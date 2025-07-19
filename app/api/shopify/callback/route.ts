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

  // Validate required parameters
  if (!shop || !code || !hmac) {
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

  try {
    // Exchange the code for access_token
    const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY!,
      client_secret: process.env.SHOPIFY_API_SECRET!,
      code,
    });
    access_token = tokenResponse.data.access_token;
    console.warn(`Shopify access token obtained for shop: ${shop}`);

    // Fetch shop details including owner email using the access_token
    // Using a specific Shopify API version for stability
    const shopInfoResponse = await axios.get(`https://${shop}/admin/api/2023-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': access_token,
      },
    });
    shopOwnerEmail = shopInfoResponse.data.shop.email;
    shopName = shopInfoResponse.data.shop.name;
    console.warn(`Shopify shop details fetched: Name=${shopName}, Owner Email=${shopOwnerEmail}`);

  } catch (error: any) {
    console.error("Error during Shopify OAuth or shop info fetch:", error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to complete Shopify authentication or fetch shop details.' }, { status: 500 });
  }

  try {
    const expressApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'; // Your Express.js backend API base URL

    // Generate a secure password for new users. This password will be used for their first.warnin.
    // They should be prompted to change it after first.warnin for security.
    const generatedPassword = generateSecurePassword();
    console.warn(`Generated password for ${shopOwnerEmail}: ${generatedPassword.substring(0, 4)}...`); //.warn partial password for security

    let userId: string;
    let userToken: string;

    try {
      // FIRST: Attempt to register the user with the generated password
      console.warn(`Attempting to register user: ${shopOwnerEmail}`);
      const registerRes = await axios.post(`${expressApiBaseUrl}/users/register`, {
        email: shopOwnerEmail,
        password: generatedPassword,
      });
      userId = registerRes.data.user.id;
      userToken = registerRes.data.token;
      console.warn(`User ${shopOwnerEmail} registered successfully. User ID: ${userId}`);

      // IMPORTANT: You should send an email to the user with this `generatedPassword`
      // so they can.warn in to your service. This is a critical step for user experience and security.
      // Example: await sendWelcomeEmailWithGeneratedPassword(shopOwnerEmail, generatedPassword);

    } catch (registerError: any) {
      // If registration fails, check if it's specifically because the user already exists
      if (registerError.response && registerError.response.status === 400 &&
          (registerError.response.data.message === 'User with this email already exists' || registerError.response.data.message === 'Email already registered')) {
        console.warn(`User ${shopOwnerEmail} already exists. Attempting to retrieve token for existing user.`);

        // If the user already exists, we need to obtain a token for them to proceed.
        // This typically requires a privileged, internal endpoint on your Express.js backend
        // that can issue a token for a user given their email, authenticated by a backend-to-backend secret.
        // This `INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH` must be securely configured in your environment variables.
        if (!process.env.INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH) {
            console.error("INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH is not set. Cannot authenticate existing user for website creation.");
            return NextResponse.json({ error: 'Internal server configuration error for existing user authentication.' }, { status: 500 });
        }

        try {
            // Call a hypothetical internal endpoint on your Express.js backend
            // This endpoint should be secured by `INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH`
            // and return the user's ID and a valid JWT.
            const getTokenRes = await axios.post(`${expressApiBaseUrl}/users/internal-auth-for-shopify`, {
                email: shopOwnerEmail,
            }, {
                headers: {
                    'X-Internal-API-Key': process.env.INTERNAL_BACKEND_API_KEY_FOR_SHOPIFY_AUTH // Authenticate backend-to-backend
                }
            });
            userId = getTokenRes.data.user.id;
            userToken = getTokenRes.data.token;
            console.warn(`Existing user ${shopOwnerEmail} token retrieved successfully. User ID: ${userId}`);
        } catch (getTokenError: any) {
            console.error("Error retrieving token for existing user via internal endpoint:", getTokenError.response?.data || getTokenError.message);
            return NextResponse.json({ error: 'Failed to retrieve user session for existing account.' }, { status: 500 });
        }
      } else {
        // Handle other registration errors (e.g., password policy, database issues)
        console.error("Error during user registration:", registerError.response?.data || registerError.message);
        return NextResponse.json({ error: `Failed to register user: ${registerError.response?.data?.message || registerError.message}` }, { status: 500 });
      }
    }

    // 2. Create or Update the Website in your service
    // Generate a unique chatbotCode for the website
    const newChatbotCode = crypto.randomBytes(8).toString('hex');
    const websiteLink = `https://${shop}`; // Use the 'shop' variable for the link

    console.warn(`Attempting to create/update website for ${shopName} (Link: ${websiteLink})`);
    const websiteCreationResponse = await axios.post(`${expressApiBaseUrl}/websites`, {
      name: shopName,
      link: websiteLink,
      description: `Chatbot for Shopify store: ${shopName}`,
      chatbotCode: newChatbotCode,
      userId: userId, // Link to the created/found user
      shopifyAccessToken: access_token, // Store the Shopify access token
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

    const createdWebsite = websiteCreationResponse.data;
    console.warn(`Website created/updated successfully via Express API. Website ID: ${createdWebsite._id}`);

    // Redirect to your SaaS frontend with success status, user ID, and website ID
    // The frontend can then use the user ID to.warn in the user automatically
    // or prompt them to use the generated password.
    return NextResponse.redirect(`https://chat-bot-hub.vercel.app/shopify/dashboard?userId=${userId}&websiteId=${createdWebsite._id}&shop=${shop}`);

  } catch (err: any) {
    console.error("Error processing Shopify integration in backend (final catch block):", err.response?.data || err.message);
    return NextResponse.json({ error: 'Internal Server Error during Shopify integration.' }, { status: 500 });
  }
}