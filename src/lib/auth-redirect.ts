/**
 * Authentication redirect utility functions for FixMate.
 * Handles safe redirect parsing, open redirect prevention,
 * and role-based destination authorization.
 */

function matchesPathPrefix(url: string, prefix: string): boolean {
  const path = url.split("?")[0].split("#")[0];
  return path === prefix || path.startsWith(`${prefix}/`);
}

/**
 * Validates that a redirect URL is safe to navigate to:
 * - Must be an internal relative path starting with '/'
 * - Must not be protocol-relative ('//' or '/\')
 * - Must not contain schemes or ports in the path component
 * - Must not loop back to auth pages (/login, /sign-in, /sign-up)
 */
export function getSafeRedirectUrl(url: string | null): string | null {
  if (!url) return null;

  // Must be a relative path starting with a single '/'
  if (!url.startsWith("/")) return null;

  // Prevent protocol-relative URLs (e.g. '//evil.com' or '/\evil.com')
  if (url.startsWith("//") || url.startsWith("/\\")) return null;

  // Prevent scheme or port tricks (e.g. 'javascript:', 'https:') in path
  const pathPart = url.split("?")[0].split("#")[0];
  if (pathPart.includes(":")) return null;

  // Prevent redirect loops back to auth pages
  if (
    matchesPathPrefix(url, "/login") ||
    matchesPathPrefix(url, "/sign-in") ||
    matchesPathPrefix(url, "/sign-up")
  ) {
    return null;
  }

  return url;
}

/**
 * Returns the default dashboard route for a given user role.
 */
export function getRoleDashboard(role?: string): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "technician") return "/dashboard/technician";
  return "/dashboard/customer";
}

/**
 * Validates whether the authenticated user's role is authorized
 * to access the target redirect destination.
 * - Customer cannot access /dashboard/admin or /dashboard/technician
 * - Technician cannot access /dashboard/admin or /dashboard/customer
 * - Admin cannot access /dashboard/technician or /dashboard/customer
 * - Bare /dashboard root has no page and returns false to use role dashboard
 * - Shared routes (/dashboard/profile, /, /services, /about, /services/.../book, etc.) return true
 */
export function isAuthorizedRedirect(targetUrl: string, role?: string): boolean {
  const path = targetUrl.split("?")[0].split("#")[0];

  // Disallow bare /dashboard root
  if (path === "/dashboard") {
    return false;
  }

  // Admin dashboard section
  if (matchesPathPrefix(targetUrl, "/dashboard/admin")) {
    return role === "admin";
  }

  // Technician dashboard section
  if (matchesPathPrefix(targetUrl, "/dashboard/technician")) {
    return role === "technician";
  }

  // Customer dashboard section
  if (matchesPathPrefix(targetUrl, "/dashboard/customer")) {
    return role === "customer";
  }

  return true;
}

/**
 * Returns the final safe and authorized redirect destination.
 * Falls back to the user's role-based dashboard if the target is
 * missing, unsafe, or unauthorized for their role.
 */
export function getFinalRedirectUrl(
  targetUrl: string | null,
  role?: string
): string {
  const fallback = getRoleDashboard(role);
  if (!targetUrl) return fallback;

  if (!isAuthorizedRedirect(targetUrl, role)) {
    return fallback;
  }

  return targetUrl;
}
