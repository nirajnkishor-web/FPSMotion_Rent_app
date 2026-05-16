import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { COMPANY_DETAILS } from '../constants';
import { toast } from 'react-hot-toast';

export default function Contact() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                Let's Start your <br />
                <span className="text-blue-600">Property Journey</span>
              </h2>
              <p className="text-lg text-slate-600 mb-12 max-w-lg leading-relaxed">
                Have questions about a listing? Need expert advice on property laws in Jharkhand? Our team is here to help you 24/7.
              </p>

              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us Anywhere</p>
                    <p className="text-xl font-bold text-slate-900">{COMPANY_DETAILS.phone}</p>
                    <p className="text-sm text-slate-500">Mon-Sat (9am - 7pm)</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Send an Email</p>
                    <p className="text-xl font-bold text-slate-900">{COMPANY_DETAILS.email}</p>
                    <p className="text-sm text-slate-500">Expect reply in 2-4 hours</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Our Office</p>
                    <p className="text-lg font-bold text-slate-900 max-w-xs">{COMPANY_DETAILS.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-slate-200">
                <p className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Connect with our owner</p>
                <div className="flex gap-4">
                  <a href={`https://wa.me/${COMPANY_DETAILS.whatsapp}`} className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-200 hover:scale-105 transition-transform active:scale-95">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm">
                  <option>Property Inquiry</option>
                  <option>Book Site Visit</option>
                  <option>Sell My Property</option>
                  <option>Legal Assistance</option>
                  <option>Support / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                <textarea
                  className="w-full px-5 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 text-sm min-h-[150px]"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <span className="flex items-center gap-2">
                    Send Inquiry <Send className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-6 text-slate-400">
              <div className="flex items-center gap-2 text-xs font-medium">
                <CheckCircle className="w-4 h-4 text-green-500" /> Secure Data
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <Clock className="w-4 h-4 text-blue-500" /> Fast Response
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
