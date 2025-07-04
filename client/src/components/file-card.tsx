import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Info, ExternalLink, FileText, Image, Code, Database, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface FileCardProps {
  file: {
    id: number;
    filename: string;
    cid: string;
    fileSize: number;
    mimeType: string;
    status: string;
    pdpVerified: boolean;
    uploadedAt?: Date;
    filcdnUrl?: string;
    deal?: {
      dealId: string;
      status: string;
      pdpVerified: boolean;
    };
  };
}

export function FileCard({ file }: FileCardProps) {
  const { toast } = useToast();

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="text-primary" />;
    if (mimeType.includes('javascript') || mimeType.includes('json')) return <Code className="text-primary" />;
    if (mimeType.includes('html') || mimeType.includes('css')) return <FileText className="text-primary" />;
    if (mimeType.includes('gltf') || mimeType.includes('glb')) return <Zap className="text-primary" />;
    return <Database className="text-primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${type} copied to clipboard`,
    });
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

  return (
    <Card className="bg-surface border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              {getFileIcon(file.mimeType)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{file.filename}</h3>
              <p className="text-sm text-slate-400">{formatFileSize(file.fileSize)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(file.cid, 'CID')}
              className="text-slate-400 hover:text-slate-200"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-200"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">CID:</span>
            <span className="font-mono text-slate-300">{file.cid.slice(0, 12)}...</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Status:</span>
            <Badge className={getStatusColor(file.status)}>
              {file.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">PDP Verified:</span>
            <Badge className={file.pdpVerified ? 'bg-secondary/20 text-secondary' : 'bg-slate-500/20 text-slate-400'}>
              {file.pdpVerified ? 'Verified' : 'Pending'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Uploaded:</span>
            <span className="text-slate-300">
              {file.uploadedAt 
                ? formatDistanceToNow(file.uploadedAt, { addSuffix: true })
                : 'Unknown'
              }
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">FilCDN URL:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={openFilCDN}
              className="text-primary hover:text-primary/80"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
