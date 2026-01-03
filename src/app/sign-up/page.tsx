"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Upload, ArrowLeft, CheckCircle2, Building2, User2, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, useDataStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateEmployeeId } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { addUser } = useDataStore();
  
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.values(formData).some(v => !v)) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser = {
      id: Math.random().toString(36).substring(2, 15),
      employeeId: generateEmployeeId(formData.companyName, formData.fullName),
      email: formData.email,
      fullName: formData.fullName,
      role: 'hr' as const,
      status: 'active' as const,
      createdAt: new Date(),
      companyName: formData.companyName,
      companyLogo: logo,
    };

    addUser(newUser);
    login(newUser);
    
    toast.success("Account created successfully!");
    router.push("/admin/dashboard");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Branding & Info */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-emerald-500 rounded-full blur-3xl" />
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
            Start your journey with <span className="text-emerald-400">Dayflow</span> today.
          </h1>
          <p className="text-xl text-slate-300 mb-12">
            Join 500+ companies who have transformed their HR operations with our intelligent platform.
          </p>
          
          <div className="space-y-6">
            {[
              "Setup your organization in minutes",
              "Manage unlimited employees",
              "Advanced analytics & reporting",
              "Secure role-based access control"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-slate-200">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-sm">© 2024 Dayflow Management Systems. Empowering Workforces.</p>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="flex flex-col justify-start p-8 md:p-16 lg:p-20 relative bg-slate-50/50 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-xl w-full mx-auto">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 text-lg">Register your company and start managing.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center lg:items-start mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-slate-900 group-hover:bg-slate-50">
                  {logo ? (
                    <img src={logo} alt="Company Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-300 group-hover:text-slate-900" />
                  )}
                </div>
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <label
                  htmlFor="logo-upload"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Upload className="w-4 h-4" />
                </label>
              </div>
              <p className="text-slate-400 text-xs mt-3">Upload Company Logo</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName" className="text-sm font-semibold text-slate-700">Company Name</Label>
                <div className="relative">
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    placeholder="Dayflow Inc."
                    className="h-12 pl-10 rounded-xl border-slate-200 focus:ring-slate-900"
                  />
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">Full Name</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="h-12 pl-10 rounded-xl border-slate-200 focus:ring-slate-900"
                  />
                  <User2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Work Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="john@company.com"
                    className="h-12 pl-10 rounded-xl border-slate-200 focus:ring-slate-900"
                  />
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="h-12 pl-10 rounded-xl border-slate-200 focus:ring-slate-900"
                  />
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    className="h-12 pl-10 rounded-xl border-slate-200 focus:ring-slate-900 pr-10"
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className="h-12 pl-10 rounded-xl border-slate-200 focus:ring-slate-900 pr-10"
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-lg font-semibold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-slate-900 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
