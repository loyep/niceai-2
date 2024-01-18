import { useSession } from "@niceai/auth/react";
import { notFound } from "next/navigation";

export default function AdminPage() {
  const session = useSession();
  if (session.data?.user?.email !== 'Zack') {
    return notFound();
  }
  return <div>Admin</div>;
}
