import { PropsWithChildren } from "react";
import { notFound } from "next/navigation";

import Layout from "../../layouts/admin";

type Props = {
  params: { admin: string };
};

export default function AdminLayout({
  children,
  params,
}: PropsWithChildren<Props>) {
  if (params.admin !== "cloud") notFound();
  return <Layout>{children}</Layout>;
}
