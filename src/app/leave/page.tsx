"use client";

import { useState } from "react";
import { Calendar, Plus, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore, useDataStore } from "@/lib/store";
import { formatDate, calculateDaysBetween, cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { LeaveType } from "@/lib/types";

export default function LeavePage() {
  const { user } = useAuthStore();
  const { leaveRequests, leaveBalances, addLeaveRequest, jobDetails } = useDataStore();
  
  const userLeaveRequests = leaveRequests.filter((lr) => lr.userId === user?.id);
  const leaveBalance = user ? leaveBalances[user.id] : null;
  const job = user ? jobDetails[user.id] : null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '' as LeaveType | '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const days = formData.fromDate && formData.toDate 
    ? calculateDaysBetween(formData.fromDate, formData.toDate)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.leaveType || !formData.fromDate || !formData.toDate || !formData.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    addLeaveRequest({
      userId: user!.id,
      employeeName: user!.fullName,
      employeeId: user!.employeeId,
      department: job?.department || 'General',
      leaveType: formData.leaveType as LeaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      days,
      reason: formData.reason,
      status: 'pending',
    });

    toast.success("Leave request submitted successfully!");
    setIsDialogOpen(false);
    setFormData({ leaveType: '', fromDate: '', toDate: '', reason: '' });
  };

  const pendingRequests = userLeaveRequests.filter((lr) => lr.status === 'pending');
  const approvedRequests = userLeaveRequests.filter((lr) => lr.status === 'approved');
  const rejectedRequests = userLeaveRequests.filter((lr) => lr.status === 'rejected');

  const totalBalance = leaveBalance
    ? leaveBalance.paid + leaveBalance.sick + leaveBalance.casual + leaveBalance.emergency
    : 0;

  return (
    <DashboardLayout title="Leave Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Leave Management</h2>
            <p className="text-slate-600">Apply for leave and track your requests</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary">
                <Plus className="w-4 h-4" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Fill in the details for your leave request
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={formData.leaveType} onValueChange={(value) => setFormData({ ...formData, leaveType: value as LeaveType })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave ({leaveBalance?.paid || 0} days available)</SelectItem>
                      <SelectItem value="sick">Sick Leave ({leaveBalance?.sick || 0} days available)</SelectItem>
                      <SelectItem value="casual">Casual Leave ({leaveBalance?.casual || 0} days available)</SelectItem>
                      <SelectItem value="emergency">Emergency Leave ({leaveBalance?.emergency || 0} days available)</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      min={formData.fromDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                {days > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Total days: <span className="font-semibold">{days}</span>
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Please provide a reason for your leave..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-slate-900">{totalBalance}</p>
              <p className="text-sm text-slate-500">Total Balance</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{leaveBalance?.paid || 0}</p>
              <p className="text-sm text-blue-600">Paid Leave</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-600">{leaveBalance?.sick || 0}</p>
              <p className="text-sm text-red-600">Sick Leave</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{leaveBalance?.casual || 0}</p>
              <p className="text-sm text-amber-600">Casual Leave</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{leaveBalance?.emergency || 0}</p>
              <p className="text-sm text-purple-600">Emergency</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{pendingRequests.length}</p>
                <p className="text-sm text-amber-600">Pending Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{approvedRequests.length}</p>
                <p className="text-sm text-emerald-600">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{rejectedRequests.length}</p>
                <p className="text-sm text-red-600">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Your leave request history</CardDescription>
          </CardHeader>
          <CardContent>
            {userLeaveRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No leave requests yet</p>
                <p className="text-sm">Click &quot;Apply for Leave&quot; to submit your first request</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userLeaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl transition-colors",
                      request.status === 'pending' && "bg-amber-50",
                      request.status === 'approved' && "bg-emerald-50",
                      request.status === 'rejected' && "bg-red-50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        request.status === 'pending' && "bg-amber-100",
                        request.status === 'approved' && "bg-emerald-100",
                        request.status === 'rejected' && "bg-red-100"
                      )}>
                        {request.status === 'approved' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {request.status === 'rejected' && <XCircle className="w-5 h-5 text-red-600" />}
                        {request.status === 'pending' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900 capitalize">{request.leaveType} Leave</p>
                          <Badge variant="outline" className="text-xs">
                            {request.days} {request.days === 1 ? 'day' : 'days'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{request.reason}</p>
                        {request.adminRemarks && (
                          <p className="text-xs text-slate-500 mt-1 italic">
                            HR Note: {request.adminRemarks}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center gap-3">
                      <p className="text-xs text-slate-400">Applied: {formatDate(request.appliedAt)}</p>
                      <Badge
                        variant={
                          request.status === 'approved' ? 'default' :
                          request.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {request.status}
                      </Badge>
                    </div>
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
