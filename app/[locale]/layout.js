import "./globals.scss";
import { Analytics } from "@vercel/analytics/react";
import { NextUIProvider } from "@nextui-org/react";
import Header from "./components/Header/Header";
import Footer from "./components/footer";
import i18nConfig from "@/i18nConfig";
import getIntl from "../../app/intl";
import ServerIntlProvider from "./components/ServerIntlProvider";
import React from "react"; // Добавляем импорт React

export const metadata = {
  title: "Alexander",
  description: "Generated by create next app",
  robots: "index, follow",
  other: {
    "google-site-verification": "googlee210a71ad2956609.html",
  },
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  const intl = await getIntl(locale);
  return (
    <html lang={locale}>
      <head></head>
      <body>
        <ServerIntlProvider messages={intl.messages} locale={intl.locale}>
          <NextUIProvider>
            <Header />
            <main>{React.cloneElement(children, { locale })}</main>
            <Analytics />
            <Footer params={{ locale }} />
          </NextUIProvider>
        </ServerIntlProvider>
      </body>
    </html>
  );
}