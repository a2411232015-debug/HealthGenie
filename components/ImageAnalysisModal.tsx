import React, { useState } from 'react';
import { ICONS } from '../constants';
import { analyzeFoodImage, fileToGenerativePart } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface ImageAnalysisModalProps {
  onClose: () => void;
}

export const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const analysis = await analyzeFoodImage(base64Data, selectedFile.type);
      setResult(analysis);
    } catch (e) {
      alert("分析失敗，請重試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-primary-50">
          <h3 className="font-bold text-primary-800 flex items-center gap-2">
            {ICONS.Camera} AI 食物營養分析
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!previewUrl ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
                {ICONS.Upload}
              </div>
              <p className="text-slate-600 font-medium">點擊上傳食物照片</p>
              <p className="text-slate-400 text-sm mt-1">支援 JPG, PNG</p>
            </div>
          ) : (
            <div className="space-y-4">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
              
              {!result && (
                 <button 
                 onClick={handleAnalyze}
                 disabled={loading}
                 className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
               >
                 {loading ? <>{ICONS.Loading} 分析中...</> : <>{ICONS.Magic} 開始分析</>}
               </button>
              )}
             
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <h4 className="font-bold text-emerald-800 text-lg mb-1">{result.foodName}</h4>
                <div className="flex gap-4 text-sm text-emerald-700 mb-2">
                  <span className="bg-white px-2 py-0.5 rounded shadow-sm">🔥 {result.calories}</span>
                </div>
                <p className="text-emerald-900 text-sm">{result.nutrients}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">AI 建議</h5>
                <p className="text-slate-600 text-sm leading-relaxed">{result.advice}</p>
              </div>
              <button onClick={() => {setPreviewUrl(null); setSelectedFile(null); setResult(null);}} className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm">
                分析下一張
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
