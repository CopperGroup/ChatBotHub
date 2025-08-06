"use client";

import * as React from "react";
import { Users, MessageSquare, BarChart3, Brain, Code, Send, Palette, Settings, Zap, ArrowLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  useSidebar, // Import useSidebar hook
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: string;
  website: {
    _id: string;
    name: string;
    link: string;
  };
}

const navigationItems = [
  {
    title: "Overview",
    value: "overview",
    icon: BarChart3,
    href: (websiteId: string) => `/websites/${websiteId}`,
  },
  {
    title: "Conversations",
    value: "conversations",
    icon: MessageSquare,
    href: (websiteId: string) => `/websites/${websiteId}/conversations`,
  },
  {
    title: "Telegram Bot", // New navigation item
    value: "telegram",
    icon: Send,
    href: (websiteId: string) => `/websites/${websiteId}/telegram`, // Link to the new Telegram page
  },
  {
    title: "AI Management",
    value: "ai",
    icon: Brain,
    href: (websiteId: string) => `/websites/${websiteId}/ai`,
  },
  {
    title: "Staff",
    value: "staff",
    icon: Users,
    href: (websiteId: string) => `/websites/${websiteId}/staff`,
  },
  {
    title: "Appearance",
    value: "appearance",
    icon: Palette,
    href: (websiteId: string) => `/websites/${websiteId}/appearance`,
  },
  {
    title: "Integration",
    value: "integration",
    icon: Code,
    href: (websiteId: string) => `/websites/${websiteId}/integration`,
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
    href: (websiteId: string) => `/websites/${websiteId}/settings`,
  },
];

export function AppSidebar({ activeTab, website, ...props }: AppSidebarProps) {
  const { state, isMobile } = useSidebar(); // Get state and isMobile from the hook
  // Determine if the sidebar is in a truly collapsed state (not just mobile offcanvas)
  const isCollapsed = state === 'collapsed' && !isMobile;
  return (
    <Sidebar {...props} className="group/sidebar"> {/* Added group/sidebar for conditional styling */}
      <SidebarHeader>
        <div className={`py-4 ${isCollapsed ? "": "px-2"}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg min-w-10">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {/* Conditionally hide text when collapsed */}
            <div className={`min-w-0 flex-1 ${isCollapsed ? 'hidden' : ''}`}>
              <h2 className="text-lg font-bold text-slate-900 truncate">{website.name}</h2>
              <p className="text-xs text-slate-500 font-medium">Website Dashboard</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="thin-scrollbar">
        <SidebarGroup>
          {/* Conditionally hide label when collapsed */}
          <SidebarGroupLabel className={`text-xs font-bold text-slate-700 uppercase tracking-wider px-2 ${isCollapsed ? 'hidden' : ''}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeTab === item.value}
                    className="rounded-xl hover:bg-slate-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-500 data-[active=true]:to-emerald-600 data-[active=true]:text-white data-[active=true]:shadow-lg transition-all duration-200 py-5"
                  >
                    {/* Adjusted spacing and visibility for shrunk state */}
                    {item.value === "telegram" ? (
                      <button
                        className="w-full flex items-center space-x-3 px-3 py-2.5 cursor-pointer"
                        onClick={() => window.open("https://t.me/chat_bot_hub_bot", "_blank")}
                      >
                        <div className={`w-8 h-8 data-[active=true]:bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 ${isCollapsed ? "-ml-2 bg-transparent " : ""}`}>
                          <item.icon className={`w-4 h-4 ${isCollapsed ? "data-[active=true]:text-white!" : ""}`} />
                        </div>
                        <span className={`font-semibold ${isCollapsed ? 'hidden' : ''}`}>
                          {item.title}
                        </span>
                      </button>
                    ) : (
                      <Link href={item.href(website._id)} className="w-full flex items-center space-x-3 px-3 py-2.5">
                        <div className={`w-8 h-8 data-[active=true]:bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 ${isCollapsed ? "-ml-2 bg-transparent " : ""}`}>
                          <item.icon className={`w-4 h-4 ${isCollapsed ? "data-[active=true]:text-white!" : ""}`} />
                        </div>
                        <span className={`font-semibold ${isCollapsed ? 'hidden' : ''}`}>
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Image and description section within a card, moved under navigation */}
        <div className={`p-2 ${isCollapsed ? 'hidden' : ''}`}> {/* Smaller padding when collapsed */}
          <Link href="/blog/multi-language-support" className="block">
            <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md
                            ${isCollapsed ? 'rounded-full w-10 h-10 flex items-center justify-center' : ''}`}>
              <img
                src="/assets/sidebar/version.png"
                alt="Multi-language support"
                className={`w-full h-auto object-cover rounded-t-xl
                           ${isCollapsed ? 'w-8 h-8 rounded-full object-contain' : ''}`}
                style={{ maxWidth: isCollapsed ? '32px' : '100%', maxHeight: isCollapsed ? '32px' : '100%', margin: '0 auto', display: 'block' }} // Adjusted image size for collapsed state
              />
              {/* Hide description when collapsed */}
              <div className={`p-3 ${isCollapsed ? 'hidden' : ''}`}>
                <p className="text-xs text-slate-700 font-medium text-center">version 1.3 (multi-language)</p>
              </div>
            </div>
          </Link>
        </div>

      </SidebarContent>
      <SidebarFooter>
        <div className="py-2 border-t">
          <Link href="/websites" passHref>
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className={`h-4 w-4 ${isCollapsed ? '-ml-1' : 'mr-2'}`} /> {/* Adjusted margin for collapsed state */}
              <span className={`${isCollapsed ? 'hidden' : ''}`}>Back to Websites</span> {/* Hide text when collapsed */}
            </Button>
          </Link>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}