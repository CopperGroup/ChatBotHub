// The base URL for your external analytics microservice.
// Make sure to define this in your .env.local file.
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL;

// This function will handle POST requests to this API route.
export async function POST(request: Request) {
  // If the analytics service URL is not configured, return an error.
  if (!ANALYTICS_SERVICE_URL) {
    return new Response(JSON.stringify({ error: "Analytics service URL is not configured." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse the request body to get the websiteId.
    const body = await request.json();
    const { websiteId } = body;

    if (!websiteId) {
      return new Response(JSON.stringify({ error: "Missing websiteId in request body." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Forward the request to your external analytics microservice.
    const response = await fetch(`${ANALYTICS_SERVICE_URL}/api/analytics/website/${websiteId}`, {
      method: 'GET', // The microservice expects a GET request.
      headers: {
        'Content-Type': 'application/json',
        // You might need to pass additional headers like an API key for authentication here.
      },
    });

    if (!response.ok) {
      // If the microservice returns an error, forward it to the client.
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData.error || "Failed to fetch analytics from microservice." }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const analyticsData = await response.json();

    // Return the analytics data to the client.
    return new Response(JSON.stringify(analyticsData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in Next.js API route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}