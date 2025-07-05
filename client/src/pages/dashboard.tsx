
import { useWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileCard } from '@/components/file-card';
import { DealTracker } from '@/components/deal-tracker';
import { useQuery } from '@tanstack/react-query';
import { 
  Files, 
  Database, 
  Zap, 
  TrendingUp, 
  Activity,
  HardDrive,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface FileStats {
  totalFiles: number;
  activeDeals: number;
  totalStorage: number;
  cdnRequests: number;
}

interface FileWithDeal {
  id: number;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  cid: string;
  dealId: string | null;
  status: string;
  pdpVerified: boolean | null;
  filcdnUrl: string | null;
  uploadedAt: Date;
  deal?: {
    id: number;
    dealId: string;
    status: string;
    pdpVerified: boolean | null;
    createdAt: Date;
  };
}

export default function Dashboard() {
  const { address, isConnected } = useWallet();

  const { data: stats, isLoading: statsLoading } = useQuery<FileStats>({
    queryKey: ['/api/stats', address],
    queryFn: async () => {
      if (!address) throw new Error('No wallet connected');
      const response = await fetch(`/api/stats/${address}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!address,
    refetchInterval: 30000,
  });

  const { data: files, isLoading: filesLoading } = useQuery<FileWithDeal[]>({
    queryKey: ['/api/files', address],
    queryFn: async () => {
      if (!address) throw new Error('No wallet connected');
      const response = await fetch(`/api/files/${address}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      return response.json();
    },
    enabled: !!address,
    refetchInterval: 30000,
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-900/50 backdrop-blur border-slate-700/50 max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-slate-400 mb-4">Connect your wallet to view your uploaded files and storage deals.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Storage <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-xl text-slate-300">
                Manage your decentralized assets and storage deals
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur border-slate-700/50 hover:border-primary/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Files</p>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : stats?.totalFiles || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Files className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Deals</p>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : stats?.activeDeals || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur border-slate-700/50 hover:border-violet-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Storage</p>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : formatBytes(stats?.totalStorage || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                  <HardDrive className="w-6 h-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur border-slate-700/50 hover:border-orange-500/30 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">CDN Requests</p>
                  <p className="text-2xl font-bold text-white">
                    {statsLoading ? '...' : formatNumber(stats?.cdnRequests || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <Globe className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Files List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Files className="w-5 h-5 mr-2 text-primary" />
                  Your Files
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your uploaded assets and storage deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-slate-800/50 h-20 rounded-xl" />
                    ))}
                  </div>
                ) : files && files.length > 0 ? (
                  <div className="space-y-4">
                    {files.map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Files className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No files uploaded yet</h3>
                    <p className="text-slate-400 mb-4">Upload your first file to get started</p>
                    <Button className="bg-primary hover:bg-primary/90">
                      Upload Files
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Storage Usage */}
            <Card className="bg-slate-900/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Used</span>
                    <span className="text-white">{formatBytes(stats?.totalStorage || 0)}</span>
                  </div>
                  <Progress value={30} className="h-2 bg-slate-800" />
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">0 GB</span>
                    <span className="text-slate-500">100 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Tracker */}
            <DealTracker />

            {/* Quick Stats */}
            <Card className="bg-slate-900/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Verified Deals</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {files?.filter(f => f.deal?.pdpVerified).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Pending Deals</span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {files?.filter(f => f.deal && !f.deal.pdpVerified).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Avg File Size</span>
                    <span className="text-white text-sm">
                      {files && files.length > 0 
                        ? formatBytes(files.reduce((sum, f) => sum + f.fileSize, 0) / files.length)
                        : '0 B'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
