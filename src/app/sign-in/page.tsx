"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, useDataStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { users } = useDataStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("employee");

  const performLogin = async (userEmail: string, userPassword: string, role: 'hr' | 'admin' | 'employee') => {
    const user = users.find((u) => 
      u.email.toLowerCase() === userEmail.toLowerCase() || 
      u.employeeId?.toLowerCase() === userEmail.toLowerCase()
    );
    
    if (user) {
      if ((role === 'hr' || role === 'admin') && (user.role !== 'hr' && user.role !== 'admin')) {
        toast.error("This account does not have HR/Admin access");
        return false;
      }
      
      login(user);
      toast.success(`Welcome back, ${user.fullName}!`);
      
      if (user.role === 'hr' || user.role === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
      return true;
    } else {
      toast.error("Invalid Login Id/Email or Password");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    await performLogin(email, password, activeTab === "admin" ? 'hr' : 'employee');
    
    setIsLoading(false);
  };

  const handleDemoLogin = async (role: 'hr' | 'admin' | 'employee') => {
    setIsLoading(true);
    
    let demoEmail = "";
    if (role === 'hr') demoEmail = "priya.hr@dayflow.com";
    else if (role === 'admin') demoEmail = "amit.admin@dayflow.com";
    else demoEmail = "rahul.sharma@dayflow.com";

    const demoPassword = "password";
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    setActiveTab(role === 'employee' ? "employee" : "admin");
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    await performLogin(demoEmail, demoPassword, role);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Branding & Info */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">Dayflow</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Welcome back to the <span className="text-blue-400">future</span> of HR.
          </h1>
          <p className="text-xl text-slate-300 mb-12">
            Managing your workforce has never been this seamless. Access your dashboard to stay updated.
          </p>
          
          <div className="space-y-6">
            {[
              "Real-time Attendance Tracking",
              "Simplified Leave Management",
              "Automated Payroll Reports"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-200">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-sm">© 2024 Dayflow Management Systems. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 relative bg-slate-50/50">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-12 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500 text-lg">Enter your details to access your account.</p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                <TabsTrigger 
                  value="employee" 
                  className="rounded-xl py-3 text-sm font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
                >
                  <User className="w-4 h-4 mr-2" />
                  Employee
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="rounded-xl py-3 text-sm font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  HR / Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                Login ID or Email
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your credentials"
                className="h-12 rounded-xl border-slate-200 focus:ring-slate-900 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs font-medium text-slate-500 hover:text-slate-900">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-slate-200 focus:ring-slate-900 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-lg font-semibold shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>

          <div className="mt-12 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500">Quick Demo Access</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {activeTab === "employee" ? (
                <Button 
                  variant="outline" 
                  onClick={() => handleDemoLogin('employee')}
                  disabled={isLoading}
                  className="flex-1 rounded-xl h-12 border-slate-200 hover:bg-white hover:border-slate-900 transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  Employee Portal Demo
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('hr')}
                    disabled={isLoading}
                    className="flex-1 rounded-xl h-12 border-slate-200 hover:bg-white hover:border-slate-900 transition-all text-xs sm:text-sm"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                    HR Portal Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('admin')}
                    disabled={isLoading}
                    className="flex-1 rounded-xl h-12 border-slate-200 hover:bg-white hover:border-slate-900 transition-all text-xs sm:text-sm"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                    Admin Portal Demo
                  </Button>
                </>
              )}
            </div>

            <p className="text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-slate-900 font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
