import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Staff } from '../backend';

export function useGetStaff() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Staff[]>({
    queryKey: ['staff'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStaff(BigInt(0), BigInt(1000));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddStaff() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staff: {
      name: string;
      mobile: string;
      designation: string;
      basic: number;
      da: number;
      otherAllowance: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addStaff(
        staff.name,
        staff.mobile,
        staff.designation,
        staff.basic,
        staff.da,
        staff.otherAllowance
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useSaveAttMonth() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      staffName: string;
      monthYear: string;
      absent: number;
      cl: number;
      el: number;
      sl: number;
      present: number;
      weekoff: number;
      totalDays: number;
      pf: number;
      esi: number;
      grossPay: number;
      salaryAdvance: number;
      basic: number;
      da: number;
      otherAllowances: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveAttMonth(
        data.staffName,
        data.monthYear,
        BigInt(data.absent),
        BigInt(data.cl),
        BigInt(data.el),
        BigInt(data.sl),
        BigInt(data.present),
        BigInt(data.weekoff),
        BigInt(data.totalDays),
        data.pf,
        data.esi,
        data.grossPay,
        data.salaryAdvance,
        data.basic,
        data.da,
        data.otherAllowances
      );
    },
  });
}

export function useFinalizeSalary() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (staffId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.finalizeSalary(staffId);
    },
  });
}
