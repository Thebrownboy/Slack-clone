import { auth } from "./auth";
import { apiAuthRoute, authneticationRoutes } from "./routes";

export default auth(async (request) => {
  console.log(request);
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

  // if (nextUrl.pathname.startsWith("/api/auth")) {
  //   return;
  // }
  // if (!loggedIn && nextUrl.pathname !== "/") {
  //   console.log("I am true here ");
  //   return Response.redirect(new URL("/", nextUrl));
  // }
  // if (loggedIn && nextUrl.pathname !== "/settings") {
  //   return Response.redirect(new URL("/settings", nextUrl));
  // } else {
  //   return;
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
