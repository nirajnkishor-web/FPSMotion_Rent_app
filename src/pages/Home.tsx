import React from 'react';
import { Search, MapPin, Home, IndianRupee, ArrowRight, Building2, User2, CheckCircle2, PhoneCall, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PROPERTY_CATEGORIES, CITIES, COMPANY_DETAILS } from '../constants';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-slate-50 min-h-screen p-4 md:p-6 lg:p-8 gap-6 max-w-7xl mx-auto">
      {/* Hero Section - Bento Style */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 lg:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px] shadow-2xl">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ea580c 0%, transparent 40%), radial-gradient(circle at 80% 50%, #2563eb 0%, transparent 40%)' }}></div>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative z-10 w-full flex flex-col items-center"
        >
          <div className="absolute top-8 left-8 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Niraj Kishor" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-none">Verified Owner</p>
              <p className="text-xs font-bold text-white italic">Niraj Kishor</p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-8 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            Direct Property Portal
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-10 tracking-tighter uppercase italic leading-none">
            Find Your Perfect <br />
            <span className="text-brand">Dream Space</span>
          </h1>
          
          <div className="w-full max-w-3xl bg-white p-2 rounded-2xl flex flex-col md:flex-row shadow-2xl items-center">
            <select className="w-full md:w-auto px-6 py-4 bg-transparent text-slate-800 font-bold outline-none border-b md:border-b-0 md:border-r border-slate-100 appearance-none">
              <option>Buy</option>
              <option>Rent</option>
            </select>
            <input 
              type="text" 
              placeholder="Locality: Kanke, Lalpur, Bariatu..." 
              className="flex-1 px-6 py-4 outline-none text-slate-900 font-medium text-base w-full" 
            />
            <button className="w-full md:w-auto px-10 py-4 bg-brand text-white font-black rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-all uppercase tracking-widest text-sm italic">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </motion.div>
      </section>

      {/* Grid Layout - Bento Grid Pattern */}
      <section className="grid grid-cols-12 auto-rows-auto lg:grid-rows-6 gap-6">
        {/* Featured Property - High Impact */}
        <div className="col-span-12 lg:col-span-5 lg:row-span-4 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col group">
          <div className="h-64 bg-slate-200 relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&q=80&w=800" 
              alt="Luxury Flat" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-6 left-6 bg-brand text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic shadow-lg">Featured: Sale</div>
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl font-black text-slate-900 shadow-xl border border-white/50 italic">₹ 1.2 Cr</div>
          </div>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Residential</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-brand" /> Kanke, Ranchi</span>
            </div>
            <h3 className="text-2xl font-display font-black text-slate-900 mb-6 italic uppercase leading-none">Luxury 3BHK at Ramdash Residency</h3>
            <div className="flex gap-6 text-sm font-bold text-slate-600 mb-8 border-y border-slate-50 py-4">
              <span className="flex items-center gap-2">🛏 3 Bed</span>
              <span className="flex items-center gap-2">🚿 2 Bath</span>
              <span className="flex items-center gap-2">📐 1850 sq.ft</span>
            </div>
            <Link to="/buy" className="mt-auto flex items-center gap-2 text-brand font-black italic uppercase text-xs tracking-widest hover:gap-4 transition-all">
              View Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Consult Experts - Dark Card */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand mb-6">
              <User2 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-display font-black mb-4 italic uppercase tracking-tighter leading-none">Consult <br />Experts</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">Book a dedicated consultation session with our verified property experts to clear your investment doubts.</p>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-brand/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Available</p>
                <p className="text-sm font-bold italic">Tomorrow, 11:00 AM</p>
              </div>
            </div>
            <Link to="/book" className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all text-center uppercase tracking-widest text-sm italic shadow-lg">
              Book Appointment
            </Link>
            <p className="text-[9px] text-center text-slate-500 italic mt-2">
              * Consultation charges will be applicable {COMPANY_DETAILS.consultationFee}
            </p>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:row-span-2 bg-orange-50 rounded-[2.5rem] p-8 border border-orange-100 flex flex-col">
          <h4 className="text-brand font-black text-[10px] mb-6 uppercase tracking-widest italic">Quick Categories</h4>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {['Flat', 'House', 'PG/Room', 'Shop'].map(cat => (
               <div key={cat} className="bg-white p-3 rounded-xl text-center text-[11px] font-black text-slate-700 shadow-sm border border-slate-50 hover:border-brand hover:text-brand transition-all cursor-pointer flex items-center justify-center uppercase italic">
                 {cat}
               </div>
            ))}
          </div>
        </div>

        {/* Post Property - Blue/Brand Accents */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 lg:row-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h4 className="font-black italic uppercase text-lg tracking-tighter leading-none mb-2">Post <br />Property</h4>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Sell or Rent for free</p>
          </div>
          <Link to="/upload" className="relative z-10 bg-white/10 hover:bg-brand hover:text-slate-900 backdrop-blur-md px-6 py-2.5 rounded-xl text-[10px] font-black w-fit uppercase tracking-widest italic transition-all">
            Start Upload
          </Link>
        </div>

        {/* Location & Contact - Wide Banner */}
        <div className="col-span-12 lg:col-span-9 lg:row-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-slate-100">📍</div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg uppercase italic tracking-tighter">Our Office</h4>
              <p className="text-slate-500 text-sm font-medium">Purnima Complex, Near Ramdash Residency, Kanke, Ranchi</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <a href="tel:8687834006" className="w-full sm:w-auto px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-sm border border-slate-100 hover:bg-slate-100 transition-all text-center uppercase italic">
              8687834006
            </a>
            <button className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all uppercase italic">
               WhatsApp
            </button>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="col-span-12 lg:col-span-3 lg:row-span-2 bg-slate-200 rounded-[2.5rem] overflow-hidden grayscale group relative">
          <div className="w-full h-full bg-slate-300 flex items-center justify-center italic font-black text-slate-400 uppercase tracking-widest text-xs">
            Location Map
          </div>
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-all pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
