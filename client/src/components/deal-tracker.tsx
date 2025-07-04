import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, RefreshCw, Shield, CheckCircle } from 'lucide-react';
import { useDealStatus } from '@/hooks/use-deals';
import { formatDistanceToNow } from 'date-fns';

interface DealTrackerProps {
  files: Array<{
    id: number;
    filename: string;
    cid: string;
    dealId?: string;
    status: string;
    pdpVerified: boolean;
    lastVerified?: Date;
    filcdnUrl?: string;
  }>;
}

export function DealTracker({ files }: DealTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-secondary/20 text-secondary';
      case 'sealing':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'failed':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getPdpStatusIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="w-3 h-3 text-secondary" />
    ) : (
      <Shield className="w-3 h-3 text-slate-400" />
    );
  };

  return (
    <Card className="bg-surface border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Active Storage Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3">
                  Deal ID
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3">
                  CID
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3">
                  PDP Verified
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3">
                  Last Check
                </th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {files.map((file) => (
                <DealRow key={file.id} file={file} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function DealRow({ file }: { file: DealTrackerProps['files'][0] }) {
  const { data: dealStatus, refetch, isLoading } = useDealStatus(file.cid, !!file.dealId);

  const handleRefresh = () => {
    refetch();
  };

  const openFilCDN = () => {
    if (file.filcdnUrl) {
      window.open(file.filcdnUrl, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-secondary/20 text-secondary';
      case 'sealing':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'failed':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const status = dealStatus?.status || file.status;
  const pdpVerified = dealStatus?.pdpVerified || file.pdpVerified;
  const lastVerified = dealStatus?.lastVerified || file.lastVerified;

  return (
    <tr>
      <td className="py-4 whitespace-nowrap">
        <span className="text-sm font-mono text-slate-300">
          {file.dealId || 'N/A'}
        </span>
      </td>
      <td className="py-4 whitespace-nowrap">
        <span className="text-sm font-mono text-slate-300">
          {file.cid.slice(0, 8)}...
        </span>
      </td>
      <td className="py-4 whitespace-nowrap">
        <Badge className={getStatusColor(status)}>
          <CheckCircle className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      </td>
      <td className="py-4 whitespace-nowrap">
        <Badge className={pdpVerified ? 'bg-secondary/20 text-secondary' : 'bg-slate-500/20 text-slate-400'}>
          <Shield className="w-3 h-3 mr-1" />
          {pdpVerified ? 'Verified' : 'Pending'}
        </Badge>
      </td>
      <td className="py-4 whitespace-nowrap text-sm text-slate-400">
        {lastVerified 
          ? formatDistanceToNow(new Date(lastVerified), { addSuffix: true })
          : 'Never'
        }
      </td>
      <td className="py-4 whitespace-nowrap text-sm space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={openFilCDN}
          className="text-primary hover:text-primary/80"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-slate-400 hover:text-slate-200"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </td>
    </tr>
  );
}
