import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Users, Target, Calendar, Headphones, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
// import ComingSoonModal from '@/components/coming-soon-modal';

interface VideoDemo {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  icon: any;
  color: string;
}

interface VideoDemoSectionProps {
  className?: string;
}

const videoDemos: VideoDemo[] = [
  {
    id: 'customerSupport',
    videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1760687367/Customer_Support_htcufl.mp4',
    thumbnailUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/so_0/v1760687367/Customer_Support_htcufl.jpg',
    icon: Headphones,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'appointmentBooking',
    videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1760687400/03_-_Appointment_Booking_Demo_x68sqr.mp4',
    thumbnailUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/so_0/v1760687400/03_-_Appointment_Booking_Demo_x68sqr.jpg',
    icon: Calendar,
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'salesGeneration',
    videoUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/v1760687515/02_-_Lead_Qualification_nmfyez.mp4',
    thumbnailUrl: 'https://res.cloudinary.com/domnocrwi/video/upload/so_0/v1760687515/02_-_Lead_Qualification_nmfyez.jpg',
    icon: Target,
    color: 'from-purple-500 to-blue-500'
  }
];

export default function VideoDemoSection({ className = "" }: VideoDemoSectionProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVideoPlay = (videoId: string) => {
    // Stop any currently playing video
    if (playingVideoId && playingVideoId !== videoId) {
      const currentVideo = videoRefs.current[playingVideoId];
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      }
    }

    // Play the selected video
    const video = videoRefs.current[videoId];
    if (video) {
      if (playingVideoId === videoId) {
        // If same video, toggle play/pause
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      } else {
        // If different video, play it
        video.muted = isMuted;
        video.play();
        setPlayingVideoId(videoId);
      }
    }
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Update all videos with new mute state
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = newMutedState;
      }
    });
  };

  const handleStartFreeTrial = () => {
    // Show coming soon modal
    setShowComingSoonModal(true);
  };

  const handleScheduleDemo = () => {
    // Open calendar booking in new tab
    window.open('https://calendly.com/your-company/demo', '_blank');
  };

  const handleVideoEnd = (videoId: string) => {
    setPlayingVideoId(null);
  };

  const stopAllVideos = () => {
    if (playingVideoId) {
      const currentVideo = videoRefs.current[playingVideoId];
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      }
      setPlayingVideoId(null);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      stopAllVideos();
    }
  };

  useEffect(() => {
    if (playingVideoId) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [playingVideoId]);

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {/* Audio Controls */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-slate-600/30">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isMuted ? t('home.demo.videoDemo.audioOff') : t('home.demo.videoDemo.audioOn')}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 hover:bg-white/30 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
              onClick={handleMuteToggle}
            >
              {isMuted ? t('home.demo.videoDemo.enableAudio') : t('home.demo.videoDemo.disableAudio')}
            </Button>
          </div>
        </div>
      </div>

      {/* Video Demo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {videoDemos.map((demo, index) => {
          const Icon = demo.icon;
          const isPlaying = playingVideoId === demo.id;
          
          return (
            <Card 
              key={demo.id}
              className={`group cursor-pointer demo-card-hover overflow-hidden relative ${
                isPlaying 
                  ? 'ring-2 ring-blue-500 demo-card-selected' 
                  : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleVideoPlay(demo.id);
              }}
            >
              {/* Animated Background Glow */}
              {isPlaying && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>
              )}
              
              {/* Video Player - Full Card */}
              <div className={`relative bg-black overflow-hidden ${isPlaying ? 'h-full' : 'aspect-video'}`}>
                <video
                  ref={(el) => {
                    videoRefs.current[demo.id] = el;
                  }}
                  className={`w-full ${isPlaying ? 'h-full object-cover' : 'h-full object-contain'}`}
                  poster={demo.thumbnailUrl}
                  preload="metadata"
                  onEnded={() => handleVideoEnd(demo.id)}
                  onClick={(e) => e.stopPropagation()}
                  muted={isMuted}
                >
                  <source src={demo.videoUrl} type="video/mp4" />
                  {t('common.browserNotSupported')}
                </video>
                
                {/* Gradient Overlay - only when not playing */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                )}
                
                {/* Play Button Overlay - only when not playing */}
                {!isPlaying && (
                  <div className="play-button-overlay absolute inset-0 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-white via-white to-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                        <Play className="w-8 h-8 text-slate-700 ml-0.5" />
                      </div>
                      {/* Animated Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping"></div>
                    </div>
                  </div>
                )}
                
                {/* Duration Badge - only when not playing */}
                {!isPlaying && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-black/80 to-black/60 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {t(`home.demo.categories.${demo.id}.duration`)}
                  </div>
                )}
                
                {/* Industry Badge - only when not playing */}
                {!isPlaying && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-white/95 to-white/85 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/30">
                    {t(`home.demo.categories.${demo.id}.industry`)}
                  </div>
                )}
                
                {/* Playing Indicator - only when playing */}
                {isPlaying && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                    {t('home.demo.videoDemo.playing')}
                  </div>
                )}
              </div>
              
              {/* Card Content - Hidden when playing */}
              {!isPlaying && (
                <>
                  <CardHeader className="pb-3 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="relative">
                        <div className={`w-12 h-12 bg-gradient-to-r ${demo.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <Zap className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors duration-300 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      {t(`home.demo.categories.${demo.id}.title`)}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                      {t(`home.demo.categories.${demo.id}.description`)}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {(t(`home.demo.categories.${demo.id}.features`, { returnObjects: true }) as string[]).map((feature: string, featureIndex: number) => (
                        <div key={featureIndex} className="flex items-center text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full transition-all duration-300 relative overflow-hidden group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoPlay(demo.id);
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <Play className="mr-2 w-4 h-4" />
                        {t('home.demo.videoDemo.watchDemo')}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </CardContent>
                </>
              )}
              
              {/* Minimal controls when playing */}
              {isPlaying && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t(`home.demo.categories.${demo.id}.title`)}</p>
                      <p className="text-white/70 text-xs">{t(`home.demo.categories.${demo.id}.industry`)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMuteToggle();
                      }}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoPlay(demo.id);
                      }}
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      {t('home.demo.videoDemo.pause')}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8 sm:mt-12 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-600/5 rounded-3xl blur-2xl"></div>
        
        <div className="relative bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-700/60 dark:to-slate-600/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 dark:border-slate-600/20">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
              {t('home.demo.videoDemo.readyToTransform')}
            </h3>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
            {t('home.demo.videoDemo.readyToExperience')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg mx-auto">
            <Button 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
              onClick={handleStartFreeTrial}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Play className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                {t('home.demo.videoDemo.startFreeTrial')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            <Button 
              variant="outline" 
              className="px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 relative overflow-hidden"
              onClick={handleScheduleDemo}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Calendar className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                {t('home.demo.videoDemo.scheduleLiveDemo')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>{t('home.demo.videoDemo.freeTrial')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span>{t('home.demo.videoDemo.noCreditCard')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              <span>{t('home.demo.videoDemo.support247')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal
      {showComingSoonModal && (
        <ComingSoonModal 
          isOpen={showComingSoonModal}
          onClose={() => setShowComingSoonModal(false)}
        />
      )} */}
    </div>
  );
}
