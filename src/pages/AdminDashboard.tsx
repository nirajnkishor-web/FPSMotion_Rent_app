import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Building2, Calendar, LayoutDashboard, Search, Filter, CheckCircle, XCircle, MoreVertical, TrendingUp, AlertCircle, Loader2, Plus, ArrowRight, Trash2, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'fpsmotion@hotmail.com';

interface PlatformUser {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
}

interface Listing {
  id: string;
  userId: string;
  title: string;
  category: string;
  type: string;
  city: string;
  locality: string;
  price: string;
  description: string;
  status: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [platformUsers, setPlatformUsers] = useState<Record<string, PlatformUser>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({
    userEmail: '',
    type: 'visit',
    date: '',
    slot: '10:00 AM'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all users to map them to bookings
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersMap: Record<string, PlatformUser> = {};
        usersSnapshot.docs.forEach(doc => {
          usersMap[doc.id] = doc.data() as PlatformUser;
        });
        setPlatformUsers(usersMap);

        // Fetch all bookings
        const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const fetchedBookings = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookings(fetchedBookings);

        // Fetch all listings
        const listingsQuery = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
        const listingsSnapshot = await getDocs(listingsQuery);
        const fetchedListings = listingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Listing[];
        setListings(fetchedListings);
      } catch (error) {
        toast.error("Failed to fetch admin data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status });
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast.success("Booking deleted successfully");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bookings/${bookingId}`);
    }
  };

  const handleUpdateListingStatus = async (listingId: string, status: string) => {
    try {
      const listingRef = doc(db, 'listings', listingId);
      await updateDoc(listingRef, { status });
      setListings(listings.map(l => l.id === listingId ? { ...l, status } : l));
      toast.success(`Listing ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `listings/${listingId}`);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteDoc(doc(db, 'listings', listingId));
      setListings(listings.filter(l => l.id !== listingId));
      toast.success("Listing deleted");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `listings/${listingId}`);
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Find user by email from our fetched users
      const targetUser = Object.values(platformUsers).find((u: PlatformUser) => u.email === newBooking.userEmail);
      
      if (!targetUser) {
        toast.error("User not found with this email");
        setIsLoading(false);
        return;
      }

      await addDoc(collection(db, 'bookings'), {
        userId: (targetUser as PlatformUser).userId,
        type: newBooking.type,
        date: newBooking.date,
        slot: newBooking.slot,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });

      toast.success("Booking added successfully");
      setIsAddingBooking(false);
      // Refresh bookings
      const bookingsSnapshot = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')));
      setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'bookings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-800 p-6 flex flex-col sticky top-0 h-screen border-r border-slate-700">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center font-black text-xl italic text-slate-900">F</div>
          <span className="font-display font-bold text-2xl tracking-tight italic uppercase">Admin<span className="text-brand">Panel</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'appointments', name: 'Bookings', icon: Calendar },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'listings', name: 'Listings', icon: Building2 },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all italic uppercase text-[10px] tracking-widest",
                activeTab === item.id ? "bg-brand text-slate-900 shadow-xl shadow-brand/20" : "text-slate-400 hover:bg-slate-700 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}

          <Link
            to="/"
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all italic uppercase text-[10px] tracking-widest text-rose-400 hover:bg-rose-500/10 mt-12"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-700">
           <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
             <ShieldCheck className="w-5 h-5 text-brand" />
             <span className="text-sm font-bold tracking-widest text-[8px] uppercase italic">Secure Elite Access</span>
           </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 bg-slate-900 min-h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold italic uppercase tracking-tighter">Elite Console</h1>
            <p className="text-slate-400 font-medium italic">Managing Director's Control Center</p>
          </div>
          <div className="flex items-center gap-6">
             <button 
                onClick={() => setIsAddingBooking(!isAddingBooking)}
                className="bg-brand text-slate-900 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-brand-dark transition-all italic"
             >
                <Plus className="w-4 h-4" /> {isAddingBooking ? 'Cancel' : 'New Booking'}
             </button>
             <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center font-bold text-brand">
                Director
             </div>
          </div>
        </header>

        {isAddingBooking && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-slate-800 p-8 rounded-[2.5rem] border border-brand/20 shadow-2xl shadow-brand/5"
          >
            <h2 className="text-xl font-bold mb-6 italic uppercase tracking-widest text-brand text-sm">Offline Booking Entry</h2>
            <form onSubmit={handleAddBooking} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">User Email</label>
                <input 
                  type="email" 
                  value={newBooking.userEmail}
                  onChange={e => setNewBooking({...newBooking, userEmail: e.target.value})}
                  required
                  placeholder="client@email.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-brand outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Date</label>
                <input 
                  type="date" 
                  value={newBooking.date}
                  onChange={e => setNewBooking({...newBooking, date: e.target.value})}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-brand outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Slot</label>
                <select 
                  value={newBooking.slot}
                  onChange={e => setNewBooking({...newBooking, slot: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:border-brand outline-none"
                >
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-brand text-slate-900 py-3 rounded-xl font-black uppercase text-xs tracking-widest italic border border-brand">
                  Register Booking
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-800 rounded-[2.5rem] border border-slate-700">
            <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
            <p className="text-slate-500 uppercase tracking-widest font-black italic">Synchronizing Fleet Data...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Volume', value: bookings.length, icon: Calendar, color: 'brand' },
                    { label: 'Platform Users', value: Object.keys(platformUsers).length, icon: Users, color: 'blue' },
                    { label: 'Active Listings', value: listings.length, icon: Building2, color: 'green' },
                    { label: 'Success Rate', value: '94%', icon: CheckCircle, color: 'purple' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color === 'brand' ? "bg-brand/10 text-brand" : `bg-${stat.color}-500/10 text-${stat.color}-500`)}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] italic mb-6 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-brand uppercase">
                              {platformUsers[booking.userId]?.fullName?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase italic">{platformUsers[booking.userId]?.fullName || 'Client'}</p>
                              <p className="text-[10px] text-slate-500 italic">{booking.type} • {booking.date}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                            booking.status === 'confirmed' ? "text-green-500 bg-green-500/10" : "text-amber-500 bg-amber-500/10"
                          )}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] italic mb-6 flex items-center gap-2">
                       <Building2 className="w-4 h-4 text-brand" /> Pending Approvals
                    </h3>
                    <div className="space-y-4">
                      {listings.filter(l => l.status === 'pending').slice(0, 5).map(listing => (
                        <div key={listing.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-brand">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase italic truncate w-32">{listing.title}</p>
                              <p className="text-[10px] text-slate-500 italic">₹{listing.price} • {listing.city}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveTab('listings')}
                            className="text-[8px] font-black uppercase tracking-widest text-brand hover:underline"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                      {listings.filter(l => l.status === 'pending').length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-[10px] text-slate-500 font-bold uppercase italic tracking-widest">No pending approvals</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Table */}
            {activeTab === 'users' && (
              <div className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-700">
                  <h2 className="text-xl font-bold flex items-center gap-3 italic uppercase tracking-widest text-sm text-brand">
                     <Users className="w-5 h-5" /> Registered Platform Users
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                      <tr>
                        <th className="px-8 py-5">Internal ID</th>
                        <th className="px-8 py-5">Full Name</th>
                        <th className="px-8 py-5">Email Address</th>
                        <th className="px-8 py-5">Contact Number</th>
                        <th className="px-8 py-5 text-center">Protocol Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {Object.values(platformUsers).map((u: PlatformUser) => (
                        <tr key={u.userId} className="group hover:bg-slate-700/30 transition-colors">
                          <td className="px-8 py-6">
                            <span className="text-[10px] text-slate-500 font-mono italic">ID-{u.userId.slice(0, 8)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="font-bold text-white text-sm uppercase italic tracking-tight">{u.fullName}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs text-brand font-medium italic">{u.email}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs text-slate-400 font-bold italic">{u.phone}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-3">
                              <button className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 hover:text-white transition-all flex items-center justify-center">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Table */}
            {activeTab === 'appointments' && (
              <div className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-3 italic uppercase tracking-widest text-sm">
                     <AlertCircle className="w-5 h-5 text-brand" /> Operation Manifest
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                      <tr>
                        <th className="px-8 py-5">Client Identity</th>
                        <th className="px-8 py-5">Consultation Type</th>
                        <th className="px-8 py-5">Scheduled Window</th>
                        <th className="px-8 py-5">Platform Status</th>
                        <th className="px-8 py-5 text-center">Protocol Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {bookings.map(booking => {
                        const userDetails = platformUsers[booking.userId];
                        return (
                          <tr key={booking.id} className="group hover:bg-slate-700/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-brand uppercase italic">
                                  {userDetails?.fullName?.[0] || 'U'}
                                </div>
                                <div>
                                  <p className="font-bold text-white text-sm uppercase italic tracking-tight">{userDetails?.fullName || 'Legacy User'}</p>
                                  <p className="text-[10px] text-slate-500 font-medium italic">{userDetails?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="bg-slate-900 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700 italic">
                                {booking.type}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <p className="font-bold text-white text-xs italic tracking-widest">{booking.date}</p>
                              <p className="text-[10px] text-brand font-black uppercase">{booking.slot}</p>
                            </td>
                            <td className="px-8 py-6">
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic",
                                booking.status === 'confirmed' ? "bg-green-500/10 text-green-500" : 
                                booking.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                              )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", booking.status === 'confirmed' ? "bg-green-500" : booking.status === 'pending' ? "bg-amber-500" : "bg-red-500")} />
                                {booking.status}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center gap-3">
                                {booking.status !== 'confirmed' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                    title="Confirm Booking"
                                    className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                )}
                                {booking.status !== 'cancelled' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                    title="Cancel Booking"
                                    className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  title="Delete Booking"
                                  className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 hover:text-white transition-all flex items-center justify-center">
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Listings Table */}
            {activeTab === 'listings' && (
              <div className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-700 flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-3 italic uppercase tracking-widest text-sm text-brand">
                     <Building2 className="w-5 h-5" /> Property Approval Pipeline
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                      <tr>
                        <th className="px-8 py-5">Property Details</th>
                        <th className="px-8 py-5">Owner</th>
                        <th className="px-8 py-5">Valuation</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-center">Admin Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {listings.map(listing => {
                        const userDetails = platformUsers[listing.userId];
                        return (
                          <tr key={listing.id} className="group hover:bg-slate-700/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-brand">
                                  <Building2 className="w-6 h-6" />
                                </div>
                                <div className="max-w-xs">
                                  <p className="font-bold text-white text-sm uppercase italic tracking-tight truncate">{listing.title}</p>
                                  <p className="text-[10px] text-slate-500 font-medium italic uppercase">{listing.locality}, {listing.city}</p>
                                  <p className="text-[10px] text-brand font-black mt-1 uppercase">{listing.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-xs text-slate-400 italic">
                              {userDetails?.fullName || 'Unknown Owner'}
                            </td>
                            <td className="px-8 py-6 font-black text-white italic text-sm">
                              ₹{listing.price}
                            </td>
                            <td className="px-8 py-6">
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic",
                                listing.status === 'approved' ? "bg-green-500/10 text-green-500" : 
                                listing.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                              )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", listing.status === 'approved' ? "bg-green-500" : listing.status === 'pending' ? "bg-amber-500" : "bg-red-500")} />
                                {listing.status}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center gap-3">
                                {listing.status !== 'approved' && (
                                  <button 
                                    onClick={() => handleUpdateListingStatus(listing.id, 'approved')}
                                    title="Approve Listing"
                                    className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                )}
                                {listing.status !== 'rejected' && (
                                  <button 
                                    onClick={() => handleUpdateListingStatus(listing.id, 'rejected')}
                                    title="Reject Listing"
                                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteListing(listing.id)}
                                  title="Delete Listing"
                                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
