import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Building2, Calendar, Heart, Settings, Plus, ArrowUpRight, Clock, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsPath = 'bookings';
      try {
        const q = query(
          collection(db, bookingsPath),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const fetchedBookings = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(fetchedBookings);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, bookingsPath);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const stats = [
    { name: 'My Listings', value: '0', icon: Building2, color: 'blue' },
    { name: 'Appointments', value: bookings.length.toString(), icon: Calendar, color: 'amber' },
    { name: 'Favorites', value: '0', icon: Heart, color: 'rose' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col p-6 sticky top-20 h-[calc(100vh-80px)]">
        <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl mb-8 border border-slate-800">
          <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand flex items-center justify-center text-slate-900 font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate">{user.displayName || userProfile?.fullName || 'User'}</p>
            <p className="text-xs text-brand font-black uppercase tracking-widest leading-none mt-1">Premium Member</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-brand text-slate-900 rounded-xl font-black shadow-lg shadow-brand/20 italic">
            <LayoutDashboard className="w-5 h-5" />
            DASHBOARD
          </Link>
          <Link to="/dashboard/listings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors">
            <Building2 className="w-5 h-5" />
            My Listings
          </Link>
          <Link to="/dashboard/appointments" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors">
            <Calendar className="w-5 h-5" />
            Appointments
          </Link>
          <Link to="/dashboard/favorites" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors">
            <Heart className="w-5 h-5" />
            Favorites
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 italic uppercase">Dashboard Overview</h1>
            <p className="text-slate-500 font-medium italic">Welcome back, {user.displayName?.split(' ')[0] || userProfile?.fullName?.split(' ')[0] || 'Member'}! Here is your cinematic property status.</p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-brand px-6 py-3 rounded-xl font-black uppercase text-sm hover:bg-black active:scale-95 transition-all shadow-lg shadow-brand/10 italic tracking-widest"
          >
            <Plus className="w-5 h-5" />
            Add New Property
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <motion.div
              key={stat.name}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                stat.color === 'blue' ? "bg-slate-900 text-brand" :
                stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                "bg-rose-50 text-rose-600"
              )}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">{stat.name}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Listings */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900 italic uppercase tracking-widest text-sm">Recent Listings</h2>
              <Link to="/dashboard/listings" className="text-xs font-black text-brand uppercase italic">View All</Link>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Building2 className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase italic tracking-widest">No listings yet</p>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900 italic uppercase tracking-widest text-sm">Recent Appointments</h2>
              <Link to="/dashboard/appointments" className="text-xs font-black text-brand uppercase italic">Manage</Link>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-bold text-brand uppercase">{booking.date.split('-')[1]}</p>
                      <p className="text-lg font-black text-slate-900">{booking.date.split('-')[2]}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 italic uppercase text-xs tracking-tight">
                        {booking.type === 'visit' ? 'Site Visit' : booking.type === 'video' ? 'Video Call' : 'Consultation'}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.slot}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full",
                          booking.status === 'pending' ? "bg-amber-100 text-amber-700" :
                          booking.status === 'confirmed' ? "bg-green-100 text-green-700" :
                          "bg-rose-100 text-rose-700"
                        )}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Calendar className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase italic tracking-widest">No appointments booked</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
