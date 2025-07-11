import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Plus, FileText, Handshake, Database, Globe } from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { useUserFiles, useFileStats } from '@/hooks/use-deals';
import { FileCard } from '@/components/file-card';
import { DealTracker } from '@/components/deal-tracker';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { address, isConnected } = useWallet();
  const [, navigate] = useLocation();
  const { data: files, isLoading: filesLoading } = useUserFiles(address);
  const { data: stats } = useFileStats(address);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-surface border-slate-700 p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">Please connect your wallet to access your dashboard</p>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4">
              Storage Dashboard
            </h1>
            <p className="text-xl text-slate-300">Monitor your decentralized storage deals and file status</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-surface border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Files</p>
                  <p className="text-2xl font-bold">{stats?.totalFiles || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Deals</p>
                  <p className="text-2xl font-bold">{stats?.activeDeals || 0}</p>
                </div>
                <Handshake className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Storage</p>
                  <p className="text-2xl font-bold">{formatFileSize(stats?.totalStorage || 0)}</p>
                </div>
                <Database className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">CDN Requests</p>
                  <p className="text-2xl font-bold">{stats?.cdnRequests?.toLocaleString() || 0}</p>
                </div>
                <Globe className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deal Tracker */}
        {files && files.length > 0 && (
          <div className="mb-8">
            <DealTracker files={files} />
          </div>
        )}

        {/* Files Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Files</h2>
          {filesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-surface border-slate-700">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-700 rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : files && files.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <Card className="bg-surface border-slate-700">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
                <p className="text-slate-400 mb-6">Start by uploading your first file to create a PDP storage deal</p>
                <Button onClick={() => navigate('/upload')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First File
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}