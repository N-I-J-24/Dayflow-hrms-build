"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, LogOut, Settings, UserCircle, X } from "lucide-react";
import { useAuthStore, useDataStore } from "@/lib/store";
import { cn, getInitials, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ title, subtitle, onMenuClick, showMenuButton }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDataStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const userNotifications = notifications.filter((n) => n.userId === user?.id);
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leave":
        return "🏖️";
      case "attendance":
        return "📊";
      case "payroll":
        return "💰";
      case "announcement":
        return "📢";
      default:
        return "🔔";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className={cn("relative transition-all duration-300", searchOpen ? "w-64" : "w-auto")}>
            {searchOpen ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  className="pl-9 pr-9 h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b dark:border-slate-800">
                <DropdownMenuLabel className="font-semibold p-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-700 h-auto p-0"
                    onClick={() => markAllNotificationsRead()}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-80">
                {userNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500 dark:text-slate-400">
                    <Bell className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {userNotifications.slice(0, 10).map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800",
                          !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/20"
                        )}
                      >
                        <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium text-slate-900 dark:text-white", !notification.isRead && "font-semibold")}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDate(notification.createdAt)}</p>
                        </div>
                        {!notification.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Link href="/notifications" className="block">
                  <Button variant="ghost" className="w-full text-sm">
                    View all notifications
                  </Button>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 rounded-xl pl-2 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {user ? getInitials(user.fullName) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.fullName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
