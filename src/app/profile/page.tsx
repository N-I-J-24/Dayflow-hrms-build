"use client";

import { useState } from "react";
import { FileText, Lock, User, IndianRupee, Pencil, Plus, X, Save } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuthStore, useDataStore } from "@/lib/store";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { profiles, jobDetails, salaryStructures, updateProfile } = useDataStore();
  
  const profile = user ? profiles[user.id] : null;
  const job = user ? jobDetails[user.id] : null;
  const salary = user ? salaryStructures[user.id] : null;
  
  const isAdmin = user?.role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && user) {
      const currentSkills = profile?.skills || [];
      updateProfile(user.id, { skills: [...currentSkills, newSkill.trim()] });
      setNewSkill('');
      toast.success("Skill added!");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (user && profile?.skills) {
      updateProfile(user.id, { skills: profile.skills.filter(s => s !== skillToRemove) });
    }
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && user) {
      const currentCerts = profile?.certifications || [];
      updateProfile(user.id, { certifications: [...currentCerts, newCertification.trim()] });
      setNewCertification('');
      toast.success("Certification added!");
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    if (user && profile?.certifications) {
      updateProfile(user.id, { certifications: profile.certifications.filter(c => c !== certToRemove) });
    }
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="space-y-6">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                    {user ? getInitials(user.fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{user?.fullName}</h2>
                  <p className="text-slate-500">{job?.position || 'Employee'}</p>
                  <p className="text-sm text-slate-400">{user?.email}</p>
                  <p className="text-sm text-slate-400">{profile?.phone || 'No phone'}</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="font-medium text-slate-900">{job?.company || 'Dayflow'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="font-medium text-slate-900">{job?.department || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Manager</p>
                  <p className="font-medium text-slate-900">{job?.reportingManager || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">{job?.workLocation || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="resume" className="gap-2">
              <FileText className="w-4 h-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="private" className="gap-2">
              <User className="w-4 h-4" />
              Private Info
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="salary" className="gap-2">
                <IndianRupee className="w-4 h-4" />
                Salary Info
              </TabsTrigger>
            )}
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">About</CardTitle>
                      <CardDescription>Tell us about yourself</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={profile?.about || ''}
                        placeholder="Write about yourself..."
                        rows={4}
                        onBlur={(e) => {
                          if (user) updateProfile(user.id, { about: e.target.value });
                        }}
                      />
                    ) : (
                      <p className="text-slate-600 leading-relaxed">
                        {profile?.about || 'No information added yet.'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">What I love about my job</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={profile?.whatILoveAboutJob || ''}
                        placeholder="What do you love about your job..."
                        rows={4}
                        onBlur={(e) => {
                          if (user) updateProfile(user.id, { whatILoveAboutJob: e.target.value });
                        }}
                      />
                    ) : (
                      <p className="text-slate-600 leading-relaxed">
                        {profile?.whatILoveAboutJob || 'No information added yet.'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">My interests and hobbies</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={profile?.interestsAndHobbies || ''}
                        placeholder="Share your interests and hobbies..."
                        rows={4}
                        onBlur={(e) => {
                          if (user) updateProfile(user.id, { interestsAndHobbies: e.target.value });
                        }}
                      />
                    ) : (
                      <p className="text-slate-600 leading-relaxed">
                        {profile?.interestsAndHobbies || 'No information added yet.'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(profile?.skills || []).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleAddSkill}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {(profile?.certifications || []).map((cert, i) => (
                        <div key={i} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                          <span className="text-sm text-slate-700">{cert}</span>
                          <button onClick={() => handleRemoveCertification(cert)} className="hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add certification"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCertification()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleAddCertification}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="private">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Date of Birth</p>
                      <p className="font-medium">{profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Nationality</p>
                      <p className="font-medium">{profile?.nationality || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Personal Email</p>
                      <p className="font-medium">{profile?.personalEmail || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Gender</p>
                      <p className="font-medium capitalize">{profile?.gender || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Marital Status</p>
                      <p className="font-medium capitalize">{profile?.maritalStatus || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Blood Group</p>
                      <p className="font-medium">{profile?.bloodGroup || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Residing Address</p>
                    <p className="font-medium">{profile?.currentAddress || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date of Joining</p>
                    <p className="font-medium">{job?.dateOfJoining ? formatDate(job.dateOfJoining) : '-'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Account Number</p>
                    <p className="font-medium">{profile?.bankDetails?.accountNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Bank Name</p>
                    <p className="font-medium">{profile?.bankDetails?.bankName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">IFSC Code</p>
                    <p className="font-medium">{profile?.bankDetails?.ifscCode || '-'}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-500">PAN No</p>
                    <p className="font-medium">{profile?.panNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">UAN No</p>
                    <p className="font-medium">{profile?.uanNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Emp Code</p>
                    <p className="font-medium">{profile?.empCode || user?.employeeId || '-'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="salary">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Salary Information</CardTitle>
                  <CardDescription>Salary components calculated based on monthly wage</CardDescription>
                </CardHeader>
                <CardContent>
                  {salary ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <p className="text-sm text-blue-600">Monthly Wage</p>
                          <p className="text-2xl font-bold text-blue-700">{formatCurrency(salary.monthlyWage)}</p>
                          <p className="text-xs text-blue-500">/ Month</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl">
                          <p className="text-sm text-emerald-600">Yearly Wage</p>
                          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(salary.yearlyWage)}</p>
                          <p className="text-xs text-emerald-500">/ Yearly</p>
                        </div>
                        <div className="p-4 bg-violet-50 rounded-xl">
                          <p className="text-sm text-violet-600">Working Days</p>
                          <p className="text-2xl font-bold text-violet-700">{salary.workingDaysPerWeek || 5} days</p>
                          <p className="text-xs text-violet-500">Break: {salary.breakTimeHours || 1} hrs</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-4">Salary Components</h4>
                          <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">Basic Salary</p>
                                <p className="text-xs text-slate-500">50% of monthly wage</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.basicSalary)}</p>
                                <p className="text-xs text-slate-500">{salary.basicPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">House Rent Allowance</p>
                                <p className="text-xs text-slate-500">50% of basic salary</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.hra)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.hraPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">Standard Allowance</p>
                                <p className="text-xs text-slate-500">Fixed amount provided to employee</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.standardAllowance)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.standardPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">Performance Bonus</p>
                                <p className="text-xs text-slate-500">Variable amount based on performance</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.performanceBonus)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.performancePercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">Leave Travel Allowance</p>
                                <p className="text-xs text-slate-500">LTA for travel expenses</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.leaveTravelAllowance)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.ltaPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-700">Fixed Allowance</p>
                                <p className="text-xs text-slate-500">Remaining after all components</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.fixedAllowance)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.fixedPercent}%</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 mb-4">Provident Fund (PF) Contribution</h4>
                          <div className="space-y-3 bg-slate-50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">Employee</p>
                                <p className="text-xs text-slate-500">PF calculated on basic salary</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-red-600">-{formatCurrency(salary.deductions.pf)}</p>
                                <p className="text-xs text-slate-500">{salary.deductions.pfPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-700">Employer</p>
                                <p className="text-xs text-slate-500">PF calculated on basic salary</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.deductions.employerPf)}</p>
                                <p className="text-xs text-slate-500">{salary.deductions.employerPfPercent}%</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="font-semibold text-slate-900 mb-4">Tax Deductions</h4>
                          <div className="space-y-3 bg-red-50 p-4 rounded-xl">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-700">Professional Tax</p>
                                <p className="text-xs text-slate-500">Deducted from gross salary</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-red-600">-{formatCurrency(salary.deductions.professionalTax)}</p>
                                <p className="text-xs text-slate-500">/ month</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">Salary structure not configured</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="security">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Current Password</Label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  <Button onClick={() => toast.success("Password updated successfully!")}>
                    Update Password
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-slate-900 mb-4">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-slate-900 mb-4">Active Sessions</h4>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-slate-500">Bangalore, India • Chrome on Windows</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
