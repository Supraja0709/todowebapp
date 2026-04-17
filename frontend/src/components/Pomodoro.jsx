import { useState, useEffect, useRef, useCallback } from 'react';
import { IoPlay, IoPause, IoRefresh, IoCafeOutline, IoFlashOutline } from 'react-icons/io5';

function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break
  const timerRef = useRef(null);

  const handleModeSwitch = useCallback(() => {
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    const nextTime = nextMode === 'focus' ? 25 : 5;
    setMode(nextMode);
    setMinutes(nextTime);
    setSeconds(0);
    setIsActive(false);
    
    // Play a notification sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio error:', e));
  }, [mode]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(timerRef.current);
          handleModeSwitch();
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="pomodoro-card">
      <div className="mode-toggle">
        <button 
          className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => { setMode('focus'); setMinutes(25); setSeconds(0); setIsActive(false); }}
        >
          <IoFlashOutline /> Focus
        </button>
        <button 
          className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
          onClick={() => { setMode('break'); setMinutes(5); setSeconds(0); setIsActive(false); }}
        >
          <IoCafeOutline /> Break
        </button>
      </div>

      <div className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="timer-controls">
        <button className="control-btn play-pause" onClick={toggleTimer}>
          {isActive ? <IoPause size={32} /> : <IoPlay size={32} />}
        </button>
        <button className="control-btn reset" onClick={resetTimer}>
          <IoRefresh size={24} />
        </button>
      </div>

      <div className="timer-footer">
        <p>{mode === 'focus' ? "Time to focus!" : "Take a short break"}</p>
      </div>
    </div>
  );
}

export default Pomodoro;
