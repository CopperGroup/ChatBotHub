import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const shop = req.nextUrl.searchParams.get('shop')?.replace(/\/.*$/, '');
  if (!shop) return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });

  const redirectUri = process.env.SHOPIFY_REDIRECT_URI!;
  const apiKey = process.env.SHOPIFY_API_KEY!;
  const scopes = process.env.SHOPIFY_SCOPES!;

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=123456&grant_options[]=per-user`;

  return NextResponse.redirect(authUrl);
}
