// hooks/use-auth.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // Memoized logout function
  const logout = useCallback(() => {
    console.log("useAuth: Performing user logout (clearing localStorage).");
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId"); // FIX: Also remove userId
      localStorage.removeItem("userData"); // Ensure old userData is cleared for good measure
    }
    setUser(null);
    setToken(null);
    toast.info("You have been logged out.");
    window.location.href = "/login";
  }, []);

  // Core function to fetch/refresh user data from the server
  const refreshUser = useCallback(async () => {
    setLoading(true); // Indicate that a refresh/load is in progress

    let currentToken = null;
    let currentUserId = null; // FIX: Retrieve userId directly
    
    if (typeof window !== 'undefined') { // Only access localStorage on the client-side
      currentToken = localStorage.getItem("userToken");
      currentUserId = localStorage.getItem("userId"); // FIX: Get userId directly
    }

    // If no token or user ID, we're not logged in.
    // Ensure local state reflects no user and clear any remnants.
    if (!currentToken || !currentUserId) { // FIX: Check for currentUserId
      console.log("useAuth: No valid token or user ID found for server refresh. Setting user to null.");
      // Ensure local storage is clean in case of partial or bad data
      if (typeof window !== 'undefined') {
         localStorage.removeItem("userToken");
         localStorage.removeItem("userId"); // FIX: Clear userId
         localStorage.removeItem("userData"); // Clear any old full user data
      }
      setUser(null);
      setToken(null);
      setLoading(false);
      return false; // Refresh skipped/failed
    }

    try {
      console.log(`useAuth: Attempting to fetch/refresh user data for user ID: ${currentUserId}`); // FIX: Use currentUserId
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${currentUserId}`, { // FIX: Use currentUserId in URL
        headers: {
          'x-auth-token': currentToken,
          'Content-Type': 'application/json'
        },
        cache: 'no-store' // Always get fresh data
      });

      if (res.ok) {
        const freshUserData = await res.json();
        setUser(freshUserData);
        setToken(currentToken); // Confirm token is still active
        console.log("useAuth: User data successfully fetched/re-verified from server.");
        return true; // Refresh successful
      } else if (res.status === 401 || res.status === 403) {
        console.warn(`useAuth: Token invalid or unauthorized (Status: ${res.status}). Logging out.`);
        logout();
        toast.error("Your session has expired. Please log in again.");
        return false;
      } else {
        console.error(`useAuth: Server responded with status ${res.status} during refresh.`, await res.text());
        toast.warning("Could not refresh user data. Displaying cached information (if any, but likely null now).");
        // User state might already be null if there was no userData, or it remains as optimistically set before this call.
        // We do NOT logout here unless explicitly 401/403.
        return false;
      }
    } catch (networkError) {
      console.error("useAuth: Network error during user data fetch/refresh.", networkError);
      toast.warning("Could not connect to authentication server. Displaying cached information (if any).");
      // Keep optimistic user state if it was set, do NOT logout on network error.
      return false;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    console.log("useAuth: Initializing authentication status.");
    refreshUser(); // Call refreshUser immediately on mount to load/verify session
  }, [refreshUser]); // `refreshUser` is a dependency as it's a useCallback

  return { user, loading, token, setUser, logout, refreshUser };
}