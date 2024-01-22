"use client";

import { Layout } from "@arco-design/web-react";

import Footer from "./components/footer";
import Header from "./components/header";

interface LandingLayoutProps {}

export default function LandingLayout({
  children,
}: React.PropsWithChildren<LandingLayoutProps>) {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout.Content>{children}</Layout.Content>
      <Footer />
    </Layout>
  );
}
