import React, { useState } from 'react';
import { Search, HelpCircle, BookOpen, CreditCard, Shield, MapPin, Ticket, Users, Phone, Mail, MessageSquare, ChevronRight, ChevronDown, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  id: string;
  title: string;
  icon: any;
  color: string;
  articles: number;
}

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories: Category[] = [
    { id: 'booking', title: 'Booking & Reservations', icon: BookOpen, color: 'from-blue-500 to-cyan-600', articles: 12 },
    { id: 'payment', title: 'Payment & Billing', icon: CreditCard, color: 'from-purple-500 to-pink-600', articles: 8 },
    { id: 'security', title: 'Account & Security', icon: Shield, color: 'from-emerald-500 to-teal-600', articles: 10 },
    { id: 'travel', title: 'Travel Information', icon: MapPin, color: 'from-orange-500 to-red-600', articles: 15 },
    { id: 'events', title: 'Events & Tickets', icon: Ticket, color: 'from-indigo-500 to-purple-600', articles: 9 },
    { id: 'host', title: 'For Event Hosts', icon: Users, color: 'from-pink-500 to-rose-600', articles: 11 }
  ];

  const faqs: FAQItem[] = [
    {
      question: 'How do I book a hotel or event ticket?',
      answer: 'Search for your destination or event, select your dates, choose from available options, and proceed to checkout. You\'ll receive instant confirmation via email.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption.'
    },
    {
      question: 'Can I cancel or modify my booking?',
      answer: 'Cancellation policies vary by property and event. Most hotels offer free cancellation up to 24-48 hours before check-in. Event tickets typically have specific cancellation terms listed at purchase.'
    },
    {
      question: 'How do I receive my tickets?',
      answer: 'Digital tickets are sent to your email immediately after purchase. You can also access them in your account under "My Bookings". Simply show the QR code at the venue entrance.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption and comply with international data protection regulations. Your payment information is never stored on our servers.'
    },
    {
      question: 'How can I become a host or list my property?',
      answer: 'Click on "List Property" or "List Event" in the main navigation. Fill out the registration form, provide required documentation, and our team will review your application within 24-48 hours.'
    }
  ];

  const quickLinks = [
    { title: 'Getting Started Guide', icon: BookOpen, time: '5 min read' },
    { title: 'Cancellation Policy', icon: Shield, time: '3 min read' },
    { title: 'Payment Options', icon: CreditCard, time: '4 min read' },
    { title: 'Host Guidelines', icon: Users, time: '8 min read' }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;600&display=swap');
        
        * {
          font-family: 'Archivo', -apple-system, sans-serif;
        }
        
        .font-display {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        
        .font-serif {
          font-family: 'Crimson Pro', serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
      `}</style>


      {/* Hero Section */}
      <header className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
            <HelpCircle size={16} className="text-white" />
            <span className="text-white text-sm font-semibold">We're here to help</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display text-white mb-4 leading-tight animate-fadeInUp">
            How can we help you?
          </h1>
          
          <p className="text-xl text-white/90 font-serif mb-10 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            Search our help center or browse by category
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="glass p-2 rounded-2xl shadow-2xl">
              <div className="flex items-center bg-white rounded-xl p-4">
                <Search className="text-indigo-600 mr-3" size={24} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-lg font-medium"
                />
                <button className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Categories */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display text-slate-900 mb-3">Browse by Category</h2>
            <p className="text-slate-600 text-lg font-serif">Find answers organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white rounded-2xl p-6 border-2 border-slate-200 cursor-pointer card-hover animate-fadeInUp"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className={`inline-flex p-4 rounded-xl bg-linear-to-br ${category.color} mb-4`}>
                  <category.icon size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{category.title}</h3>
                <p className="text-slate-600 mb-4">{category.articles} articles</p>
                <div className="flex items-center text-indigo-600 font-semibold group">
                  <span>View articles</span>
                  <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display text-slate-900 mb-3">Popular Articles</h2>
            <p className="text-slate-600 text-lg font-serif">Most viewed help articles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border-2 border-slate-200 cursor-pointer card-hover flex items-start space-x-4"
              >
                <div className="bg-indigo-100 p-3 rounded-xl flex-shrink-0">
                  <link.icon size={24} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{link.title}</h3>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock size={14} className="mr-1.5" />
                    <span>{link.time}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-400" />
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display text-slate-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-lg font-serif">Quick answers to common questions</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0 mt-1">
                      <HelpCircle size={20} className="text-indigo-600" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">{faq.question}</span>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-slate-400 flex-shrink-0 transition-transform ${
                      expandedFAQ === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="px-6 pb-6 animate-slideDown">
                    <div className="pl-12 text-slate-600 leading-relaxed">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 border-2 border-indigo-200">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display text-slate-900 mb-3">Still need help?</h2>
            <p className="text-slate-600 text-lg font-serif">Our support team is here for you 24/7</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 text-center border-2 border-indigo-200 card-hover">
              <div className="bg-linear-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={28} className="text-white" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Phone Support</h3>
              <p className="text-slate-600 mb-4">Mon-Fri, 9am-6pm EST</p>
              <a href="tel:+1234567890" className="text-indigo-600 font-bold hover:text-indigo-700">
                +1 (234) 567-890
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border-2 border-indigo-200 card-hover">
              <div className="bg-linear-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-white" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Email Support</h3>
              <p className="text-slate-600 mb-4">Response in 24 hours</p>
              <a href="mailto:support@booknstay.com" className="text-indigo-600 font-bold hover:text-indigo-700">
                support@booknstay.com
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border-2 border-indigo-200 card-hover">
              <div className="bg-linear-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-white" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Live Chat</h3>
              <p className="text-slate-600 mb-4">Available 24/7</p>
              <button className="text-indigo-600 font-bold hover:text-indigo-700">
                Start Chat
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-3xl font-display mb-4 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                BookNStay
              </div>
              <p className="text-slate-400 leading-relaxed font-serif">
                Your gateway to extraordinary stays and unforgettable experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Explore</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Experiences</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cancellation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>© 2026 BookNStay. Crafted with care.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;