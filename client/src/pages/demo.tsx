import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Code, RefreshCw } from 'lucide-react';
import { useUserFiles } from '@/hooks/use-deals';
import { useWallet } from '@/hooks/use-wallet';

export default function Demo() {
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    dnsLookup: 0,
    connection: 0,
    ttfb: 0,
    download: 0,
  });
  const { address } = useWallet();
  const { data: files } = useUserFiles(address);

  const measurePerformance = async (url: string) => {
    const startTime = performance.now();
    
    try {
      const response = await fetch(url);
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      setLoadTime(totalTime);
      
      // Mock performance metrics for demonstration
      setPerformanceMetrics({
        dnsLookup: Math.floor(Math.random() * 20) + 5,
        connection: Math.floor(Math.random() * 50) + 20,
        ttfb: Math.floor(Math.random() * 100) + 50,
        download: Math.floor(totalTime - 100),
      });
    } catch (error) {
      console.error('Performance measurement failed:', error);
    }
  };

  const handleAssetLoad = (url: string) => {
    setSelectedAsset(url);
    measurePerformance(url);
  };

  const renderAssetPreview = () => {
    if (!selectedAsset) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Image className="w-8 h-8 text-primary" />
          </div>
          <p className="text-slate-400 text-center">Your uploaded assets will render here</p>
          <p className="text-sm text-slate-500 mt-2">Select a file from your uploads to see it in action</p>
        </div>
      );
    }

    const file = files?.find(f => f.filcdnUrl === selectedAsset);
    if (!file) return null;

    if (file.mimeType.startsWith('image/')) {
      return (
        <div className="text-center">
          <img
            src={selectedAsset}
            alt={file.filename}
            className="max-w-full max-h-64 mx-auto rounded-lg"
            onLoad={() => measurePerformance(selectedAsset)}
          />
          <p className="text-sm text-slate-400 mt-2">{file.filename}</p>
        </div>
      );
    }

    if (file.mimeType.includes('json')) {
      return (
        <div className="text-left">
          <div className="bg-slate-800 rounded-lg p-4 max-h-64 overflow-auto">
            <pre className="text-sm text-slate-300">
              <code>{JSON.stringify(JSON.parse('{"example": "data"}'), null, 2)}</code>
            </pre>
          </div>
          <p className="text-sm text-slate-400 mt-2">{file.filename}</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Code className="w-8 h-8 text-primary" />
        </div>
        <p className="text-slate-400">{file.filename}</p>
        <p className="text-sm text-slate-500 mt-2">File loaded via FilCDN</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.open(selectedAsset, '_blank')}
        >
          View Raw File
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Live React Demo</h1>
          <p className="text-slate-400">See your uploaded assets in action with performance monitoring</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Demo Preview */}
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Preview</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Load Time:</span>
                  <span className="text-sm font-mono text-secondary">
                    {loadTime ? `${loadTime.toFixed(0)}ms` : 'N/A'}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                {renderAssetPreview()}
              </div>
            </CardContent>
          </Card>

          {/* Controls and Metrics */}
          <div className="space-y-6">
            {/* Asset Selector */}
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle>Select Asset</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="asset-select">Choose from your uploads:</Label>
                    <select
                      id="asset-select"
                      className="w-full mt-2 p-2 bg-slate-750 border border-slate-600 rounded-lg text-white"
                      value={selectedAsset}
                      onChange={(e) => handleAssetLoad(e.target.value)}
                    >
                      <option value="">Select an asset...</option>
                      {files?.map((file) => (
                        <option key={file.id} value={file.filcdnUrl || ''}>
                          {file.filename}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="custom-url">Or enter a custom FilCDN URL:</Label>
                    <div className="flex mt-2">
                      <Input
                        id="custom-url"
                        placeholder="https://gateway.filcdn.io/ipfs/..."
                        className="bg-slate-750 border-slate-600"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAssetLoad((e.target as HTMLInputElement).value);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                          const input = document.getElementById('custom-url') as HTMLInputElement;
                          if (input.value) {
                            handleAssetLoad(input.value);
                          }
                        }}
                      >
                        Load
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Performance Metrics
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => selectedAsset && measurePerformance(selectedAsset)}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">DNS Lookup:</span>
                    <span className="font-mono text-sm">{performanceMetrics.dnsLookup}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Initial Connection:</span>
                    <span className="font-mono text-sm">{performanceMetrics.connection}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Time to First Byte:</span>
                    <span className="font-mono text-sm">{performanceMetrics.ttfb}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Content Download:</span>
                    <span className="font-mono text-sm">{performanceMetrics.download}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Snippet */}
            <Card className="bg-surface border-slate-700">
              <CardHeader>
                <CardTitle>React Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-4">
                  <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                    <code>{`// Use your CDN assets directly
const imgUrl = "https://gateway.filcdn.io/ipfs/\${cid}";

function MyComponent() {
  return (
    <img 
      src={imgUrl} 
      alt="Decentralized asset"
      className="w-full h-auto"
    />
  );
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
