"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IndianRupee, Download, Eye, EyeOff, FileText, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore, useDataStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Payslip } from "@/lib/types";

export default function PayrollPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { payslips, salaryStructures } = useDataStore();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  
  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">You don't have permission to view payroll information.</p>
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const userPayslips = payslips.filter((p) => p.userId === user?.id);
  const salary = user ? salaryStructures[user.id] : null;
  const [showSalary, setShowSalary] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const handleDownload = (payslip: Payslip) => {
    toast.success(`Downloading payslip for ${payslip.month} ${payslip.year}`);
  };

  const ytdEarnings = userPayslips.reduce((acc, p) => acc + p.grossSalary, 0);
  const ytdDeductions = userPayslips.reduce((acc, p) => acc + p.deductions.pf + p.deductions.professionalTax, 0);

  return (
    <DashboardLayout title="Payroll">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Payroll & Salary</h2>
            <p className="text-slate-600">View your salary details and payslips</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setShowSalary(!showSalary)}>
            {showSalary ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSalary ? "Hide Salary" : "Show Salary"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-emerald-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-500 mb-1">Net Salary</p>
              <p className="text-2xl font-bold text-slate-900">
                {showSalary ? formatCurrency(salary?.netSalary || 0) : "₹ ****"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Monthly take-home</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">Gross Salary</p>
              <p className="text-2xl font-bold text-slate-900">
                {showSalary ? formatCurrency(salary?.grossSalary || 0) : "₹ ****"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Before deductions</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-violet-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">YTD Earnings</p>
              <p className="text-2xl font-bold text-slate-900">
                {showSalary ? formatCurrency(ytdEarnings) : "₹ ****"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Year to date</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1">YTD Deductions</p>
              <p className="text-2xl font-bold text-slate-900">
                {showSalary ? formatCurrency(ytdDeductions) : "₹ ****"}
              </p>
              <p className="text-xs text-slate-500 mt-1">PF + PT</p>
            </CardContent>
          </Card>
        </div>

        {salary && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
              <CardDescription>Your current compensation breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    Earnings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-medium">{showSalary ? formatCurrency(salary.basicSalary) : '****'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-medium">{showSalary ? formatCurrency(salary.allowances.hra) : '****'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Standard Allowance</span>
                      <span className="font-medium">{showSalary ? formatCurrency(salary.allowances.standardAllowance || 0) : '****'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Performance Bonus</span>
                      <span className="font-medium">{showSalary ? formatCurrency(salary.allowances.performanceBonus || 0) : '****'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Leave Travel Allowance</span>
                      <span className="font-medium">{showSalary ? formatCurrency(salary.allowances.leaveTravelAllowance || 0) : '****'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Fixed Allowance</span>
                      <span className="font-medium">{showSalary ? formatCurrency(salary.allowances.fixedAllowance || 0) : '****'}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-emerald-50 rounded-lg px-3 mt-2">
                      <span className="font-semibold text-emerald-700">Total Earnings</span>
                      <span className="font-bold text-emerald-700">{showSalary ? formatCurrency(salary.grossSalary) : '****'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    Deductions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-600">Provident Fund (Employee)</span>
                      <span className="font-medium text-red-600">{showSalary ? `-${formatCurrency(salary.deductions.pf)}` : '****'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600">Professional Tax</span>
                      <span className="font-medium text-red-600">{showSalary ? `-${formatCurrency(salary.deductions.professionalTax)}` : '****'}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-red-50 rounded-lg px-3 mt-2">
                      <span className="font-semibold text-red-700">Total Deductions</span>
                      <span className="font-bold text-red-700">
                        {showSalary ? `-${formatCurrency(salary.deductions.pf + salary.deductions.professionalTax)}` : '****'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between py-4 bg-blue-50 rounded-lg px-3 mt-6 border-2 border-blue-200">
                    <span className="font-bold text-blue-700">Net Salary</span>
                    <span className="font-bold text-blue-700 text-xl">{showSalary ? formatCurrency(salary.netSalary) : '****'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Payslip History</CardTitle>
            <CardDescription>Download your monthly payslips</CardDescription>
          </CardHeader>
          <CardContent>
            {userPayslips.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No payslips available</p>
                <p className="text-sm">Payslips will appear here once processed</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell className="font-medium">{payslip.month} {payslip.year}</TableCell>
                      <TableCell>{showSalary ? formatCurrency(payslip.grossSalary) : '****'}</TableCell>
                      <TableCell className="text-red-600">
                        {showSalary ? `-${formatCurrency(payslip.deductions.pf + payslip.deductions.professionalTax)}` : '****'}
                      </TableCell>
                      <TableCell className="font-semibold">{showSalary ? formatCurrency(payslip.netSalary) : '****'}</TableCell>
                      <TableCell>
                        <Badge variant={payslip.paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize">
                          {payslip.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{payslip.paymentDate ? formatDate(payslip.paymentDate) : '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(payslip)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Payslip - {payslip.month} {payslip.year}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6 mt-4">
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                  <div>
                                    <p className="font-semibold">{user?.fullName}</p>
                                    <p className="text-sm text-slate-500">{user?.employeeId}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-slate-500">Payment Date</p>
                                    <p className="font-medium">{payslip.paymentDate ? formatDate(payslip.paymentDate) : 'Pending'}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Earnings</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between"><span>Basic</span><span>{formatCurrency(payslip.earnings.basic)}</span></div>
                                      <div className="flex justify-between"><span>HRA</span><span>{formatCurrency(payslip.earnings.hra)}</span></div>
                                      <div className="flex justify-between"><span>DA</span><span>{formatCurrency(payslip.earnings.da)}</span></div>
                                      <div className="flex justify-between"><span>Transport</span><span>{formatCurrency(payslip.earnings.transport)}</span></div>
                                      <div className="flex justify-between"><span>Special</span><span>{formatCurrency(payslip.earnings.special)}</span></div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-3">Deductions</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between"><span>PF</span><span className="text-red-600">-{formatCurrency(payslip.deductions.pf)}</span></div>
                                      <div className="flex justify-between"><span>PT</span><span className="text-red-600">-{formatCurrency(payslip.deductions.professionalTax)}</span></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                  <span className="font-bold text-blue-700">Net Pay</span>
                                  <span className="text-2xl font-bold text-blue-700">{formatCurrency(payslip.netSalary)}</span>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(payslip)}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
