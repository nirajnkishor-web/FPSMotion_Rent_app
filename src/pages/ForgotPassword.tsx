import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { KeyRound, ArrowLeft, Loader2, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to your email!");
      navigate('/login');
    } catch (error: any) {
      console.error("Reset error:", error);
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20 mb-6 group transition-transform hover:scale-110">
            <KeyRound className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Reset Password</h1>
          <p className="text-slate-500 font-medium italic text-sm">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4 italic">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-brand" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand focus:outline-none transition-all font-bold placeholder:font-medium italic"
                placeholder="nirajnkishor@gmail.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand" />
            ) : (
              <>
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest italic transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          
          <div className="text-center">
            <Link
              to="/recover-account"
              className="text-brand hover:text-brand-dark font-black text-xs uppercase tracking-widest italic"
            >
              Forgot which email you used?
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
