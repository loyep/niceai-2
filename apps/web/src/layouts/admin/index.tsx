import Footer from "./components/footer";
import Header from "./components/header";

interface AdminProps {}

export default function AdminLayout({
  children,
}: React.PropsWithChildren<AdminProps>) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
