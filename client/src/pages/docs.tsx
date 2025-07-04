import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudUpload, Shield, Handshake, CheckCircle, Globe, Code } from 'lucide-react';

export default function Docs() {
  return (
    <div className="min-h-screen bg-slate-900/50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Documentation</h1>
          <p className="text-slate-400">Learn how to integrate Fastlane CDN into your Web3 applications</p>
        </div>

        {/* Lifecycle Diagram */}
        <Card className="bg-surface border-slate-700 mb-8">
          <CardHeader>
            <CardTitle>Asset Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              <div className="flex items-center space-x-6 min-w-max">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <CloudUpload className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm mt-2">Upload</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-600"></div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-sm mt-2">PDP Deal</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-600"></div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-sm mt-2">Storage</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-600"></div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm mt-2">Proof</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-600"></div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-sm mt-2">CDN</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle>HTML Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                  <code>{`<img 
  src="https://gateway.filcdn.io/ipfs/QmX..."
  alt="Decentralized asset"
  loading="lazy"
>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-slate-700">
            <CardHeader>
              <CardTitle>React Hook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4">
                <pre className="text-sm font-mono text-slate-300 overflow-x-auto">
                  <code>{`const { data: asset } = useFastlane({
  cid: "QmX123...",
  fallback: "/loading.png"
});`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Reference */}
        <Card className="bg-surface border-slate-700 mb-8">
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="bg-primary/20 text-primary">POST</Badge>
                  <code className="text-sm">/api/upload</code>
                </div>
                <p className="text-slate-400 text-sm">Upload a file and create a PDP storage deal</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="bg-secondary/20 text-secondary">GET</Badge>
                  <code className="text-sm">/api/deal/:cid</code>
                </div>
                <p className="text-slate-400 text-sm">Check the status of a storage deal by CID</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="bg-secondary/20 text-secondary">GET</Badge>
                  <code className="text-sm">/api/files/:wallet</code>
                </div>
                <p className="text-slate-400 text-sm">Get all files uploaded by a wallet address</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="bg-accent/20 text-accent">POST</Badge>
                  <code className="text-sm">/api/verify/:cid</code>
                </div>
                <p className="text-slate-400 text-sm">Manually verify PDP proof for a file</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-surface border-slate-700">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">How long does storage last?</h4>
                <p className="text-slate-400">Storage deals on Filecoin are guaranteed for the duration specified in the contract. Default deals last 6 months and can be renewed.</p>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Can I verify my files are stored?</h4>
                <p className="text-slate-400">Yes! Every file gets a PDP (Proof of Data Possession) that you can verify on-chain. The deal tracker shows real-time verification status.</p>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">What networks are supported?</h4>
                <p className="text-slate-400">Currently supporting Filecoin Calibration testnet for MVP. Mainnet support coming soon with production releases.</p>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">What file types are supported?</h4>
                <p className="text-slate-400">HTML, CSS, JavaScript, JSON, images (JPEG, PNG, SVG), and 3D models (GLB/GLTF). Files up to 50MB are supported.</p>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">How fast is FilCDN delivery?</h4>
                <p className="text-slate-400">FilCDN provides edge caching with global distribution. Typical load times are under 200ms for cached assets.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
