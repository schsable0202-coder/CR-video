import React, { useState, useRef } from 'react';
import { X, Crop, Check, Sparkles, Move, Maximize } from 'lucide-react';
import { ProcessingSettings } from '../types';

interface WatermarkSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  settings: ProcessingSettings;
  onSave: (watermarkBox: ProcessingSettings['watermarkBox']) => void;
}

export const WatermarkSelectorModal: React.FC<WatermarkSelectorModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  settings,
  onSave
}) => {
  const [box, setBox] = useState(settings.watermarkBox || { x: 74, y: 5, width: 22, height: 12 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const presets = [
    { name: 'Top-Right (Standard Broadcaster)', x: 74, y: 5, width: 22, height: 12 },
    { name: 'Top-Left (Station ID)', x: 4, y: 5, width: 22, height: 12 },
    { name: 'Bottom-Right (Static Bug)', x: 74, y: 82, width: 22, height: 14 },
    { name: 'Bottom-Left (Live Streamer Tag)', x: 4, y: 82, width: 22, height: 14 },
  ];

  const handleApply = () => {
    onSave(box);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Spatial Watermark / Logo Inpaint Target</h3>
              <p className="text-xs text-[#94a3b8]">Select the region containing station logos or watermark bugs to inpaint</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container with interactive overlay box */}
        <div className="px-5 py-2">
          <div 
            ref={containerRef}
            className="relative bg-black rounded-xl aspect-video overflow-hidden border border-white/10 flex items-center justify-center select-none"
          >
            {videoUrl ? (
              <video 
                src={videoUrl} 
                className="w-full h-full object-contain pointer-events-none"
                muted 
                autoPlay 
                loop 
                playsInline
              />
            ) : (
              <div className="text-[#94a3b8] font-mono text-xs">No video stream loaded</div>
            )}

            {/* Bounding Box Overlay */}
            <div 
              className="absolute border-2 border-dashed border-[#06b6d4] bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded flex flex-col justify-between p-1 cursor-move transition-all"
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.width}%`,
                height: `${box.height}%`
              }}
            >
              <div className="bg-[#06b6d4] text-black font-mono font-bold text-[9px] px-1 py-0.5 rounded flex items-center gap-1 self-start shadow">
                <Sparkles className="w-2.5 h-2.5" /> ERASE REGION
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-cyan-300 bg-black/60 px-1 py-0.5 rounded">
                <span>{box.width}% × {box.height}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Presets and sliders */}
        <div className="px-5 space-y-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Quick Corner Presets</span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setBox({ x: p.x, y: p.y, width: p.width, height: p.height })}
                  className="p-2 rounded-lg text-left text-xs bg-[#0f172a] hover:bg-[#111827] border border-white/5 hover:border-cyan-500/50 text-slate-300 transition-all flex items-center justify-between"
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">[{p.x}%, {p.y}%]</span>
                </button>
              ))}
            </div>
          </div>

          {/* Coordinate Sliders */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
            <div>
              <span className="text-[10px] font-mono text-[#94a3b8]">X Position ({box.x}%)</span>
              <input 
                type="range" 
                min="0" 
                max="80" 
                value={box.x}
                onChange={(e) => setBox({ ...box, x: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-[#334155] rounded accent-[#06b6d4] cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#94a3b8]">Y Position ({box.y}%)</span>
              <input 
                type="range" 
                min="0" 
                max="80" 
                value={box.y}
                onChange={(e) => setBox({ ...box, y: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-[#334155] rounded accent-[#06b6d4] cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#94a3b8]">Box Width ({box.width}%)</span>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={box.width}
                onChange={(e) => setBox({ ...box, width: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-[#334155] rounded accent-[#06b6d4] cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#94a3b8]">Box Height ({box.height}%)</span>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={box.height}
                onChange={(e) => setBox({ ...box, height: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-[#334155] rounded accent-[#06b6d4] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-end gap-2 bg-[#111827]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94a3b8] hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#06b6d4] hover:bg-[#0891b2] text-black shadow-lg transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Inpaint Region</span>
          </button>
        </div>
      </div>
    </div>
  );
};
