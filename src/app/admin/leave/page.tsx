"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, Calendar, Filter, Search, MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useDataStore, useAuthStore } from "@/lib/store";
import { formatDate, cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { LeaveRequest } from "@/lib/types";

export default function AdminLeavePage() {
  const { leaveRequests, updateLeaveRequest, addNotification } = useDataStore();
  const { user: currentUser } = useAuthStore();
  const router = useRouter();

  // Protection for admin only route
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr';
  
  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/dashboard');
    }
    return null;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const pendingRequests = leaveRequests.filter((lr) => lr.status === 'pending');
  const approvedRequests = leaveRequests.filter((lr) => lr.status === 'approved');
  const rejectedRequests = leaveRequests.filter((lr) => lr.status === 'rejected');

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.leaveType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAction = (request: LeaveRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminRemarks("");
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;

    updateLeaveRequest(selectedRequest.id, {
      status: actionType === 'approve' ? 'approved' : 'rejected',
      adminRemarks,
    });

    addNotification({
      userId: selectedRequest.userId,
      type: 'leave',
      title: `Leave Request ${actionType === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `Your ${selectedRequest.leaveType} leave request for ${formatDate(selectedRequest.fromDate)} - ${formatDate(selectedRequest.toDate)} has been ${actionType === 'approve' ? 'approved' : 'rejected'}.${adminRemarks ? ` Note: ${adminRemarks}` : ''}`,
      isRead: false,
    });

    toast.success(`Leave request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
    setSelectedRequest(null);
    setActionType(null);
    setAdminRemarks("");
  };

  return (
    <DashboardLayout title="Leave Requests">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Leave Requests</h2>
            <p className="text-slate-600">Review and approve leave requests</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{pendingRequests.length}</p>
                <p className="text-sm text-amber-600">Pending</p>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>All Leave Requests</CardTitle>
                <CardDescription>Manage employee leave requests</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No leave requests found</p>
                <p className="text-sm">Adjust filters or check back later</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl gap-4",
                      request.status === 'pending' && "bg-amber-50",
                      request.status === 'approved' && "bg-emerald-50",
                      request.status === 'rejected' && "bg-red-50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{request.employeeName}</p>
                          <span className="text-sm text-slate-500">({request.employeeId})</span>
                        </div>
                        <p className="text-sm text-slate-600">{request.department}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="capitalize">{request.leaveType} Leave</Badge>
                          <span className="text-sm text-slate-600">
                            {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                          </span>
                          <span className="text-sm font-medium text-slate-700">({request.days} days)</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                      <p className="text-xs text-slate-400">Applied: {formatDate(request.appliedAt)}</p>
                      {request.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleAction(request, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleAction(request, 'approve')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <Badge variant={request.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                          {request.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => { setSelectedRequest(null); setActionType(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve' 
                  ? 'You are about to approve this leave request.'
                  : 'You are about to reject this leave request.'}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium">{selectedRequest.employeeName}</p>
                  <p className="text-sm text-slate-600 capitalize">{selectedRequest.leaveType} Leave - {selectedRequest.days} days</p>
                  <p className="text-sm text-slate-500">{formatDate(selectedRequest.fromDate)} - {formatDate(selectedRequest.toDate)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Add remarks (optional)
                  </label>
                  <Textarea
                    placeholder="Add any notes for the employee..."
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setSelectedRequest(null); setActionType(null); }}>
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                className={actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
