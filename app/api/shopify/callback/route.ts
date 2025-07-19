import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import axios from 'axios'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const shop = searchParams.get('shop')!;
  const code = searchParams.get('code')!;
  const hmac = searchParams.get('hmac')!;

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
    return NextResponse.json({ error: 'HMAC verification failed' }, { status: 400 });
  }

  if (!valid) {
    return NextResponse.json({ error: 'Invalid HMAC' }, { status: 400 });
  }

  // Exchange the code for access_token
  const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
    client_id: process.env.SHOPIFY_API_KEY!,
    client_secret: process.env.SHOPIFY_API_SECRET!,
    code,
  });

  const { access_token } = tokenResponse.data;

  // ⬇️ Store access_token, shop, and link to a tenant in your DB
  // e.g., await db.saveShop({ shop, access_token, linkedTenantId })

  // Optional: Generate a custom JWT for your user
  // const jwt = generateJWT({ shop, tenantId })

  return NextResponse.redirect(`https://your-saas.com/shopify/connected?shop=${shop}`);
}
