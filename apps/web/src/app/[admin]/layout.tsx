import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

type Props = {
  params: { admin: string }
}

export default function AdminLayout({ children, params }: PropsWithChildren<Props>) {
  if (params.admin !== "cloud") notFound();
  return children;
}
