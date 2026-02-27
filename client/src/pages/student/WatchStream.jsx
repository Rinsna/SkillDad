import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Users, Clock, Radio, ShieldCheck,
    MessageSquare, Maximize2, Volume2, Settings,
    AlertCircle, RefreshCw, ChevronLeft, Send
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import ModernButton from '../../components/ui/ModernButton';

const API = (path) => `${import.meta.env.VITE_API_URL || ''}/api/sessions${path}`;

const WatchStream = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [playbackData, setPlaybackData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chat, setChat] = useState([
        { id: 1, user: 'System', message: 'Welcome to the live session! Please stay respectful in chat.', time: 'System' },
        { id: 2, user: 'Admin', message: 'The session will begin shortly.', time: 'System' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    useEffect(() => {
        const fetchStream = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                navigate('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            try {
                // 1. Fetch Session Details
                const { data: sessionData } = await axios.get(API(`/${id}`), config);
                setSession(sessionData);

                // 2. Fetch Signed Playback Links
                const { data: playback } = await axios.get(API(`/${id}/playback`), config);
                setPlaybackData(playback);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching stream:', err);
                setError(err.response?.data?.message || 'Failed to connect to the live stream.');
                setLoading(false);
            }
        };

        fetchStream();
    }, [id, navigate]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            user: 'You',
            message: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChat([...chat, msg]);
        setNewMessage('');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050514] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Secure Stream...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#050514] flex flex-col items-center justify-center p-6 text-center">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl max-w-md w-full">
                <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Stream Unavailable</h2>
                <p className="text-white/50 mb-6">{error}</p>
                <div className="flex gap-4">
                    <ModernButton onClick={() => window.location.reload()} variant="primary" className="flex-1 justify-center">
                        <RefreshCw size={16} className="mr-2" /> Retry
                    </ModernButton>
                    <ModernButton onClick={() => navigate('/dashboard/live-classes')} variant="secondary" className="flex-1 justify-center">
                        Back
                    </ModernButton>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020210] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-black/40 border-b border-white/5 backdrop-blur-xl flex items-center justify-between z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard/live-classes')}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <ChevronLeft className="text-white/40 group-hover:text-white" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-black text-red-400 animate-pulse uppercase tracking-widest">Live Now</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">• {session?.category || 'Educational'}</span>
                        </div>
                        <h1 className="text-base font-bold text-white leading-tight">{session?.topic}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <Users size={14} className="text-primary" />
                        <span className="text-xs font-bold text-white">{session?.metrics?.totalJoins || 12}+ Learners</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} /> Encrypted Stream
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Main Player Area */}
                <div className="flex-1 relative bg-black flex flex-col min-h-0 lg:border-r border-white/5">
                    {playbackData?.signedIframe ? (
                        <div className="flex-1 relative overflow-hidden">
                            <iframe
                                src={playbackData.signedIframe}
                                className="absolute inset-0 w-full h-full border-0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                loading="lazy"
                                title="SkillDad Live Stream"
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="p-6 bg-primary/10 rounded-full">
                                <Radio size={64} className="text-primary animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-black text-white">Connecting to Feed...</h2>
                            <p className="text-white/40 max-w-sm">The session source is being initialized. This usually takes a few seconds once the instructor goes live.</p>
                        </div>
                    )}

                    {/* Desktop Toolbar - Submerged */}
                    <div className="px-6 py-4 bg-gradient-to-t from-black to-transparent flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                                    <Video size={18} />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Streaming from</p>
                                    <p className="text-xs font-bold text-white truncate">{session?.instructor?.name || 'Scholar Foundation'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><Volume2 size={16} /></button>
                            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><Settings size={16} /></button>
                            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><Maximize2 size={16} /></button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Chat */}
                <div className="w-full lg:w-[380px] flex flex-col bg-[#050514] lg:bg-[#020210] min-h-0">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
                            <MessageSquare size={14} /> Live Interaction
                        </h2>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {chat.map((msg, i) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className="flex items-center gap-2 mb-1.5 px-0.5">
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${msg.user === 'You' ? 'text-primary' : msg.user === 'System' ? 'text-amber-500' : 'text-emerald-400'}`}>
                                            {msg.user}
                                        </span>
                                        <span className="text-[9px] text-white/20 font-bold">{msg.time}</span>
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${msg.user === 'You'
                                            ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10'
                                            : msg.user === 'System'
                                                ? 'bg-amber-500/10 text-amber-200 border border-amber-500/10 italic'
                                                : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                                        }`}>
                                        {msg.message}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/5">
                        <div className="relative group">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Say something nice..."
                                className="w-full bg-[#0a0a1f] border border-white/10 rounded-2xl px-5 py-3 pr-12 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WatchStream;
