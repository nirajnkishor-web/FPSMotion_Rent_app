import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, IndianRupee, Home, Calendar, Phone, MessageSquare, Share2, Heart, ShieldCheck, ChevronRight, CheckCircle2, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { COMPANY_DETAILS } from '../constants';
import { formatCurrency } from '../lib/utils';

export default function PropertyDetail() {
  const { id } = useParams();

  // Mock implementation for demo
  const property = {
    id,
    title: 'Modern 3BHK Apartment near Kanke Dam',
    price: 4500000,
    type: 'Sale',
    category: 'Flat',
    city: 'Ranchi',
    locality: 'Kanke Road',
    address: 'Flat 402, Purnima Complex, Kanke, Ranchi, Jharkhand',
    description: 'Beautifully designed 3BHK flat with modern amenities. Located in a prime area with easy access to schools, hospitals, and markets. The property offers a breathtaking view of the Kanke Dam and ample ventilation.',
    features: ['3 Bedrooms', '2 Bathrooms', '2 Balconies', 'Modular Kitchen', 'Lift Access', 'Power Backup', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea'
    ],
    owner: {
      name: 'FPS Motion Admin',
      verified: true,
      memberSince: '2021'
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Photo Gallery */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-2 md:h-[500px] bg-slate-900">
        <div className="md:col-span-2 relative group overflow-hidden">
          <img src={property.images[0] + "?auto=format&fit=crop&w=1200&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Living" />
          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="md:col-span-1 grid grid-rows-2 gap-2">
          <div className="overflow-hidden">
            <img src={property.images[1] + "?auto=format&fit=crop&w=600&q=80"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Bedroom" />
          </div>
          <div className="overflow-hidden">
            <img src={property.images[2] + "?auto=format&fit=crop&w=600&q=80"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Kitchen" />
          </div>
        </div>
        <div className="md:col-span-1 relative bg-slate-800 flex items-center justify-center cursor-pointer group">
          <img src={property.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" alt="Overlay" />
          <div className="relative text-white text-center">
            <p className="text-3xl font-bold">+12</p>
            <p className="text-xs font-bold uppercase tracking-widest mt-2 group-hover:underline">View All Photos</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
              <div>
                <div className="flex gap-2 mb-4">
                  <span className="bg-brand text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none flex items-center italic">For {property.type}</span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none flex items-center">{property.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">{property.title}</h1>
                <p className="flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin className="w-5 h-5 text-blue-500" /> {property.address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-slate-900">{formatCurrency(property.price)}</p>
                <p className="text-slate-500 text-sm font-medium mt-1">Freehold • Government Registry</p>
              </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { label: 'Area', val: '1450 sqft', icon: Home },
                { label: 'Bedrooms', val: '3 BHK', icon: CheckCircle2 },
                { label: 'Possession', val: 'Ready to Move', icon: Calendar },
                { label: 'Floor', val: '4/8 Floors', icon: ShieldCheck },
              ].map(item => (
                <div key={item.label} className="p-6 bg-slate-50 rounded-2xl">
                  <item.icon className="w-6 h-6 text-slate-900 mb-3" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-bold text-slate-900">{item.val}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">About this Property</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Amenities & Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                {property.features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-display">Location & Nearby</h3>
              <div className="aspect-video w-full bg-slate-100 rounded-[3rem] relative overflow-hidden group border border-slate-100 shadow-sm">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-slate-100 scale-90 group-hover:scale-100 transition-transform">
                    <MapPin className="w-8 h-8 text-red-500 animate-bounce" />
                    <div>
                      <p className="font-bold text-slate-900">Virtual Map View</p>
                      <p className="text-xs text-slate-500">Enable Google Maps in production</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Niraj" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">FPS Motion</h3>
                    <div className="flex items-center gap-1 text-slate-900 text-xs font-black uppercase tracking-widest italic">
                      <ShieldCheck className="w-3 h-3 text-brand" /> Professional Agency
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <button className="w-full bg-slate-900 text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-sm hover:bg-brand hover:text-slate-900 active:scale-95 transition-all shadow-lg shadow-slate-200">
                    <Phone className="w-5 h-5" />
                    Show Contact
                  </button>
                  <a href={`https://wa.me/${COMPANY_DETAILS.whatsapp}`} className="w-full border-2 border-emerald-500 text-emerald-600 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all">
                    <MessageSquare className="w-5 h-5" />
                    Chat on WhatsApp
                  </a>
                  <Link to="/book" className="w-full flex items-center justify-center gap-3 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all">
                    <Video className="w-5 h-5" />
                    Book Video Call
                  </Link>
                  <p className="px-4 text-[10px] text-center text-slate-400 italic">
                    * Consultation charges will be applicable {COMPANY_DETAILS.consultationFee}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Inquiry</h4>
                  <textarea className="w-full bg-white p-3 rounded-xl border border-slate-100 text-sm h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="I'm interested in this property..."></textarea>
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                    Send Inquiry
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-200 rounded-xl flex items-center justify-center text-amber-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900">Verified Listing</p>
                  <p className="text-xs text-amber-700">Documents verified by FPS Motion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
