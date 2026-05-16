import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { UserSearch, ArrowLeft, Loader2, Phone, Mail, Search } from 'lucide-react';

export default function AccountRecovery() {
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recoveredUser, setRecoveredUser] = useState<{ fullName: string, email: string } | null>(null);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return toast.error(`Please enter your ${searchType}`);

    setIsLoading(true);
    setRecoveredUser(null);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where(searchType, '==', inputValue));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error(`No account found with this ${searchType}`);
      } else {
        const userData = querySnapshot.docs[0].data();
        setRecoveredUser({
          fullName: userData.fullName,
          email: userData.email
        });
        toast.success("Account details retrieved successfully");
      }
    } catch (error: any) {
      console.error("Recovery error:", error);
      toast.error("Failed to retrieve account data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20 mb-6">
            <UserSearch className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Recover Account</h1>
          <p className="text-slate-500 font-medium italic text-sm">Find your platform credentials</p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            onClick={() => { setSearchType('phone'); setInputValue(''); setRecoveredUser(null); }}
            className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${searchType === 'phone' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Using Phone
          </button>
          <button
            onClick={() => { setSearchType('email'); setInputValue(''); setRecoveredUser(null); }}
            className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${searchType === 'email' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Using Email
          </button>
        </div>

        {!recoveredUser ? (
          <form onSubmit={handleRecover} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4 italic">
                {searchType === 'phone' ? 'Registered Phone' : 'Registered Email'}
              </label>
              <div className="relative group">
                {searchType === 'phone' ? (
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-brand" />
                ) : (
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-brand" />
                )}
                <input
                  type={searchType === 'email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-brand focus:outline-none transition-all font-bold placeholder:font-medium italic"
                  placeholder={searchType === 'phone' ? '+91 00000 00000' : 'user@example.com'}
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
                  <Search className="w-5 h-5 text-brand" />
                  Identify Account
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-900 rounded-[2rem] border border-slate-700 space-y-4"
          >
            <div className="text-center">
              <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1 italic">Account Found</p>
              <h3 className="text-xl font-bold text-white italic uppercase">{recoveredUser.fullName}</h3>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Login Email Address</p>
              <p className="text-sm font-bold text-white">{recoveredUser.email}</p>
            </div>

            <Link
              to="/login"
              className="block w-full bg-brand text-slate-900 text-center py-4 rounded-xl font-black italic uppercase tracking-widest transition-all hover:scale-[1.02]"
            >
              Proceed to Login
            </Link>
            
            <button
              onClick={() => setRecoveredUser(null)}
              className="w-full text-slate-500 hover:text-white font-bold text-[10px] italic uppercase tracking-widest transition-colors py-2"
            >
              Not your account? Search again
            </button>
          </motion.div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest italic transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
