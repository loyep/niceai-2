import { notFound, redirect } from "next/navigation";

export default function AdminPage({ params }: { params: { admin: string } }) {
  if (params.admin !== "cloud") notFound();
  return <div>Admin</div>;
}
