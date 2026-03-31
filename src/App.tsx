/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#0ff] font-mono crt-flicker relative overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="scanlines"></div>

      <header className="absolute top-8 left-8 z-10">
        <h1 className="text-5xl font-bold glitch-text uppercase tracking-tighter" data-text="NEURO_SNAKE_OS">NEURO_SNAKE_OS</h1>
        <p className="text-[#f0f] text-lg tracking-widest mt-2">v2.0.4 // SYSTEM_ONLINE</p>
      </header>

      <main className="relative z-10 flex flex-col xl:flex-row items-center justify-center gap-16 w-full max-w-7xl mt-32 xl:mt-0">
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>

        <div className="xl:absolute xl:bottom-12 xl:right-12 z-10 w-full max-w-md">
          <MusicPlayer />
        </div>
      </main>

      <div className="absolute bottom-6 left-6 text-sm text-[#0ff]/50 tracking-widest z-10">
        WARNING: UNAUTHORIZED ORGANIC INPUT DETECTED.
      </div>
    </div>
  );
}
