import { useContext } from 'react';
import { FinancialContext } from '../context/FinancialContext';

export function useFinancialData() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialProvider');
  }
  return context;
}
