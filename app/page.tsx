"use client";

import Sidebar from "@/components/sidebar";
import Workspace from "@/components/workspace";

export default function Home() {
  return (
    <div className="flex h-full text-slate-900">
      <Sidebar />
      <Workspace />
    </div>
  );
}
