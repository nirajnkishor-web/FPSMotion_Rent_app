import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, Calendar, User, ShoppingBag, Menu, X, Phone, Film, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { COMPANY_DETAILS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navLinks = [
    { name: 'Buy', href: '/buy', icon: ShoppingBag },
    { name: 'Rent', href: '/rent', icon: Home },
    { name: 'Upload', href: '/upload', icon: PlusCircle },
    { name: 'Book Appointment', href: '/book', icon: Calendar },
    { name: 'About', href: '/about', icon: null },
    { name: 'Contact', href: '/contact', icon: null },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 italic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-brand/20 group-hover:rotate-12 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <span className="font-display text-2xl font-bold text-slate-900 tracking-tight italic uppercase">
                FPS<span className="text-brand">MOTION</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-bold transition-colors hover:text-brand uppercase tracking-tight",
                  isActive(link.href) ? "text-brand border-b-2 border-brand" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4">
              {user ? (
                <>
                  {user.email === 'fpsmotion@hotmail.com' && (
                    <Link
                      to="/admin"
                      className="text-sm font-bold text-brand hover:text-brand-dark transition-colors uppercase tracking-tight flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="text-sm font-bold text-slate-700 hover:text-brand transition-colors uppercase tracking-tight flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-all uppercase tracking-widest italic"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-bold text-slate-700 hover:text-brand transition-colors uppercase tracking-tight"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 uppercase tracking-widest italic"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-bottom duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-4 rounded-xl text-sm font-bold transition-colors uppercase tracking-tight",
                  isActive(link.href) ? "bg-orange-50 text-brand" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.name}
              </Link>
            ))}
            <div className="grid grid-cols-1 gap-4 mt-6 px-3">
              {user ? (
                <>
                  {user.email === 'fpsmotion@hotmail.com' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center p-4 rounded-xl bg-brand text-slate-900 font-bold text-sm shadow-md italic uppercase tracking-widest"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl bg-slate-900 text-brand font-bold text-sm shadow-md italic uppercase tracking-widest"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="flex items-center justify-center p-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm italic uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm italic uppercase tracking-widest"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center p-4 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md italic uppercase tracking-widest"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
