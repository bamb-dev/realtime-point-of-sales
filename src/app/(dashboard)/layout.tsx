"use client";
import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardBreadcrumb from "./_components/dashboard-breadcrumb";
import dynamic from "next/dynamic";

const AppSidebar = dynamic(() => import("@/components/common/app-sidebar"), {
  ssr: false,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar></AppSidebar>
      <SidebarInset>
        <header className="flex items-center justify-between h-16 gap-2 shrink-0 transition[width, height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4 mr-2"
            />
            <DashboardBreadcrumb />
          </div>
          <div className="px-4">
            <DarkmodeToggle />
          </div>
        </header>
        <main className="flex flex-col items-start flex-1 gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
