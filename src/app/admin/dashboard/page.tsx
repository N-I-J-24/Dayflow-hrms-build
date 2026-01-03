"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  UserPlus,
  FileText,
  BarChart3,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useDataStore, useAuthStore } from "@/lib/store";
import { formatDate, getGreeting } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const departmentData = [
  { name: "Engineering", present: 45, absent: 5, leave: 3 },
  { name: "Design", present: 12, absent: 2, leave: 1 },
  { name: "Marketing", present: 18, absent: 1, leave: 2 },
  { name: "HR", present: 8, absent: 0, leave: 1 },
  { name: "Sales", present: 22, absent: 3, leave: 2 },
];

const attendanceOverview = [
  { name: "Present", value: 105, color: "#10B981" },
  { name: "Absent", value: 11, color: "#EF4444" },
  { name: "On Leave", value: 9, color: "#3B82F6" },
];

export default function AdminDashboard() {
  const { users, leaveRequests, attendance } = useDataStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  // Protection for admin only route
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  
  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/dashboard');
    }
    return null;
  }

  const isSuperAdmin = user?.role === 'admin';
  const totalEmployees = users.length;
  const pendingLeaves = leaveRequests.filter((lr) => lr.status === 'pending');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentToday = todayAttendance.filter((a) => a.status === 'present').length;
  const absentToday = totalEmployees - presentToday - pendingLeaves.length;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      change: "+2 this month",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Present Today",
      value: presentToday || 85,
      change: "92% attendance",
      trend: "up",
      icon: CheckCircle2,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "On Leave",
      value: 9,
      change: "3 pending requests",
      trend: "neutral",
      icon: Calendar,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Pending Approvals",
      value: pendingLeaves.length,
      change: "Action required",
      trend: "down",
      icon: AlertCircle,
      color: "bg-rose-500",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  const recentActivities = [
    { type: "join", user: "Alex Thompson", action: "joined as Software Engineer", time: "2 hours ago" },
    { type: "leave", user: "Emma Wilson", action: "leave request approved", time: "3 hours ago" },
    { type: "attendance", user: "James Brown", action: "marked attendance late", time: "5 hours ago" },
    { type: "payroll", user: "System", action: "January payroll processed", time: "Yesterday" },
  ];

  return (
    <DashboardLayout title="HR Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{getGreeting()}!</h2>
            <p className="text-slate-600">Here&apos;s what&apos;s happening with your team today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/employees">
              <Button variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Employee
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button className="gap-2 gradient-primary">
                <BarChart3 className="w-4 h-4" />
                View Reports
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  {stat.trend === "up" && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                  {stat.trend === "down" && <TrendingDown className="w-5 h-5 text-rose-500" />}
                </div>
                <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department-wise Attendance</CardTitle>
                  <CardDescription>Today&apos;s attendance by department</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="present" name="Present" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="leave" name="On Leave" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Today&apos;s attendance distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceOverview}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {attendanceOverview.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {attendanceOverview.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Leave Requests</CardTitle>
                  <CardDescription>{pendingLeaves.length} requests awaiting approval</CardDescription>
                </div>
                <Link href="/admin/leave">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.slice(0, 4).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {request.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{request.employeeName}</p>
                          <p className="text-sm text-slate-500 capitalize">
                            {request.leaveType} Leave - {request.days} days
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates across the organization</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'join' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'leave' ? 'bg-emerald-100 text-emerald-600' :
                      activity.type === 'attendance' ? 'bg-amber-100 text-amber-600' :
                      'bg-violet-100 text-violet-600'
                    }`}>
                      {activity.type === 'join' && <UserPlus className="w-4 h-4" />}
                      {activity.type === 'leave' && <Calendar className="w-4 h-4" />}
                      {activity.type === 'attendance' && <Clock className="w-4 h-4" />}
                      {activity.type === 'payroll' && <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-slate-900">{activity.user}</span>
                        <span className="text-slate-600"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/employees">
              <Card className="hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group border-slate-200">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Manage Employees
                    </p>
                    <p className="text-sm text-slate-500">View, edit, add employees</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-blue-600 transition-colors" />
                </CardContent>
              </Card>
            </Link>

            {isSuperAdmin && (
              <Link href="/admin/payroll">
                <Card className="hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group border-slate-200">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <FileText className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        Process Payroll
                      </p>
                      <p className="text-sm text-slate-500">Generate payslips</p>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            )}

            <Link href="/admin/reports" className={!isSuperAdmin ? "md:col-span-2" : ""}>
              <Card className="hover:shadow-lg hover:border-violet-200 transition-all cursor-pointer group border-slate-200">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                    <BarChart3 className="w-7 h-7 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                      View Reports
                    </p>
                    <p className="text-sm text-slate-500">Analytics & insights</p>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto text-slate-400 group-hover:text-violet-600 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>

      </div>
    </DashboardLayout>
  );
}
