"use client";

import { Bell, Check, CheckCircle2, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore, useDataStore } from "@/lib/store";
import { formatDate, cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDataStore();
  
  const userNotifications = notifications.filter((n) => n.userId === user?.id);
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leave": return "🏖️";
      case "attendance": return "📊";
      case "payroll": return "💰";
      case "announcement": return "📢";
      default: return "🔔";
    }
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
            <p className="text-slate-600">Stay updated with the latest activities</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" className="gap-2" onClick={markAllNotificationsRead}>
              <Check className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>{unreadCount} unread notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {userNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">You&apos;ll see notifications here when there are updates</p>
              </div>
            ) : (
              <div className="space-y-2">
                {userNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer hover:bg-slate-50",
                      !notification.isRead && "bg-blue-50/50"
                    )}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={cn("font-medium text-slate-900", !notification.isRead && "font-semibold")}>
                          {notification.title}
                        </p>
                        {!notification.isRead && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      <p className="text-sm text-slate-600">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-2">{formatDate(notification.createdAt)}</p>
                    </div>
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); markNotificationRead(notification.id); }}>
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
