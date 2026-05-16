import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowRight, Loader2, Film } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back to FPS Motion!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password. If you haven't created an account yet, please sign up.");
      } else if (error.code === 'auth/user-not-found') {
        toast.error("Account not found. Please sign up first.");
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error(error.message || "Failed to log in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Welcome back to FPS Motion!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to log in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 z-10"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-brand font-black text-xl italic shadow-lg">
              <Film className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900 italic uppercase">FPS<span className="text-brand">MOTION</span></span>
          </Link>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight italic uppercase">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium italic">
            Log in to your cinematic property dashboard
          </p>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-900 hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-widest italic"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Chrome className="w-5 h-5" /> Continue with Google</>}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 border border-slate-100 bg-slate-50 rounded-2xl text-slate-900 text-sm focus:outline-none focus:border-brand transition-all placeholder:text-slate-400 font-medium"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-4 border border-slate-100 bg-slate-50 rounded-2xl text-slate-900 text-sm focus:outline-none focus:border-brand transition-all placeholder:text-slate-400 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <Link
              to="/forgot-password"
              className="text-[10px] font-black text-brand hover:text-brand-dark uppercase tracking-widest italic transition-colors"
            >
              Forgot Password?
            </Link>
            <Link
              to="/recover-account"
              className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest italic transition-colors"
            >
              Need Account Info?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-5 px-4 border border-transparent text-sm font-black rounded-2xl text-slate-900 bg-brand hover:bg-brand-dark focus:outline-none transition-all shadow-xl shadow-brand/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest italic"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Enter Dashboard <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 font-medium">
          New to FPS Motion?{' '}
          <Link to="/signup" className="font-black text-slate-900 hover:text-brand transition-colors uppercase tracking-widest text-[10px] italic">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
