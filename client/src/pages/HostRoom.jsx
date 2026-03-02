import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ZoomMeeting from '../components/ZoomMeeting';
import axios from 'axios';

const HostRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const token = searchParams.get('token');
                if (!token) {
                    setError('No authentication token provided');
                    setLoading(false);
                    return;
                }

                // Use the token from URL for authentication
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const { data } = await axios.get(`/api/sessions/${id}`, config);
                setSession(data);
            } catch (err) {
                console.error('Error fetching session:', err);
                setError(err.response?.data?.message || 'Failed to load session');
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [id, searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Loading session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Unable to Load Session</h2>
                    <p className="text-white/60 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/60">Session not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-white mb-2">{session.topic}</h1>
                    <p className="text-white/60 text-sm">Host Room - {session.status}</p>
                </div>

                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                    <ZoomMeeting
                        sessionId={id}
                        isHost={true}
                        token={searchParams.get('token')}
                        onLeave={() => navigate('/dashboard')}
                        onError={(error) => {
                            console.error('Zoom meeting error:', error);
                            setError(error);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default HostRoom;
