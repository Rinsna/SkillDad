import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Radio, Copy, CheckCircle2, Play, Square, AlertCircle,
    Wifi, Monitor, Clapperboard, Clock, ExternalLink,
    ChevronRight, RefreshCw, ShieldCheck
} from 'lucide-react';

const API = (path) => `${import.meta.env.VITE_API_URL || ''}/api/sessions${path}`;
const authHeader = () => {
    const rawInfo = localStorage.getItem('userInfo');
    if (rawInfo) {
        const userInfo = JSON.parse(rawInfo);
        return { Authorization: `Bearer ${userInfo.token}` };
    }
    // Fallback to the host token in URL if user is not logged in explicitly
    const urlParams = new URLSearchParams(window.location.search);
    const hostToken = urlParams.get('token');
    if (hostToken) return { Authorization: `Bearer ${hostToken}` };
    return {};
};

/* ── small util ── */
const CopyField = ({ label, value, mono = true }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</p>
            <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border border-white/10 rounded-xl group">
                <span className={`flex-1 text-sm truncate ${mono ? 'font-mono text-emerald-400' : 'text-white'}`}>
                    {value || <span className="text-white/20 italic">not available</span>}
                </span>
                {value && (
                    <button onClick={copy} className="text-white/30 hover:text-white transition-colors shrink-0">
                        {copied ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                    </button>
                )}
            </div>
        </div>
    );
};

/* ── Step badge ── */
const Step = ({ n, title, children }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm font-black flex items-center justify-center shrink-0">
                {n}
            </div>
            <div className="flex-1 w-px bg-white/5 mt-2" />
        </div>
        <div className="pb-6 flex-1 min-w-0">
            <p className="font-semibold text-white mb-2">{title}</p>
            <div className="text-sm text-white/50 leading-relaxed">{children}</div>
        </div>
    </div>
);

/* ── Main ── */
/**
 * DEPRECATED: This component was designed for Bunny.net RTMP/HLS streaming.
 * The platform has migrated to Zoom for live sessions.
 * This component is kept for backward compatibility with legacy sessions only.
 * New sessions should use the Zoom SDK integration instead.
 */
const HostRoom = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const hostToken = searchParams.get('token');
    const [info, setInfo] = useState(null);   // decoded JWT payload
    const [status, setStatus] = useState(null);   // live | scheduled | ended
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [timeLeft, setTimeLeft] = useState('');

    /* ── Decode host token ── */
    useEffect(() => {
        if (!hostToken) { setError('No host token found in URL.'); return; }
        try {
            const decoded = jwtDecode(hostToken);
            if (decoded.purpose !== 'host_session') throw new Error('Invalid token purpose');
            setInfo(decoded);

            // countdown to expiry
            const tick = () => {
                const secs = decoded.exp - Math.floor(Date.now() / 1000);
                if (secs <= 0) { setTimeLeft('Expired'); return; }
                const h = Math.floor(secs / 3600);
                const m = Math.floor((secs % 3600) / 60);
                const s = secs % 60;
                setTimeLeft(`${h}h ${m}m ${s}s`);
            };
            tick();
            const t = setInterval(tick, 1000);
            return () => clearInterval(t);
        } catch {
            setError('Invalid or expired host link. Please request a new one.');
        }
    }, [hostToken]);

    /* ── Poll live status from API (needs auth token) ── */
    useEffect(() => {
        if (!id) return;
        const fetchStatus = async () => {
            try {
                const { data } = await axios.get(API(`/${id}/status`), { headers: authHeader() });
                setStatus(data.status);
            } catch { /* ignore */ }
        };
        fetchStatus();
        const t = setInterval(fetchStatus, 30000);
        return () => clearInterval(t);
    }, [id]);

    /* ── Actions ── */
    const handleStart = async () => {
        setLoading(true);
        try {
            await axios.put(API(`/${id}/start`), {}, { headers: authHeader() });
            setStatus('live');
            setToast('🔴 Session is now LIVE!');
        } catch (e) {
            setToast('❌ ' + (e.response?.data?.message || 'Error going live'));
        } finally { setLoading(false); }
    };

    const handleEnd = async () => {
        if (!window.confirm('End the session? Recording will start processing.')) return;
        setLoading(true);
        try {
            await axios.put(API(`/${id}/end`), {}, { headers: authHeader() });
            setStatus('ended');
            setToast('✅ Session ended. Recording will be ready shortly.');
        } catch (e) {
            setToast('❌ ' + (e.response?.data?.message || 'Error ending session'));
        } finally { setLoading(false); }
    };

    /* ── Toast auto-clear ── */
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(''), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    /* ── OBS steps ── */
    const obsSteps = info ? [
        {
            n: 1, title: 'Open OBS Studio', body: (
                <>Download from <a href="https://obsproject.com" target="_blank" rel="noreferrer" className="text-primary underline">obsproject.com</a> if not installed.</>
            )
        },
        {
            n: 2, title: 'Go to Settings → Stream', body: 'Set Service to "Custom…".'
        },
        {
            n: 3, title: 'Paste the RTMP Server URL', body: (
                <code className="text-emerald-400 text-xs font-mono break-all">{info.rtmpEndpoint || '(not available — legacy streaming no longer supported)'}</code>
            )
        },
        {
            n: 4, title: 'Paste the Stream Key', body: (
                <code className="text-emerald-400 text-xs font-mono break-all">{info.streamKey || '(legacy streaming no longer supported)'}</code>
            )
        },
        {
            n: 5, title: 'Click "Start Streaming" in OBS', body: 'Legacy RTMP streaming is no longer supported. Please use Zoom for new sessions.'
        },
        {
            n: 6, title: 'Click "Go Live" below', body: 'This updates the session status so students can join.'
        },
    ] : [];

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050514] px-4">
            <div className="text-center space-y-4 max-w-md">
                <AlertCircle size={48} className="text-red-400 mx-auto" />
                <h1 className="text-xl font-bold text-white">Host Link Error</h1>
                <p className="text-white/50">{error}</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                    Go Back
                </button>
            </div>
        </div>
    );

    if (!info) return (
        <div className="min-h-screen flex items-center justify-center bg-[#050514]">
            <RefreshCw size={24} className="animate-spin text-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050514] text-white px-4 py-8">
            {/* background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Clapperboard size={20} className="text-red-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-red-400">Host Room</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{info.topic}</h1>
                    </div>

                    {/* Status + Expiry */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {status && (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${status === 'live' ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                                status === 'scheduled' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' :
                                    'bg-white/5 border-white/10 text-white/40'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status === 'live' ? 'bg-red-400 animate-pulse' : 'bg-current'}`} />
                                {status.toUpperCase()}
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-white/30">
                            <Clock size={11} />
                            <span>Link expires in <strong className="text-white/50">{timeLeft}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-emerald-400/60">
                            <ShieldCheck size={11} />
                            <span>JWT-signed · 4h TTL</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left — Stream credentials */}
                    <div className="space-y-4">
                        <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                            <h2 className="font-bold text-white flex items-center gap-2">
                                <Wifi size={16} className="text-primary" /> Stream Credentials
                            </h2>
                            <CopyField label="RTMP Server URL" value={info.rtmpEndpoint} />
                            <CopyField label="Stream Key (keep secret!)" value={info.streamKey} />
                            <CopyField label="HLS Playback URL" value={info.hlsUrl} />
                            <CopyField label="Session ID" value={info.sessionId} />
                        </div>

                        {/* Control buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleStart}
                                disabled={loading || status !== 'scheduled'}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
                                Go Live
                            </button>
                            <button
                                onClick={handleEnd}
                                disabled={loading || status !== 'live'}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-sm hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? <RefreshCw size={15} className="animate-spin" /> : <Square size={15} />}
                                End Session
                            </button>
                        </div>

                        {/* Status ended callout */}
                        {status === 'ended' && (
                            <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                Session ended. Recording processing is no longer supported for legacy sessions.
                            </div>
                        )}

                        {/* Monitor button */}
                        <button
                            onClick={() => navigate(`/university/dashboard`)}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/50 text-sm hover:bg-white/5 transition-colors"
                        >
                            <Monitor size={15} /> Back to Dashboard
                        </button>
                    </div>

                    {/* Right — OBS Setup Steps */}
                    <div className="px-4 py-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <h2 className="font-bold text-white flex items-center gap-2 mb-5">
                            <Radio size={16} className="text-purple-400" /> OBS Setup Guide
                        </h2>
                        <div className="space-y-0">
                            {obsSteps.map(({ n, title, body }) => (
                                <Step key={n} n={n} title={title}>{body}</Step>
                            ))}
                        </div>

                        <div className="mt-4 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-300 flex gap-2 items-start">
                            <ShieldCheck size={13} className="mt-0.5 shrink-0" />
                            <span>Your stream key is embedded in this page only. It never appears in URLs, chat, or shared embeds. Don't screen-share this page.</span>
                        </div>
                    </div>
                </div>

                {/* iframe preview (if live) */}
                {info.hlsUrl && status === 'live' && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black relative" style={{ paddingBottom: '40%' }}>
                        <div className="absolute inset-0 flex items-center justify-center text-white/30 gap-2 text-sm">
                            <ExternalLink size={16} /> Preview available via HLS player (paste HLS URL into VLC or hls.js)
                        </div>
                    </div>
                )}
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 80 }}
                        className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-[#0d0d1f] border border-white/10 rounded-xl text-sm text-white shadow-2xl"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HostRoom;
