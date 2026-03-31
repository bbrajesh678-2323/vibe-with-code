import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'SYS.OP.AUDIO_01 // NEURAL_DRIFT', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'SYS.OP.AUDIO_02 // VOID_WALKER', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'SYS.OP.AUDIO_03 // CYBER_PULSE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn("AUDIO_SUBSYSTEM_ERR: USER_INTERACTION_REQUIRED", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="border-2 border-[#f0f] bg-black/80 p-6 w-full max-w-md relative overflow-hidden group shadow-[0_0_20px_rgba(255,0,255,0.2)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f]/20">
        <div className="h-full bg-[#f0f] w-1/3 animate-[slide_2s_ease-in-out_infinite_alternate]"></div>
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        onEnded={nextTrack}
      />

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-[#f0f] text-sm tracking-widest uppercase mb-1">AUDIO_SUBSYSTEM</h3>
            <div className="text-[#0ff] text-xl font-bold tracking-wider glitch-text-subtle truncate max-w-[250px]">
              {TRACKS[currentTrackIndex].title}
            </div>
          </div>
          <div className="text-sm text-[#f0f] animate-pulse font-bold">
            {isPlaying ? 'PLAYING' : 'STANDBY'}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#f0f]/30 pt-4">
          <div className="flex gap-6">
            <button onClick={prevTrack} className="text-[#0ff] hover:text-[#f0f] transition-colors drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
              <SkipBack size={28} />
            </button>
            <button onClick={togglePlay} className="text-[#0ff] hover:text-[#f0f] transition-colors drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button onClick={nextTrack} className="text-[#0ff] hover:text-[#f0f] transition-colors drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
              <SkipForward size={28} />
            </button>
          </div>

          <button onClick={toggleMute} className="text-[#0ff]/70 hover:text-[#f0f] transition-colors">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}
