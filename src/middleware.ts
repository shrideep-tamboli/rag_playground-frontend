// src/middleware.ts or middleware.ts if not using src folder
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes where authentication is not required
const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)', '/sign-up(.*)', '/public(.*)']);

// Clerk middleware setup
export default clerkMiddleware((auth, req) => {
  // Apply protection only on routes that are not public
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

// Middleware configuration to match routes
export const config = {
  matcher: "/((?!_next|.*\\..*|favicon.ico).*)", // Apply middleware to all routes except static assets and Next.js internals
};
