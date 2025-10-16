import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHumanWallet } from './useHumanWallet';
import { useReadContract, useWriteContract } from 'wagmi';
import { readContract } from 'viem';
import { parseUnits } from 'viem';
import { TANDA_ABI, TANDA_ADDRESS } from '@/lib/contracts';
import { Tanda, CreateTandaData } from '@/types/tanda';

export function useTanda() {
  const { address } = useHumanWallet();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();

  // Get user's tandas
  const { data: userTandaIds } = useReadContract({
    address: TANDA_ADDRESS as `0x${string}`,
    abi: TANDA_ABI,
    functionName: 'getUserTandas',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Fetch tanda details for each ID
  const { data: userTandas, isLoading: loadingTandas } = useQuery({
    queryKey: ['userTandas', address],
    queryFn: async () => {
      if (!userTandaIds || !Array.isArray(userTandaIds)) return [];
      
      const tandaPromises = userTandaIds.map(async (id: bigint) => {
        const details = await readContract({
          address: TANDA_ADDRESS as `0x${string}`,
          abi: TANDA_ABI,
          functionName: 'getTandaDetails',
          args: [id],
        });
        
        const members = await readContract({
          address: TANDA_ADDRESS as `0x${string}`,
          abi: TANDA_ABI,
          functionName: 'getTandaMembers',
          args: [id],
        });
        
        // Check if user needs to pay current round
        const hasPaid = await readContract({
          address: TANDA_ADDRESS as `0x${string}`,
          abi: TANDA_ABI,
          functionName: 'hasUserPaidRound',
          args: [id, details.currentRound, address as `0x${string}`],
        });
        
        return {
          id: Number(id),
          name: `Tanda #${Number(id)}`,
          creator: details.creator,
          monthlyAmount: Number(details.monthlyAmount) / 1e18,
          maxMembers: details.maxMembers,
          currentMembers: details.currentMembers,
          currentRound: details.currentRound,
          isActive: details.isActive,
          isCompleted: details.isCompleted,
          members,
          startTime: details.startTime ? new Date(Number(details.startTime) * 1000) : null,
          needsPayment: details.isActive && !hasPaid,
        } as Tanda;
      });
      
      return Promise.all(tandaPromises);
    },
    enabled: !!address && !!userTandaIds,
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
          BigInt(data.members),
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
