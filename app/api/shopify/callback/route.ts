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

    // Fetch shop details including owner email using the access_token
    const shopInfoResponse = await axios.get(`https://${shop}/admin/api/2023-10/shop.json`, { // Use a specific Shopify API version
      headers: {
        'X-Shopify-Access-Token': access_token,
      },
    });
    shopOwnerEmail = shopInfoResponse.data.shop.email;
    shopName = shopInfoResponse.data.shop.name;

  } catch (error: any) {
    console.error("Error during Shopify OAuth or shop info fetch:", error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to complete Shopify authentication or fetch shop details.' }, { status: 500 });
  }

  try {
    const expressApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'; // Your Express.js backend API base URL

    // 1. Attempt to register/login the user in your service
    // Generate a secure password for new users. This password will be used for their first login.
    // They should be prompted to change it after first login for security.
    const generatedPassword = generateSecurePassword();

    let userId: string;
    let userToken: string;
    // userWebsitesCount is not directly used in this Next.js route's logic for website creation,
    // it's primarily for determining trial status on the Express.js backend.
    // It's removed here to avoid confusion and keep the Next.js route focused.

    try {
      // Try to log in the user first (in case they already exist from a previous Shopify install or manual signup)
      const loginRes = await axios.post(`${expressApiBaseUrl}/users/login`, {
        email: shopOwnerEmail,
        password: generatedPassword, // Use generated password for initial login attempt
      });
      userId = loginRes.data.user.id;
      userToken = loginRes.data.token;

      console.log(`User ${shopOwnerEmail} logged in successfully.`);

    } catch (loginError: any) {
      // If login fails, assume the user doesn't exist and try to register them
      if (loginError.response && loginError.response.status === 400 && loginError.response.data.message === 'Invalid credentials') {
        console.log(`User ${shopOwnerEmail} not found, attempting to register.`);
        const registerRes = await axios.post(`${expressApiBaseUrl}/users/register`, {
          email: shopOwnerEmail,
          password: generatedPassword,
        });
        userId = registerRes.data.user.id;
        userToken = registerRes.data.token;

        console.log(`User ${shopOwnerEmail} registered successfully.`);
        // You might want to send an email to the user with their generated password here.
        // This is crucial for them to be able to log in to your service.
        // e.g., await sendWelcomeEmailWithPassword(shopOwnerEmail, generatedPassword);

      } else {
        console.error("Error during user login/registration:", loginError.response?.data || loginError.message);
        return NextResponse.json({ error: 'Failed to process user account.' }, { status: 500 });
      }
    }

    // 2. Create or Update the Website in your service
    // Generate a unique chatbotCode for the website
    const newChatbotCode = crypto.randomBytes(8).toString('hex');

    const websiteLink = `https://${shop}`; // Corrected: use 'shop' variable for the link

    // Make an API call to your Express.js backend to create the website
    // This uses axios, which is suitable for server-side requests.
    const websiteCreationResponse = await axios.post(`${expressApiBaseUrl}/websites`, {
      name: shopName, // Use Shopify shop name
      link: websiteLink, // Corrected: use websiteLink variable
      description: `Chatbot for Shopify store: ${shopName}`,
      chatbotCode: newChatbotCode,
      userId: userId, // Link to the created/found user
      shopifyAccessToken: access_token, // Store the Shopify access token
      // Pass default preferences or other data as needed
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
    console.log(`Website created/updated via Express API: ${createdWebsite._id}`);

    // Redirect to your SaaS frontend with success status, user ID, and website ID
    // The frontend can then use the user ID to log in the user automatically
    // or prompt them to use the generated password.
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/shopify/dashboard?userId=${userId}&websiteId=${createdWebsite._id}&shop=${shop}`);

  } catch (err: any) {
    console.error("Error processing Shopify integration in backend:", err.response?.data || err.message);
    return NextResponse.json({ error: 'Internal Server Error during Shopify integration.' }, { status: 500 });
  }
}