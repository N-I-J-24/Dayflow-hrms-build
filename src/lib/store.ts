"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LeaveRequest, Attendance, LeaveBalance, Notification, Payslip, Profile, JobDetails, SalaryStructure } from './types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    { name: 'auth-storage' }
  )
);

const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
];

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
];

const INDIAN_AVATARS = [...MALE_AVATARS, ...FEMALE_AVATARS];

const generateId = () => Math.random().toString(36).substring(2, 15);

const sampleUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'rahul.sharma@dayflow.com',
    fullName: 'Rahul Sharma',
    role: 'employee',
    status: 'active',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    employeeId: 'EMP002',
    email: 'priya.hr@dayflow.com',
    fullName: 'Priya Patel',
    role: 'hr',
    status: 'active',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2022-06-01'),
  },
  {
    id: '3',
    employeeId: 'EMP003',
    email: 'amit.admin@dayflow.com',
    fullName: 'Amit Verma',
    role: 'admin',
    status: 'active',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2021-03-20'),
  },
  {
    id: '4',
    employeeId: 'EMP004',
    email: 'sneha.gupta@dayflow.com',
    fullName: 'Sneha Gupta',
    role: 'employee',
    status: 'active',
    profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2023-03-10'),
  },
  {
    id: '5',
    employeeId: 'EMP005',
    email: 'vikram.singh@dayflow.com',
    fullName: 'Vikram Singh',
    role: 'employee',
    status: 'active',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2023-05-22'),
  },
  {
    id: '6',
    employeeId: 'EMP006',
    email: 'ananya.reddy@dayflow.com',
    fullName: 'Ananya Reddy',
    role: 'employee',
    status: 'active',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2023-07-15'),
  },
  {
    id: '7',
    employeeId: 'EMP007',
    email: 'rajesh.kumar@dayflow.com',
    fullName: 'Rajesh Kumar',
    role: 'employee',
    status: 'active',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2022-11-08'),
  },
  {
    id: '8',
    employeeId: 'EMP008',
    email: 'meera.joshi@dayflow.com',
    fullName: 'Meera Joshi',
    role: 'employee',
    status: 'on_leave',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2023-02-28'),
  },
  {
    id: '9',
    employeeId: 'EMP009',
    email: 'arjun.nair@dayflow.com',
    fullName: 'Arjun Nair',
    role: 'employee',
    status: 'inactive',
    profilePicture: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date('2022-09-12'),
  },
];

const sampleProfiles: Record<string, Profile> = {
  '1': {
    userId: '1',
    dateOfBirth: '1992-08-15',
    gender: 'male',
    bloodGroup: 'B+',
    maritalStatus: 'married',
    nationality: 'Indian',
    phone: '+91 98765 43210',
    personalEmail: 'rahul.personal@email.com',
    currentAddress: '42, Koramangala 5th Block, Bangalore, Karnataka 560095',
    permanentAddress: '156, MG Road, Lucknow, Uttar Pradesh 226001',
    emergencyContact: {
      name: 'Neha Sharma',
      relationship: 'Spouse',
      phone: '+91 98765 43211',
    },
    bankDetails: {
      accountNumber: 'XXXX XXXX 1234',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
    },
    panNumber: 'ABCDE1234F',
    uanNumber: '100123456789',
    empCode: 'EMP001',
    about: 'Passionate software engineer with 5+ years of experience in building scalable web applications. Love to explore new technologies and share knowledge with the team.',
    whatILoveAboutJob: 'The collaborative environment and the opportunity to work on cutting-edge technologies. The team culture here is amazing and everyone is supportive.',
    interestsAndHobbies: 'Reading tech blogs, playing cricket on weekends, photography, and exploring new places. Also enjoy cooking South Indian cuisine.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
  },
  '2': {
    userId: '2',
    dateOfBirth: '1990-03-22',
    gender: 'female',
    bloodGroup: 'A+',
    maritalStatus: 'single',
    nationality: 'Indian',
    phone: '+91 87654 32109',
    personalEmail: 'priya.personal@email.com',
    currentAddress: '78, Indiranagar, Bangalore, Karnataka 560038',
    permanentAddress: '234, Satellite Road, Ahmedabad, Gujarat 380015',
    emergencyContact: {
      name: 'Suresh Patel',
      relationship: 'Father',
      phone: '+91 87654 32108',
    },
    bankDetails: {
      accountNumber: 'XXXX XXXX 5678',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0005678',
    },
    panNumber: 'FGHIJ5678K',
    uanNumber: '100234567890',
    empCode: 'EMP002',
    about: 'HR professional with expertise in talent acquisition, employee engagement, and organizational development.',
    whatILoveAboutJob: 'Helping employees grow and creating a positive work culture. Every day brings new challenges and opportunities.',
    interestsAndHobbies: 'Yoga, reading business books, traveling, and volunteering for social causes.',
    skills: ['HR Management', 'Talent Acquisition', 'Employee Relations', 'HRIS Systems'],
    certifications: ['SHRM-CP', 'PHR Certified'],
  },
  '4': {
    userId: '4',
    dateOfBirth: '1995-11-30',
    gender: 'female',
    bloodGroup: 'O+',
    maritalStatus: 'single',
    nationality: 'Indian',
    phone: '+91 76543 21098',
    personalEmail: 'sneha.personal@email.com',
    currentAddress: '15, HSR Layout, Bangalore, Karnataka 560102',
    permanentAddress: '89, Civil Lines, Delhi 110054',
    emergencyContact: {
      name: 'Rakesh Gupta',
      relationship: 'Father',
      phone: '+91 76543 21097',
    },
    bankDetails: {
      accountNumber: 'XXXX XXXX 9012',
      bankName: 'Axis Bank',
      ifscCode: 'UTIB0009012',
    },
    panNumber: 'KLMNO9012P',
    uanNumber: '100345678901',
    empCode: 'EMP004',
    about: 'Creative UI/UX designer passionate about crafting beautiful and intuitive user experiences.',
    whatILoveAboutJob: 'The freedom to be creative and the impact my designs have on user satisfaction.',
    interestsAndHobbies: 'Digital art, photography, attending design meetups, and exploring cafes.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'User Research', 'Prototyping'],
    certifications: ['Google UX Design Certificate', 'Interaction Design Foundation'],
  },
};

const sampleJobDetails: Record<string, JobDetails> = {
  '1': {
    userId: '1',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    dateOfJoining: '2023-01-15',
    employmentType: 'full-time',
    reportingManager: 'Priya Patel',
    workLocation: 'Bangalore Office',
    shiftTimings: '9:00 AM - 6:00 PM',
  },
  '2': {
    userId: '2',
    department: 'Human Resources',
    position: 'HR Manager',
    dateOfJoining: '2022-06-01',
    employmentType: 'full-time',
    reportingManager: 'Amit Verma',
    workLocation: 'Bangalore Office',
    shiftTimings: '9:00 AM - 6:00 PM',
  },
  '4': {
    userId: '4',
    department: 'Design',
    position: 'UI/UX Designer',
    dateOfJoining: '2023-03-10',
    employmentType: 'full-time',
    reportingManager: 'Priya Patel',
    workLocation: 'Bangalore Office',
    shiftTimings: '10:00 AM - 7:00 PM',
  },
  '5': {
    userId: '5',
    department: 'Engineering',
    position: 'Backend Developer',
    dateOfJoining: '2023-05-22',
    employmentType: 'full-time',
    reportingManager: 'Rahul Sharma',
    workLocation: 'Mumbai Office',
    shiftTimings: '9:00 AM - 6:00 PM',
  },
  '6': {
    userId: '6',
    department: 'Marketing',
    position: 'Marketing Executive',
    dateOfJoining: '2023-07-15',
    employmentType: 'full-time',
    reportingManager: 'Priya Patel',
    workLocation: 'Bangalore Office',
    shiftTimings: '9:30 AM - 6:30 PM',
  },
  '7': {
    userId: '7',
    department: 'Engineering',
    position: 'DevOps Engineer',
    dateOfJoining: '2022-11-08',
    employmentType: 'full-time',
    reportingManager: 'Amit Verma',
    workLocation: 'Bangalore Office',
    shiftTimings: '9:00 AM - 6:00 PM',
  },
  '8': {
    userId: '8',
    department: 'Finance',
    position: 'Accounts Manager',
    dateOfJoining: '2023-02-28',
    employmentType: 'full-time',
    reportingManager: 'Amit Verma',
    workLocation: 'Delhi Office',
    shiftTimings: '9:00 AM - 6:00 PM',
  },
  '9': {
    userId: '9',
    department: 'Sales',
    position: 'Sales Executive',
    dateOfJoining: '2022-09-12',
    employmentType: 'full-time',
    reportingManager: 'Priya Patel',
    workLocation: 'Chennai Office',
    shiftTimings: '10:00 AM - 7:00 PM',
  },
};

const sampleSalaryStructure: Record<string, SalaryStructure> = {
  '1': {
    userId: '1',
    monthlyWage: 50000,
    yearlyWage: 600000,
    workingDaysPerWeek: 5,
    breakTimeHours: 1,
    basicSalary: 25000,
    basicPercent: 50,
    allowances: {
      hra: 12500,
      hraPercent: 50,
      da: 0,
      daPercent: 0,
      standardAllowance: 4167,
      standardPercent: 16.67,
      performanceBonus: 2092.50,
      performancePercent: 8.33,
      leaveTravelAllowance: 2082.50,
      ltaPercent: 8.33,
      fixedAllowance: 2918,
      fixedPercent: 11.67,
      transport: 3000,
      special: 12000,
    },
    deductions: {
      pf: 3000,
      pfPercent: 12,
      employerPf: 3000,
      employerPfPercent: 12,
      tax: 15000,
      professionalTax: 200,
    },
    grossSalary: 135000,
    netSalary: 110200,
    bankAccount: 'XXXX XXXX 1234',
    effectiveFrom: '2023-01-01',
  },
  '4': {
    userId: '4',
    monthlyWage: 40000,
    yearlyWage: 480000,
    workingDaysPerWeek: 5,
    breakTimeHours: 1,
    basicSalary: 20000,
    basicPercent: 50,
    allowances: {
      hra: 10000,
      hraPercent: 50,
      da: 0,
      daPercent: 0,
      standardAllowance: 3334,
      standardPercent: 16.67,
      performanceBonus: 1666,
      performancePercent: 8.33,
      leaveTravelAllowance: 1666,
      ltaPercent: 8.33,
      fixedAllowance: 2334,
      fixedPercent: 11.67,
      transport: 2500,
      special: 8000,
    },
    deductions: {
      pf: 2400,
      pfPercent: 12,
      employerPf: 2400,
      employerPfPercent: 12,
      tax: 10000,
      professionalTax: 200,
    },
    grossSalary: 100500,
    netSalary: 83100,
    bankAccount: 'XXXX XXXX 5678',
    effectiveFrom: '2023-03-10',
  },
};

const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '1',
    employeeName: 'Rahul Sharma',
    employeeId: 'EMP001',
    department: 'Engineering',
    leaveType: 'paid',
    fromDate: '2024-02-15',
    toDate: '2024-02-17',
    days: 3,
    reason: 'Family function in hometown',
    status: 'pending',
    appliedAt: '2024-02-10',
  },
  {
    id: '2',
    userId: '1',
    employeeName: 'Rahul Sharma',
    employeeId: 'EMP001',
    department: 'Engineering',
    leaveType: 'sick',
    fromDate: '2024-01-20',
    toDate: '2024-01-21',
    days: 2,
    reason: 'Fever and cold',
    status: 'approved',
    adminRemarks: 'Take care!',
    appliedAt: '2024-01-19',
    updatedAt: '2024-01-19',
  },
  {
    id: '3',
    userId: '8',
    employeeName: 'Meera Joshi',
    employeeId: 'EMP008',
    department: 'Finance',
    leaveType: 'paid',
    fromDate: '2024-02-01',
    toDate: '2024-02-10',
    days: 10,
    reason: 'Vacation',
    status: 'approved',
    appliedAt: '2024-01-25',
    updatedAt: '2024-01-26',
  },
];

const sampleAttendance: Attendance[] = [];
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Generate attendance for the last 3 months for all users
sampleUsers.forEach(user => {
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Skip some days for "absent" status randomly, except for user 1 who we want to show as mostly present
    const isAbsent = user.id !== '1' && Math.random() < 0.1;
    
    if (isWeekend) {
      sampleAttendance.push({
        id: generateId(),
        userId: user.id,
        date: dateStr,
        status: 'weekend',
      });
    } else if (isAbsent) {
      sampleAttendance.push({
        id: generateId(),
        userId: user.id,
        date: dateStr,
        status: 'absent',
      });
    } else {
      const checkIn = '09:00';
      const checkOut = '18:00';
      const totalHours = 9;
      const extraHours = 1;
      
      sampleAttendance.push({
        id: generateId(),
        userId: user.id,
        date: dateStr,
        checkInTime: checkIn,
        checkOutTime: checkOut,
        totalHours,
        extraHours,
        status: 'present',
      });
    }
  }
});

const samplePayslips: Payslip[] = [
  {
    id: '1',
    userId: '1',
    month: 'January',
    year: 2024,
    earnings: { basic: 80000, hra: 32000, da: 8000, transport: 3000, special: 12000 },
    deductions: { pf: 9600, tax: 15000, professionalTax: 200 },
    grossSalary: 135000,
    netSalary: 110200,
    paymentStatus: 'paid',
    paymentDate: '2024-01-31',
  },
  {
    id: '2',
    userId: '1',
    month: 'December',
    year: 2023,
    earnings: { basic: 80000, hra: 32000, da: 8000, transport: 3000, special: 12000 },
    deductions: { pf: 9600, tax: 15000, professionalTax: 200 },
    grossSalary: 135000,
    netSalary: 110200,
    paymentStatus: 'paid',
    paymentDate: '2023-12-31',
  },
];

const sampleNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'leave',
    title: 'Leave Request Approved',
    message: 'Your sick leave request for Jan 20-21 has been approved.',
    isRead: false,
    createdAt: '2024-01-19T10:30:00',
  },
  {
    id: '2',
    userId: '1',
    type: 'payroll',
    title: 'Salary Credited',
    message: 'Your salary for January 2024 has been credited to your account.',
    isRead: true,
    createdAt: '2024-01-31T09:00:00',
  },
  {
    id: '3',
    userId: '1',
    type: 'announcement',
    title: 'Office Holiday',
    message: 'Office will remain closed on January 26th for Republic Day.',
    isRead: false,
    createdAt: '2024-01-20T08:00:00',
  },
];

interface DataState {
  users: User[];
  profiles: Record<string, Profile>;
  jobDetails: Record<string, JobDetails>;
  salaryStructures: Record<string, SalaryStructure>;
  leaveRequests: LeaveRequest[];
  attendance: Attendance[];
  leaveBalances: Record<string, LeaveBalance>;
  payslips: Payslip[];
  notifications: Notification[];
  
  addUser: (user: User, jobInfo?: { department?: string; position?: string; phone?: string }) => void;
  updateProfile: (userId: string, profile: Partial<Profile>) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'appliedAt'>) => void;
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  updateAttendance: (id: string, updates: Partial<Attendance>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      users: sampleUsers,
      profiles: sampleProfiles,
      jobDetails: sampleJobDetails,
      salaryStructures: sampleSalaryStructure,
      leaveRequests: sampleLeaveRequests,
      attendance: sampleAttendance,
      leaveBalances: {
        '1': { paid: 12, sick: 8, unpaid: 0, casual: 5, emergency: 3 },
        '4': { paid: 15, sick: 10, unpaid: 0, casual: 7, emergency: 3 },
        '5': { paid: 14, sick: 9, unpaid: 0, casual: 6, emergency: 3 },
        '6': { paid: 12, sick: 8, unpaid: 0, casual: 5, emergency: 3 },
        '7': { paid: 10, sick: 7, unpaid: 0, casual: 4, emergency: 2 },
        '8': { paid: 5, sick: 6, unpaid: 0, casual: 3, emergency: 2 },
        '9': { paid: 8, sick: 5, unpaid: 0, casual: 4, emergency: 2 },
      },
      payslips: samplePayslips,
      notifications: sampleNotifications,
      
  addUser: (user, jobInfo?: { department?: string; position?: string; phone?: string }) => set((state) => {
          const randomAvatar = INDIAN_AVATARS[Math.floor(Math.random() * INDIAN_AVATARS.length)];
          const newUser = {
            ...user,
            profilePicture: user.profilePicture || randomAvatar
          };
          
          return {
            users: [...state.users, newUser],
            leaveBalances: {
              ...state.leaveBalances,
              [user.id]: { paid: 15, sick: 10, unpaid: 0, casual: 7, emergency: 3 },
            },
            profiles: {
              ...state.profiles,
              [user.id]: {
                userId: user.id,
                dateOfBirth: '1990-01-01',
                gender: 'male',
                bloodGroup: 'O+',
                maritalStatus: 'single',
                phone: jobInfo?.phone || '',
                personalEmail: user.email,
                currentAddress: '',
                permanentAddress: '',
                emergencyContact: {
                  name: '',
                  relationship: '',
                  phone: '',
                },
                skills: [],
                certifications: [],
              },
            },
            jobDetails: {
              ...state.jobDetails,
              [user.id]: {
                userId: user.id,
                department: jobInfo?.department || '',
                position: jobInfo?.position || '',
                dateOfJoining: new Date().toISOString().split('T')[0],
                employmentType: 'full-time',
                reportingManager: '',
                workLocation: 'Bangalore Office',
                shiftTimings: '9:00 AM - 6:00 PM',
              },
            },
          };
        }),
      
      updateProfile: (userId, profile) => set((state) => ({
        profiles: {
          ...state.profiles,
          [userId]: { ...state.profiles[userId], ...profile },
        },
      })),
      
      addLeaveRequest: (request) => set((state) => ({
        leaveRequests: [
          ...state.leaveRequests,
          { ...request, id: generateId(), appliedAt: new Date().toISOString() },
        ],
      })),
      
      updateLeaveRequest: (id, updates) => set((state) => ({
        leaveRequests: state.leaveRequests.map((req) =>
          req.id === id ? { ...req, ...updates, updatedAt: new Date().toISOString() } : req
        ),
      })),
      
      addAttendance: (attendance) => set((state) => ({
        attendance: [...state.attendance, { ...attendance, id: generateId() }],
      })),
      
      updateAttendance: (id, updates) => set((state) => ({
        attendance: state.attendance.map((att) =>
          att.id === id ? { ...att, ...updates } : att
        ),
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
      })),
      
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          { ...notification, id: generateId(), createdAt: new Date().toISOString() },
          ...state.notifications,
        ],
      })),
    }),
    { name: 'data-storage' }
  )
);
