// src/app/api/shared-variables-config/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SHARED_VARIABLES_SERVICE_URL = process.env.SHARED_VARIABLES_SERVICE_URL;
const SHARED_VARIABLES_SERVICE_API_KEY = process.env.SHARED_VARIABLES_SERVICE_API_KEY;

// This route will handle POST requests to fetch a specific shared variable by name in the body
export async function POST(req: NextRequest) {
  // Get the variable name from the request body
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ message: 'Variable name is required' }, { status: 400 });
  }

  if (!SHARED_VARIABLES_SERVICE_URL || !SHARED_VARIABLES_SERVICE_API_KEY) {
    return NextResponse.json({ message: 'Shared variables service URL or API key not configured' }, { status: 500 });
  }

  try {
    // Proxy the GET request to the actual shared-variables-service
    // The shared-variables-service's GET endpoint is dynamic (e.g., /variables/:name)
    const response = await fetch(`${SHARED_VARIABLES_SERVICE_URL}/variables/${name}`, {
      method: 'GET', // Explicitly use GET method for the proxied request
      headers: {
        'x-api-key': SHARED_VARIABLES_SERVICE_API_KEY,
        'Content-Type': 'application/json', // Good practice
      },
      cache: 'no-store', // Ensure fresh data from the shared variables service
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`Error proxying fetch for shared variable '${name}':`, error);
    return NextResponse.json({ message: `Failed to fetch shared variable '${name}': ${error.message}` }, { status: 500 });
  }
}