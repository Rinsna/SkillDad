import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Mail, MessageSquare, Phone, ChevronDown, ChevronUp, Send } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ModernButton from '../components/ui/ModernButton';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import axios from 'axios';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 last:border-0 p-3 bg-white/5 rounded-lg mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="text-sm text-white font-medium group-hover:text-[#E879F9] transition-colors">{question}</span>
                {isOpen ? <ChevronUp size={18} className="text-[#E879F9]" /> : <ChevronDown size={18} className="text-white/50" />}
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <p className="pb-3 text-[#B8C0FF] text-xs leading-relaxed">
                    {answer}
                </p>
            </motion.div>
        </div>
    );
};

const Support = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Technical Issue',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    // Check if we're in a dashboard route
    const isInDashboard = location.pathname.includes('/dashboard') ||
        location.pathname.includes('/admin') ||
        location.pathname.includes('/finance') ||
        location.pathname.includes('/partner') ||
        location.pathname.includes('/university');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = userInfo ? {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            } : {};

            await axios.post('/api/support', formData, config);

            // Show success message
            alert(`Support ticket submitted successfully!\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nOur support team will get back to you shortly.`);

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: 'Technical Issue',
                message: ''
            });
        } catch (error) {
            console.error('Submit ticket error:', error);
            alert('Failed to submit ticket. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const containerClasses = isInDashboard
        ? "min-h-screen text-white selection:bg-primary/30 font-inter"
        : "min-h-screen bg-gradient-to-br from-[#05030B] via-[#080512] to-[#0B071A] text-white selection:bg-primary/30 font-inter relative overflow-hidden";

    const contentClasses = isInDashboard
        ? "pt-2 pb-12 px-6 max-w-6xl mx-auto"
        : "pt-20 md:pt-24 pb-12 px-6 max-w-6xl mx-auto relative z-10";

    return (
        <div className={containerClasses}>
            {!isInDashboard && <Navbar />}
            <div className={contentClasses}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={isInDashboard ? "mb-8 text-left" : "text-center mb-6"}
                >
                    <h1 className={isInDashboard ? "text-base font-bold text-white font-inter tracking-tight" : "text-2xl font-bold text-white font-inter mb-2"}>
                        {isInDashboard ? "Support Center" : "How can we help?"}
                    </h1>
                    {!isInDashboard && <p className="text-slate-400">We're here to help you get the most out of SkillDad</p>}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-4">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <GlassCard className="h-full">
                            <h2 className="text-base font-normal mb-3 flex items-center space-x-4 text-white/90">
                                <Mail className="text-[#E879F9]" size={18} />
                                <span>Send us a Message</span>
                            </h2>
                            <form className="space-y-3" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#020005]/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#7C3AED] focus:outline-none transition-colors"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#020005]/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#7C3AED] focus:outline-none transition-colors"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-[#020005]/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#7C3AED] focus:outline-none transition-colors appearance-none"
                                    >
                                        <option>Technical Issue</option>
                                        <option>Billing & Payments</option>
                                        <option>Course Content</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">Message</label>
                                    <textarea
                                        rows="3"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-[#020005]/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#7C3AED] focus:outline-none transition-colors"
                                        placeholder="Describe your issue in detail..."
                                        required
                                    ></textarea>
                                </div>

                                <ModernButton type="submit" variant="primary" className="w-full justify-center !py-2 text-sm">
                                    <Send size={16} className="mr-2" />
                                    Submit Ticket
                                </ModernButton>
                            </form>
                        </GlassCard>
                    </div>

                    {/* FAQ & Info */}
                    <div className="space-y-4">
                        {/* Quick Contact Info */}
                        <GlassCard>
                            <h3 className="text-sm font-bold mb-2 text-white">Direct Channels</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center group-hover:bg-[#7C3AED] transition-colors">
                                        <MessageSquare size={14} className="text-[#7C3AED] group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Live Chat</p>
                                        <p className="text-[10px] text-[#A78BFA]">Available 9am - 5pm EST</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="w-8 h-8 rounded-full bg-[#E879F9]/20 flex items-center justify-center group-hover:bg-[#E879F9] transition-colors">
                                        <Phone size={14} className="text-[#E879F9] group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Phone Support</p>
                                        <p className="text-[10px] text-[#A78BFA]">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* FAQs */}
                        <GlassCard>
                            <h3 className="text-sm font-bold mb-2 text-white">Common Questions</h3>
                            <div className="space-y-1">
                                <FAQItem
                                    question="How do I reset my password?"
                                    answer="Go to the login page and click 'Forgot Password'. You'll receive an email with reset instructions."
                                />
                                <FAQItem
                                    question="Can I download course materials?"
                                    answer="Yes! Most courses allow you to download PDF guides and project files for offline use."
                                />
                                <FAQItem
                                    question="Do you offer refunds?"
                                    answer="We offer a 30-day money-back guarantee for all course purchases if you're not satisfied."
                                />
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
            {!isInDashboard && <Footer />}
        </div>
    );
};

export default Support;
