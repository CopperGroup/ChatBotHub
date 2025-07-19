// next-app/api/auth/shopify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';

// Function to generate a secure random password
function generateSecurePassword(length: number = 16): string {
  // Generate random bytes and convert to a URL-safe base64 string
  // This creates a strong, random password.
  return crypto.randomBytes(Math.ceil(length * 3 / 4))
    .toString('base64url') // base64url is safe for URLs and file names
    .slice(0, length); // Ensure it's the desired length
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const shop = searchParams.get('shop')!;
  const code = searchParams.get('code')!;
  const hmac = searchParams.get('hmac')!;
  const host = searchParams.get('host')!; // <--- Get the host parameter here

  // Validate required parameters
  if (!shop || !code || !hmac || !host) { // <--- Include host in validation
    console.error("Missing required query parameters for Shopify OAuth.");
    return NextResponse.json({ error: 'Missing required query parameters.' }, { status: 400 });
  }

  // HMAC verification (as provided in your original code)
  const params = new URLSearchParams(req.nextUrl.searchParams);
  params.delete('signature');
  params.delete('hmac');

  const message = params.toString();
  const providedHmac = Buffer.from(hmac, 'utf-8');
  const generatedHash = Buffer.from(
    crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET!)
      .update(message)
      .digest('hex'),
    'utf-8'
  );

  let valid = false;
  try {
    valid = crypto.timingSafeEqual(providedHmac, generatedHash);
  } catch (e) {
    console.error("HMAC verification failed:", e);
    return NextResponse.json({ error: 'HMAC verification failed' }, { status: 400 });
  }

  if (!valid) {
    console.error("Invalid HMAC provided in Shopify OAuth callback.");
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 400 });
  }

  let access_token: string;
  let shopOwnerEmail: string;
  let shopName: string;
  let shopifyUserId: string; // To store Shopify's user ID for the merchant

  try {
    // Exchange the code for access_token
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY!,
      client_secret: process.env.SHOPIFY_API_SECRET!,
      code,
    });
    access_token = tokenResponse.data.access_token;
    console.log(`Shopify access token obtained for shop: ${shop}`);

    // Fetch shop details including owner email and shop owner ID
    const shopInfoResponse = await axios.get(`https://${shop}/admin/api/2023-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': access_token,
      },
    });
    shopOwnerEmail = shopInfoResponse.data.shop.email;
    shopName = shopInfoResponse.data.shop.name;
    // For shopifyUserId, Shopify doesn't expose a direct 'user ID' of the merchant via shop.json.
    // A common practice is to use the shop domain itself as a unique identifier for the merchant's Shopify account,
    // or to fetch the user ID via the /admin/api/latest/users/current.json endpoint (requires `read_users` scope).
    // For this example, let's use a combination of shop domain and owner email as a pseudo-unique ID if a direct ID isn't available.
    // If you have `read_users` scope, you can fetch the current user's ID:
    // const currentUserResponse = await axios.get(`https://${shop}/admin/api/2023-10/users/current.json`, { headers: { 'X-Shopify-Access-Token': access_token }});
    // shopifyUserId = currentUserResponse.data.user.id.toString();
    shopifyUserId = `${shop}_${shopOwnerEmail}`; // Fallback: Combine shop domain and email for a unique ID

    console.log(`Shopify shop details fetched: Name=${shopName}, Owner Email=${shopOwnerEmail}, Shopify User ID=${shopifyUserId}`);

  } catch (error: any) {
    console.error("Error during Shopify OAuth or shop info fetch:", error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to complete Shopify authentication or fetch shop details.' }, { status: 500 });
  }

  try {
    const expressApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'; // Your Express.js backend API base URL

    const generatedPassword = generateSecurePassword();
    console.log(`Generated password for ${shopOwnerEmail}: ${generatedPassword.substring(0, 4)}...`);

    let userId: string;
    let userToken: string;

    try {
      // FIRST: Attempt to register the user with the generated password
      console.log(`Attempting to register user: ${shopOwnerEmail}`);
      const registerRes = await axios.post(`${expressApiBaseUrl}/users/register`, {
        email: shopOwnerEmail,
        password: generatedPassword,
      });
      userId = registerRes.data.user._id;
      userToken = registerRes.data.token;
      console.log(`User ${shopOwnerEmail} registered successfully. User ID: ${userId}`);

      // Now, link their Shopify ID and access token to their newly created user account
      const linkShopifyUserRes = await axios.post(`${expressApiBaseUrl}/users/internal-auth-for-shopify`, {
        email: shopOwnerEmail,
        shopifyUserId: shopifyUserId,
        shopifyUserAccessToken: access_token, // Store the user-level Shopify access token
      }, {
        headers: {
          'X-Internal-API-Key': process.env.INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH // Authenticate backend-to-backend
        }
      });
      userToken = linkShopifyUserRes.data.token; // Get updated token with Shopify info
      console.log(`Linked Shopify details for new user ${shopOwnerEmail}.`);

      // IMPORTANT: Send an email to the user with this `generatedPassword`
      // so they can log in to your service directly.
      // Example: await sendWelcomeEmailWithGeneratedPassword(shopOwnerEmail, generatedPassword);

    } catch (registerError: any) {
      // If registration fails, it means the user likely already exists
      if (registerError.response && registerError.response.status === 400 &&
          (registerError.response.data.message === 'User with this email already exists' || registerError.response.data.message === 'Email already registered')) {
        console.log(`User ${shopOwnerEmail} already exists. Attempting to authenticate and link Shopify ID.`);

        // If the user already exists, we need to obtain a token for them and link their Shopify ID.
        // This is done via the new internal endpoint.
        if (!process.env.INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH) {
            console.error("INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH is not set. Cannot authenticate existing user for website creation.");
            return NextResponse.json({ error: 'Internal server configuration error for existing user authentication.' }, { status: 500 });
        }

        try {
            const getTokenRes = await axios.post(`${expressApiBaseUrl}/users/internal-auth-for-shopify`, {
                email: shopOwnerEmail,
                shopifyUserId: shopifyUserId,
                shopifyUserAccessToken: access_token, // Update user-level access token
            }, {
                headers: {
                    'X-Internal-API-Key': process.env.INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH // Authenticate backend-to-backend
                }
            });
            userId = getTokenRes.data.user.id;
            userToken = getTokenRes.data.token;
            console.log(`Existing user ${shopOwnerEmail} authenticated and Shopify details linked. User ID: ${userId}`);
        } catch (getTokenError: any) {
            console.error("Error retrieving token/linking Shopify for existing user via internal endpoint:", getTokenError.response?.data || getTokenError.message);
            return NextResponse.json({ error: 'Failed to retrieve user session or link Shopify account.' }, { status: 500 });
        }
      } else {
        // Handle other unexpected registration errors
        console.error("Unexpected error during user registration/authentication:", registerError.response?.data || registerError.message);
        return NextResponse.json({ error: `Failed to process user account: ${registerError.response?.data?.message || registerError.message}` }, { status: 500 });
      }
    }

    // 2. Create or Update the Website in your service
    // Generate a unique chatbotCode for the website
    const newChatbotCode = crypto.randomBytes(8).toString('hex');
    const websiteLink = `https://${shop}`; // Use the 'shop' variable for the link

    console.log(`Attempting to create/update website for ${shopName} (Link: ${websiteLink})`);

    console.log(userToken)
    // Before creating a new website, check if a website for this shop already exists for this user.
    // This prevents creating duplicate website entries if the user re-installs the app.
    let existingWebsite = null;
    try {
        // Assuming you have an endpoint to check for existing websites by link and owner
        // This is a GET request, so it should be secured by userToken
        const websiteCheckRes = await axios.get(`${expressApiBaseUrl}/websites?link=${encodeURIComponent(websiteLink)}&owner=${userId}`, {
            headers: {
                'x-auth-token': userToken
            }
        });
        // Assuming the response is an array of websites, take the first one if found
        if (websiteCheckRes.data && websiteCheckRes.data.length > 0) {
            existingWebsite = websiteCheckRes.data[0];
            console.log(`Found existing website for ${shopName}: ${existingWebsite._id}`);
        }
    } catch (checkError: any) {
        // Log error but don't block flow, proceed to create if check fails
        console.error("Error checking for existing website:", checkError.response?.data || checkError.message);
    }


    let createdWebsite;
    if (existingWebsite) {
        // If website exists, update its shopifyAccessToken and other relevant fields
        console.log(`Updating existing website ${existingWebsite._id} with new Shopify access token.`);
        const updateWebsiteResponse = await axios.put(`${expressApiBaseUrl}/websites/${existingWebsite._id}`, {
            shopifyAccessToken: access_token, // Update website-specific access token
            // You might want to update other fields like name, description if they can change
            name: shopName,
            description: `Chatbot for Shopify store: ${shopName}`,
            link: websiteLink, // Ensure link is consistent
            // Do NOT update chatbotCode here unless explicitly intended for re-generation
            userId: userId, // Ensure owner is still correct
        }, {
            headers: {
                'x-auth-token': userToken
            }
        });
        createdWebsite = updateWebsiteResponse.data.website; // Assuming the PUT response returns the updated website object
        console.log(`Existing website ${createdWebsite._id} updated successfully.`);

    } else {
        // If no existing website, create a new one
        console.log(`Creating new website for ${shopName}.`);
        const websiteCreationResponse = await axios.post(`${expressApiBaseUrl}/websites`, {
            name: shopName,
            link: websiteLink,
            description: `Chatbot for Shopify store: ${shopName}`,
            chatbotCode: newChatbotCode,
            userId: userId, // Link to the created/found user
            shopifyAccessToken: access_token, // Store the Shopify access token for this specific website
            preferences: {
                colors: { gradient1: "#10b981", gradient2: "#059669" },
                header: "Chat Support",
                allowAIResponses: false,
            },
        }, {
            headers: {
                'x-auth-token': userToken // Authenticate the request to your backend using the obtained token
            }
        });
        createdWebsite = websiteCreationResponse.data;
        console.log(`New website created successfully via Express API. Website ID: ${createdWebsite._id}`);
    }


    // Redirect to your SaaS frontend with success status, user ID, and website ID
    // The frontend can then use the user ID to log in the user automatically
    // or prompt them to use the generated password.
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/dashboard?host=${host}&shop=${shop}&noRedirect=true`);

  } catch (err: any) {
    console.error("Error processing Shopify integration in backend (final catch block):", err.response?.data || err.message);
    return NextResponse.json({ error: 'Internal Server Error during Shopify integration.' }, { status: 500 });
  }
}