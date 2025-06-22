"use client"

import { Zap, Mail, Phone, MapPin, Twitter, Linkedin, Github, MessageSquare } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold">ChatBot Hub</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Empowering businesses with intelligent AI-powered customer support solutions that provide exceptional
              experiences and drive sustainable growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4 md:mb-6 text-white">Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Widget Customization
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 md:mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Status Page
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm md:text-base">
                  Training Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 md:mb-6 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm md:text-base">support@chatbothub.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm md:text-base">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-slate-400 text-sm md:text-base">
                  123 Innovation Drive
                  <br />
                  San Francisco, CA 94105
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm md:text-base">Live Chat Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm text-center md:text-left">© 2024 ChatBot Hub. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
