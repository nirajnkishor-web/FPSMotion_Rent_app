import React from 'react';
import { Calendar, User, ArrowRight, MessageSquare, Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const BLOG_POSTS = [
  {
    id: 1,
    title: '5 Tips for First-Time Home Buyers in Ranchi',
    excerpt: 'Buying your first home is a huge milestone. Here is what you need to know about properties in Ranchi...',
    category: 'Real Estate Advice',
    author: 'Niraj Kishor',
    date: 'May 12, 2026',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'
  },
  {
    id: 2,
    title: 'Understanding Property Registration Laws in Jharkhand',
    excerpt: 'Legal documentation can be tricky. We break down the Jharbhoomi portal and registration process...',
    category: 'Legal Guide',
    author: 'FPS Legal Team',
    date: 'May 10, 2026',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f'
  },
  {
    id: 3,
    title: 'Why Kanke Road is the Best Investment in 2026',
    excerpt: 'Analyzing the growth patterns and future developments in the Kanke area of Ranchi...',
    category: 'Investment',
    author: 'Admin',
    date: 'May 05, 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] opacity-30 -z-10" />
           <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Latest Insights</p>
           <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight">Blog & News</h1>
           <p className="text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
             Everything you need to know about the real estate market in India, legal tips, and investment guides.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image + "?auto=format&fit=crop&w=600&q=80"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={post.title} 
                />
                <div className="absolute top-4 left-4 bg-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand shadow-sm italic">
                   {post.category}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-4">
                   <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                   <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors leading-tight">{post.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{post.excerpt}</p>
                
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
                   <Link to={`/blog/${post.id}`} className="text-slate-900 hover:text-amber-600 flex items-center gap-2 transition-colors">
                      Read Article <ArrowRight className="w-4 h-4" />
                   </Link>
                   <div className="flex items-center gap-1 text-slate-400">
                      <MessageSquare className="w-4 h-4" /> 12
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <section className="mt-32 bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center md:text-left">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand rounded-full blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/2" />
           <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                 <h2 className="text-4xl font-display font-bold text-white mb-6 uppercase italic tracking-tighter">Stay ahead with property news</h2>
                 <p className="text-slate-400 text-lg max-w-md">Subscribe to our weekly newsletter and never miss a prime property deal.</p>
              </div>
              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                 <input type="email" placeholder="Your email address" className="bg-slate-800 border-none outline-none text-white px-8 py-5 rounded-2xl w-full sm:w-[350px] font-medium" />
                 <button className="bg-brand text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 active:scale-95 whitespace-nowrap">
                    Subscribe Now
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
