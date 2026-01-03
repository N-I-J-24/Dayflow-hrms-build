"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Lock, User, IndianRupee, Pencil, Plus, X, ArrowLeft } from "lucide-react";
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

export default function EmployeeProfileView() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;
  
  const { user: currentUser } = useAuthStore();
  const { users, profiles, jobDetails, salaryStructures, updateProfile } = useDataStore();
  
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const employee = users.find(u => u.id === employeeId);
  const profile = profiles[employeeId];
  const job = jobDetails[employeeId];
  const salary = salaryStructures[employeeId];
  
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr';
  const isOwnProfile = currentUser?.id === employeeId;

  if (!mounted) return null;

  if (!employee) {
    return (
      <DashboardLayout title="Profile Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Employee Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin && !isOwnProfile) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">You don't have permission to view this profile.</p>
          <Button onClick={() => router.push('/profile')}>Go to My Profile</Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = profile?.skills || [];
      updateProfile(employeeId, { skills: [...currentSkills, newSkill.trim()] });
      setNewSkill('');
      toast.success("Skill added!");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (profile?.skills) {
      updateProfile(employeeId, { skills: profile.skills.filter(s => s !== skillToRemove) });
    }
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      const currentCerts = profile?.certifications || [];
      updateProfile(employeeId, { certifications: [...currentCerts, newCertification.trim()] });
      setNewCertification('');
      toast.success("Certification added!");
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    if (profile?.certifications) {
      updateProfile(employeeId, { certifications: profile.certifications.filter(c => c !== certToRemove) });
    }
  };

  return (
    <DashboardLayout title={`${employee.fullName}'s Profile`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={employee.profilePicture} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                    {getInitials(employee.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{employee.fullName}</h2>
                  <p className="text-slate-500">{job?.position || 'Employee'}</p>
                  <p className="text-sm text-slate-400">{employee.email}</p>
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
            {isOwnProfile && (
              <TabsTrigger value="security" className="gap-2">
                <Lock className="w-4 h-4" />
                Security
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="resume">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">About</CardTitle>
                      <CardDescription>Personal background and summary</CardDescription>
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={profile?.about || ''}
                        placeholder="Write about the employee..."
                        rows={4}
                        onBlur={(e) => {
                          updateProfile(employeeId, { about: e.target.value });
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
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={profile?.whatILoveAboutJob || ''}
                        placeholder="What they love about their job..."
                        rows={4}
                        onBlur={(e) => {
                          updateProfile(employeeId, { whatILoveAboutJob: e.target.value });
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
                      <CardTitle className="text-lg">Interests and hobbies</CardTitle>
                    </div>
                    {isAdmin && (
                      <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={profile?.interestsAndHobbies || ''}
                        placeholder="Interests and hobbies..."
                        rows={4}
                        onBlur={(e) => {
                          updateProfile(employeeId, { interestsAndHobbies: e.target.value });
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
                          {isAdmin && (
                            <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-500">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isAdmin && (
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
                    )}
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
                          {isAdmin && (
                            <button onClick={() => handleRemoveCertification(cert)} className="hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isAdmin && (
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
                    )}
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
                    <p className="font-medium">{profile?.empCode || employee?.employeeId || '-'}</p>
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
                  <CardDescription>Salary components for {employee.fullName}</CardDescription>
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
                                <p className="text-xs text-slate-500">Fixed amount</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.standardAllowance)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.standardPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">Performance Bonus</p>
                                <p className="text-xs text-slate-500">Variable bonus</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.performanceBonus)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.performancePercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">LTA</p>
                                <p className="text-xs text-slate-500">Travel allowance</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.leaveTravelAllowance)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.ltaPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-700">Fixed Allowance</p>
                                <p className="text-xs text-slate-500">Other fixed components</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.allowances.fixedAllowance)}</p>
                                <p className="text-xs text-slate-500">{salary.allowances.fixedPercent}%</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 mb-4">PF Contributions</h4>
                          <div className="space-y-3 bg-slate-50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                              <div>
                                <p className="font-medium text-slate-700">Employee PF</p>
                                <p className="text-xs text-slate-500">12% of basic</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-red-600">-{formatCurrency(salary.deductions.pf)}</p>
                                <p className="text-xs text-slate-500">{salary.deductions.pfPercent}%</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-700">Employer PF</p>
                                <p className="text-xs text-slate-500">12% of basic</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(salary.deductions.employerPf)}</p>
                                <p className="text-xs text-slate-500">{salary.deductions.employerPfPercent}%</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="font-semibold text-slate-900 mb-4">Statutory Deductions</h4>
                          <div className="space-y-3 bg-red-50 p-4 rounded-xl">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-slate-700">Professional Tax</p>
                                <p className="text-xs text-slate-500">Monthly deduction</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-red-600">-{formatCurrency(salary.deductions.professionalTax)}</p>
                                <p className="text-xs text-slate-500">Fixed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">Salary structure not configured for this employee</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isOwnProfile && (
            <TabsContent value="security">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">Security settings are only available when viewing your own profile.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
