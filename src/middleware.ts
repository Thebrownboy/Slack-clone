import { auth } from "./auth";

export default auth(async (request) => {
  const { nextUrl } = request;
  console.log(request.auth);
  const loggedIn = !!request.auth;
  console.log(loggedIn);
  if (nextUrl.pathname.startsWith("/api/auth")) {
    return;
  }
  if (!loggedIn && nextUrl.pathname !== "/") {
    console.log("I am true here ");
    return Response.redirect(new URL("/", nextUrl));
  }
  if (loggedIn && nextUrl.pathname !== "/settings") {
    return Response.redirect(new URL("/settings", nextUrl));
  } else {
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
