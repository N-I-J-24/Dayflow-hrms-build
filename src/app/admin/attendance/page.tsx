"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore, useDataStore } from "@/lib/store";
import { formatTime, cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function AdminAttendancePage() {
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { users, attendance } = useDataStore();

  useEffect(() => {
    if (authUser && authUser.role !== 'admin' && authUser.role !== 'hr') {
      router.push("/dashboard");
    }
  }, [authUser, router]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  
  const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

  const filteredAttendance = useMemo(() => {
    return users.map(user => {
      const record = attendance.find(a => a.userId === user.id && a.date === formattedSelectedDate);
      return {
        user,
        record
      };
    }).filter(item => 
      item.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, attendance, formattedSelectedDate, searchQuery]);

  const prevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
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
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Searchbar" 
                className="pl-9 bg-white border-slate-300 rounded-sm" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10 border-slate-300" onClick={prevDay}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 border-slate-300" onClick={nextDay}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="bg-white border-slate-300 h-10 px-4 flex gap-2 font-normal rounded-sm min-w-[160px] justify-between">
                    Date
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" className="bg-white border-slate-300 h-10 px-6 rounded-sm">Day</Button>
            </div>
          </div>
        </div>

        <div className="border border-slate-300 rounded-sm overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-slate-300 bg-white">
            <p className="text-sm font-medium text-slate-600">
              {format(selectedDate, "dd, MMMM yyyy")}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-300">
                <TableHead className="font-semibold text-slate-900 h-12 w-[300px]">Emp</TableHead>
                <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Check In</TableHead>
                <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Check Out</TableHead>
                <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Work Hours</TableHead>
                <TableHead className="font-semibold text-slate-900 h-12 border-l border-slate-300">Extra hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    No attendance records found for this date.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendance.map(({ user, record }) => (
                  <TableRow key={user.id} className="border-b border-slate-300 last:border-0">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profilePicture} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 text-sm">[{user.fullName}]</span>
                          <span className="text-[10px] text-slate-500">{user.employeeId}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="border-l border-slate-300 py-4 text-sm">
                      {record?.checkInTime ? record.checkInTime : "-"}
                    </TableCell>
                    <TableCell className="border-l border-slate-300 py-4 text-sm">
                      {record?.checkOutTime ? record.checkOutTime : "-"}
                    </TableCell>
                    <TableCell className="border-l border-slate-300 py-4 text-sm font-medium">
                      {formatHours(record?.totalHours)}
                    </TableCell>
                    <TableCell className="border-l border-slate-300 py-4 text-sm font-medium">
                      {formatHours(record?.extraHours)}
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
