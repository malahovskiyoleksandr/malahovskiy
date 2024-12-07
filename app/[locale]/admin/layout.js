import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import Link from "next/link";
import "./admin.module.scss";

export const metadata = {
  title: "Admin Panel",
  description: "Административная панель сайта",
};

export default function AdminLayout({ children }) {
  return (
    <NextUIProvider>
      <div className="admin-layout">
        <main className="admin-content">{children}</main>
        {/* <p>© {new Date().getFullYear()} Your Site</p> */}
      </div>
    </NextUIProvider>
  );
}
