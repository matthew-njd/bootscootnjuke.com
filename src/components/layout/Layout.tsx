// src/components/layout/Layout.tsx
import type { ReactNode } from "react";
import Nav from "./Nav";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="grow">{children}</main>
    </div>
  );
}

export default Layout;
