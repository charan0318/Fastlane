import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/use-wallet';
import { useState } from 'react';
import { WalletConnect } from './wallet-connect';
import { Link, useLocation } from 'wouter';
import { Rocket } from 'lucide-react';

export function Navigation() {
  const { address, isConnected } = useWallet();
  const [location] = useLocation();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/upload', label: 'Upload' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/demo', label: 'Demo' },
    { href: '/docs', label: 'Docs' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      <nav className="bg-surface border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Rocket className="text-primary text-xl" />
                <span className="text-xl font-bold">Fastlane CDN</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-colors ${
                      isActive(item.href) 
                        ? 'text-white' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-slate-400">Network:</span>
                <span className="text-secondary">Calibration</span>
              </div>
              <Button
                onClick={() => setShowWalletModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                {isConnected 
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : 'Connect Wallet'
                }
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <WalletConnect 
        open={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
    </>
  );
}
