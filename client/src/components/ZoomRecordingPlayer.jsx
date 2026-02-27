import { useEffect, useRef, useState } from 'react';
import { Play, AlertCircle } from 'lucide-react';

/**
 * ZoomRecordingPlayer Component
 * Plays Zoom cloud recordings in an embedded player
 * 
 * @param {string} recordingUrl - Zoom recording play URL
 * @param {string} title - Video title
 * @param {function} onEnded - Callback when video ends
 * @param {function} onError - Callback when error occurs
 */
const ZoomRecordingPlayer = ({ recordingUrl, title, onEnded, onError }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!recordingUrl) {
      setError('No recording URL provided');
      setLoading(false);
      return;
    }

    // Zoom recordings are typically served as direct video URLs
    // We can use a standard HTML5 video player
    setLoading(false);
  }, [recordingUrl]);

  const handleVideoError = (e) => {
    console.error('[Zoom Recording] Error loading video:', e);
    const errorMessage = 'Failed to load recording. The recording may not be available yet.';
    setError(errorMessage);
    setLoading(false);
    
    if (onError) {
      onError(errorMessage);
    }
  };

  const handleVideoEnded = () => {
    console.log('[Zoom Recording] Video ended');
    if (onEnded) {
      onEnded();
    }
  };

  if (error) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-black/40 border border-red-500/30 rounded-lg">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Recording Unavailable</h3>
          <p className="text-white/60 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-black/40 border border-primary/30 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="text-white/60 text-sm">Loading recording...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={playerRef}
        className="w-full h-full"
        controls
        controlsList="nodownload"
        onError={handleVideoError}
        onEnded={handleVideoEnded}
        poster={`https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=${encodeURIComponent(title || 'Zoom Recording')}`}
      >
        <source src={recordingUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Custom overlay for additional controls if needed */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white text-xs font-medium">Zoom Recording</span>
        </div>
      </div>
    </div>
  );
};

export default ZoomRecordingPlayer;
