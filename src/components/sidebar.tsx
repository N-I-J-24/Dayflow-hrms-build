"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Clock,
    FileText,
    CreditCard,
    Settings,
    LogOut,
    ChevronLeft,
    BarChart3,
    UserCircle,
    Bell,
  } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const employeeNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/profile", icon: UserCircle, label: "My Profile" },
  { href: "/attendance", icon: Clock, label: "Attendance" },
  { href: "/leave", icon: Calendar, label: "Leave" },
];

const adminNavItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/employees", icon: Users, label: "Employees" },
  { href: "/admin/attendance", icon: Clock, label: "Attendance" },
  { href: "/admin/leave", icon: Calendar, label: "Leave Requests" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
    const isAdmin = user?.role === 'hr' || user?.role === 'admin';
    const isSuperAdmin = user?.role === 'admin';
    
    const navItems = isAdmin 
        ? [
            ...adminNavItems,
            ...(isSuperAdmin ? [{ href: "/admin/payroll", icon: CreditCard, label: "Payroll" }] : [])
          ]
      : employeeNavItems;


  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

    return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800", isCollapsed ? "justify-center" : "justify-between")}>
          <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            {!isCollapsed && <span className="text-xl font-bold text-slate-900 dark:text-white">Dayflow</span>}
          </Link>
          {!isCollapsed && (
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center py-3 border-b border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const NavIcon = item.icon;
              
              const navLink = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <NavIcon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-600 dark:text-blue-400")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );

              return (
                <li key={item.href}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    navLink
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <ul className="space-y-1">
              {[
                { href: "/notifications", icon: Bell, label: "Notifications" },
                { href: "/settings", icon: Settings, label: "Settings" },
              ].map((item) => {
                const isActive = pathname === item.href;
                const NavIcon = item.icon;
                
                const navLink = (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <NavIcon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-600 dark:text-blue-400")} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );

                return (
                  <li key={item.href}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      navLink
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className={cn("p-3 border-t border-slate-200 dark:border-slate-800", isCollapsed ? "px-2" : "")}>
          {user && (
            <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800", isCollapsed && "justify-center")}>
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.profilePicture} alt={user.fullName} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate uppercase">{user.role === 'hr' ? 'HR' : user.role}</p>
                </div>
              )}
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full mt-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
              isCollapsed ? "px-2" : "justify-start"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Sign out</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
