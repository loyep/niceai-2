"use client";

import { Layout } from "@arco-design/web-react";

import Footer from "./components/footer";
import Header from "./components/header";

interface AdminLayoutProps {}

export default function AdminLayout({
  children,
}: React.PropsWithChildren<AdminLayoutProps>) {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout.Content>{children}</Layout.Content>
      <Footer />
    </Layout>
  );
}
