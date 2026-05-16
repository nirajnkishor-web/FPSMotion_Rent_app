import React, { useState } from 'react';
import { Camera, Video, MapPin, IndianRupee, Layers, CheckCircle, ArrowLeft, ArrowRight, Loader2, Wand2, FileText, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { PROPERTY_CATEGORIES, PROPERTY_TYPES, CITIES } from '../constants';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Upload() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: 'Sale',
    city: '',
    locality: '',
    price: '',
    description: '',
    features: [] as string[],
    idProof: null as File | null,
    images: [] as File[],
  });

  const handleAiDescription = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Please enter a title and category first!");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a professional real estate description for a ${formData.category} named "${formData.title}" in ${formData.locality}, ${formData.city}. The price is ₹${formData.price}. Highlight comfort, location advantages, and modern amenities. Keep it under 150 words and friendly.`,
      });
      setFormData(prev => ({ ...prev, description: response.text || '' }));
      toast.success("AI Description generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI description.");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to list property");
      navigate('/login');
      return;
    }
    if (!formData.idProof) {
      toast.error("ID/Address proof is mandatory!");
      setStep(2);
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'listings'), {
        userId: user.uid,
        title: formData.title,
        category: formData.category,
        type: formData.type,
        city: formData.city,
        locality: formData.locality,
        price: formData.price,
        description: formData.description,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      toast.success("Property listed successfully! Pending admin approval.");
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'listings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 ${
                  step >= s ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Basic Details</h2>
                <p className="text-slate-500">Tell us what you are listing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Property Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                    placeholder="e.g. Luxurious 3BHK Apartment near Kanke Dam"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                  >
                    <option value="">Select Category</option>
                    {PROPERTY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Listed For</label>
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                    {PROPERTY_TYPES.map(t => (
                      <button
                        key={t}
                        onClick={() => setFormData({ ...formData, type: t })}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          formData.type === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                  >
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Locality</label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                    placeholder="e.g. Kanke Road"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  onClick={nextStep}
                  disabled={!formData.title || !formData.city || !formData.category}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Price & Media</h2>
                <p className="text-slate-500">Upload visuals and set your pricing</p>
              </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Expected Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand text-slate-900"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Verification Documents <span className="text-brand font-black">(Required)</span></label>
                    <div 
                      className={cn(
                        "p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group relative overflow-hidden",
                        formData.idProof ? "border-brand bg-brand/5" : "border-slate-200 hover:border-brand hover:bg-slate-50"
                      )}
                      onClick={() => document.getElementById('id-upload')?.click()}
                    >
                      <input 
                        id="id-upload" 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({ ...formData, idProof: file });
                        }}
                      />
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                        formData.idProof ? "bg-brand text-slate-900" : "bg-slate-100 text-slate-400"
                      )}>
                        {formData.idProof ? <ShieldCheck className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest italic">
                          {formData.idProof ? formData.idProof.name : "Upload ID / Address Proof"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Aadhar, PAN, or Utility Bill (PDF/JPG)</p>
                      </div>
                      {formData.idProof && (
                        <div className="absolute top-4 right-4 bg-brand text-slate-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic shadow-lg">
                          Uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:border-brand hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-brand group-hover:text-slate-900 transition-all">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-widest italic">Add Photos</span>
                      <span className="text-[10px] text-slate-400 font-black">Up to 10 images</span>
                    </div>

                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:border-brand hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-brand group-hover:text-slate-900 transition-all">
                        <Video className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-600 uppercase tracking-widest italic">Add Video</span>
                      <span className="text-[10px] text-slate-400 font-black">MP4, max 50MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    onClick={prevStep}
                    className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest text-xs italic"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2 inline" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.price || !formData.idProof}
                    className="bg-brand text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-brand-dark active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-50 uppercase tracking-widest text-xs italic"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Description</h2>
                  <p className="text-slate-500">Sell your property with words</p>
                </div>
                <button
                  onClick={handleAiDescription}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  AI Generate
                </button>
              </div>

              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 min-h-[250px] text-lg leading-relaxed placeholder:text-slate-300"
                placeholder="Describe your property features, highlights, and why someone should buy/rent it..."
              />

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-8 py-4 rounded-2xl font-bold flex items-center gap-2 text-slate-500 hover:bg-slate-100 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-200 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  List Property Now
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
