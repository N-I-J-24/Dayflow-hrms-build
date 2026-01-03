"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Calendar, CreditCard, Users, BarChart3, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'hr' || user.role === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  // Dayflow - Modern HR Management System
  const features = [
    { icon: Users, title: "Employee Management", description: "Complete employee profiles with personal and job details" },
    { icon: Clock, title: "Attendance Tracking", description: "Real-time check-in/out with monthly calendar view" },
    { icon: Calendar, title: "Leave Management", description: "Apply, track, and approve leave requests seamlessly" },
    { icon: CreditCard, title: "Payroll System", description: "View salary structure and download payslips" },
    { icon: BarChart3, title: "Reports & Analytics", description: "Comprehensive HR analytics and reports" },
    { icon: Shield, title: "Role-Based Access", description: "Secure access control for employees and HR" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">Dayflow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="gradient-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Modern HR Management System
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Every workday,<br />
                <span className="text-gradient">perfectly aligned.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg">
                Streamline your HR operations with Dayflow. From attendance tracking to payroll management, 
                we&apos;ve got everything covered for modern workplaces.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="gradient-primary gap-2 w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=100&h=100&fit=crop"
                  ].map((url, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                      <img src={url} alt={`User ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Trusted by 500+ companies</p>
                  <p className="text-xs text-slate-500">10,000+ employees managed</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-blue-500/10 border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Attendance Marked</p>
                      <p className="text-sm text-slate-500">Check-in at 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Leave Approved</p>
                      <p className="text-sm text-slate-500">Feb 15-17, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Salary Credited</p>
                        <p className="text-sm text-slate-500">January 2024 Payslip</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Everything you need to manage HR
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                A comprehensive suite of tools designed to simplify HR operations and enhance employee experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                    <feature.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ready to streamline your HR?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of companies that trust Dayflow for their HR management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="gradient-primary gap-2 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-white font-bold">Dayflow</span>
            </div>
            <p className="text-sm">© 2024 Dayflow. Every workday, perfectly aligned.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
