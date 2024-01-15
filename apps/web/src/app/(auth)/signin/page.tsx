"use client";

import { Button } from "@arco-design/web-react";

import { signIn } from "@niceai/auth/react";

export default function SignInPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <Button
        type="primary"
        onClick={async () => {
          await signIn("github");
        }}
      >
        Sign in
      </Button>
    </div>
  );
}
