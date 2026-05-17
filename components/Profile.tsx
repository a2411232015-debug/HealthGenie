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

  const bmi = React.useMemo(() => {
    const h = formData.height;
    const w = formData.weight;
    if (!h || !w || h <= 0 || w <= 0) return null;
    return Number((w / Math.pow(h / 100, 2)).toFixed(1));
  }, [formData.height, formData.weight]);

  const bmiStyle = React.useMemo(() => {
    if (bmi === null) return { label: '--', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
    if (bmi < 18.5) return { label: '體重過輕', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (bmi < 24) return { label: '健康體位', color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-200' };
    if (bmi < 27) return { label: '體重過重', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { label: '肥胖', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
  }, [bmi]);

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

  // Weight Logging Actions
  const [logWeight, setLogWeight] = useState<number>(
    weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : data.weight
  );

  const [timeframe, setTimeframe] = useState<'7d'|'30d'|'90d'|'all'>('7d');

  const filteredWeightHistory = React.useMemo(() => {
    switch (timeframe) {
      case '7d': return weightHistory.slice(-7);
      case '30d': return weightHistory.slice(-30);
      case '90d': return weightHistory.slice(-90);
      case 'all': return weightHistory;
      default: return weightHistory;
    }
  }, [timeframe, weightHistory]);

  const handleLogWeight = () => {
    const newData = { ...formData, weight: logWeight };
    setFormData(newData);
    onSave(newData);
  };

  const weightComparison = React.useMemo(() => {
    if (weightHistory.length < 1) return null;
    const targetW = formData.targetWeight ?? 65;
    
    // 與上一筆紀錄比較 (若原本只有 1 筆則都是當日，視為持平)
    const prevWeight = weightHistory.length >= 2 ? weightHistory[weightHistory.length - 2].weight : weightHistory[0].weight;
    const todayWeight = logWeight;
    const diff = Number((todayWeight - prevWeight).toFixed(1));
    const targetDistance = Number((todayWeight - targetW).toFixed(1));
    
    if (diff < 0) {
      return { text: `📉 比上次減少 ${Math.abs(diff)} kg`, style: 'text-green-600 bg-green-50 border-green-100', diff, targetDistance, targetW };
    } else if (diff > 0) {
      return { text: `📈 比上次增加 ${diff} kg`, style: 'text-red-500 bg-red-50 border-red-100', diff, targetDistance, targetW };
    }
    return { text: `➖ 與上次持平`, style: 'text-gray-500 bg-gray-50 border-gray-100', diff, targetDistance, targetW };
  }, [logWeight, weightHistory, formData.targetWeight]);

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

        {/* Weight Logging Card (New) */}
        <div className="mx-6 mb-6 mt-6 p-5 border border-slate-100 bg-white rounded-xl shadow-sm text-center">
          <h3 className="font-bold text-slate-700 mb-4 items-center justify-center gap-2">
            ✏️ 今日體重紀錄
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 justify-center">
              <input 
                type="number" 
                step="0.1"
                value={logWeight}
                onChange={(e) => setLogWeight(Number(e.target.value))}
                className="w-32 text-center text-2xl font-bold text-slate-800 p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
              />
              <span className="font-bold text-slate-400">kg</span>
            </div>
            <button 
              type="button"
              onClick={handleLogWeight}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md shadow-teal-500/20 active:scale-95 transition-all"
            >
              儲存今日體重
            </button>
          </div>
          
          {/* Comparison Result */}
          {weightComparison && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-lg border ${weightComparison.style}`}>
                {weightComparison.text}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                🎯 距離目標 {weightComparison.targetW}kg 還差 {Math.abs(weightComparison.targetDistance)}kg，繼續保持！
              </span>
            </div>
          )}
        </div>

        {/* Weight Trend Section */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                {ICONS.Activity} 體重趨勢
              </h3>
              <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 border border-teal-100 rounded-full font-bold ml-2">
                目標: {formData.targetWeight ?? 65} kg
              </span>
            </div>
            
            {/* Timeframe Toggles */}
            <div className="bg-slate-100 p-1 rounded-lg inline-flex" role="group">
              {[
                { label: '7天', val: '7d' }, 
                { label: '30天', val: '30d' }, 
                { label: '90天', val: '90d' },
                { label: '全部', val: 'all' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setTimeframe(opt.val as any)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    timeframe === opt.val
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2">
            <WeightChart data={filteredWeightHistory} targetWeight={formData.targetWeight ?? 65} />
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

          {/* BMI Result Card */}
          <div className={`p-4 rounded-xl border ${bmiStyle.bg} ${bmiStyle.border} flex items-center justify-between transition-colors duration-300`}>
            <div>
              <p className="text-sm font-bold text-slate-600 mb-1">BMI 數值</p>
              <div className="text-3xl font-black text-slate-800">
                {bmi !== null ? bmi : '--'}
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-white ${bmiStyle.color} shadow-sm border border-white/50`}>
                {bmiStyle.label}
              </span>
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
