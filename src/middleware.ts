import { auth } from "./auth";

const middleware = auth(async (request) => {
  const { nextUrl } = request;

  console.log("this is next url ", nextUrl);
});

export default middleware;
