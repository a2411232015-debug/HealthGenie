import React, { useState } from 'react';
import { ICONS } from '../constants';
import { editImage, fileToGenerativePart } from '../services/geminiService';

interface ImageEditorModalProps {
  onClose: () => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setEditedUrl(null);
    }
  };

  const handleEdit = async () => {
    if (!selectedFile || !prompt.trim()) return;

    setLoading(true);
    setEditedUrl(null);
    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const resultImage = await editImage(base64Data, selectedFile.type, prompt);
      setEditedUrl(resultImage);
    } catch (e) {
      alert("編輯失敗，請確認圖片或 Prompt 是否符合規範");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-emerald-400 flex items-center gap-2">
            {ICONS.Magic} AI 創意工作室
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original / Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">原始圖片</label>
              {!previewUrl ? (
                <div className="aspect-square border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center hover:bg-slate-800 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mb-2 text-slate-400">
                    {ICONS.Upload}
                  </div>
                  <span className="text-sm text-slate-400">上傳圖片</span>
                </div>
              ) : (
                <div className="relative group">
                  <img src={previewUrl} alt="Original" className="w-full aspect-square object-cover rounded-xl bg-slate-800" />
                  <button 
                    onClick={() => {setPreviewUrl(null); setSelectedFile(null); setEditedUrl(null);}}
                    className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Result */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI 生成結果</label>
              <div className="aspect-square bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
                 {loading ? (
                   <div className="flex flex-col items-center gap-3 text-emerald-500">
                     {ICONS.Loading}
                     <span className="text-sm animate-pulse">AI 正在施展魔法...</span>
                   </div>
                 ) : editedUrl ? (
                   <img src={editedUrl} alt="Edited" className="w-full h-full object-cover" />
                 ) : (
                   <div className="text-slate-600 text-sm text-center px-4">
                     等待指令...<br/>試試 "Add a retro filter"
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="輸入英文指令，例如: Add a cyber punk neon filter..."
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            />
            <button 
              onClick={handleEdit}
              disabled={loading || !selectedFile || !prompt}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {ICONS.Magic} 生成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
