import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CloudUpload, X, File, Check } from 'lucide-react';
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
      if (!address) throw new Error('Wallet not connected');
      
      const results = [];
      for (const file of files) {
        const result = await uploadFile(file, address);
        results.push(result);
      }
      return results;
    },
    onSuccess: (results) => {
      setSelectedFiles([]);
      toast({
        title: 'Upload Successful!',
        description: `${results.length} file(s) uploaded and PDP deals created`,
      });
      // Invalidate files query to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ['/api/files', address] });
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
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
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
    <div className="min-h-screen bg-slate-900/50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Upload Your Assets</h1>
          <p className="text-slate-400">Drag and drop your files to create PDP storage deals on Filecoin Calibration testnet</p>
        </div>

        <Card className="bg-surface border-slate-700">
          <CardContent className="p-8">
            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-slate-600 hover:border-primary'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drop files here or click to upload</h3>
              <p className="text-slate-400 mb-4">Supports HTML, JS, CSS, JSON, images, 3D models (.glb), and more</p>
              <p className="text-sm text-slate-500">Maximum file size: 50MB</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".html,.js,.css,.json,.jpg,.jpeg,.png,.svg,.glb,.gltf"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Upload Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-slate-750 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pdp-toggle" className="font-medium">Enable PDP Storage</Label>
                      <p className="text-sm text-slate-400">Proof of Data Possession on Filecoin</p>
                    </div>
                    <Switch
                      id="pdp-toggle"
                      checked={pdpEnabled}
                      onCheckedChange={setPdpEnabled}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-750 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="filcdn-toggle" className="font-medium">FilCDN Delivery</Label>
                      <p className="text-sm text-slate-400">Edge caching for instant access</p>
                    </div>
                    <Switch
                      id="filcdn-toggle"
                      checked={filcdnEnabled}
                      onCheckedChange={setFilcdnEnabled}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Selected Files:</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="w-4 h-4 text-primary" />
                        <div>
                          <span className="text-sm font-medium">{file.name}</span>
                          <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-red-400"
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
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Creating PDP Storage Deals...</span>
                  <span className="text-sm text-slate-400">Processing</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploadMutation.isPending || !isConnected}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-semibold"
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Storage Deal...
                </>
              ) : uploadMutation.isSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Storage Deal Created!
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4 mr-2" />
                  Create PDP Storage Deal
                </>
              )}
            </Button>

            {!isConnected && (
              <p className="text-center text-slate-400 mt-4">
                Please connect your wallet to upload files
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
