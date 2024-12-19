"use client";

import { SignInFlow } from "../types";
import { useState } from "react";
import SignInCard from "./signInCard";
import SignUpCard from "./signUpCard";
function AuthScreen() {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#5c3b58]">
      <div className="md:h-auto md-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
