'use client';

import { signIn, signOut, useSession } from "@niceai/auth/react";
import { Button } from "@arco-design/web-react";

export function AuthShowcase() {
  const session = useSession();

  if (!session.data) {
    return (
      <form>
        <Button
          onClick={async () => {
            await signIn("github");
          }}
        >
          Sign in with Github
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {session.data && <span>Logged in as {session.data.user.name}</span>}
      </p>

      <form>
        <Button
          // formAction={async () => {
          //   "use server";
          //   await signOut();
          // }}
          onClick={async () => {
            await signOut();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
