"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { AppSidebar } from "./app-sidebar";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [website, setWebsite] = useState<any | null>(null);
  const [websiteLoading, setWebsiteLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    if (user && id) {
      const foundWebsite = user.websites.find((w: any) => w._id === id);
      if (foundWebsite) {
        setWebsite(foundWebsite);
      } else {
        router.push("/websites");
      }
    } else if (user && !id) {
      router.push("/websites");
    }
    setWebsiteLoading(false);
  }, [user, id, router, authLoading]);

  // Handle free trial redirection logic
  useEffect(() => {
    if (!websiteLoading && website) {
      if (website.freeTrialPlanId) {
        if (website.freeTrialEnded && !website.stripeSubscriptionId) {
          router.push(`/pricing?websiteId=${website._id}`);
        }
      } else {
        if (!website.stripeSubscriptionId && !website.exlusiveCustomer) {
          router.push(`/pricing?websiteId=${website._id}`);
        }
      }
    }
  }, [website, websiteLoading, router]);

  // Determine active tab based on pathname
  useEffect(() => {
    if (pathname.includes("/conversations")) {
      setActiveTab("conversations");
    } else if (pathname.includes("/ai")) {
      setActiveTab("ai");
    } else if (pathname.includes("/staff")) {
      setActiveTab("staff");
    } else if (pathname.includes("/appearance")) {
      setActiveTab("appearance");
    } else if (pathname.includes("/integration")) {
      setActiveTab("integration");
    } else if (pathname.includes("/settings")) {
      setActiveTab("settings");
    } else {
      setActiveTab("overview"); // Default to overview
    }
  }, [pathname]);

  if (authLoading || websiteLoading || !website) {
    return <LoadingSpinner />;
  }

  // Function to generate breadcrumbs dynamically
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(segment => segment);
    let currentPath = '';
    const breadcrumbs = segments.map((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      let displaySegment = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Special handling for dynamic segments and specific names
      if (segment === id) {
        displaySegment = website.name; // Use website name for the ID segment
      } else if (segment === 'websites') {
        displaySegment = 'Websites';
      } else if (segment === 'ai') {
        displaySegment = 'AI Management';
      } else if (segment === 'conversations') {
        displaySegment = 'Conversations';
      } else if (segment === 'staff') {
        displaySegment = 'Staff';
      } else if (segment === 'appearance') {
        displaySegment = 'Appearance';
      } else if (segment === 'integration') {
        displaySegment = 'Integration';
      } else if (segment === 'settings') {
        displaySegment = 'Settings';
      }


      return (
        <React.Fragment key={currentPath}>
          <BreadcrumbItem>
            {isLast ? (
              <BreadcrumbPage>{displaySegment}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={currentPath}>{displaySegment}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      );
    });
    return breadcrumbs;
  };


  return (
    <SidebarProvider>
      {/* The AppSidebar component, which contains the actual sidebar UI */}
      <AppSidebar website={website} activeTab={activeTab} collapsible="icon" variant="inset"/>
      
      {/* The main content area, wrapped in SidebarInset */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {generateBreadcrumbs()}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4">
          {children} {/* This is where your page content will be rendered */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}