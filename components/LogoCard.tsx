import React, { useState } from 'react';
import { LogoConcept } from '../types';
import { Palette, Sparkles, Image as ImageIcon, CheckCircle, Loader2, MessageSquare, RefreshCw, X, Wand2 } from 'lucide-react';
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
  
  // Image Editing State
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
      setImageUrl(null); // Reset image as concept changed
    } catch (err) {
      setError("Failed to refine concept. Please try again.");
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
      setError("Failed to edit image. Please try again.");
    } finally {
      setIsLoadingImageEdit(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full hover:border-primary-500/30 transition-all duration-300 shadow-xl shadow-black/20">
      
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex justify-between items-start">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-widest text-primary-500 uppercase">Concept {index + 1}</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">{concept.conceptName}</h3>
        </div>
        <button 
            onClick={() => setIsRefining(!isRefining)}
            className={`text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full ${isRefining ? 'bg-white/10 text-white' : ''}`}
            title="Refine this concept text"
        >
            {isRefining ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
        </button>
      </div>

      {/* Concept Refinement Input */}
      {isRefining && (
          <div className="p-4 bg-primary-900/20 border-b border-primary-500/20 animate-fade-in">
             <form onSubmit={handleRefineSubmit}>
                <label className="block text-xs font-semibold text-primary-400 mb-2 uppercase">Refine Concept Text</label>
                <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="E.g., Make the meaning more about sustainability..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors mb-3 resize-none h-20"
                />
                <div className="flex justify-end gap-2">
                    <button 
                        type="button"
                        onClick={() => setIsRefining(false)}
                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoadingRefinement || !feedback.trim()}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoadingRefinement ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                        Update Concept
                    </button>
                </div>
             </form>
          </div>
      )}

      {/* Content */}
      <div className="p-6 flex-grow space-y-6">
        
        {/* Meaning */}
        <div>
           <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> The Strategy
           </h4>
           <p className="text-gray-300 text-sm leading-relaxed">
             {concept.meaning}
           </p>
        </div>

        {/* Visual Description */}
        <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Visual Brief
            </h4>
            <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                <p className="text-gray-400 text-xs italic leading-relaxed">
                    "{concept.visualDescription}"
                </p>
            </div>
        </div>

        {/* Colors */}
        <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Color Palette
            </h4>
            <div className="grid grid-cols-1 gap-2">
                {concept.colorPalette.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                        <div 
                            className="w-10 h-10 rounded-md border border-white/10 shadow-sm flex-shrink-0" 
                            style={{ backgroundColor: color.hex }}
                        />
                        <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate">{color.name}</span>
                                <span className="text-[10px] text-gray-500 font-mono bg-black/40 px-1.5 py-0.5 rounded">{color.hex}</span>
                            </div>
                            <span className="text-[10px] text-primary-400 uppercase tracking-wider">{color.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Image Generation & Editing Section */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        {imageUrl ? (
          <div className="relative group animate-fade-in space-y-3">
            <div className="relative">
                <img 
                    src={imageUrl} 
                    alt={`Generated logo for ${concept.conceptName}`} 
                    className="w-full h-48 object-contain bg-white rounded-lg p-4"
                />
                
                {/* Image Actions Overlay */}
                <div className="absolute top-2 right-2 flex gap-2">
                     <button 
                        onClick={() => setIsEditingImage(!isEditingImage)}
                        className={`p-1.5 rounded-md text-white transition-all shadow-lg ${isEditingImage ? 'bg-secondary-500' : 'bg-black/70 hover:bg-black/90 opacity-0 group-hover:opacity-100'}`}
                        title="Magic Edit"
                     >
                         <Wand2 className="w-3 h-3" />
                     </button>
                     <button 
                        onClick={handleGenerateImage}
                        className="bg-black/70 p-1.5 rounded-md hover:bg-black/90 text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                        title="Regenerate from Scratch"
                     >
                         <RefreshCw className="w-3 h-3" />
                     </button>
                </div>
                <a 
                    href={imageUrl} 
                    download={`logo-concept-${index+1}.png`}
                    className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                >
                    Download
                </a>
            </div>

            {/* Image Edit Input */}
            {isEditingImage && (
                <form onSubmit={handleImageEditSubmit} className="animate-fade-in bg-white/5 p-3 rounded-lg border border-white/10">
                    <label className="block text-xs font-semibold text-secondary-400 mb-2 flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> Magic Edit Image
                    </label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={imageEditPrompt}
                            onChange={(e) => setImageEditPrompt(e.target.value)}
                            placeholder="e.g., 'Add a retro filter' or 'Make background blue'"
                            className="flex-grow bg-black/40 border border-white/10 rounded-md px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-secondary-500"
                            autoFocus
                        />
                        <button 
                            type="submit"
                            disabled={isLoadingImageEdit || !imageEditPrompt.trim()}
                            className="bg-secondary-600 hover:bg-secondary-500 text-white px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 transition-colors flex items-center justify-center min-w-[60px]"
                        >
                            {isLoadingImageEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Go'}
                        </button>
                    </div>
                </form>
            )}
            
          </div>
        ) : (
          <button
            onClick={handleGenerateImage}
            disabled={isLoadingImage}
            className="w-full py-3 rounded-lg bg-white/5 hover:bg-primary-600 hover:text-white border border-white/10 hover:border-transparent text-gray-300 font-medium text-sm transition-all flex items-center justify-center gap-2 group"
          >
            {isLoadingImage ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Visualizing...
                </>
            ) : (
                <>
                    <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Visualize Concept
                </>
            )}
          </button>
        )}
        {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default LogoCard;