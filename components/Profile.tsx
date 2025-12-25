import React, { useState } from 'react';
import { ActivityLevel, Gender, UserProfile, WeightData } from '../types';
import { ICONS } from '../constants';
import { WeightChart } from './WeightChart';

interface ProfileProps {
  data: UserProfile;
  weightHistory: WeightData[];
  onSave: (data: UserProfile) => void;
  onAdminAccess: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ data, weightHistory, onSave, onAdminAccess }) => {
  const [formData, setFormData] = useState<UserProfile>(data);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden mb-6">
        <div className="bg-primary-600 p-8 text-white text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4 backdrop-blur-md">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold">個人生理數據</h2>
          <p className="text-primary-100 mt-2">精準的數據能協助 AI 提供更棒的建議</p>
        </div>

        {/* Weight Trend Section */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              {ICONS.Activity} 體重趨勢 (近 7 天)
            </h3>
            <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full font-bold">
              目標: {formData.weight - 5} kg
            </span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2">
            <WeightChart data={weightHistory} targetWeight={formData.weight - 5} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">性別</label>
              <div className="flex gap-4">
                {[Gender.MALE, Gender.FEMALE].map(g => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleChange('gender', g)}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${formData.gender === g
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">年齡</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">身高 (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">體重 (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">日常活動量</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => handleChange('activityLevel', e.target.value as ActivityLevel)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
            >
              {Object.values(ActivityLevel).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2
              ${isSaved
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-800/30'
              }`}
          >
            {isSaved ? '已儲存設定 ✓' : '儲存變更'}
          </button>
        </form>
      </div>

      {/* Hidden Admin Entry */}
      <div className="text-center mt-8">
        <button
          onClick={onAdminAccess}
          className="text-slate-400 text-xs font-medium hover:text-primary-600 hover:underline transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          {ICONS.Admin}
          <span>我是合作商家 (Merchant Login)</span>
        </button>
      </div>
    </div>
  );
};
