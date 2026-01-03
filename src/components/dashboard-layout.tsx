"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Welcome back! Here's your overview." },
  "/profile": { title: "My Profile", subtitle: "View and manage your profile information" },
  "/attendance": { title: "Attendance", subtitle: "Track your daily attendance" },
  "/leave": { title: "Leave Management", subtitle: "Apply for leave and track requests" },
  "/payroll": { title: "Payroll", subtitle: "View your salary and payslips" },
  "/notifications": { title: "Notifications", subtitle: "Stay updated with latest activities" },
  "/settings": { title: "Settings", subtitle: "Manage your account settings" },
  "/admin/dashboard": { title: "HR Dashboard", subtitle: "Overview of HR operations" },
  "/admin/employees": { title: "Employee Management", subtitle: "Manage all employees" },
  "/admin/attendance": { title: "Attendance Management", subtitle: "Track and manage attendance" },
  "/admin/leave": { title: "Leave Requests", subtitle: "Review and approve leave requests" },
  "/admin/payroll": { title: "Payroll Management", subtitle: "Process and manage payroll" },
  "/admin/reports": { title: "Reports & Analytics", subtitle: "View detailed reports" },
};

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white animate-pulse">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const pageInfo = pageTitles[pathname] || { title, subtitle };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={cn("transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          showMenuButton
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
