import { useContext } from 'react';
import { ProgressContext } from '../context/ProgressContextInstance';

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
