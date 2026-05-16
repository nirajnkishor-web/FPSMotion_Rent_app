import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter, IndianRupee, Home, ArrowUpDown, ChevronDown, CheckCircle2, PhoneCall, TrendingUp, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PROPERTY_CATEGORIES, CITIES, PROPERTY_TYPES, COMPANY_DETAILS } from '../constants';
import { cn, formatCurrency } from '../lib/utils';

// Mock Data
const MOCK_PROPERTIES = [
  { id: 1, title: 'Luxury 3BHK Villa', category: 'House', city: 'Ranchi', locality: 'Kanke', price: 8500000, type: 'Sale', area: 2400, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' },
  { id: 2, title: 'Modern Studio Apartment', category: 'Flat', city: 'Ranchi', locality: 'Bariatu', price: 12000, type: 'Rent', area: 450, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' },
  { id: 3, title: 'Commercial Shop', category: 'Shop', city: 'Ranchi', locality: 'Lalpur', price: 3500000, type: 'Sale', area: 600, image: 'https://images.unsplash.com/photo-1556740734-7f9a2b7a0f4d' },
  { id: 4, title: 'Student PG Room', category: 'PG', city: 'Ranchi', locality: 'Kanke', price: 6500, type: 'Rent', area: 150, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5' },
  { id: 5, title: 'Prime Residential Land', category: 'Land', city: 'Jamshedpur', locality: 'Sonari', price: 5500000, type: 'Sale', area: 3000, image: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62' },
  { id: 6, title: '2BHK Family House', category: 'House', city: 'Patna', locality: 'Boring Road', price: 18000, type: 'Rent', area: 1200, image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea' },
];

export default function SearchPage() {
  const location = useLocation();
  const pageType = location.pathname === '/buy' ? 'Sale' : 'Rent';

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter(p => {
      const matchType = p.type === pageType;
      const matchCity = !city || p.city === city;
      const matchCategory = !category || p.category === category;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.locality.toLowerCase().includes(search.toLowerCase());
      return matchType && matchCity && matchCategory && matchSearch;
    });
  }, [pageType, city, category, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Search Bar */}
      <section className="bg-white border-b border-slate-100 py-10 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 flex items-center gap-4 bg-slate-50 border border-slate-100 p-2 rounded-2xl w-full">
              <div className="flex items-center gap-2 pl-4 flex-1">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search locality or property title..."
                  className="w-full bg-transparent outline-none text-slate-900 font-medium py-3"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 px-6 border-l border-slate-200">
                <MapPin className="w-5 h-5 text-slate-400" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent outline-none font-bold text-slate-700 cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "p-3 rounded-xl transition-all flex items-center gap-2",
                  isFilterOpen ? "bg-brand text-slate-900" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline font-bold text-sm">Filters</span>
              </button>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex bg-slate-100 p-1 rounded-2xl w-full lg:w-auto">
                <Link
                  to="/buy"
                  className={cn(
                    "flex-1 lg:px-8 py-3 rounded-xl text-sm font-bold transition-all text-center",
                    pageType === 'Sale' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Buy
                </Link>
                <Link
                  to="/rent"
                  className={cn(
                    "flex-1 lg:px-8 py-3 rounded-xl text-sm font-bold transition-all text-center",
                    pageType === 'Rent' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Rent
                </Link>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 pb-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700"
                    >
                      <option value="">All Categories</option>
                      {PROPERTY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Min Price</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                      <option value="">No Min</option>
                      <option value="10L">₹10 L</option>
                      <option value="20L">₹20 L</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Max Price</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                      <option value="">No Max</option>
                      <option value="50L">₹50 L</option>
                      <option value="1Cr">₹1 Cr+</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => { setCity(''); setCategory(''); setSearch(''); }}
                      className="text-xs font-bold text-red-500 hover:text-red-600 pb-4 flex items-center gap-1"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">
              Properties for {pageType} in {city || 'India'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">{filteredProperties.length} Properties found</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
            <ArrowUpDown className="w-4 h-4" />
            Sort By: <span className="text-slate-900 ml-1 cursor-pointer">Newest First</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="py-32 text-center">
            <div className="inline-flex w-24 h-24 bg-slate-100 rounded-full items-center justify-center text-slate-400 mb-6">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Properties Found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image + "?auto=format&fit=crop&w=600&q=80"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={p.title}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={cn(
                      "text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-widest",
                      p.type === 'Sale' ? "bg-brand" : "bg-emerald-400"
                    )}>
                      {p.type}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-widest">
                      Verified
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-[10px] font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.category}</p>
                    <p className="text-2xl font-black text-slate-900">{formatCurrency(p.price)}{p.type === 'Rent' && <span className="text-sm font-medium text-slate-400">/mo</span>}</p>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">{p.title}</h3>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mb-6">
                    <MapPin className="w-4 h-4 text-slate-300" /> {p.locality}, {p.city}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-slate-900">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Built-up</p>
                        <p className="text-sm font-bold text-slate-700">{p.area} sqft</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</p>
                        <p className="text-sm font-bold text-slate-700">Ready</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/property/${p.id}`} className="flex-[2] bg-slate-900 text-white text-center py-4 rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-brand hover:text-slate-900 transition-all active:scale-95">
                      View Property
                    </Link>
                    <button className="flex-1 border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                      <PhoneCall className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Direct Contact Floating Button */}
      <a
        href={`https://wa.me/${COMPANY_DETAILS.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-90 transition-all z-50 group"
      >
        <Phone className="w-8 h-8" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with Owner
        </span>
      </a>
    </div>
  );
}
