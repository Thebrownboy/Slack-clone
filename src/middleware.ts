import { auth } from "./auth";
import { apiAuthRoute, authneticationRoutes } from "./routes";

export default auth(async (request) => {
  const { nextUrl } = request;
  const loggedIn = !!request.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoute);
  const isAuthenticationRoute = authneticationRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (loggedIn) {
    if (isAuthenticationRoute) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }
  if (!loggedIn && isAuthenticationRoute) {
    return;
  }
  return Response.redirect(new URL(authneticationRoutes[0], nextUrl));
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
