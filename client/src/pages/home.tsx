import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Code, Rocket } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, navigate] = useLocation();

  const scrollToSection = (section: string) => {
    navigate(`/${section}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Upload & Deliver <span className="text-primary">Decentralized</span> Assets Instantly
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              A decentralized content delivery network for Web3, powered by Web3.Storage for IPFS and Filecoin storage. Deploy your frontend assets with decentralized, censorship-resistant delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/upload')}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
                size="lg"
              >
                Start Uploading
              </Button>
              <Button
                onClick={() => navigate('/demo')}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 px-8 py-3 text-lg"
                size="lg"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Fastlane CDN?</h2>
            <p className="text-slate-400">Built for Web3 developers who need verifiable, censorship-resistant content delivery</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-surface border-slate-700">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">PDP Storage Proofs</h3>
                <p className="text-slate-400">Every file is backed by cryptographic Proof of Data Possession on Filecoin, ensuring your content is verifiably stored.</p>
              </CardContent>
            </Card>
            <Card className="bg-surface border-slate-700">
              <CardContent className="p-6">
                <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-secondary text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant CDN Delivery</h3>
                <p className="text-slate-400">FilCDN edge caching ensures your assets load instantly from a globally distributed network.</p>
              </CardContent>
            </Card>
            <Card className="bg-surface border-slate-700">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Code className="text-accent text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">React Compatible</h3>
                <p className="text-slate-400">Drop-in compatibility with React, Next.js, and any frontend framework. No vendor lock-in.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
