import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';
import { Wallet, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  open: boolean;
  onClose: () => void;
}

export function WalletConnect({ open, onClose }: WalletConnectProps) {
  const { connect, disconnect, isConnected, isConnecting } = useWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      onClose();
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to your wallet',
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-750 rounded-lg">
                <p className="text-sm text-slate-400">Connected to MetaMask</p>
              </div>
              <Button 
                onClick={handleDisconnect}
                variant="destructive"
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-4 bg-slate-750 hover:bg-slate-600 text-left"
                variant="ghost"
              >
                <div className="flex items-center space-x-3">
                  <Wallet className="text-primary text-xl" />
                  <span>MetaMask</span>
                </div>
                {isConnecting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                ) : (
                  <span className="text-slate-400">→</span>
                )}
              </Button>
              <Button
                disabled
                className="w-full flex items-center justify-between p-4 bg-slate-750 opacity-50 text-left"
                variant="ghost"
              >
                <div className="flex items-center space-x-3">
                  <Zap className="text-accent text-xl" />
                  <span>WalletConnect</span>
                </div>
                <span className="text-slate-400 text-sm">Coming Soon</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
