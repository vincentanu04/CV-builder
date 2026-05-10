import { useEffect, useState } from 'react';
import { IconCheck, IconX, IconLoader2, IconPoint } from '@tabler/icons-react';

interface AutosaveIndicatorProps {
  state: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedTime: Date | null;
}

const AutosaveIndicator = ({ state, lastSavedTime }: AutosaveIndicatorProps) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    if (!lastSavedTime) {
      setTimeString('');
      return;
    }

    const updateTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastSavedTime.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);

      if (diffSecs < 60) {
        setTimeString('now');
      } else if (diffMins < 60) {
        setTimeString(`${diffMins}m ago`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        setTimeString(`${diffHours}h ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [lastSavedTime]);

  const getStatusColor = () => {
    switch (state) {
      case 'saving': return 'text-yellow-500';
      case 'saved':  return 'text-green-500';
      case 'error':  return 'text-red-500';
      default:       return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (state) {
      case 'saving': return <IconLoader2 size={14} className="autosave-spin" />;
      case 'saved':  return <IconCheck size={14} />;
      case 'error':  return <IconX size={14} />;
      default:       return <IconPoint size={14} />;
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'saving': return 'Saving…';
      case 'saved':  return `Saved ${timeString}`;
      case 'error':  return 'Save failed';
      default:       return 'Waiting…';
    }
  };

  return (
    <div className={`autosave-indicator ${getStatusColor()}`}>
      <span className='autosave-icon'>{getStatusIcon()}</span>
      <span className='autosave-text'>{getStatusText()}</span>
    </div>
  );
};

export default AutosaveIndicator;

