import type { PropsWithChildren } from "react";

import Layout from "../../layouts/admin";

export default function AdminLayout({
  children,
}: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
