import { useState, useCallback, useMemo } from 'react';
import { FrequencyCard, FrequencyComponent, DataPoint, InverseFourierResult } from '../types/inverse-fourier';
import { drawRandomFrequencyCard } from '../data/frequency-cards';

export const useInverseFourierGame = () => {
  const [spectrum, setSpectrum] = useState<Map<string, FrequencyComponent>>(new Map());
  const [hand, setHand] = useState<FrequencyCard[]>([]);

  // Draw a frequency card
  const drawCard = useCallback(() => {
    if (hand.length < 7) {
      const newCard = drawRandomFrequencyCard();
      setHand(prev => [...prev, newCard]);
    }
  }, [hand.length]);

  // Play a frequency card (add to spectrum)
  const playCard = useCallback((card: FrequencyCard) => {
    const key = `${card.frequency.toFixed(1)}Hz`;
    
    setSpectrum(prev => {
      const newSpectrum = new Map(prev);
      const existing = newSpectrum.get(key);
      
      if (existing) {
        // Add to existing frequency component
        newSpectrum.set(key, {
          ...existing,
          amplitude: existing.amplitude + (card.amplitude * 0.5), // Reduce stacking effect
          count: existing.count + 1
        });
      } else {
        // Add new frequency component
        newSpectrum.set(key, {
          frequency: card.frequency,
          amplitude: card.amplitude,
          phase: card.phase,
          count: 1
        });
      }
      
      return newSpectrum;
    });

    // Remove card from hand
    setHand(prev => prev.filter(c => c.id !== card.id));
  }, []);

  // Reset spectrum
  const resetSpectrum = useCallback(() => {
    setSpectrum(new Map());
  }, []);

  // Calculate frequency domain visualization
  const calculateFrequencyDomain = useCallback((): DataPoint[] => {
    const maxFreq = 12;
    const frequencies = Array.from({ length: 200 }, (_, i) => i * maxFreq / 200);
    
    return frequencies.map(freq => {
      let amplitude = 0;
      
      spectrum.forEach((component) => {
        // Check if frequency is close to a component
        if (Math.abs(freq - component.frequency) < 0.1) {
          amplitude += component.amplitude;
        }
        
        // Add some spectral spreading for visualization
        const distance = Math.abs(freq - component.frequency);
        if (distance < 0.5) {
          const spreading = Math.exp(-distance * distance * 10) * component.amplitude * 0.3;
          amplitude += spreading;
        }
      });
      
      return { x: freq, y: Math.max(0, amplitude) };
    });
  }, [spectrum]);

  // Calculate inverse Fourier transform (frequency → time)
  const calculateTimeDomain = useCallback((): DataPoint[] => {
    const timePoints = 500;
    const timeRange = 10; // -5 to +5 seconds
    const times = Array.from({ length: timePoints }, (_, i) => (i - timePoints/2) * timeRange / timePoints);
    
    return times.map(t => {
      let signal = 0;
      
      spectrum.forEach((component) => {
        const freq = component.frequency;
        const amp = component.amplitude;
        const phase = component.phase;
        
        if (freq === 0) {
          // DC component
          signal += amp;
        } else {
          // AC component: cos(2πft + φ)
          signal += amp * Math.cos(2 * Math.PI * freq * t + phase);
        }
        
        // Handle special component types
        if (component.frequency === 0 && spectrum.has('noise')) {
          // Add some noise if white noise card is played
          signal += (Math.random() - 0.5) * 0.1;
        }
      });
      
      return { x: t, y: signal };
    });
  }, [spectrum]);

  // Inverse Fourier transform result
  const inverseFourierResult: InverseFourierResult = useMemo(() => {
    const frequencyDomain = calculateFrequencyDomain();
    const timeDomain = calculateTimeDomain();
    
    return {
      frequencyDomain,
      timeDomain,
      frequencies: Array.from(spectrum.values()).map(c => c.frequency),
      amplitudes: Array.from(spectrum.values()).map(c => c.amplitude),
      phases: Array.from(spectrum.values()).map(c => c.phase)
    };
  }, [spectrum, calculateFrequencyDomain, calculateTimeDomain]);

  return {
    // State
    spectrum,
    hand,
    inverseFourierResult,
    
    // Actions
    drawCard,
    playCard,
    resetSpectrum,
    
    // Computed values
    calculateFrequencyDomain,
    calculateTimeDomain
  };
}; 