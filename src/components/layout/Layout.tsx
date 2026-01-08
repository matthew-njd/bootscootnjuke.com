import type { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
