import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Film } from 'lucide-react';
import { COMPANY_DETAILS } from '../constants';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="font-display font-black tracking-tighter uppercase italic">FPS MOTION</span>
            </Link>
            <p className="hidden md:block">© {new Date().getFullYear()} FPS MOTION REAL ESTATE. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex gap-8">
            <Link to="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <a href="#" className="hover:text-slate-900 transition-colors">Facebook</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Instagram</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
