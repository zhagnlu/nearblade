import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/generated/Header";
import { Footer } from "@/components/generated/Footer";
import { WhatsAppContact } from "@/components/common/WhatsAppContact";
import { LanguageProvider } from "@/i18n/LanguageProvider";

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <LanguageProvider><div className="flex flex-col min-h-screen bg-industrial">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppContact />
    </div></LanguageProvider>
  );
}
