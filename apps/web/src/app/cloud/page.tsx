"use client";

import { useSession } from "@niceai/auth/react";

export default function AdminPage() {
  const session = useSession();
  if (session.data?.user?.email !== "lorenx@163.com") {
    // return notFound();
    return <div>Not Found</div>;
  }
  return <div>Admin</div>;
}
