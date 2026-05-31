"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { DenDenMushi } from "@/components/ai/den-den-mushi";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="min-h-screen bg-[#060B14]">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content area */}
      <motion.div
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col min-h-screen"
      >
        {/* Topbar */}
        <Topbar sidebarCollapsed={collapsed} onMenuToggle={() => setCollapsed(!collapsed)} />

        {/* Page content */}
        <main className="flex-1 pt-16 overflow-x-hidden">
          {children}
        </main>
      </motion.div>

      {/* AI Chat (Den Den Mushi) */}
      <DenDenMushi />
    </div>
  );
}
