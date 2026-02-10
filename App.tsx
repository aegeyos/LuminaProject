import React, { useState } from 'react';
import { generateConcepts } from './services/gemini';
import { LogoConcept, LoadingState } from './types';
import LogoCard from './components/LogoCard';
import { 
  PenTool, 
  Loader2, 
  Sparkles, 
  LayoutGrid, 
  Search, 
  MessageSquare, 
  Palette, 
  Menu, 
  X, 
  ChevronRight, 
  Github, 
  Twitter, 
  Linkedin,
  Zap,
  Layers,
  Shield,
  Monitor,
  Check,
  Star,
  ExternalLink,
  Wand2,
  MousePointer2,
  Code,
  Users,
  BookOpen,
  Scale,
  Lock
} from 'lucide-react';

const STYLES = [
  "Modern & Minimalist",
  "Elegant & Luxury",
  "Bold & Geometric",
  "Playful & Cartoon",
  "Vintage & Retro",
  "Abstract & Tech",
  "Hand-Drawn & Organic",
  "Futuristic & Neon"
];

type View = 'HOME' | 'FEATURES' | 'SHOWCASE' | 'PRICING' | 'API' | 'ABOUT' | 'BLOG' | 'CAREERS' | 'PRIVACY' | 'TERMS';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [concepts, setConcepts] = useState<LogoConcept[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !industry.trim()) return;

    setLoadingState(LoadingState.GENERATING_CONCEPTS);
    setError(null);
    setConcepts([]);

    try {
      const results = await generateConcepts(businessName, industry, selectedStyle);
      setConcepts(results);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setError("Failed to generate concepts. Please check your API key and try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleUpdateConcept = (index: number, updatedConcept: LogoConcept) => {
    const newConcepts = [...concepts];
    newConcepts[index] = updatedConcept;
    setConcepts(newConcepts);
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHome = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          Lumina AI v2.0 Live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">
          Craft Your Identity <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-shimmer bg-[length:200%_100%]">
            in Seconds
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Transform your business idea into a professional brand concept. 
          Get detailed briefs, curated color palettes, and instant visual mockups powered by Gemini.
        </p>
      </div>

      {/* App Functionality */}
      <div className="max-w-2xl mx-auto mb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <form onSubmit={handleSubmit} className="glass-panel p-1 rounded-2xl shadow-2xl shadow-black/50">
           <div className="bg-[#09090b]/80 p-8 rounded-xl border border-white/5 backdrop-blur-sm">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                  <label htmlFor="businessName" className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Business Name</label>
                  <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-400">
                          <LayoutGrid className="h-5 w-5 text-gray-600" />
                      </div>
                      <input
                          type="text"
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all sm:text-sm hover:bg-white/10 focus:bg-black/40"
                          placeholder="e.g. Acme Corp"
                          required
                      />
                  </div>
              </div>

              <div className="space-y-2">
                  <label htmlFor="industry" className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Industry / Theme</label>
                  <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-400">
                          <Search className="h-5 w-5 text-gray-600" />
                      </div>
                      <input
                          type="text"
                          id="industry"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all sm:text-sm hover:bg-white/10 focus:bg-black/40"
                          placeholder="e.g. Sustainable Coffee"
                          required
                      />
                  </div>
              </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-4 mb-8">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Design Aesthetic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STYLES.map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setSelectedStyle(style)}
                          className={`
                              py-2.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 border text-center relative overflow-hidden group
                              ${selectedStyle === style 
                                  ? 'bg-primary-900/40 border-primary-500 text-primary-200 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                                  : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
                              }
                          `}
                        >
                          <span className="relative z-10">{style}</span>
                          {selectedStyle === style && <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent pointer-events-none" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-2">
              <button
                  type="submit"
                  disabled={loadingState === LoadingState.GENERATING_CONCEPTS}
                  className="w-full group relative flex justify-center items-center py-4 px-4 border border-white/10 rounded-xl text-sm font-bold text-white overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {/* Button Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:via-secondary-500 group-hover:to-primary-600 opacity-90 group-hover:opacity-100" />
                  
                  {/* Button Content */}
                  <div className="relative flex items-center gap-2">
                    {loadingState === LoadingState.GENERATING_CONCEPTS ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Crafting Brand Identity...</span>
                    </>
                    ) : (
                    <>
                        <Sparkles className="h-5 w-5" />
                        <span>Generate Concepts</span>
                        <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </>
                    )}
                  </div>
              </button>
            </div>
           </div>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-sm animate-fade-in backdrop-blur-md">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {loadingState === LoadingState.SUCCESS && concepts.length > 0 && (
          <div className="space-y-12 animate-fade-in-up">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Design Concepts</h2>
                    <p className="text-gray-400 text-sm">Created for <span className="text-primary-400 font-semibold">{businessName}</span></p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-500 flex items-center justify-end gap-2">
                       <MessageSquare className="w-3 h-3" />
                       Tip: Click the chat icon to refine a concept
                    </p>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {concepts.map((concept, idx) => (
                      <LogoCard 
                          key={idx} 
                          concept={concept} 
                          index={idx} 
                          onUpdate={(updated) => handleUpdateConcept(idx, updated)}
                      />
                  ))}
              </div>
          </div>
      )}
    </div>
  );

  const renderFeatures = () => (
    <div className="animate-fade-in max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Powerful Brand Intelligence</h2>
        <p className="text-gray-400 text-lg">Every detail of your visual identity, automated and refined by AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: <Sparkles className="w-6 h-6 text-primary-400" />,
            title: "Conceptual Storytelling",
            description: "Gemini doesn't just design; it theorizes. Every logo comes with a strategic 'Why' that connects your brand to your audience."
          },
          {
            icon: <Palette className="w-6 h-6 text-secondary-400" />,
            title: "Color Psychology",
            description: "Receive exact HEX codes for Primary, Secondary, and Accent colors, curated based on industry trends and psychological impact."
          },
          {
            icon: <Wand2 className="w-6 h-6 text-primary-400" />,
            title: "Magic Visualizations",
            description: "Instantly turn a text-based brief into a high-fidelity vector mockup. Perfect for social media, business cards, and websites."
          },
          {
            icon: <MessageSquare className="w-6 h-6 text-secondary-400" />,
            title: "Iterative Refinement",
            description: "Not quite right? Talk to the AI. Give feedback like 'Make it more playful' and watch the brief and visual update instantly."
          },
          {
            icon: <Shield className="w-6 h-6 text-primary-400" />,
            title: "Commercial Ready",
            description: "Generate unique concepts that avoid the 'stock look'. Our prompts are engineered for high-end, award-standard aesthetics."
          },
          {
            icon: <Zap className="w-6 h-6 text-secondary-400" />,
            title: "Ultra-Fast Workflow",
            description: "Go from 'no idea' to 'complete brand board' in under 60 seconds. Spend your time building, not just brainstorming."
          }
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-all duration-300">
            <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderShowcase = () => (
    <div className="animate-fade-in max-w-7xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Community Showcase</h2>
        <p className="text-gray-400 text-lg">Real concepts generated by Lumina users around the world.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { name: "Verdant Brew", industry: "Eco-Coffee", style: "Minimalist", color: "#16a34a" },
          { name: "Nebula Tech", industry: "SaaS", style: "Abstract & Tech", color: "#8b5cf6" },
          { name: "Oasis Realty", industry: "Real Estate", style: "Luxury", color: "#d97706" },
          { name: "Cyber Pulse", industry: "E-Sports", style: "Futuristic", color: "#ec4899" },
          { name: "Bloom & Stem", industry: "Florist", style: "Hand-Drawn", color: "#f472b6" },
          { name: "Iron Vault", industry: "Cybersecurity", style: "Geometric", color: "#3f3f46" }
        ].map((item, i) => (
          <div key={i} className="glass-panel rounded-2xl overflow-hidden group border border-white/5 hover:border-primary-500/30 transition-all">
            <div className="h-64 bg-white/5 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10" style={{ backgroundColor: item.color }}></div>
               <div className="relative flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-white/20 group-hover:scale-110 transition-transform duration-500">
                    <Star className="w-10 h-10 text-white/40" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-white tracking-tight">{item.name}</span>
               </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">{item.industry}</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">{item.style}</span>
              </div>
              <p className="text-sm text-gray-500 italic">"A fusion of elegance and functionality."</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="animate-fade-in max-w-6xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-400 text-lg">Scale your creativity without breaking the bank.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Hobbyist",
            price: "$0",
            period: "forever",
            features: ["5 Concepts per month", "Standard Visualizations", "Community Access", "Public Gallery"],
            cta: "Get Started",
            highlight: false
          },
          {
            name: "Designer Pro",
            price: "$29",
            period: "per month",
            features: ["Unlimited Concepts", "4K High-Res Exports", "Magic Image Editing", "Brand Board PDF Exports", "Private Mode"],
            cta: "Start Free Trial",
            highlight: true
          },
          {
            name: "Agency",
            price: "$99",
            period: "per month",
            features: ["Shared Team Workspace", "Client Presentation Mode", "Custom AI Fine-tuning", "Priority Support", "Whitelabel Exports"],
            cta: "Contact Sales",
            highlight: false
          }
        ].map((plan, i) => (
          <div key={i} className={`glass-panel p-1 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${plan.highlight ? 'border-primary-500 shadow-2xl shadow-primary-500/10' : 'border-white/5'}`}>
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest z-20">
                Most Popular
              </div>
            )}
            <div className="bg-[#09090b]/60 p-10 rounded-[1.4rem] h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm">/{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-primary-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.highlight ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}>
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApi = () => (
    <div className="animate-fade-in max-w-4xl mx-auto py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-bold text-white mb-4 flex items-center gap-3">
          <Code className="text-primary-500" /> Lumina API
        </h2>
        <p className="text-gray-400 text-lg">Integrate our design intelligence directly into your own applications.</p>
      </div>

      <div className="space-y-8">
        <div className="glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
          <p className="text-gray-400 mb-6">Our RESTful API allows you to programmatically generate brand concepts and visualizations. All requests require an `Authorization` header with your API key.</p>
          <pre className="bg-black/50 p-4 rounded-lg font-mono text-sm text-primary-300 border border-white/5 overflow-x-auto whitespace-pre-wrap">
{`curl -X POST https://api.lumina.ai/v1/concepts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"business": "Aero", "industry": "Drones"}'`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest text-secondary-400">Endpoints</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>/v1/generate-concept</span>
                <span className="text-green-500 font-bold">POST</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>/v1/visualize</span>
                <span className="text-green-500 font-bold">POST</span>
              </li>
              <li className="flex justify-between">
                <span>/v1/user/usage</span>
                <span className="text-blue-500 font-bold">GET</span>
              </li>
            </ul>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest text-primary-400">Rate Limits</h4>
            <p className="text-sm text-gray-500 mb-4">Standard tier limits are designed for small-scale production.</p>
            <div className="flex items-center gap-2 text-white font-bold">
              <Zap className="w-4 h-4 text-yellow-500" /> 100 req / minute
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-fade-in max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-white mb-6">The Future of Brand Identity</h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
          We believe high-quality design should be accessible to every entrepreneur, instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Lumina was born from the idea that the first spark of a business shouldn't be held back by design complexity. By leveraging the advanced reasoning of Gemini AI, we help founders visualize their ideas before they even write a business plan.
          </p>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500">500k+</div>
              <div className="text-xs text-gray-500 uppercase tracking-tighter">Logos Generated</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-500">120+</div>
              <div className="text-xs text-gray-500 uppercase tracking-tighter">Countries Reached</div>
            </div>
          </div>
        </div>
        <div className="glass-panel p-8 rounded-3xl border-primary-500/20 rotate-3 shadow-2xl shadow-primary-500/5">
          <div className="aspect-square bg-gradient-to-tr from-primary-900 to-secondary-900 rounded-2xl flex items-center justify-center">
            <PenTool className="w-32 h-32 text-white/20 animate-pulse-slow" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Powered by Google Gemini</h3>
        <p className="text-gray-400 mb-8">Lumina utilizes cutting-edge multimodal models to understand the nuance of your industry and translate abstract concepts into visual language.</p>
        <button onClick={() => navigateTo('HOME')} className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">
          Try Lumina Now
        </button>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="animate-fade-in max-w-7xl mx-auto py-12">
      <div className="mb-16">
        <h2 className="text-4xl font-serif font-bold text-white mb-4 flex items-center gap-3">
          <BookOpen className="text-primary-500" /> Design Thinking Blog
        </h2>
        <p className="text-gray-400 text-lg">Insights on branding, AI, and the future of creative work.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "The Psychology of Neon in Branding", date: "May 12, 2024", tag: "Case Study" },
          { title: "How Gemini 2.5 is Changing Logo Design", date: "May 08, 2024", tag: "AI Tech" },
          { title: "Minimalism vs. Maximalism: 2024 Trends", date: "May 01, 2024", tag: "Trends" },
          { title: "Negative Space: The Hidden Secret of Luxury", date: "April 25, 2024", tag: "Design Tips" },
          { title: "Building a Brand Identity from Scratch", date: "April 18, 2024", tag: "Guide" },
          { title: "Why Your Business Name Matters", date: "April 12, 2024", tag: "Branding" }
        ].map((post, i) => (
          <div key={i} className="glass-panel group rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all cursor-pointer">
            <div className="h-48 bg-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent opacity-60" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-600 text-white px-2 py-1 rounded">{post.tag}</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-gray-500 mb-2">{post.date}</p>
              <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors mb-4">{post.title}</h3>
              <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-white">
                Read More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCareers = () => (
    <div className="animate-fade-in max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Users className="text-secondary-400" /> Join Our Mission
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">We're building the infrastructure for the next generation of creative tools. Come build with us.</p>
      </div>

      <div className="space-y-6">
        {[
          { role: "Senior AI Product Designer", team: "Design", loc: "Remote / SF" },
          { role: "Staff Frontend Engineer (React)", team: "Engineering", loc: "Remote" },
          { role: "LLM Fine-Tuning Specialist", team: "AI Research", loc: "London / Hybrid" },
          { role: "Head of Marketing", team: "Growth", loc: "New York" }
        ].map((job, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition-all group cursor-pointer">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{job.role}</h3>
              <div className="flex gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {job.team}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.loc}</span>
              </div>
            </div>
            <button className="px-6 py-2 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLegal = (title: string, content: string[]) => (
    <div className="animate-fade-in max-w-3xl mx-auto py-12">
      <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">{title}</h2>
      <div className="space-y-6 text-gray-400 leading-relaxed text-sm">
        {content.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-primary-500 selection:text-white bg-[#09090b]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              onClick={() => navigateTo('HOME')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="bg-gradient-to-tr from-primary-600 to-secondary-500 p-2 rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary-500/20">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-primary-100 transition-colors">
                Lumina
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigateTo('FEATURES')}
                className={`text-sm font-medium transition-colors ${currentView === 'FEATURES' ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}
              >
                Features
              </button>
              <button 
                onClick={() => navigateTo('SHOWCASE')}
                className={`text-sm font-medium transition-colors ${currentView === 'SHOWCASE' ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}
              >
                Showcase
              </button>
              <button 
                onClick={() => navigateTo('PRICING')}
                className={`text-sm font-medium transition-colors ${currentView === 'PRICING' ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}
              >
                Pricing
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all">
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-nav border-t border-white/5 absolute w-full animate-fade-in">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <button onClick={() => navigateTo('FEATURES')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">Features</button>
              <button onClick={() => navigateTo('SHOWCASE')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">Showcase</button>
              <button onClick={() => navigateTo('PRICING')} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md">Pricing</button>
              <div className="pt-4 mt-4 border-t border-white/5">
                <button className="w-full px-4 py-3 text-center font-medium text-white bg-primary-600 rounded-lg">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-24 pb-12 relative z-10 px-4 sm:px-6 lg:px-8">
          {currentView === 'HOME' && renderHome()}
          {currentView === 'FEATURES' && renderFeatures()}
          {currentView === 'SHOWCASE' && renderShowcase()}
          {currentView === 'PRICING' && renderPricing()}
          {currentView === 'API' && renderApi()}
          {currentView === 'ABOUT' && renderAbout()}
          {currentView === 'BLOG' && renderBlog()}
          {currentView === 'CAREERS' && renderCareers()}
          {currentView === 'PRIVACY' && renderLegal("Privacy Policy", [
            "At Lumina, we take your privacy seriously. This policy describes what information we collect and how we use it to provide our logo generation services.",
            "We collect information that you provide directly to us when you use the generator, such as your business name and industry. This data is used to generate brand concepts through the Gemini API.",
            "Lumina does not sell your personal data or generated designs to third parties. Generated concepts and images are stored temporarily for your session unless saved to an account.",
            "We use cookies and similar tracking technologies to analyze how our service is used and to improve the performance of our application. You can control cookie settings through your browser.",
            "Updates to this policy will be posted here. Continued use of our service after changes constitutes acceptance of the updated policy."
          ])}
          {currentView === 'TERMS' && renderLegal("Terms of Service", [
            "By using Lumina Logo Concepts, you agree to comply with these terms of service. Please read them carefully.",
            "Ownership of generated content: Users retain full commercial rights to the specific visual compositions generated for them, subject to standard trademark and copyright laws. Lumina does not claim ownership of your brand identity.",
            "Prohibited use: You may not use Lumina to generate content that is illegal, harmful, threatening, or infringing on the intellectual property rights of others.",
            "Service availability: We strive to maintain 99.9% uptime, but Lumina is provided 'as is' without warranty of any kind. We are not liable for any damages resulting from service interruptions or AI-generated inaccuracies.",
            "Termination: We reserve the right to suspend or terminate access to Lumina for any user who violates these terms or engages in excessive usage that impacts our infrastructure."
          ])}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050507] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div 
                onClick={() => navigateTo('HOME')}
                className="flex items-center gap-2 mb-4 cursor-pointer"
              >
                <PenTool className="w-5 h-5 text-primary-500" />
                <span className="font-serif font-bold text-lg text-white">Lumina</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Empowering businesses with AI-driven brand identity concepts instantly.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><button onClick={() => navigateTo('FEATURES')} className="hover:text-primary-400 transition-colors">Features</button></li>
                <li><button onClick={() => navigateTo('PRICING')} className="hover:text-primary-400 transition-colors">Pricing</button></li>
                <li><button onClick={() => navigateTo('API')} className="hover:text-primary-400 transition-colors">API</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><button onClick={() => navigateTo('ABOUT')} className="hover:text-primary-400 transition-colors">About</button></li>
                <li><button onClick={() => navigateTo('BLOG')} className="hover:text-primary-400 transition-colors">Blog</button></li>
                <li><button onClick={() => navigateTo('CAREERS')} className="hover:text-primary-400 transition-colors">Careers</button></li>
              </ul>
            </div>

            <div>
               <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
               <ul className="space-y-2 text-sm text-gray-500">
                <li><button onClick={() => navigateTo('PRIVACY')} className="hover:text-primary-400 transition-colors">Privacy</button></li>
                <li><button onClick={() => navigateTo('TERMS')} className="hover:text-primary-400 transition-colors">Terms</button></li>
               </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Lumina Concepts AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;