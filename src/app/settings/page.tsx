"use client";

import { useState, useEffect } from "react";
import { User, Bell, Lock, Moon, Sun, Globe, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [leaveUpdates, setLeaveUpdates] = useState(true);
  const [payrollAlerts, setPayrollAlerts] = useState(true);
  const [language, setLanguage] = useState("en");

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  if (!mounted) return null;

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="account" className="gap-2">
                <User className="w-4 h-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={user?.fullName} disabled className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user?.email} disabled className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Employee ID</Label>
                      <Input value={user?.employeeId} disabled className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={user?.role} disabled className="bg-slate-50 capitalize" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSave} className="gradient-primary text-white">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive updates via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">Push Notifications</p>
                        <p className="text-sm text-slate-500">Receive browser push notifications</p>
                      </div>
                      <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">Leave Updates</p>
                        <p className="text-sm text-slate-500">Get notified about leave request status</p>
                      </div>
                      <Switch checked={leaveUpdates} onCheckedChange={setLeaveUpdates} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">Payroll Alerts</p>
                        <p className="text-sm text-slate-500">Get notified when salary is credited</p>
                      </div>
                      <Switch checked={payrollAlerts} onCheckedChange={setPayrollAlerts} />
                    </div>
                  </div>
                  <Button onClick={handleSave} className="gradient-primary text-white">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  <Button onClick={() => toast.success("Password updated successfully!")} className="gradient-primary text-white">
                    Update Password
                  </Button>
                  <div className="pt-6 border-t">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

      </div>
    </DashboardLayout>
  );
}
