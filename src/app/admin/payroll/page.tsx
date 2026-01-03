"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useDataStore } from "@/lib/store";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, FileText, Download, Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminPayrollPage() {
  const { users, salaryStructures, jobDetails, addNotification } = useDataStore();
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  const totalPayroll = Object.values(salaryStructures).reduce((acc, s) => acc + s.netSalary, 0);
  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const handleGeneratePayslips = async () => {
    setGenerating(true);
    setGeneratedCount(0);
    
    for (let i = 0; i < users.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setGeneratedCount(i + 1);
    }
    
    setGenerating(false);
    toast.success(`Generated ${users.length} payslips for ${currentMonth}`);
  };

  const handleSendPayslips = async () => {
    setSending(true);
    setSentCount(0);
    
    for (let i = 0; i < users.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setSentCount(i + 1);
      
      addNotification({
        userId: users[i].id,
        type: 'payroll',
        title: 'Payslip Available',
        message: `Your payslip for ${currentMonth} is now available for download.`,
        isRead: false,
      });
    }
    
    setSending(false);
    toast.success(`Sent payslips to ${users.length} employees`);
  };

  const downloadPayslip = (user: typeof users[0]) => {
    const salary = salaryStructures[user.id];
    if (!salary) {
      toast.error("No salary data available for this employee");
      return;
    }

    const content = `
PAYSLIP - ${currentMonth.toUpperCase()}
================================

Employee: ${user.fullName}
Employee ID: ${user.employeeId}
Department: ${jobDetails[user.id]?.department || 'N/A'}
Position: ${jobDetails[user.id]?.position || 'N/A'}

EARNINGS
--------------------------------
Basic Salary:        ${formatCurrency(salary.basicSalary)}
HRA:                 ${formatCurrency(salary.allowances.hra)}
Standard Allowance:  ${formatCurrency(salary.allowances.standardAllowance || 0)}
Performance Bonus:   ${formatCurrency(salary.allowances.performanceBonus || 0)}
LTA:                 ${formatCurrency(salary.allowances.leaveTravelAllowance || 0)}
Fixed Allowance:     ${formatCurrency(salary.allowances.fixedAllowance || 0)}
--------------------------------
Gross Salary:        ${formatCurrency(salary.grossSalary)}

DEDUCTIONS
--------------------------------
PF (Employee):       ${formatCurrency(salary.deductions.pf)}
Professional Tax:    ${formatCurrency(salary.deductions.professionalTax)}
--------------------------------
Total Deductions:    ${formatCurrency(salary.deductions.pf + salary.deductions.professionalTax)}

================================
NET SALARY:          ${formatCurrency(salary.netSalary)}
================================

Generated on: ${new Date().toLocaleDateString('en-IN')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip_${user.employeeId}_${currentMonth.replace(' ', '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded payslip for ${user.fullName}`);
  };

  return (
    <DashboardLayout title="Payroll Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Payroll Management</h2>
            <p className="text-slate-600">Process and manage employee payroll for {currentMonth}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleGeneratePayslips}
              disabled={generating || sending}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating ({generatedCount}/{users.length})
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Payslips
                </>
              )}
            </Button>
            <Button 
              className="gap-2 gradient-primary" 
              onClick={handleSendPayslips}
              disabled={generating || sending}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending ({sentCount}/{users.length})
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Payslips
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPayroll)}</p>
                  <p className="text-sm text-slate-500">Total Payroll</p>
                </div>
              </CardContent>
            </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{generatedCount || users.length}</p>
                <p className="text-sm text-slate-500">Payslips Generated</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Send className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{sentCount || users.length}</p>
                <p className="text-sm text-slate-500">Payslips Sent</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                <Check className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Employee Payroll - {currentMonth}</CardTitle>
            <CardDescription>Current month payroll details with download option</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const salary = salaryStructures[user.id];
                  const job = jobDetails[user.id];
                  const deductions = salary ? salary.deductions.pf + salary.deductions.professionalTax : 0;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{job?.department || '-'}</TableCell>
                      <TableCell>{salary ? formatCurrency(salary.grossSalary) : '-'}</TableCell>
                      <TableCell className="text-red-600">{salary ? `-${formatCurrency(deductions)}` : '-'}</TableCell>
                      <TableCell className="font-semibold">{salary ? formatCurrency(salary.netSalary) : '-'}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-700">Paid</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => downloadPayslip(user)}
                          className="gap-1 text-blue-600 hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
