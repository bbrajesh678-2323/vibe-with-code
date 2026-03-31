import { useEffect, useRef, useState } from 'react';

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: { x: 15, y: 5 },
    score: 0,
    gameOver: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTick = performance.now();
    const TICK_RATE = 100; // ms per frame

    const handleKeyDown = (e: KeyboardEvent) => {
      const { dir } = gameState.current;
      switch (e.key) {
        case 'ArrowUp': case 'w':
          if (dir.y === 0) gameState.current.nextDir = { x: 0, y: -1 };
          e.preventDefault(); break;
        case 'ArrowDown': case 's':
          if (dir.y === 0) gameState.current.nextDir = { x: 0, y: 1 };
          e.preventDefault(); break;
        case 'ArrowLeft': case 'a':
          if (dir.x === 0) gameState.current.nextDir = { x: -1, y: 0 };
          e.preventDefault(); break;
        case 'ArrowRight': case 'd':
          if (dir.x === 0) gameState.current.nextDir = { x: 1, y: 0 };
          e.preventDefault(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const loop = (time: number) => {
      animationFrameId = requestAnimationFrame(loop);
      if (time - lastTick < TICK_RATE) return;
      lastTick = time;

      if (gameState.current.gameOver) return;

      const state = gameState.current;
      state.dir = state.nextDir;

      const head = state.snake[0];
      const newHead = { x: head.x + state.dir.x, y: head.y + state.dir.y };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= 20 || newHead.y < 0 || newHead.y >= 20) {
        state.gameOver = true;
        setGameOver(true);
        return;
      }

      // Self collision
      if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        state.gameOver = true;
        setGameOver(true);
        return;
      }

      state.snake.unshift(newHead);

      // Food collision
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        state.score += 10;
        setScore(state.score);
        
        let newFood = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        while(state.snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
           newFood = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        }
        state.food = newFood;
      } else {
        state.snake.pop();
      }

      // Draw Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 400, 400);

      // Draw Grid (Scanline aesthetic)
      ctx.strokeStyle = '#003333';
      ctx.lineWidth = 1;
      for(let i=0; i<20; i++) {
        ctx.beginPath(); ctx.moveTo(i*20, 0); ctx.lineTo(i*20, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i*20); ctx.lineTo(400, i*20); ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#f0f'; // Magenta
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f0f';
      ctx.fillRect(state.food.x * 20, state.food.y * 20, 20, 20);

      // Draw Snake
      ctx.fillStyle = '#0ff'; // Cyan
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ff';
      state.snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#fff'; // Head is white
        } else {
            ctx.fillStyle = '#0ff';
        }
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
      });
      ctx.shadowBlur = 0; // reset
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const resetGame = () => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      dir: { x: 0, y: -1 },
      nextDir: { x: 0, y: -1 },
      food: { x: 15, y: 5 },
      score: 0,
      gameOver: false
    };
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-[400px] text-[#0ff] font-bold text-2xl uppercase tracking-widest">
        <span>SCORE: {score.toString().padStart(4, '0')}</span>
        <span>STATUS: {gameOver ? <span className="text-[#f0f] animate-pulse">FATAL_ERR</span> : 'ACTIVE'}</span>
      </div>
      <div className="relative border-2 border-[#0ff] p-1 bg-black shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-[#050505] block"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-20">
            <h2 className="text-5xl text-[#f0f] glitch-text mb-6" data-text="SYSTEM FAILURE">SYSTEM FAILURE</h2>
            <button
              onClick={resetGame}
              className="px-8 py-3 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors uppercase tracking-widest text-xl font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)]"
            >
              REBOOT_SEQUENCE
            </button>
          </div>
        )}
      </div>
      <div className="text-[#0ff]/70 text-lg tracking-widest">
        [ USE W A S D OR ARROWS TO INTERFACE ]
      </div>
    </div>
  );
}
