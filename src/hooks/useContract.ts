import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TANDA_ABI, TANDA_ADDRESS } from '@/lib/contracts';
import { toast } from 'sonner';

export function useContract() {
  const { writeContractAsync } = useWriteContract();

  // Read contract data
  const readContract = useReadContract({
    address: TANDA_ADDRESS,
    abi: TANDA_ABI,
  });

  // Write contract functions
  const writeContract = async (functionName: string, args: any[] = []) => {
    try {
      const hash = await writeContractAsync({
        address: TANDA_ADDRESS,
        abi: TANDA_ABI,
        functionName,
        args,
      });
      
      toast.success('Transacción enviada');
      return hash;
    } catch (error) {
      console.error('Error writing contract:', error);
      toast.error('Error en la transacción');
      throw error;
    }
  };

  // Wait for transaction receipt
  const waitForTransaction = useWaitForTransactionReceipt();

  return {
    readContract,
    writeContract,
    waitForTransaction,
  };
}
