import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioController() {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isBlowing, setIsBlowing] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Auto-start listening when component mounts
  useEffect(() => {
    const startListening = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateAudioLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            const normalizedLevel = average / 255;
            
            setAudioLevel(normalizedLevel);
            
            // Detect blowing (sudden increase in audio level)
            if (normalizedLevel > 0.15) {
              setIsBlowing(true);
              setTimeout(() => setIsBlowing(false), 1000);
            }
          }
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };

        updateAudioLevel();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    startListening();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      analyserRef.current = null;
      setAudioLevel(0);
      setIsBlowing(false);
    };
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          const normalizedLevel = average / 255;
          
          setAudioLevel(normalizedLevel);
          
          // Detect blowing (sudden increase in audio level)
          if (normalizedLevel > 0.15) {
            setIsBlowing(true);
            setTimeout(() => setIsBlowing(false), 1000);
          }
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
    setIsBlowing(false);
  }, []);

  return {
    audioLevel,
    isBlowing,
  };
}