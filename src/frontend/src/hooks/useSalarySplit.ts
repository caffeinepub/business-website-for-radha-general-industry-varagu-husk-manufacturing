import { useState, useMemo, useEffect } from 'react';
import type { Zone } from '@/lib/zoneDesignationBasicConfig';
import type { HotelDesignation } from '@/lib/hotelDesignations';
import { getBasicConfigForDesignation } from '@/lib/zoneDesignationBasicConfig';

interface SalaryState {
  grossSalary: string;
  basic: string;
  da: string;
}

export type CalculationMode = 'manual' | 'tn-hotel-rule';

export interface TamilNaduHotelRuleConfig {
  basicPercentage: number;
}

interface SalaryCalculation {
  grossSalary: number;
  basic: number;
  da: number;
  other: number;
  isValid: boolean;
  errorMessage: string;
}

const DEFAULT_TN_HOTEL_RULE: TamilNaduHotelRuleConfig = {
  basicPercentage: 50,
};

// Default gross salary - editable per zone
const DEFAULT_GROSS_SALARY = '8419';

// Fixed DA - immutable across all zones and modes
const FIXED_DA = 8419;

// Zone-scoped state
interface ZoneState {
  salaryState: SalaryState;
  tnHotelRule: TamilNaduHotelRuleConfig;
  selectedDesignation: HotelDesignation | null;
  autoApplyBasic50: boolean;
}

const createDefaultZoneState = (): ZoneState => ({
  salaryState: {
    grossSalary: DEFAULT_GROSS_SALARY,
    basic: '',
    da: FIXED_DA.toString(),
  },
  tnHotelRule: { ...DEFAULT_TN_HOTEL_RULE },
  selectedDesignation: null,
  autoApplyBasic50: true,
});

export function useSalarySplit() {
  const [selectedZone, setSelectedZone] = useState<Zone>('A');
  const [mode, setMode] = useState<CalculationMode>('manual');
  
  // Per-zone state storage
  const [zoneStates, setZoneStates] = useState<Record<Zone, ZoneState>>({
    A: createDefaultZoneState(),
    B: createDefaultZoneState(),
    C: createDefaultZoneState(),
    D: createDefaultZoneState(),
  });

  const [autoFillMessage, setAutoFillMessage] = useState<string>('');

  // Get current zone's state
  const currentZoneState = zoneStates[selectedZone];

  // Auto-calculate Basic as 50% of Gross when auto-apply is enabled in manual mode
  useEffect(() => {
    if (mode !== 'manual' || !currentZoneState.autoApplyBasic50) {
      return;
    }

    const gross = parseFloat(currentZoneState.salaryState.grossSalary);
    if (!isNaN(gross) && gross > 0) {
      const autoBasic = (gross * 0.5).toFixed(2);
      
      // Only update if different to avoid infinite loops
      if (currentZoneState.salaryState.basic !== autoBasic) {
        setZoneStates((prev) => ({
          ...prev,
          [selectedZone]: {
            ...prev[selectedZone],
            salaryState: {
              ...prev[selectedZone].salaryState,
              basic: autoBasic,
            },
          },
        }));
      }
    }
  }, [currentZoneState.salaryState.grossSalary, currentZoneState.autoApplyBasic50, mode, selectedZone]);

  const updateZoneState = (updates: Partial<ZoneState>) => {
    setZoneStates((prev) => ({
      ...prev,
      [selectedZone]: {
        ...prev[selectedZone],
        ...updates,
      },
    }));
  };

  const updateSalaryState = (updates: Partial<SalaryState>) => {
    setZoneStates((prev) => ({
      ...prev,
      [selectedZone]: {
        ...prev[selectedZone],
        salaryState: {
          ...prev[selectedZone].salaryState,
          ...updates,
        },
      },
    }));
  };

  const calculation = useMemo((): SalaryCalculation => {
    const gross = parseFloat(currentZoneState.salaryState.grossSalary) || 0;
    const basic = parseFloat(currentZoneState.salaryState.basic) || 0;
    const da = FIXED_DA; // Always use fixed DA

    let calculatedBasic = basic;

    // In TN Hotel Rule mode, calculate Basic from percentage
    if (mode === 'tn-hotel-rule') {
      calculatedBasic = (gross * currentZoneState.tnHotelRule.basicPercentage) / 100;
    }

    const other = gross - calculatedBasic - da;

    // Validation
    let isValid = true;
    let errorMessage = '';

    if (gross <= 0) {
      isValid = false;
      errorMessage = 'Gross salary must be greater than 0';
    } else if (calculatedBasic < 0) {
      isValid = false;
      errorMessage = 'Basic salary cannot be negative';
    } else if (other < 0) {
      isValid = false;
      errorMessage = 'Other components cannot be negative. Basic + DA exceeds Gross Salary.';
    } else if (calculatedBasic + da > gross) {
      isValid = false;
      errorMessage = 'Basic + DA cannot exceed Gross Salary';
    }

    return {
      grossSalary: gross,
      basic: calculatedBasic,
      da,
      other: Math.max(0, other),
      isValid,
      errorMessage,
    };
  }, [currentZoneState.salaryState, currentZoneState.tnHotelRule, mode]);

  const updateZone = (zone: Zone) => {
    setSelectedZone(zone);
    setAutoFillMessage('');
  };

  const updateGrossSalary = (value: string) => {
    updateSalaryState({ grossSalary: value });
  };

  const updateBasic = (value: string) => {
    updateSalaryState({ basic: value });
  };

  const updateDA = (value: string) => {
    // DA is fixed, this is a no-op
    // Keep for API compatibility but don't update
  };

  const updateMode = (newMode: CalculationMode) => {
    setMode(newMode);
    setAutoFillMessage('');
  };

  const updateTnHotelRule = (updates: Partial<TamilNaduHotelRuleConfig>) => {
    updateZoneState({
      tnHotelRule: {
        ...currentZoneState.tnHotelRule,
        ...updates,
      },
    });
  };

  const updateDesignation = (designation: HotelDesignation | null) => {
    updateZoneState({ selectedDesignation: designation });

    if (designation) {
      const config = getBasicConfigForDesignation(selectedZone, designation);

      if (config) {
        if (mode === 'manual') {
          // In manual mode, auto-fill Basic amount only
          if (config.manualBasicAmount !== undefined && config.manualBasicAmount !== null) {
            updateSalaryState({ basic: config.manualBasicAmount.toString() });
            setAutoFillMessage(`Basic auto-filled to ₹${config.manualBasicAmount} for ${designation} in Zone ${selectedZone}`);
          }
        } else if (mode === 'tn-hotel-rule') {
          // In TN Hotel Rule mode, auto-fill Basic percentage only
          if (config.tnRuleBasicPercentage !== undefined && config.tnRuleBasicPercentage !== null) {
            updateTnHotelRule({ basicPercentage: config.tnRuleBasicPercentage });
            setAutoFillMessage(`Basic percentage auto-filled to ${config.tnRuleBasicPercentage}% for ${designation} in Zone ${selectedZone}`);
          }
        }

        setTimeout(() => setAutoFillMessage(''), 5000);
      }
    } else {
      setAutoFillMessage('');
    }
  };

  const toggleAutoApplyBasic50 = () => {
    updateZoneState({ autoApplyBasic50: !currentZoneState.autoApplyBasic50 });
  };

  const reset = () => {
    setZoneStates((prev) => ({
      ...prev,
      [selectedZone]: createDefaultZoneState(),
    }));
    setAutoFillMessage('');
  };

  return {
    selectedZone,
    salaryState: currentZoneState.salaryState,
    calculation,
    mode,
    tnHotelRule: currentZoneState.tnHotelRule,
    selectedDesignation: currentZoneState.selectedDesignation,
    autoFillMessage,
    autoApplyBasic50: currentZoneState.autoApplyBasic50,
    updateZone,
    updateGrossSalary,
    updateBasic,
    updateDA,
    updateMode,
    updateTnHotelRule,
    updateDesignation,
    toggleAutoApplyBasic50,
    reset,
  };
}
