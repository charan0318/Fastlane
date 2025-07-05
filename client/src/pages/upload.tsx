
import { useState, useRef } from "react";
import { useWallet } from "../hooks/use-wallet";
import { uploadFile } from "../lib/estuary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Upload, 
  File, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Cloud, 
  Shield, 
  Zap,
  FileText,
  Image,
  Code,
  Film,
  Music,
  Archive
} from "lucide-react";

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  result?: any;
  error?: string;
  progress: number;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-400" />;
  if (mimeType.startsWith('video/')) return <Film className="w-5 h-5 text-purple-400" />;
  if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5 text-green-400" />;
  if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('css') || mimeType.includes('html')) 
    return <Code className="w-5 h-5 text-yellow-400" />;
  if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="w-5 h-5 text-gray-400" />;
  return <FileText className="w-5 h-5 text-slate-400" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function Upload() {
  const { address, isConnected } = useWallet();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, walletAddress }: { file: File; walletAddress: string }) => {
      return await uploadFile(file, walletAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !isConnected || !address) return;

    const fileArray = Array.from(files);
    const newUploadedFiles: UploadedFile[] = fileArray.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Process uploads sequentially with progress simulation
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const fileIndex = uploadedFiles.length + i;

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => prev.map((uploadFile, idx) => 
            idx === fileIndex && uploadFile.progress < 90 
              ? { ...uploadFile, progress: uploadFile.progress + Math.random() * 15 }
              : uploadFile
          ));
        }, 200);

        const result = await uploadMutation.mutateAsync({ file, walletAddress: address });
        
        clearInterval(progressInterval);
        
        setUploadedFiles(prev => prev.map((uploadFile, idx) => 
          idx === fileIndex 
            ? { ...uploadFile, status: 'success', result, progress: 100 }
            : uploadFile
        ));
      } catch (error) {
        setUploadedFiles(prev => prev.map((uploadFile, idx) => 
          idx === fileIndex 
            ? { 
                ...uploadFile, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed',
                progress: 0
              }
            : uploadFile
        ));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              Web3.Storage Integration
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Upload to the Future
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Securely store your files on IPFS and Filecoin with automated PDP verification and global CDN delivery
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="secondary" className="bg-slate-800/50 border-slate-600 text-slate-300 px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Decentralized Storage
              </Badge>
              <Badge variant="secondary" className="bg-slate-800/50 border-slate-600 text-slate-300 px-3 py-1">
                <Cloud className="w-3 h-3 mr-1" />
                Global CDN
              </Badge>
              <Badge variant="secondary" className="bg-slate-800/50 border-slate-600 text-slate-300 px-3 py-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                PDP Verified
              </Badge>
            </div>
          </div>

          {/* Upload Section */}
          <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-white">
                Upload Your Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isConnected ? (
                <>
                  {/* Drag & Drop Zone */}
                  <div
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                      ${isDragOver 
                        ? 'border-blue-400 bg-blue-500/10 scale-105' 
                        : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
                      }
                    `}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDragOver ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        <Upload className="w-8 h-8" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {isDragOver ? 'Drop files here' : 'Drag & drop files'}
                        </h3>
                        <p className="text-slate-400 mb-4">
                          or click to browse your computer
                        </p>
                        <Button 
                          variant="outline" 
                          className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white"
                        >
                          Choose Files
                        </Button>
                      </div>
                      
                      <div className="text-xs text-slate-500 space-y-1">
                        <p>Supported: HTML, CSS, JS, JSON, Images, GLB/GLTF</p>
                        <p>Maximum file size: 50MB</p>
                      </div>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".html,.css,.js,.json,.jpg,.jpeg,.png,.svg,.glb,.gltf"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />

                  {/* Development Mode Alert */}
                  <Alert className="bg-amber-900/20 border-amber-700/30 text-amber-200">
                    <Zap className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Development Mode:</strong> Files are uploaded with simulated Web3.Storage integration. 
                      Full decentralized storage requires proper Web3.Storage authentication setup.
                    </AlertDescription>
                  </Alert>

                  {/* Upload Progress Section */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white mb-4">Upload Progress</h3>
                      {uploadedFiles.map((uploadFile, index) => (
                        <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              {getFileIcon(uploadFile.file.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {uploadFile.file.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {formatFileSize(uploadFile.file.size)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {uploadFile.status === 'uploading' && (
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                )}
                                {uploadFile.status === 'success' && (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                )}
                                {uploadFile.status === 'error' && (
                                  <XCircle className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                            </div>
                            
                            {uploadFile.status === 'uploading' && (
                              <Progress value={uploadFile.progress} className="h-2" />
                            )}
                            
                            {uploadFile.status === 'success' && uploadFile.result && (
                              <div className="text-xs text-green-400 mt-2 space-y-1">
                                <p>✅ Uploaded successfully!</p>
                                <p className="font-mono">CID: {uploadFile.result.cid.slice(0, 20)}...</p>
                              </div>
                            )}
                            
                            {uploadFile.status === 'error' && (
                              <p className="text-xs text-red-400 mt-2">
                                ❌ {uploadFile.error}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Please connect your wallet to start uploading files to the decentralized web
                  </p>
                  <Button 
                    variant="default" 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
