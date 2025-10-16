import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHumanWallet } from './useHumanWallet';
import { useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { TANDA_ABI, TANDA_ADDRESS } from '@/lib/contracts';
import { Tanda, CreateTandaData } from '@/types/tanda';

export function useTanda() {
  const { address } = useHumanWallet();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();

  // Mock data for deployment - replace with actual contract calls
  const { data: userTandas, isLoading: loadingTandas } = useQuery({
    queryKey: ['userTandas', address],
    queryFn: async () => {
      // Mock data for deployment
      return [
        {
          id: 1,
          name: 'Tanda Familia González',
          creator: address || '0x123...',
          monthlyAmount: 1000,
          maxMembers: 8,
          currentMembers: 6,
          currentRound: 3,
          isActive: true,
          isCompleted: false,
          members: ['0x123...', '0x456...', '0x789...'],
          startTime: new Date('2024-01-01'),
          nextPayoutDate: new Date('2024-12-01'),
          needsPayment: true,
        }
      ] as Tanda[];
    },
    enabled: !!address,
  });

  // Create tanda mutation
  const createTanda = useMutation({
    mutationFn: async (data: CreateTandaData) => {
      const tx = await writeContractAsync({
        address: TANDA_ADDRESS as `0x${string}`,
        abi: TANDA_ABI,
        functionName: 'createTanda',
        args: [
          parseUnits(data.amount.toString(), 18),
          data.members,
          BigInt(data.frequency)
        ],
      });
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTandas'] });
    },
  });

  // Join tanda mutation
  const joinTanda = useMutation({
    mutationFn: async (tandaId: number) => {
      const tx = await writeContractAsync({
        address: TANDA_ADDRESS as `0x${string}`,
        abi: TANDA_ABI,
        functionName: 'joinTanda',
        args: [BigInt(tandaId)],
      });
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTandas'] });
      queryClient.invalidateQueries({ queryKey: ['availableTandas'] });
    },
  });

  // Pay round mutation
  const payRound = useMutation({
    mutationFn: async (tandaId: number) => {
      const tx = await writeContractAsync({
        address: TANDA_ADDRESS as `0x${string}`,
        abi: TANDA_ABI,
        functionName: 'payRound',
        args: [BigInt(tandaId)],
      });
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTandas'] });
    },
  });

  return {
    userTandas,
    loadingTandas,
    createTanda,
    joinTanda,
    payRound,
  };
}