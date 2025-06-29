"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Users,
  Shield,
  Settings,
  CheckCircle,
  LogIn,
  MessageSquare,
} from "lucide-react"

export function StaffManagementArticle() {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 rounded-full px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Staff Management
          </Badge>
          <Badge variant="outline" className="border-slate-200 text-slate-700">
            Access Control
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          <span className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
            Staff Management
          </span>
          : Register Team Members and Control Chat Access
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
          Learn how to register staff members in website settings and give them controlled access to customer chats
          through the dedicated staff login portal at /staff/login.
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>November 25, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>7 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Lisa Park</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 mb-12 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
            <Shield className="w-6 h-6 text-slate-600 mr-3" />
            Secure Staff Access Management
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            Managing your customer support team effectively requires proper access controls and clear workflows. Our
            staff management system allows you to register team members, control their access to customer chats, and
            ensure they can only participate when actively available.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-2xl font-bold text-slate-600">Secure</div>
              <div className="text-sm text-slate-600">Controlled access system</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-2xl font-bold text-slate-600">Simple</div>
              <div className="text-sm text-slate-600">Easy registration process</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
              <div className="text-2xl font-bold text-slate-600">Controlled</div>
              <div className="text-sm text-slate-600">Join chat when ready</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">How Staff Management Works</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-slate-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Register Staff Members</h3>
                <p className="text-slate-700">
                  Admin users can register new staff members through the website settings page, providing their email
                  addresses and setting their access permissions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-slate-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Staff Login Portal</h3>
                <p className="text-slate-700">
                  Staff members receive login credentials and access the dedicated staff portal at /staff/login to
                  authenticate and access their dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-slate-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Join Chat Control</h3>
                <p className="text-slate-700">
                  Staff members can only start chatting with customers after pressing the "Join Chat" button, ensuring
                  they're ready and available to provide support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Staff Management Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Easy Registration</h3>
              <p className="text-slate-700">
                Register new staff members directly from your website settings page with just their email address.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Dedicated Login Portal</h3>
              <p className="text-slate-700">
                Staff members access their dashboard through a secure login portal at /staff/login.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Controlled Chat Access</h3>
              <p className="text-slate-700">
                Staff can only participate in customer chats after actively joining, ensuring availability and
                readiness.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Role-Based Permissions</h3>
              <p className="text-slate-700">
                Set different permission levels for staff members based on their role and responsibilities.
              </p>
            </div>
          </div>
        </section>

        {/* Setup Guide */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Setting Up Staff Management</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">For Administrators:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Go to Website Settings → Staff Management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Click "Add New Staff Member"</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Enter staff member's email and set permissions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Send login credentials to the staff member</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">For Staff Members:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Visit /staff/login and enter your credentials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Review available customer chats in your dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Press "Join Chat" when ready to assist customers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-700">Start providing excellent customer support!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Best Practices</h2>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-200 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Train staff members on the "Join Chat" process before their first shift</li>
              <li>• Set clear guidelines on when staff should join chats vs. let the AI handle inquiries</li>
              <li>• Use role-based permissions to limit access to sensitive customer information</li>
              <li>• Regularly review staff activity and chat participation metrics</li>
              <li>• Provide staff with quick access to common responses and company policies</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Manage Your Support Team?</h2>
            <p className="text-xl mb-6 text-slate-100">
              Set up staff management today and give your team the tools they need to provide exceptional customer
              support.
            </p>

            <Button
              size="lg"
              className="bg-white text-slate-600 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              Setup Staff Management
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </article>
  )
}
