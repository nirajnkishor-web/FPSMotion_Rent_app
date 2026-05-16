import React from 'react';
import { Home, Users, Search, Heart, ShieldCheck, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { COMPANY_DETAILS } from '../constants';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600 rounded-full blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight italic uppercase">
              Redefining Real Estate <br />
              <span className="text-brand">In Jharkhand</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              FPS Motion is a cinematic, digital-first property marketplace built on trust and direct connections.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-8 tracking-tight uppercase italic">Our Story & Mission</h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  Founded in Ranchi, Jharkhand, <span className="font-bold text-slate-900 italic">FPS MOTION</span> started with a simple observation: the real estate process was too slow and opaque.
                </p>
                <p>
                  Our mission is to empower property seekers by providing a direct, high-impact platform. We believe that finding a home should be as moving as a great film.
                </p>
              </div>
              <div className="mt-12 flex gap-8">
                <div>
                  <p className="text-4xl font-black text-slate-900">5k+</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Properties</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-slate-900">12k+</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Happy Clients</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-900">
                <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800" alt="Team working" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-slate-900 p-8 rounded-3xl shadow-xl max-w-xs text-white">
                <ShieldCheck className="w-12 h-12 text-brand mb-4" />
                <h4 className="font-bold text-white text-lg mb-2 italic">100% Verified</h4>
                <p className="text-sm text-slate-400 font-medium">Every listing on our platform undergoes a cinematic-standard verification check.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 italic tracking-tighter">WHY CHOOSE FPS MOTION?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Zero Brokerage",
                desc: "No hidden middle-men. Direct talk with owners.",
                icon: Heart,
                color: "brand"
              },
              {
                title: "Expert Guidance",
                desc: `Legal support and document verification from experts. *Consultation charges will be applicable ${COMPANY_DETAILS.consultationFee}.`,
                icon: Award,
                color: "brand"
              },
              {
                title: "Impact Visuals",
                desc: "Cinematic property tours and high-quality photography.",
                icon: TrendingUp,
                color: "brand"
              }
            ].map(val => (
              <div key={val.title} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-slate-900 text-brand">
                  <val.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 italic uppercase">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80" 
                    className="relative z-10 w-[400px] h-[500px] object-cover rounded-[3rem] shadow-2xl group-hover:scale-105 transition-all duration-500" 
                    alt="Founder"
                  />
                </div>
             </div>
             <div className="order-1 lg:order-2">
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Meet Our Founder</p>
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-8">Niraj Kishor</h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>
                    "Real estate shouldn't be about hiding information; it should be about sharing it. At FPS Motion, we are building a bridge between dreams and reality."
                  </p>
                  <p>
                    Niraj has spent over a decade understanding the local landscape of Ranchi and Jharkhand. His vision for FPS Motion is to create a digital ecosystem where every Indian can find a home without fear of being misled.
                  </p>
                </div>
                <div className="mt-10 flex gap-4">
                   <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                     <CheckCircle className="w-4 h-4" /> Verified Expert
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
