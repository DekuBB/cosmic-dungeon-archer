import { create } from 'zustand';
import type { Web3State } from '@/types/game';

export const useWeb3Store = create<Web3State>((set, get) => ({
  address: undefined,
  isConnected: false,
  chainId: undefined,
  isClaimingTokens: false,

  setAddress: (address: string | undefined): void => {
    set({ address });
  },

  setConnected: (connected: boolean): void => {
    set({ isConnected: connected });
  },

  setChainId: (chainId: number | undefined): void => {
    set({ chainId });
  },

  claimTokens: async (): Promise<void> => {
    const { address, isConnected } = get();
    
    if (!isConnected || !address) {
      console.warn('Wallet not connected, cannot claim tokens');
      return;
    }

    set({ isClaimingTokens: true });
    
    try {
      // Token claiming logic - this would integrate with Base smart contract
      // For now, we'll simulate the transaction
      
      console.log('🎯 Claiming tokens to wallet:', address);
      console.log('🔗 Network: Base');
      
      // Simulate token transfer delay
      await new Promise((resolve: (value: unknown) => void): void => {
        setTimeout(resolve, 2000);
      });
      
      // In production, this would be replaced with actual smart contract call:
      // const contract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer);
      // const tx = await contract.claim(address, tokenAmount);
      // await tx.wait();
      
      console.log('✅ Tokens claimed successfully to', address);
      
      // Show success notification
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('tokensClaimed', {
          detail: { address, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      }
      
    } catch (error: unknown) {
      console.error('❌ Failed to claim tokens:', error);
      throw error;
    } finally {
      set({ isClaimingTokens: false });
    }
  },
}));
