"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Eye, Pencil, Trash2, Users, CheckCircle2, XCircle, Plane, ChevronRight, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useDataStore, useAuthStore } from "@/lib/store";
import { formatDate, getInitials, generateEmployeeId } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminEmployeesPage() {
  const { users, profiles, jobDetails, leaveRequests, attendance, addUser } = useDataStore();
  const { user: currentUser } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewEmployee, setViewEmployee] = useState<string | null>(null);
  const [editEmployee, setEditEmployee] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Protection for admin only route
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr';
  
  if (!isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/dashboard');
    }
    return null;
  }
  
  const [newEmployee, setNewEmployee] = useState({
    fullName: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    phone: "",
  });

  const todayStr = new Date().toISOString().split('T')[0];

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

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    const currentStatus = getEmployeeStatus(user.id);
    return matchesSearch && currentStatus === statusFilter;
  });

  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;
  const onLeaveCount = users.filter((u) => getEmployeeStatus(u.id) === 'on_leave').length;

  const selectedEmployee = viewEmployee ? users.find(u => u.id === viewEmployee) : null;
  const editingEmployee = editEmployee ? users.find(u => u.id === editEmployee) : null;

    const handleAddEmployee = () => {
      if (!newEmployee.fullName || !newEmployee.email) {
        toast.error("Please fill in required fields");
        return;
      }

      const currentYear = new Date().getFullYear();
      const employeesThisYear = users.filter(u => u.createdAt?.getFullYear() === currentYear).length;
      
        // Auto-generate Employee ID using company name
        const companyName = "Dayflow";
        const generatedId = generateEmployeeId(companyName, newEmployee.fullName, currentYear, employeesThisYear + 1);

      // Auto-generate a random temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      const newId = Math.random().toString(36).substring(2, 15);
      addUser({
        id: newId,
        employeeId: generatedId,
        email: newEmployee.email,
        fullName: newEmployee.fullName,
        role: 'employee',
        status: 'active',
        createdAt: new Date(),
        // In a real app, we'd store the hashed password. 
        // For this demo, we'll just log it or show it.
      }, {
        department: newEmployee.department,
        position: newEmployee.position,
        phone: newEmployee.phone,
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-bold">Employee Added Successfully!</p>
          <p className="text-sm">ID: <span className="font-mono">{generatedId}</span></p>
          <p className="text-sm">Temp Password: <span className="font-mono font-bold">{tempPassword}</span></p>
          <p className="text-xs text-slate-500 mt-1 italic">Please share these credentials with the employee.</p>
        </div>,
        { duration: 10000 }
      );
      
      setShowAddDialog(false);
      setNewEmployee({ fullName: "", email: "", employeeId: "", department: "", position: "", phone: "" });
    };



  return (
    <DashboardLayout title="Employee Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Employee Management</h2>
            <p className="text-slate-600">View and manage all employees</p>
          </div>
          <Button className="gap-2 gradient-primary" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                <p className="text-sm text-slate-500">Total Employees</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                <p className="text-sm text-slate-500">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{onLeaveCount}</p>
                <p className="text-sm text-slate-500">On Leave</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{inactiveCount}</p>
                <p className="text-sm text-slate-500">Inactive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((employee) => {
            const status = getEmployeeStatus(employee.id);
            const job = jobDetails[employee.id];
            
            return (
              <div
                key={employee.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
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
                <h3 className="font-semibold text-slate-900">
                  {employee.fullName}
                </h3>
                <p className="text-sm text-slate-500">{employee.employeeId}</p>
                {job && (
                  <p className="text-xs text-slate-400 mt-1">{job.position}</p>
                )}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link href={`/profile/${employee.id}`} className="flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-600 hover:bg-slate-100"
                    onClick={() => setEditEmployee(employee.id)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No employees found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <Dialog open={!!viewEmployee} onOpenChange={() => setViewEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>View employee information</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={selectedEmployee.profilePicture} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                    {getInitials(selectedEmployee.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedEmployee.fullName}</h3>
                  <p className="text-slate-500">{selectedEmployee.employeeId}</p>
                  <p className="text-blue-600">{jobDetails[selectedEmployee.id]?.position || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{selectedEmployee.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="font-medium">{jobDetails[selectedEmployee.id]?.department || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{profiles[selectedEmployee.id]?.phone || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Work Location</p>
                  <p className="font-medium">{jobDetails[selectedEmployee.id]?.workLocation || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Date of Joining</p>
                  <p className="font-medium">{jobDetails[selectedEmployee.id]?.dateOfJoining ? formatDate(jobDetails[selectedEmployee.id].dateOfJoining) : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Reporting Manager</p>
                  <p className="font-medium">{jobDetails[selectedEmployee.id]?.reportingManager || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    selectedEmployee.status === 'active' ? 'bg-green-100 text-green-700' :
                    selectedEmployee.status === 'on_leave' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedEmployee.status === 'active' ? 'Active' : 
                     selectedEmployee.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Role</p>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 uppercase">
                    {selectedEmployee.role === 'hr' ? 'HR' : selectedEmployee.role}
                  </span>
                </div>
              </div>

              {profiles[selectedEmployee.id] && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-slate-900 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Date of Birth</p>
                      <p className="font-medium">{profiles[selectedEmployee.id]?.dateOfBirth ? formatDate(profiles[selectedEmployee.id].dateOfBirth!) : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Blood Group</p>
                      <p className="font-medium">{profiles[selectedEmployee.id]?.bloodGroup || 'N/A'}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium">{profiles[selectedEmployee.id]?.currentAddress || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEmployee(null)}>Close</Button>
            <Button onClick={() => { setViewEmployee(null); setEditEmployee(viewEmployee); }}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editEmployee} onOpenChange={() => setEditEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information</DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={editingEmployee.fullName} />
                </div>
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input defaultValue={editingEmployee.employeeId} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={editingEmployee.email} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={profiles[editingEmployee.id]?.phone || ''} />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input defaultValue={jobDetails[editingEmployee.id]?.department || ''} />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input defaultValue={jobDetails[editingEmployee.id]?.position || ''} />
                </div>
                <div className="space-y-2">
                  <Label>Work Location</Label>
                  <Input defaultValue={jobDetails[editingEmployee.id]?.workLocation || ''} />
                </div>
                <div className="space-y-2">
                  <Label>Reporting Manager</Label>
                  <Input defaultValue={jobDetails[editingEmployee.id]?.reportingManager || ''} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEmployee(null)}>Cancel</Button>
            <Button onClick={() => { toast.success("Employee updated successfully!"); setEditEmployee(null); }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Create a new employee profile</DialogDescription>
          </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input 
                    value={newEmployee.fullName} 
                    onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input 
                    type="email"
                    value={newEmployee.email} 
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    placeholder="email@dayflow.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={newEmployee.phone} 
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    value={newEmployee.department} 
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input 
                    value={newEmployee.position} 
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                * Employee ID and temporary password will be auto-generated.
              </p>
            </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEmployee}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
