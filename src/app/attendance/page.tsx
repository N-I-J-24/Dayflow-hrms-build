"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore, useDataStore } from "@/lib/store";
import { formatTime, cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AttendancePage() {
  const { user } = useAuthStore();
  const { attendance, leaveRequests } = useDataStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const aDate = new Date(a.date);
      return a.userId === user?.id && aDate.getMonth() === currentMonth && aDate.getFullYear() === currentYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendance, user?.id, currentMonth, currentYear]);

  const stats = useMemo(() => {
    const present = monthAttendance.filter(a => a.status === 'present').length;
    const leaves = leaveRequests.filter(l => 
      l.userId === user?.id && 
      l.status === 'approved' && 
      new Date(l.fromDate).getMonth() === currentMonth
    ).reduce((acc, curr) => acc + curr.days, 0);
    
    // Calculate total working days in the month (excluding weekends)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let workingDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(currentYear, currentMonth, i).getDay();
      if (day !== 0 && day !== 6) workingDays++;
    }

    return { present, leaves, workingDays };
  }, [monthAttendance, leaveRequests, user?.id, currentMonth, currentYear]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = MONTHS.indexOf(month);
    setCurrentDate(new Date(currentYear, monthIndex, 1));
  };

  const formatHours = (hours?: number) => {
    if (hours === undefined) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout title="Attendance">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Attendance</h2>
          
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10 border-slate-300" onClick={prevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 border-slate-300" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <Select value={MONTHS[currentMonth]} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[140px] h-10 bg-white border-slate-300">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-4 flex-wrap">
                <div className="border border-slate-300 bg-white px-6 py-2 rounded-sm text-center min-w-[150px]">
                  <p className="text-sm text-slate-600 font-medium">Count of days present</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{stats.present}</p>
                </div>
                <div className="border border-slate-300 bg-white px-6 py-2 rounded-sm text-center min-w-[150px]">
                  <p className="text-sm text-slate-600 font-medium">Leaves count</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{stats.leaves}</p>
                </div>
                <div className="border border-slate-300 bg-white px-6 py-2 rounded-sm text-center min-w-[150px]">
                  <p className="text-sm text-slate-600 font-medium">Total working days</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{stats.workingDays}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-300 rounded-sm overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-slate-300">
              <p className="text-sm font-medium text-slate-600">
                {currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-300">
                  <TableHead className="font-semibold text-slate-900 h-12">Date</TableHead>
                  <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Check In</TableHead>
                  <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Check Out</TableHead>
                  <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Work Hours</TableHead>
                  <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Extra hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                      No attendance records found for this month.
                    </TableCell>
                  </TableRow>
                ) : (
                  monthAttendance.map((record) => (
                    <TableRow key={record.id} className="border-b border-slate-300 last:border-0">
                      <TableCell className="font-medium py-4">
                        {new Date(record.date).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell className="border-l border-slate-300 py-4">
                        {record.checkInTime ? record.checkInTime : "-"}
                      </TableCell>
                      <TableCell className="border-l border-slate-300 py-4">
                        {record.checkOutTime ? record.checkOutTime : "-"}
                      </TableCell>
                      <TableCell className="border-l border-slate-300 py-4 font-medium">
                        {formatHours(record.totalHours)}
                      </TableCell>
                      <TableCell className="border-l border-slate-300 py-4 font-medium">
                        {formatHours(record.extraHours)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    );
  }

