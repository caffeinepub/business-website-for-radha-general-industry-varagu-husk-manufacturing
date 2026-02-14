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

// Fixed gross salary - immutable across all zones and modes
const FIXED_GROSS_SALARY = '8419';

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
    grossSalary: FIXED_GROSS_SALARY,
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

    const gross = parseFloat(FIXED_GROSS_SALARY);
    if (!isNaN(gross) && gross > 0) {
      const autoBasic = (gross * 0.5).toFixed(2);
      
      // Only update if different to prevent loops
      if (currentZoneState.salaryState.basic !== autoBasic) {
        setZoneStates(prev => ({
          ...prev,
          [selectedZone]: {
            ...prev[selectedZone],
            salaryState: {
              ...prev[selectedZone].salaryState,
              grossSalary: FIXED_GROSS_SALARY,
              basic: autoBasic,
              da: FIXED_DA.toString(),
            },
          },
        }));
      }
    }
  }, [currentZoneState.autoApplyBasic50, mode, selectedZone]);

  // Auto-fill logic when designation changes
  useEffect(() => {
    const designation = currentZoneState.selectedDesignation;
    if (!designation) {
      setAutoFillMessage('');
      return;
    }

    const config = getBasicConfigForDesignation(selectedZone, designation);
    
    if (!config) {
      setAutoFillMessage(
        `No auto-fill configuration available for ${designation} in Zone ${selectedZone}. Please enter values manually.`
      );
      return;
    }

    setAutoFillMessage('');

    // Apply auto-fill based on mode
    setZoneStates(prev => {
      const newState = { ...prev };
      const zoneState = { ...newState[selectedZone] };

      if (mode === 'manual' && config.manualBasicAmount !== undefined) {
        // Auto-fill Basic amount in manual mode (overrides 50% auto-apply)
        zoneState.salaryState = {
          ...zoneState.salaryState,
          grossSalary: FIXED_GROSS_SALARY,
          basic: config.manualBasicAmount.toString(),
          da: FIXED_DA.toString(),
        };
        // Disable auto-apply when designation sets a specific amount
        zoneState.autoApplyBasic50 = false;
      } else if (mode === 'tn-hotel-rule') {
        // Auto-fill rule percentages in TN Hotel Rule mode (DA is always fixed)
        if (config.tnRuleBasicPercentage !== undefined) {
          zoneState.tnHotelRule = {
            basicPercentage: config.tnRuleBasicPercentage,
          };
          zoneState.salaryState = {
            ...zoneState.salaryState,
            grossSalary: FIXED_GROSS_SALARY,
            da: FIXED_DA.toString(),
          };
        }
      }

      newState[selectedZone] = zoneState;
      return newState;
    });
  }, [currentZoneState.selectedDesignation, selectedZone, mode]);

  const calculation = useMemo<SalaryCalculation>(() => {
    // Always use fixed gross salary and fixed DA
    const gross = parseFloat(FIXED_GROSS_SALARY) || 0;
    const da = FIXED_DA;

    let basic = 0;

    if (mode === 'manual') {
      basic = parseFloat(currentZoneState.salaryState.basic) || 0;
    } else if (mode === 'tn-hotel-rule') {
      if (gross > 0) {
        basic = (gross * currentZoneState.tnHotelRule.basicPercentage) / 100;
      }
    }

    const other = gross - basic - da;

    let isValid = false;
    let errorMessage = '';

    if (gross <= 0) {
      errorMessage = 'Please enter a valid gross salary';
    } else if (gross > 0) {
      if (basic + da > gross) {
        errorMessage = 'Basic + DA cannot exceed Gross Salary';
      } else if (mode === 'tn-hotel-rule') {
        // Validate rule configuration
        if (currentZoneState.tnHotelRule.basicPercentage < 0) {
          errorMessage = 'Basic percentage cannot be negative';
        } else if (basic + da > gross) {
          errorMessage = 'Basic + DA cannot exceed Gross Salary';
        } else {
          isValid = true;
        }
      } else if (mode === 'manual') {
        isValid = basic >= 0 && da >= 0 && other >= 0;
      }
    }

    return {
      grossSalary: gross,
      basic,
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

  // Gross salary update is now a no-op (always fixed at 8419)
  const updateGrossSalary = (value: string) => {
    // Ignore any attempts to change gross salary - it's fixed at 8419
    return;
  };

  const updateBasic = (value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      setZoneStates(prev => ({
        ...prev,
        [selectedZone]: {
          ...prev[selectedZone],
          salaryState: {
            ...prev[selectedZone].salaryState,
            grossSalary: FIXED_GROSS_SALARY,
            basic: value,
            da: FIXED_DA.toString(),
          },
          // Disable auto-apply when user manually edits Basic
          autoApplyBasic50: false,
        },
      }));
    }
  };

  // DA update is now a no-op (always fixed at 8419)
  const updateDA = (value: string) => {
    // Ignore any attempts to change DA - it's fixed at 8419
    return;
  };

  const updateMode = (newMode: CalculationMode) => {
    setMode(newMode);
    setAutoFillMessage('');
  };

  const updateTnHotelRule = (config: Partial<TamilNaduHotelRuleConfig>) => {
    setZoneStates(prev => ({
      ...prev,
      [selectedZone]: {
        ...prev[selectedZone],
        salaryState: {
          ...prev[selectedZone].salaryState,
          grossSalary: FIXED_GROSS_SALARY,
          da: FIXED_DA.toString(),
        },
        tnHotelRule: {
          ...prev[selectedZone].tnHotelRule,
          ...config,
        },
      },
    }));
  };

  const updateDesignation = (designation: HotelDesignation | null) => {
    setZoneStates(prev => ({
      ...prev,
      [selectedZone]: {
        ...prev[selectedZone],
        selectedDesignation: designation,
      },
    }));
  };

  const toggleAutoApplyBasic50 = () => {
    setZoneStates(prev => ({
      ...prev,
      [selectedZone]: {
        ...prev[selectedZone],
        autoApplyBasic50: !prev[selectedZone].autoApplyBasic50,
      },
    }));
  };

  const reset = () => {
    // Reset only the current zone, always restoring fixed gross salary and DA
    setZoneStates(prev => ({
      ...prev,
      [selectedZone]: createDefaultZoneState(),
    }));
    setAutoFillMessage('');
  };

  return {
    selectedZone,
    salaryState: {
      ...currentZoneState.salaryState,
      grossSalary: FIXED_GROSS_SALARY, // Always return fixed gross salary
      da: FIXED_DA.toString(), // Always return fixed DA
    },
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
