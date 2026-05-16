import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MessageSquare, Video, MapPin, User, ChevronRight, CheckCircle, Loader2, Phone, CreditCard, Copy, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { format, addDays, startOfToday } from 'date-fns';
import { COMPANY_DETAILS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const SESSION_TYPES = [
  { id: 'visit', name: 'Site Visit', icon: MapPin, desc: 'Visit the property with an expert' },
  { id: 'video', name: 'Video Call', icon: Video, desc: 'Discuss via WhatsApp Video Call' },
  { id: 'chat', name: 'Consultation', icon: User, desc: 'General doubt clearing & guidance' },
];

export default function BookAppointment() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState('visit');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Logic for loading state handled by ProtectedRoute
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  const handleBooking = async () => {
    if (!user) {
      toast.error("You must be logged in to book.");
      navigate('/login');
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot!");
      return;
    }

    setIsLoading(true);
    const bookingPath = 'bookings';
    try {
      await addDoc(collection(db, bookingPath), {
        userId: user.uid,
        type: sessionType,
        date: format(selectedDate, 'yyyy-MM-dd'),
        slot: selectedSlot,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      toast.success("Appointment request sent! We will confirm on WhatsApp.");
      navigate('/dashboard');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.WRITE, bookingPath);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4 italic uppercase tracking-tight">Book Your Consultation</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium italic">
            Speak directly with the owner of FPS Motion. Get expert legal and property guidance today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Session Type */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 italic uppercase tracking-widest text-sm">
                <MessageSquare className="w-5 h-5 text-brand" />
                Select Consultation Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SESSION_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSessionType(type.id)}
                    className={`p-6 rounded-[2rem] text-left transition-all border-2 ${
                      sessionType === type.id ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <type.icon className={`w-8 h-8 mb-4 ${sessionType === type.id ? "text-brand" : "text-slate-400"}`} />
                    <p className="font-bold text-sm mb-1 italic uppercase">{type.name}</p>
                    <p className={`text-[10px] leading-tight italic ${sessionType === type.id ? "text-slate-400" : "text-slate-400"}`}>
                      {type.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Select */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 italic uppercase tracking-widest text-sm">
                <CalendarIcon className="w-5 h-5 text-brand" />
                Select Date
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {days.map(date => {
                  const isSelected = format(selectedDate, 'PP') === format(date, 'PP');
                  return (
                    <button
                      key={date.toString()}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-20 flex flex-col items-center justify-center p-4 rounded-2xl transition-all border ${
                        isSelected ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-widest mb-1 italic">{format(date, 'EEE')}</span>
                      <span className="text-2xl font-bold">{format(date, 'd')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Select */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 italic uppercase tracking-widest text-sm">
                <Clock className="w-5 h-5 text-brand" />
                Available Slots
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all border italic uppercase ${
                      selectedSlot === slot ? "bg-brand border-brand text-slate-900 shadow-md shadow-brand/20" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI Payment Details */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 border border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 italic uppercase tracking-widest text-sm">
                  <CreditCard className="w-5 h-5 text-brand" />
                  UPI Payment Details
                </h2>
                <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">Secure Payment</span>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-slate-800 rounded-3xl border border-slate-700 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150" />
                  
                  <div className="relative">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Merchant UPI ID</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black text-white italic tracking-tight">{COMPANY_DETAILS.upiId}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(COMPANY_DETAILS.upiId);
                          toast.success("UPI ID Copied!");
                        }}
                        className="p-3 bg-slate-900 rounded-xl text-brand hover:bg-brand hover:text-slate-900 transition-all active:scale-90"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Consultation Fee</p>
                    <p className="text-lg font-bold text-white italic">{COMPANY_DETAILS.consultationFee} of Booking Value</p>
                  </div>
                  <div className="p-6 bg-brand/5 rounded-3xl border border-brand/20">
                    <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-1 italic">Payment Protocol</p>
                    <p className="text-xs text-slate-400 font-medium italic leading-relaxed">
                      Please pay via UPI and share the transaction screenshot on WhatsApp for verification.
                    </p>
                  </div>
                </div>

                <a 
                  href={`upi://pay?pa=${COMPANY_DETAILS.upiId}&pn=FPS%20Motion&cu=INR`}
                  className="flex items-center justify-center gap-3 w-full py-5 bg-brand rounded-2xl text-slate-900 font-black italic uppercase tracking-widest text-sm hover:bg-brand-dark transition-all shadow-xl shadow-brand/10 group"
                >
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Pay with UPI Apps
                </a>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-8 italic uppercase tracking-widest text-sm">Booking Summary</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Date</p>
                    <p className="font-bold text-slate-900">{format(selectedDate, 'PPPP')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Time Slot</p>
                    <p className="font-bold text-slate-900">{selectedSlot || 'Not selected'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                    {sessionType === 'visit' ? <MapPin className="w-5 h-5 text-brand" /> : 
                     sessionType === 'video' ? <Video className="w-5 h-5 text-brand" /> : 
                     <User className="w-5 h-5 text-brand" />}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Session Type</p>
                    <p className="font-bold text-slate-900">{SESSION_TYPES.find(t => t.id === sessionType)?.name}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium italic">Consultation Fee</span>
                      <span className="text-lg font-bold text-slate-900">See Note</span>
                    </div>
                    <div className="p-3 bg-brand/5 rounded-xl border border-brand/10 italic">
                      <p className="text-[10px] text-brand-dark font-bold leading-tight">
                        * Consultation charges will be applicable {COMPANY_DETAILS.consultationFee} of the booking value.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={isLoading || !selectedSlot}
                    className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-bold hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 italic uppercase tracking-widest text-sm"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Send"}
                  </button>
                  <p className="mt-4 text-[10px] text-center text-slate-400 italic">
                    By clicking you agree to be contacted for confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
