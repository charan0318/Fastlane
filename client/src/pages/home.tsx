
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'wouter';
import { 
  Upload, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Database,
  Cloud,
  Lock,
  Gauge,
  BarChart3
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Decentralized Storage",
      description: "Your files are stored on IPFS and Filecoin network for maximum reliability and censorship resistance.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Proof of Data Possession",
      description: "Cryptographic proofs ensure your data is stored securely and can be verified at any time.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Global CDN",
      description: "Lightning-fast delivery through our FilCDN network with edge caching worldwide.",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Web3 Native",
      description: "Built for the decentralized web with wallet integration and blockchain verification.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Files Stored", value: "50K+", icon: <Cloud className="w-5 h-5" /> },
    { label: "Global Nodes", value: "1000+", icon: <Globe className="w-5 h-5" /> },
    { label: "Uptime", value: "99.9%", icon: <Gauge className="w-5 h-5" /> },
    { label: "Storage Deals", value: "25K+", icon: <BarChart3 className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Web3.Storage Powered
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-none">
              <span className="bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-transparent">
                Decentralized
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Asset Delivery
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Store, verify, and deliver your digital assets with{" "}
              <span className="text-primary font-semibold">cryptographic proof</span> on the 
              decentralized web. Built on IPFS, Filecoin, and Web3.Storage.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                onClick={() => navigate('/upload')}
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
              >
                Start Uploading
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate('/demo')}
                variant="outline"
                size="lg"
                className="border-2 border-slate-600 bg-slate-800/50 backdrop-blur text-white hover:bg-slate-700/50 hover:border-slate-500 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-800/50 backdrop-blur border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-2 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-slate-800/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-primary">Fastlane CDN</span>?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built for the future of the web with cutting-edge technology and uncompromising reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-slate-900/50 backdrop-blur border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-4`}>
                    <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-slate-800 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Simple three-step process to get your assets on the decentralized web.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload & Connect",
                description: "Connect your wallet and upload your files through our intuitive interface.",
                icon: <Upload className="w-8 h-8" />
              },
              {
                step: "02", 
                title: "Store & Verify",
                description: "Files are stored on IPFS and Filecoin with cryptographic proof of possession.",
                icon: <CheckCircle className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Deliver Globally",
                description: "Access your content instantly through our global FilCDN network.",
                icon: <Globe className="w-8 h-8" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-800 border-2 border-primary/30 rounded-2xl flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-r from-primary/10 to-violet-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Go <span className="text-primary">Decentralized</span>?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Join thousands of developers already using Fastlane CDN for their Web3 applications.
          </p>
          <Button
            onClick={() => navigate('/upload')}
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
}
