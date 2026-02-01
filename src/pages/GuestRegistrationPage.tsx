import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomToaster, showToast } from '../components/CustomToaster';
import { 
  ArrowLeft, Mail, Phone, User, Lock, CheckCircle, 
  Sparkles, ChevronRight, Heart, Compass, Music, 
  Palmtree, Map, ShieldCheck, Wind, Briefcase
} from 'lucide-react';
import { useRegisterGuestMutation } from '../store/services/AuthApi';
import { useGetInterestsQuery } from '../store/services/miscApi';
import PulseLoader from '../components/PulseLoader';

interface GuestFormData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  
  // Step 2: Travel Preferences
  interests: string[];
  travelStyle: string;
  
  // Step 3: Security
  password: string;
  confirmPassword: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  Music: <Music size={18} />,
  Sparkles: <Sparkles size={18} />,
  Palmtree: <Palmtree size={18} />,
  Compass: <Compass size={18} />,
  Map: <Map size={18} />,
  Heart: <Heart size={18} />,
  Wind: <Wind size={18} />,
  Briefcase: <Briefcase size={18} />,
  // Fallback icon
  Default: <Sparkles size={18} />,
};

const GuestRegisterationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GuestFormData>({
    fullName: '',
    email: '',
    phone: '',
    interests: [],
    travelStyle: 'leisure',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const [register, { isLoading: isRegistering }] = useRegisterGuestMutation();
  const { data: interests, isLoading: isLoadingInterests } = useGetInterestsQuery();

  const totalSteps = 3;

  const updateFormData = (field: keyof GuestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    const current = [...formData.interests];
    const index = current.indexOf(interest);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(interest);
    }
    updateFormData('interests', current);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast.error("Passwords do not match!");
      return;
    }

    const interestIds = interests
      ? formData.interests
          .map((slug) => interests.find((i) => i.slug === slug)?.id)
          .filter((id): id is number => id !== undefined && id !== null)
      : [];

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: 'guest',
        interests: interestIds,
      }).unwrap();

      showToast.success('Welcome aboard! Let the adventures begin.');
      navigate('/bookings'); // Redirect to bookings page for guests
    } catch (err: any) {
      console.error('Failed to register:', err);
      const errorMessages = err.data?.errors ? Object.values(err.data.errors).flat().join('\n') : 'Registration failed. Please try again.';
      showToast.error(errorMessages, { duration: 4000 });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-teal-50/30">
      <CustomToaster />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;600&display=swap');
        
        * { font-family: 'Archivo', sans-serif; }
        .font-display { font-family: 'Archivo', sans-serif; font-weight: 800; letter-spacing: -0.03em; }
        .font-serif { font-family: 'Crimson Pro', serif; }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .interest-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .interest-card.active {
          background: #4f46e5;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
        }
      `}</style>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="w-full md:w-1/2 space-y-8 animate-slideUp">
            <div className="inline-flex items-center space-x-2 bg-indigo-100/50 px-4 py-2 rounded-full border border-indigo-200">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-indigo-700 text-xs font-bold uppercase tracking-wider">Start Your Journey</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display text-slate-900 leading-none">
              Travel <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">Beyond Limits.</span>
            </h1>
            
            <p className="text-xl text-slate-600 font-serif max-w-md leading-relaxed">
              Book exclusive stays and world-class events in one click. Join the community of modern explorers.
            </p>

            <div className="flex items-center space-x-6 pt-4">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="user" />
                   </div>
                 ))}
               </div>
               <p className="text-sm font-semibold text-slate-500">
                 <span className="text-slate-900">2,400+</span> travelers joined today
               </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="w-full md:w-[480px] animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white">
              
              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === s ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Personal */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display text-slate-900">Create Account</h2>
                      <p className="text-slate-500 text-sm">Let's start with the basics</p>
                    </div>

                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={formData.fullName}
                        onChange={(e) => updateFormData('fullName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Preferences */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display text-slate-900">Your Interests</h2>
                      <p className="text-slate-500 text-sm">Help us personalize your feed</p>
                    </div>

                    {isLoadingInterests ? (
                      <div className="flex justify-center items-center h-48">
                        <PulseLoader />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {interests?.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleInterest(item.slug)}
                            className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all interest-card ${
                              formData.interests.includes(item.slug) ? 'active' : 'bg-white border-slate-100 text-slate-600'
                            }`}
                          >
                            {iconMap[item.icon] || iconMap.Default}
                            <span className="font-bold text-sm">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Password */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-display text-slate-900">Secure Account</h2>
                      <p className="text-slate-500 text-sm">Choose a strong password</p>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        placeholder="Password"
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        required
                      />
                    </div>

                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        required
                      />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-3">
                      <CheckCircle className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        By creating an account, you get early access to "Stay + Play" bundles and member-only pricing.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="pt-4 space-y-4">
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center group hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-200"
                    >
                      <span>Continue</span>
                      <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full py-4 bg-linear-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 disabled:opacity-50"
                    >
                      {isRegistering ? 'Creating Account...' : 'Join BookNStay'}
                    </button>
                  )}

                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="w-full text-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Go Back
                    </button>
                  )}
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Sign In</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestRegisterationPage;