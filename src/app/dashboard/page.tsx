"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Settings,
  LogOut,
  User,
  Plane,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useAuthStore, useDataStore } from "@/lib/store";
import { getInitials, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type TabType = "employees" | "attendance" | "time-off";

export default function EmployeeDashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { users, jobDetails, attendance, leaveRequests, addAttendance, updateAttendance } = useDataStore();
  const [activeTab, setActiveTab] = useState<TabType>("employees");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find((a) => a.userId === user?.id && a.date === todayStr);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (todayAttendance?.checkInTime) {
      setIsCheckedIn(true);
      setCheckInTime(todayAttendance.checkInTime);
    }
  }, [todayAttendance]);

  const handleCheckIn = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (todayAttendance) {
      updateAttendance(todayAttendance.id, { checkInTime: timeStr });
    } else {
      addAttendance({
        userId: user!.id,
        date: todayStr,
        checkInTime: timeStr,
        status: 'present',
      });
    }
    setIsCheckedIn(true);
    setCheckInTime(timeStr);
    toast.success(`Checked in at ${formatTime(timeStr)}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (todayAttendance) {
      const checkIn = todayAttendance.checkInTime?.split(':').map(Number) || [9, 0];
      const checkOut = [now.getHours(), now.getMinutes()];
      const totalHours = (checkOut[0] - checkIn[0]) + (checkOut[1] - checkIn[1]) / 60;
      
      updateAttendance(todayAttendance.id, {
        checkOutTime: timeStr,
        totalHours: Math.round(totalHours * 10) / 10,
      });
    }
    toast.success(`Checked out at ${formatTime(timeStr)}`);
    router.push("/sign-in");
    logout();
  };

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  const getEmployeeStatus = (employeeId: string) => {
    const employeeLeave = leaveRequests.find(
      (lr) => lr.userId === employeeId && lr.status === 'approved' &&
      new Date(lr.fromDate) <= new Date(todayStr) && new Date(lr.toDate) >= new Date(todayStr)
    );
    if (employeeLeave) return 'on_leave';

    const employeeAttendance = attendance.find(
      (a) => a.userId === employeeId && a.date === todayStr
    );
    if (employeeAttendance?.checkInTime) return 'present';
    return 'absent';
  };

  const allEmployees = users.filter(u => u.id === user?.id);
  
  const filteredEmployees = allEmployees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white animate-pulse">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">Dayflow</span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "employees"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "attendance"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => setActiveTab("time-off")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === "time-off"
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Time Off
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`} title={isCheckedIn ? 'Checked In' : 'Not Checked In'} />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Avatar className="h-9 w-9 border-2 border-slate-200">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/leave">
              <Button variant="outline" size="sm">
                View Requests
              </Button>
            </Link>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("employees")}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "employees"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 bg-slate-100"
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "attendance"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 bg-slate-100"
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("time-off")}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "time-off"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 bg-slate-100"
            }`}
          >
            Time Off
          </button>
        </div>

        {activeTab === "employees" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEmployees.map((employee) => {
              const status = getEmployeeStatus(employee.id);
              const job = jobDetails[employee.id];
              
              return (
                <Link
                  key={employee.id}
                  href={`/profile/${employee.id}`}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Avatar className="h-14 w-14 border-2 border-slate-100">
                      <AvatarImage src={employee.profilePicture} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(employee.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1">
                      {status === 'present' && (
                        <div className="w-3 h-3 rounded-full bg-green-500" title="Present" />
                      )}
                      {status === 'on_leave' && (
                        <span title="On Leave"><Plane className="w-4 h-4 text-blue-500" /></span>
                      )}
                      {status === 'absent' && (
                        <div className="w-3 h-3 rounded-full bg-amber-500" title="Absent" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {employee.fullName}
                  </h3>
                  <p className="text-sm text-slate-500">{employee.employeeId}</p>
                  {job && (
                    <p className="text-xs text-slate-400 mt-1">{job.position}</p>
                  )}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">View Profile</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className={`w-20 h-20 rounded-full ${isCheckedIn ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mb-4`}>
                <div className={`w-6 h-6 rounded-full ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {isCheckedIn ? 'You are checked in' : 'You are not checked in'}
              </h2>
              {checkInTime && (
                <p className="text-slate-500 mb-6">Since {formatTime(checkInTime)}</p>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleCheckIn}
                  disabled={isCheckedIn}
                  className={isCheckedIn ? "opacity-50" : "gradient-primary"}
                >
                  Check In <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCheckOut}
                  disabled={!isCheckedIn}
                >
                  Check Out <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">My Attendance Today</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allEmployees.map((employee) => {
                    const status = getEmployeeStatus(employee.id);
                    return (
                      <div key={employee.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.profilePicture} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {getInitials(employee.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{employee.fullName}</p>
                          <p className="text-xs text-slate-500 capitalize">{status.replace('_', ' ')}</p>
                        </div>
                        <div>
                          {status === 'present' && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                          {status === 'on_leave' && <Plane className="w-4 h-4 text-blue-500" />}
                          {status === 'absent' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          </div>
        )}

        {activeTab === "time-off" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Leave Requests</h2>
              <Link href="/leave">
                <Button className="gradient-primary">
                  Apply for Leave
                </Button>
              </Link>
            </div>
            
            {leaveRequests.filter(lr => lr.userId === user.id).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 mb-4">No leave requests yet</p>
                <Link href="/leave">
                  <Button variant="outline">Apply for Leave</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {leaveRequests.filter(lr => lr.userId === user.id).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900 capitalize">{request.leaveType} Leave</p>
                      <p className="text-sm text-slate-500">
                        {request.fromDate} - {request.toDate} ({request.days} days)
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200">
          <Link href="/settings" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
