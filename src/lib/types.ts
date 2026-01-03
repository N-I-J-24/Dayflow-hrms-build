export type UserRole = 'employee' | 'hr' | 'admin';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave' | 'weekend' | 'holiday';

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern';

export type LeaveType = 'paid' | 'sick' | 'unpaid' | 'casual' | 'emergency';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'on-notice' | 'on_leave';
  profilePicture?: string;
  createdAt: Date;
}

export interface Profile {
  userId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  nationality?: string;
  phone: string;
  personalEmail: string;
  currentAddress: string;
  permanentAddress: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  panNumber?: string;
  uanNumber?: string;
  empCode?: string;
  about?: string;
  whatILoveAboutJob?: string;
  interestsAndHobbies?: string;
  skills?: string[];
  certifications?: string[];
}

export interface JobDetails {
  userId: string;
  department: string;
  position: string;
  dateOfJoining: string;
  employmentType: EmploymentType;
  reportingManager: string;
  workLocation: string;
  shiftTimings: string;
  company?: string;
}

export interface SalaryStructure {
  userId: string;
  monthlyWage: number;
  yearlyWage: number;
  workingDaysPerWeek?: number;
  breakTimeHours?: number;
  basicSalary: number;
  basicPercent: number;
  allowances: {
    hra: number;
    hraPercent: number;
    da: number;
    daPercent?: number;
    standardAllowance: number;
    standardPercent: number;
    performanceBonus: number;
    performancePercent: number;
    leaveTravelAllowance: number;
    ltaPercent: number;
    fixedAllowance: number;
    fixedPercent: number;
    transport: number;
    special: number;
  };
  deductions: {
    pf: number;
    pfPercent: number;
    employerPf: number;
    employerPfPercent: number;
    tax: number;
    professionalTax: number;
  };
  grossSalary: number;
  netSalary: number;
  bankAccount: string;
  effectiveFrom: string;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalHours?: number;
  extraHours?: number;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  adminRemarks?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface LeaveBalance {
  paid: number;
  sick: number;
  unpaid: number;
  casual: number;
  emergency: number;
}

export interface Payslip {
  id: string;
  userId: string;
  month: string;
  year: number;
  earnings: {
    basic: number;
    hra: number;
    da: number;
    transport: number;
    special: number;
  };
  deductions: {
    pf: number;
    tax: number;
    professionalTax: number;
  };
  grossSalary: number;
  netSalary: number;
  paymentStatus: 'pending' | 'paid';
  paymentDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'leave' | 'attendance' | 'payroll' | 'announcement';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  absentToday: number;
  pendingLeaveRequests: number;
  pendingAttendanceCorrections: number;
}
