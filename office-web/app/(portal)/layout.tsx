"use client";

import { Header } from "@/app/components/Header";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { BottomNav } from "@/app/components/Navigation/BottomNav";
import { MenuDrawer } from "@/app/components/Navigation/MenuDrawer";
import React, { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Mobile-first shell: header + tab bar + menu on phones and tablets,
// header + sidebar from lg up
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />

      <div className="flex flex-1 gap-10 w-full max-w-[100rem] mx-auto px-4 md:px-8 lg:px-10 pt-6 lg:pt-10 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-10">
        <Sidebar />

        {/* min-w-0 lets wide content shrink instead of widening the page */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <BottomNav onOpenMenu={() => setMenuOpen(true)} />
      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} />
    </div>
  );
};

export default DashboardLayout;
