
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CloudUpload, 
  X, 
  File, 
  Check, 
  Upload,
  Shield,
  Zap,
  FileText,
  Image,
  Code,
  Box,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useWallet } from '@/hooks/use-wallet';
import { uploadFile } from '@/lib/estuary';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function Upload() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdpEnabled, setPdpEnabled] = useState(true);
  const [filcdnEnabled, setFilcdnEnabled] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address, isConnected } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const results = [];

      for (const file of files) {
        const result = await uploadFile(file, address!);
        results.push(result);
      }

      return results;
    },
    onSuccess: (results) => {
      toast({
        title: 'Upload Successful!',
        description: `${results.length} file(s) uploaded and storage deals created`,
      });
      setSelectedFiles([]);

      queryClient.invalidateQueries({ queryKey: ['/api/files', address] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats', address] });
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const allowedTypes = [
      'text/html',
      'text/css',
      'application/javascript',
      'application/json',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'model/gltf-binary',
      'model/gltf+json',
    ];

    const validFiles = files.filter(file => {
      const isValidType = allowedTypes.includes(file.type) || file.name.endsWith('.glb');
      const isValidSize = file.size <= 50 * 1024 * 1024;

      if (!isValidType) {
        toast({
          title: 'Invalid File Type',
          description: `${file.name} is not a supported file type`,
          variant: 'destructive',
        });
      }

      if (!isValidSize) {
        toast({
          title: 'File Too Large',
          description: `${file.name} exceeds 50MB limit`,
          variant: 'destructive',
        });
      }

      return isValidType && isValidSize;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'svg'].includes(ext || '')) return <Image className="w-5 h-5" />;
    if (['js', 'html', 'css', 'json'].includes(ext || '')) return <Code className="w-5 h-5" />;
    if (['glb', 'gltf'].includes(ext || '')) return <Box className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const handleUpload = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to upload files',
        variant: 'destructive',
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: 'No Files Selected',
        description: 'Please select files to upload',
        variant: 'destructive',
      });
      return;
    }

    uploadMutation.mutate(selectedFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
              <Upload className="w-4 h-4 mr-2" />
              Decentralized Storage
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Upload Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Digital Assets
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Store your files on IPFS and Filecoin with cryptographic proof of possession. 
            Deliver globally through our FilCDN network.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-700/50 shadow-2xl">
              <CardContent className="p-8">
                {/* Upload Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 group ${
                    dragActive 
                      ? 'border-primary bg-primary/5 scale-[1.02]' 
                      : 'border-slate-600 hover:border-primary/50 hover:bg-slate-800/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <CloudUpload className={`w-16 h-16 mx-auto mb-6 transition-all duration-300 ${
                      dragActive ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-primary group-hover:scale-105'
                    }`} />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                    </h3>
                    <p className="text-slate-400 mb-6 text-lg">
                      or <span className="text-primary font-semibold">click to browse</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-4">
                      {['HTML', 'JS', 'CSS', 'JSON', 'Images', '3D Models'].map(type => (
                        <Badge key={type} variant="secondary" className="bg-slate-800 text-slate-300 border-slate-600">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500">Maximum file size: 50MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".html,.js,.css,.json,.jpg,.jpeg,.png,.svg,.glb,.gltf"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <File className="w-5 h-5 mr-2 text-primary" />
                      Selected Files ({selectedFiles.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 group hover:bg-slate-800/70 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="text-primary">
                              {getFileIcon(file.name)}
                            </div>
                            <div>
                              <span className="text-white font-medium">{file.name}</span>
                              <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadMutation.isPending && (
                  <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-medium">Creating Storage Deals...</span>
                      <span className="text-primary font-medium">Processing</span>
                    </div>
                    <Progress value={50} className="h-3 bg-slate-800" />
                    <p className="text-sm text-slate-400 mt-2">
                      Your files are being stored on IPFS and Filecoin network
                    </p>
                  </div>
                )}

                {/* Upload Button */}
                <div className="mt-8">
                  <Button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0 || uploadMutation.isPending || !isConnected}
                    className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        Creating Storage Deal...
                      </>
                    ) : uploadMutation.isSuccess ? (
                      <>
                        <Check className="w-5 h-5 mr-3" />
                        Storage Deal Created!
                      </>
                    ) : (
                      <>
                        <CloudUpload className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        Create Storage Deal
                      </>
                    )}
                  </Button>

                  {!isConnected && (
                    <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-400 mr-3" />
                      <span className="text-orange-300">Please connect your wallet to upload files</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Upload Settings */}
            <Card className="bg-slate-900/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Storage Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div>
                        <Label htmlFor="pdp-toggle" className="text-white font-medium">PDP Storage</Label>
                        <p className="text-sm text-slate-400">Cryptographic proof of data possession</p>
                      </div>
                    </div>
                    <Switch
                      id="pdp-toggle"
                      checked={pdpEnabled}
                      onCheckedChange={setPdpEnabled}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-violet-400 mt-0.5" />
                      <div>
                        <Label htmlFor="filcdn-toggle" className="text-white font-medium">FilCDN Delivery</Label>
                        <p className="text-sm text-slate-400">Global edge caching network</p>
                      </div>
                    </div>
                    <Switch
                      id="filcdn-toggle"
                      checked={filcdnEnabled}
                      onCheckedChange={setFilcdnEnabled}
                      className="data-[state=checked]:bg-violet-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-slate-900/50 backdrop-blur border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Upload Files', desc: 'Select and upload your digital assets' },
                    { step: '2', title: 'IPFS Storage', desc: 'Files stored on distributed network' },
                    { step: '3', title: 'Filecoin Deal', desc: 'Long-term storage deal created' },
                    { step: '4', title: 'Global CDN', desc: 'Instant delivery worldwide' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{item.title}</p>
                        <p className="text-slate-400 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
