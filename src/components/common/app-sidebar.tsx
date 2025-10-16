"use client";
import { Coffee, EllipsisVertical, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
} from "@/constants/sidebar-constant";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth-action";
import { useAuthStore } from "@/strores/auth-store";
import { useEffect, useState } from "react";

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);

  // * Melindungi dari kesalahan hidrasi
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="font-semibold">
                <div className="flex items-center justify-center p-2 bg-teal-500 rounded-md">
                  <Coffee className="text-white dark:text-black size-4 " />
                </div>
                Rony Cafe
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {SIDEBAR_MENU_LIST[profile?.role as SidebarMenuKey]?.map(
                (item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a
                        href={item.url}
                        className={cn("px-4 py-3 h-auto", {
                          "bg-teal-500 text-white hover:bg-teal-500 hover:text-white":
                            pathname === item.url,
                        })}
                      >
                        {item.icon && <item.icon />} <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-accent-foreground"
                >
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={profile?.name}
                    />
                    <AvatarFallback className="rounded-lg capitalize">
                      {profile?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <h4 className="font-medium truncate">{profile?.name}</h4>
                    <p className="text-xs truncate text-muted-foreground capitalize">
                      {profile?.role}
                    </p>
                  </div>
                  <EllipsisVertical className="ml-auto size-4"></EllipsisVertical>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="rounded-lg min-w-56"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex item-center px-1 py-1.5 gap-2">
                    <Avatar className="w-8 h-8 rounded-lg">
                      <AvatarImage
                        src={profile?.avatar_url}
                        alt={profile?.name}
                      />
                      <AvatarFallback className="rounded-lg capitalize">
                        {profile?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <h4 className="font-medium truncate">{profile?.name}</h4>
                      <p className="text-xs truncate text-muted-foreground capitalize">
                        {profile?.role}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
