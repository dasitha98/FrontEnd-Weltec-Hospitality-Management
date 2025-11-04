/**
 * JWT Utility Functions
 *
 * Helper functions to decode and work with JWT tokens in the frontend.
 * Note: This only decodes the token payload. For security, always verify
 * the token signature on the backend.
 */

export interface JWTPayload {
  [key: string]: any;
  UserName?: string;
  role?: string;
  sub?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}

/**
 * Decodes a JWT token and returns the payload
 * @param token - The JWT token string
 * @returns The decoded payload object or null if invalid
 *
 * @example
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * const payload = decodeJWT(token);
 * console.log(payload.UserName); // "kamal"
 * console.log(payload.role); // "Admin"
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");

    if (parts.length !== 3) {
      console.error("Invalid JWT format: token must have 3 parts");
      return null;
    }

    // Get the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    // JWT uses base64url encoding which doesn't require padding,
    // but atob() needs padding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Convert base64url to base64
    // base64url uses - and _ instead of + and /
    const base64Payload = paddedPayload.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64 to string
    const decoded = atob(base64Payload);

    // Parse JSON payload
    const tokenData: JWTPayload = JSON.parse(decoded);

    return tokenData;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if token is expired or invalid, false if valid
 *
 * @example
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * if (isTokenExpired(token)) {
 *   console.log("Token is expired");
 * }
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return true; // Invalid token or no expiration = consider expired
  }

  // exp is Unix timestamp in seconds
  // Date.now() returns milliseconds, so divide by 1000
  const now = Math.floor(Date.now() / 1000);

  return payload.exp < now;
}

/**
 * Gets user information from JWT token
 * @param token - The JWT token string
 * @returns User info object with name, userId, and role, or null if invalid
 *
 * @example
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * const userInfo = getUserInfoFromToken(token);
 * console.log(userInfo?.name); // "kamal"
 * console.log(userInfo?.role); // "Admin"
 */
export interface UserInfo {
  name?: string;
  userId?: string;
  role?: string;
  email?: string;
  status?: string;
}

export function getUserInfoFromToken(token: string): UserInfo | null {
  const payload = decodeJWT(token);

  if (!payload) {
    return null;
  }

  // Extract user information from JWT claims
  // Handle both standard claims and custom claims
  const userName =
    payload.UserName ||
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    payload.name ||
    payload.username;

  const role =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload.role ||
    payload.Role;

  const userId =
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ||
    payload.sub ||
    payload.userId ||
    payload.UserId;

  const email =
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    payload.email ||
    payload.Email;

  const status = payload.Status || payload.status;

  return {
    name: userName,
    userId: userId,
    role: role,
    email: email,
    status: status,
  };
}

/**
 * Gets a specific claim value from JWT token
 * @param token - The JWT token string
 * @param claimName - The name of the claim to retrieve
 * @returns The claim value or null if not found
 *
 * @example
 * const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
 * const userName = getClaim(token, "UserName"); // "kamal"
 * const role = getClaim(token, "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"); // "Admin"
 */
export function getClaim(token: string, claimName: string): any {
  const payload = decodeJWT(token);
  return payload ? payload[claimName] : null;
}
