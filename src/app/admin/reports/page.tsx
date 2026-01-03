"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useDataStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, Calendar, Users, IndianRupee, Clock, Eye, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const monthlyAttendance = [
  { month: 'Jan', present: 92, absent: 8 },
  { month: 'Feb', present: 89, absent: 11 },
  { month: 'Mar', present: 94, absent: 6 },
  { month: 'Apr', present: 91, absent: 9 },
  { month: 'May', present: 88, absent: 12 },
  { month: 'Jun', present: 93, absent: 7 },
];

const departmentDistribution = [
  { name: 'Engineering', value: 45, color: '#3B82F6' },
  { name: 'Design', value: 15, color: '#10B981' },
  { name: 'Marketing', value: 20, color: '#F59E0B' },
  { name: 'HR', value: 10, color: '#8B5CF6' },
  { name: 'Sales', value: 25, color: '#EF4444' },
];

const payrollTrend = [
  { month: 'Jan', amount: 1250000 },
  { month: 'Feb', amount: 1280000 },
  { month: 'Mar', amount: 1320000 },
  { month: 'Apr', amount: 1300000 },
  { month: 'May', amount: 1350000 },
  { month: 'Jun', amount: 1400000 },
];

type ReportType = 'attendance' | 'leave' | 'payroll' | 'employee';

export default function AdminReportsPage() {
  const { users, jobDetails, leaveRequests, attendance, salaryStructures } = useDataStore();
  const [viewReport, setViewReport] = useState<ReportType | null>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadReport = async (reportType: ReportType) => {
    setDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    let content = '';
    const date = new Date().toLocaleDateString('en-IN');

    switch (reportType) {
      case 'attendance':
        content = `ATTENDANCE REPORT
Generated on: ${date}
================================

MONTHLY ATTENDANCE SUMMARY
--------------------------
${monthlyAttendance.map(m => `${m.month}: Present ${m.present}%, Absent ${m.absent}%`).join('\n')}

EMPLOYEE WISE ATTENDANCE
------------------------
${users.map(u => {
  const empAttendance = attendance.filter(a => a.userId === u.id);
  const presentDays = empAttendance.filter(a => a.status === 'present').length;
  return `${u.fullName} (${u.employeeId}): ${presentDays} days present`;
}).join('\n')}
`;
        break;

      case 'leave':
        content = `LEAVE REPORT
Generated on: ${date}
================================

LEAVE REQUESTS SUMMARY
----------------------
Total Requests: ${leaveRequests.length}
Approved: ${leaveRequests.filter(l => l.status === 'approved').length}
Pending: ${leaveRequests.filter(l => l.status === 'pending').length}
Rejected: ${leaveRequests.filter(l => l.status === 'rejected').length}

DETAILED LEAVE RECORDS
----------------------
${leaveRequests.map(l => `${l.employeeName} - ${l.leaveType} Leave (${l.fromDate} to ${l.toDate}) - ${l.status.toUpperCase()}`).join('\n')}
`;
        break;

      case 'payroll':
        const totalPayroll = Object.values(salaryStructures).reduce((acc, s) => acc + s.netSalary, 0);
        content = `PAYROLL REPORT
Generated on: ${date}
================================

PAYROLL SUMMARY
---------------
Total Monthly Payroll: ${formatCurrency(totalPayroll)}
Total Employees: ${users.length}

MONTHLY TREND
-------------
${payrollTrend.map(p => `${p.month}: ${formatCurrency(p.amount)}`).join('\n')}

EMPLOYEE WISE SALARY
--------------------
${users.map(u => {
  const salary = salaryStructures[u.id];
  return `${u.fullName} (${u.employeeId}): ${salary ? formatCurrency(salary.netSalary) : 'N/A'}`;
}).join('\n')}
`;
        break;

      case 'employee':
        content = `EMPLOYEE REPORT
Generated on: ${date}
================================

HEADCOUNT SUMMARY
-----------------
Total Employees: ${users.length}
Active: ${users.filter(u => u.status === 'active').length}
Inactive: ${users.filter(u => u.status === 'inactive').length}

DEPARTMENT DISTRIBUTION
-----------------------
${departmentDistribution.map(d => `${d.name}: ${d.value} employees`).join('\n')}

EMPLOYEE LIST
-------------
${users.map(u => {
  const job = jobDetails[u.id];
  return `${u.fullName} (${u.employeeId}) - ${job?.department || 'N/A'} - ${job?.position || 'N/A'}`;
}).join('\n')}
`;
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${date.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloading(false);
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded`);
  };

  const exportAllReports = async () => {
    setDownloading(true);
    for (const type of ['attendance', 'leave', 'payroll', 'employee'] as ReportType[]) {
      await downloadReport(type);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setDownloading(false);
  };

  const reports = [
    { type: 'attendance' as ReportType, title: 'Attendance Report', desc: 'Monthly attendance stats', icon: Clock, color: 'bg-blue-50 text-blue-600' },
    { type: 'leave' as ReportType, title: 'Leave Report', desc: 'Leave utilization data', icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
    { type: 'payroll' as ReportType, title: 'Payroll Report', desc: 'Salary disbursements', icon: IndianRupee, color: 'bg-violet-50 text-violet-600' },
    { type: 'employee' as ReportType, title: 'Employee Report', desc: 'Headcount analysis', icon: Users, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
            <p className="text-slate-600">View detailed HR analytics and reports</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={exportAllReports}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export All Reports
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <Card key={report.type} className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center mb-3`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-900">{report.title}</p>
                <p className="text-sm text-slate-500 mb-3">{report.desc}</p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => setViewReport(report.type)}
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => downloadReport(report.type)}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Monthly Attendance Trend</CardTitle>
              <CardDescription>Attendance percentage over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="present" name="Present %" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent %" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Employee count by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Payroll Trend</CardTitle>
            <CardDescription>Monthly payroll expenditure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value / 100000}L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={viewReport === 'attendance'} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attendance Report</DialogTitle>
            <DialogDescription>Monthly attendance statistics and employee-wise data</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="present" name="Present %" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absent %" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Absent Days</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.fullName}</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>91.7%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReport(null)}>Close</Button>
            <Button onClick={() => downloadReport('attendance')} className="gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewReport === 'leave'} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Leave Report</DialogTitle>
            <DialogDescription>Leave utilization and request summary</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-slate-900">{leaveRequests.length}</p>
                  <p className="text-sm text-slate-500">Total Requests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{leaveRequests.filter(l => l.status === 'approved').length}</p>
                  <p className="text-sm text-slate-500">Approved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">{leaveRequests.filter(l => l.status === 'pending').length}</p>
                  <p className="text-sm text-slate-500">Pending</p>
                </CardContent>
              </Card>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map(l => (
                  <TableRow key={l.id}>
                    <TableCell>{l.employeeName}</TableCell>
                    <TableCell className="capitalize">{l.leaveType}</TableCell>
                    <TableCell>{l.fromDate} - {l.toDate}</TableCell>
                    <TableCell className="capitalize">{l.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReport(null)}>Close</Button>
            <Button onClick={() => downloadReport('leave')} className="gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewReport === 'payroll'} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payroll Report</DialogTitle>
            <DialogDescription>Salary disbursement summary</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value / 100000}L`} />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map(u => {
                  const salary = salaryStructures[u.id];
                  return (
                    <TableRow key={u.id}>
                      <TableCell>{u.fullName}</TableCell>
                      <TableCell>{jobDetails[u.id]?.department || '-'}</TableCell>
                      <TableCell>{salary ? formatCurrency(salary.grossSalary) : '-'}</TableCell>
                      <TableCell>{salary ? formatCurrency(salary.netSalary) : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReport(null)}>Close</Button>
            <Button onClick={() => downloadReport('payroll')} className="gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewReport === 'employee'} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Report</DialogTitle>
            <DialogDescription>Headcount and department analysis</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                  <p className="text-sm text-slate-500">Total Employees</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
                  <p className="text-sm text-slate-500">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-slate-400">{users.filter(u => u.status === 'inactive').length}</p>
                  <p className="text-sm text-slate-500">Inactive</p>
                </CardContent>
              </Card>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.fullName}</TableCell>
                    <TableCell>{u.employeeId}</TableCell>
                    <TableCell>{jobDetails[u.id]?.department || '-'}</TableCell>
                    <TableCell>{jobDetails[u.id]?.position || '-'}</TableCell>
                    <TableCell className="capitalize">{u.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReport(null)}>Close</Button>
            <Button onClick={() => downloadReport('employee')} className="gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
