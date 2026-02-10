
import React, { useState } from 'react';
import { LogoConcept } from '../types';
import { Palette, Sparkles, Image as ImageIcon, CheckCircle, Loader2, MessageSquare, RefreshCw, X, Wand2, Copy, Check } from 'lucide-react';
import * as geminiService from '../services/gemini';

interface LogoCardProps {
  concept: LogoConcept;
  index: number;
  onUpdate: (updatedConcept: LogoConcept) => void;
}

const LogoCard: React.FC<LogoCardProps> = ({ concept, index, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoadingRefinement, setIsLoadingRefinement] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageEditPrompt, setImageEditPrompt] = useState('');
  const [isLoadingImageEdit, setIsLoadingImageEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setIsLoadingImage(true);
    setError(null);
    try {
      const url = await geminiService.generateLogoVisual(concept.visualDescription);
      setImageUrl(url);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsLoadingRefinement(true);
    setError(null);
    try {
      const updatedConcept = await geminiService.refineConcept(concept, feedback);
      onUpdate(updatedConcept);
      setFeedback('');
      setIsRefining(false);
      setImageUrl(null); 
    } catch (err) {
      setError("Failed to refine concept.");
    } finally {
      setIsLoadingRefinement(false);
    }
  };

  const handleImageEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageEditPrompt.trim() || !imageUrl) return;

    setIsLoadingImageEdit(true);
    setError(null);
    try {
      const newUrl = await geminiService.editLogoVisual(imageUrl, imageEditPrompt);
      setImageUrl(newUrl);
      setImageEditPrompt('');
      setIsEditingImage(false);
    } catch (err) {
      setError("Failed to edit image.");
    } finally {
      setIsLoadingImageEdit(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary-500/40 transition-all duration-500 shadow-2xl shadow-black/40 group/card">
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent flex justify-between items-start">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest text-primary-400 uppercase bg-primary-500/10 px-2 py-0.5 rounded-full">Option {index + 1}</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white group-hover/card:text-primary-300 transition-colors">{concept.conceptName}</h3>
        </div>
        <button 
            onClick={() => setIsRefining(!isRefining)}
            className={`text-gray-400 hover:text-white transition-all p-2.5 rounded-xl ${isRefining ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-white/5 hover:bg-white/10'}`}
        >
            {isRefining ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
        </button>
      </div>

      {/* Concept Refinement Input */}
      {isRefining && (
          <div className="p-5 bg-primary-900/10 border-b border-primary-500/20 animate-fade-in">
             <form onSubmit={handleRefineSubmit} className="space-y-4">
                <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g. 'Make it look more premium' or 'Use thicker lines'..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all resize-none h-24"
                    autoFocus
                />
                <div className="flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={() => setIsRefining(false)}
                        className="px-4 py-2 text-xs text-gray-400 hover:text-white font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoadingRefinement || !feedback.trim()}
                        className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary-600/20"
                    >
                        {isLoadingRefinement ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        Update Narrative
                    </button>
                </div>
             </form>
          </div>
      )}

      {/* Content */}
      <div className="p-6 flex-grow space-y-6">
        <div>
           <h4 className="text-[10px] font-bold text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-widest">
            <CheckCircle className="w-3 h-3 text-primary-500" /> Strategic Rationale
           </h4>
           <p className="text-gray-300 text-sm leading-relaxed font-light">
             {concept.meaning}
           </p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="text-[10px] font-bold text-gray-500 flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-secondary-400" /> Visual Blueprint
            </h4>
            <p className="text-gray-400 text-xs italic leading-relaxed">
                "{concept.visualDescription}"
            </p>
        </div>

        <div>
            <h4 className="text-[10px] font-bold text-gray-500 mb-3 flex items-center gap-2 uppercase tracking-widest">
                <Palette className="w-3 h-3 text-primary-500" /> Signature Palette
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
                {concept.colorPalette.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/[0.03] p-2 rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors group/color">
                        <div 
                            className="w-11 h-11 rounded-lg border border-white/10 shadow-inner flex-shrink-0" 
                            style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate">{color.name}</span>
                                <button 
                                    onClick={() => copyToClipboard(color.hex)}
                                    className="p-1 hover:bg-white/10 rounded-md transition-all text-gray-500 hover:text-white"
                                    title="Copy HEX"
                                >
                                    {copiedHex === color.hex ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                                <span className="text-[10px] text-primary-400/80 uppercase tracking-wider font-bold">{color.type}</span>
                                <span className="text-[9px] text-gray-600 font-mono">{color.hex}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Image Generation Section */}
      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        {imageUrl ? (
          <div className="relative group animate-fade-in space-y-3">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-inner">
                <img 
                    src={imageUrl} 
                    alt={concept.conceptName} 
                    className="w-full h-56 object-contain mix-blend-multiply"
                />
                
                <div className="absolute top-3 right-3 flex gap-2">
                     <button 
                        onClick={() => setIsEditingImage(!isEditingImage)}
                        className={`p-2 rounded-xl text-white transition-all shadow-xl backdrop-blur-md ${isEditingImage ? 'bg-secondary-600' : 'bg-black/60 hover:bg-black/80'}`}
                     >
                         <Wand2 className="w-3.5 h-3.5" />
                     </button>
                     <button 
                        onClick={handleGenerateImage}
                        className="bg-black/60 p-2 rounded-xl hover:bg-black/80 text-white transition-all shadow-xl backdrop-blur-md"
                     >
                         <RefreshCw className="w-3.5 h-3.5" />
                     </button>
                </div>
                <a 
                    href={imageUrl} 
                    download={`${concept.conceptName.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                    className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-md"
                >
                    Save Asset
                </a>
            </div>

            {isEditingImage && (
                <form onSubmit={handleImageEditSubmit} className="animate-fade-in bg-white/5 p-4 rounded-xl border border-secondary-500/20">
                    <label className="block text-[10px] font-bold text-secondary-400 mb-2 uppercase tracking-widest flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> AI Refinement
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={imageEditPrompt}
                            onChange={(e) => setImageEditPrompt(e.target.value)}
                            placeholder="e.g. 'Add a blue shadow'"
                            className="flex-grow bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-secondary-500"
                        />
                        <button 
                            type="submit"
                            disabled={isLoadingImageEdit || !imageEditPrompt.trim()}
                            className="bg-secondary-600 hover:bg-secondary-500 text-white px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-50 transition-all shadow-lg shadow-secondary-600/20"
                        >
                            {isLoadingImageEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Run'}
                        </button>
                    </div>
                </form>
            )}
          </div>
        ) : (
          <button
            onClick={handleGenerateImage}
            disabled={isLoadingImage}
            className="w-full py-4 rounded-xl bg-white/5 hover:bg-primary-600 group hover:shadow-lg hover:shadow-primary-600/20 border border-white/10 hover:border-transparent text-gray-400 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-3"
          >
            {isLoadingImage ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Vector...
                </>
            ) : (
                <>
                    <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Visualize Concept
                </>
            )}
          </button>
        )}
        {error && <p className="text-red-400 text-[10px] mt-2 text-center font-bold">{error}</p>}
      </div>
    </div>
  );
};

export default LogoCard;
