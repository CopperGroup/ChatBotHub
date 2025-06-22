interface AuthFetchOptions extends RequestInit {
    // You can extend RequestInit with any custom options you need
    // For example, a flag to skip authentication for specific endpoints
    skipAuth?: boolean;
  }
  
  /**
   * A wrapper around the native `fetch` API that automatically
   * attaches the JWT token from localStorage to the Authorization header.
   *
   * @param input The URL or Request object for the fetch call.
   * @param options Custom options for the fetch call, extending RequestInit.
   * @returns A Promise that resolves to the Response object.
   * @throws An error if the token is missing and authentication is required, or if the fetch call fails.
   */
  export async function authFetch(
    input: RequestInfo,
    options: AuthFetchOptions = {}
  ): Promise<Response> {
    // If skipAuth is true, just use regular fetch
    if (options.skipAuth) {
      // Remove skipAuth from options before passing to native fetch
      const { skipAuth, ...restOptions } = options;
      return fetch(input, restOptions);
    }
  
    // Get the token from localStorage (client-side only)
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('userToken');
    }
  
    if (!token) {
      // If no token is found, and auth is not skipped, you might want to:
      // 1. Throw an error immediately.
      // 2. Redirect to login.
      // 3. Return a rejected Promise.
      // For this example, we'll throw an error. The calling component should catch it.
      console.error("authFetch: No authentication token found. Redirecting to login or handling auth flow should occur here.");
      // Example: You might trigger a redirect on the client-side like this:
      // import Router from 'next/router';
      // Router.push('/login');
      throw new Error('Authentication token not found. Please log in.');
    }
  
    // Prepare headers
    const headers = new Headers(options.headers || {});
    headers.set('x-auth-token', token); // Set your custom auth header
    // Or if your backend uses standard Authorization header:
    // headers.set('Authorization', `Bearer ${token}`); 
  
    // Combine original options with updated headers
    const mergedOptions: RequestInit = {
      ...options,
      headers,
    };
  
    try {
      const response = await fetch(input, mergedOptions);
  
      // Optional: Centralized error handling for 401/403
      if (response.status === 401 || response.status === 403) {
        console.warn(`authFetch: Unauthorized or Forbidden response (${response.status}). Token might be invalid.`);
        // You might want to automatically log out the user here if this is a common pattern
        // import { logout } from '@/hooks/use-auth'; // Make sure logout is exported and accessible
        // logout(); // Call the logout function to clear session and redirect
      }
  
      return response;
    } catch (error) {
      console.error("authFetch: Network error or problem with request:", error);
      throw error; // Re-throw to be caught by the caller
    }
  }