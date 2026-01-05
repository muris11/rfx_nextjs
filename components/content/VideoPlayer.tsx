"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Loader2,
  PictureInPicture2,
  Gauge
} from "lucide-react";
import { useUserStore } from "@/lib/stores/userStore";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  dramaId?: string;
  episode?: number;
  type?: "drama" | "anime" | "shorts";
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function VideoPlayer({
  src,
  poster,
  title,
  dramaId,
  episode,
  type = "drama",
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const addToHistory = useUserStore((state) => state.addToHistory);
  const updateProgress = useUserStore((state) => state.updateProgress);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const adjustVolume = useCallback((delta: number) => {
    setVolume(prev => {
      const newVolume = Math.max(0, Math.min(1, prev + delta));
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
      }
      return newVolume;
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, [isFullscreen]);

  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      if (isPiP) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
      setIsPiP(!isPiP);
    } catch (err) {
      console.error("PiP error:", err);
    }
  }, [isPiP]);

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  }, []);

  useEffect(() => {
    if (dramaId && title) {
      addToHistory({
        id: dramaId,
        title,
        poster: poster || "",
        type,
        episodeId: episode?.toString(),
        episodeTitle: episode ? `Episode ${episode}` : undefined,
        progress: 0,
        duration: 0,
      });
    }
  }, [dramaId, title, poster, type, episode, addToHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && dramaId && duration > 0) {
        const currentProgress = videoRef.current.currentTime;
        updateProgress(dramaId, episode?.toString(), currentProgress, duration);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [dramaId, episode, duration, updateProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (hasNext && onNext) onNext();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasNext, onNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          skip(-10);
          break;
        case "arrowright":
          e.preventDefault();
          skip(10);
          break;
        case "arrowup":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case "p":
          if (e.shiftKey) {
            e.preventDefault();
            togglePiP();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, skip, adjustVolume, togglePiP]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-12 h-12 text-[#E50914] animate-spin" />
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {title && (
          <div className="absolute top-0 left-0 right-0 p-4">
            <h3 className="text-white font-medium truncate">{title}</h3>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-8">
          {hasPrevious && (
            <button
              onClick={onPrevious}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
          )}
          
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#E50914] flex items-center justify-center text-white hover:bg-[#b8070f] transition-colors shadow-lg shadow-[#E50914]/30"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {hasNext && (
            <button
              onClick={onNext}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div
            onClick={handleProgressClick}
            className="h-1.5 bg-white/30 rounded-full cursor-pointer group/progress hover:h-2 transition-all"
          >
            <div
              className="h-full bg-[#E50914] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-white hover:text-[#E50914] transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button onClick={() => skip(-10)} className="text-white hover:text-[#E50914] transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>

              <button onClick={() => skip(10)} className="text-white hover:text-[#E50914] transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="text-white hover:text-[#E50914] transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/volume:w-20 transition-all duration-200 accent-[#E50914]"
                />
              </div>

              <span className="text-sm text-white tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="text-white hover:text-[#E50914] transition-colors flex items-center gap-1"
                >
                  <Gauge className="w-5 h-5" />
                  <span className="text-xs">{playbackSpeed}x</span>
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-[#1A1A1A] rounded-lg overflow-hidden shadow-xl border border-white/10">
                    {PLAYBACK_SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                          playbackSpeed === speed ? "text-[#E50914]" : "text-white"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={togglePiP} className="text-white hover:text-[#E50914] transition-colors">
                <PictureInPicture2 className="w-5 h-5" />
              </button>

              <button onClick={toggleFullscreen} className="text-white hover:text-[#E50914] transition-colors">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
