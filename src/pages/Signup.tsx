import React, { useState } from 'react';
import { Mail, Lock, User, Chrome, ArrowRight, Loader2, Phone, ShieldCheck, Film } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save user details to Firestore
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, userPath), {
          userId: user.uid,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      }

      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user exists or save new profile
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, userPath), {
          userId: user.uid,
          fullName: user.displayName || '',
          email: user.email || '',
          phone: '', // Google might not provide phone
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      }

      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />

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
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight italic uppercase">
            Join the Movement
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium italic">
            Start your cinematic property journey
          </p>
        </div>

        <>
          <button 
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-900 hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-widest italic leading-none"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Chrome className="w-5 h-5" /> Join with Google</>}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">Or sign up with email</span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-100 bg-slate-50 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-100 bg-slate-50 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-400"
                    placeholder="8687834006"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-100 bg-slate-50 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-300" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="block w-full pl-11 pr-4 py-4 border border-slate-100 bg-slate-50 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-5 px-4 border border-transparent text-sm font-black rounded-2xl text-slate-900 bg-brand hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 active:scale-95 disabled:opacity-70 uppercase tracking-widest italic"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>
        </>

        <p className="text-center text-sm text-slate-500 font-medium">
          Member of FPS Motion?{' '}
          <Link to="/login" className="font-black text-slate-900 hover:text-brand transition-colors uppercase tracking-widest text-[10px] italic">
            Sign in
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Secure 256-bit SSL encrypted
        </div>
      </motion.div>
    </div>
  );
}
