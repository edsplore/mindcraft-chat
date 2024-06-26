import { useRef } from 'react';
import { parseTextParts } from 'librechat-data-provider';
import type { TMessage } from 'librechat-data-provider';
import useTextToSpeechExternal from './useTextToSpeechExternal';
import { usePauseGlobalAudio } from '../Audio';

const useTextToSpeech = (message: TMessage, isLast: boolean, index = 0) => {
  const {
    generateSpeechExternal,
    cancelSpeech,
    isSpeaking,
    isLoading,
    audioRef,
  } = useTextToSpeechExternal(message.messageId, isLast, index);
  const { pauseGlobalAudio } = usePauseGlobalAudio(index);

  const isMouseDownRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  const handleMouseDown = () => {
    isMouseDownRef.current = true;
    timerRef.current = window.setTimeout(() => {
      if (isMouseDownRef.current) {
        const messageContent = message?.content ?? message?.text ?? '';
        const parsedMessage =
          typeof messageContent === 'string' ? messageContent : parseTextParts(messageContent);
        generateSpeechExternal(parsedMessage, false);
      }
    }, 1000);
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      console.log('canceling message audio speech');
      cancelSpeech();
      pauseGlobalAudio();
    } else {
      const messageContent = message?.content ?? message?.text ?? '';
      const parsedMessage =
        typeof messageContent === 'string' ? messageContent : parseTextParts(messageContent);
      generateSpeechExternal(parsedMessage, false);
    }
  };

  return {
    handleMouseDown,
    handleMouseUp,
    toggleSpeech,
    isSpeaking,
    isLoading,
    audioRef,
  };
};

export default useTextToSpeech;