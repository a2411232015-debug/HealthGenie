import React, { useState } from 'react';
import { ICONS } from '../constants';
import { MealRecommendation } from '../types';
import { Phone, Save, Check } from 'lucide-react';

interface AdminPanelProps {
  meals: MealRecommendation[];
  onAddMeal: (meal: MealRecommendation) => void;
  onUpdateMeal: (meal: MealRecommendation) => void;
  onBack: () => void;
}

type AdminView = 'analytics' | 'menu' | 'store';
type MenuMode = 'manual' | 'ai';

export const AdminPanel: React.FC<AdminPanelProps> = ({ meals, onAddMeal, onUpdateMeal, onBack }) => {
  const [currentView, setCurrentView] = useState<AdminView>('menu');

  // --- Store Profile State ---
  const [storeProfile, setStoreProfile] = useState({
    name: '我的健康餐盒',
    phone: '02-2345-6789',
    address: '台北市信義區信義路五段7號',
    lat: '25.0330',
    lng: '121.5654',
    hours: '11:00 - 20:30'
  });

  // --- Toast State ---
  const [showToast, setShowToast] = useState(false);

  // --- Menu Manager State ---
  const [menuMode, setMenuMode] = useState<MenuMode>('manual');
  const [importUrl, setImportUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewMode, setReviewMode] = useState(false); // Enable yellow warning borders
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    merchant: '我的健康餐盒',
    calories: '',
    price: '',
    protein: '',
    fat: '',
    carbs: '',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  });

  // --- Actions ---

  const handleSaveStore = () => {
    // In a real app, this would send an API request
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAiImport = () => {
    if (!importUrl) return;
    setIsAnalyzing(true);

    // Simulate AI Analysis Delay
    setTimeout(() => {
      // Mock AI Result
      setForm({
        name: '特製藜麥舒肥嫩雞 (UberEats 熱銷)',
        merchant: storeProfile.name, // Sync with store profile
        calories: '485',
        price: '180',
        protein: '42',
        fat: '12',
        carbs: '45',
        imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80'
      });
      setIsAnalyzing(false);
      setReviewMode(true);
      setMenuMode('manual'); // Switch to form view to review
    }, 3000);
  };

  const handleEditClick = (meal: MealRecommendation) => {
    setEditingId(meal.id);
    setForm({
      name: meal.name,
      merchant: meal.merchant,
      calories: meal.calories.toString(),
      price: meal.price.toString(),
      protein: meal.macros.protein.toString(),
      fat: meal.macros.fat.toString(),
      carbs: meal.macros.carbs.toString(),
      imageUrl: meal.imageUrl
    });
    setMenuMode('manual');
    setActiveDropdownId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mealData: MealRecommendation = {
      id: editingId || `m${Date.now()}`,
      name: form.name,
      merchant: form.merchant,
      distance: 0.5,
      calories: Number(form.calories),
      price: Number(form.price),
      imageUrl: form.imageUrl,
      macros: {
        protein: Number(form.protein) || Math.round((Number(form.calories) * 0.3) / 4),
        fat: Number(form.fat) || Math.round((Number(form.calories) * 0.3) / 9),
        carbs: Number(form.carbs) || Math.round((Number(form.calories) * 0.4) / 4),
      }
    };

    if (editingId) {
      onUpdateMeal(mealData);
      alert('餐點修改成功！');
    } else {
      onAddMeal(mealData);
      alert('餐點上架成功！已發佈至客戶端。');
    }

    // Reset
    setForm({ ...form, name: '', calories: '', price: '' });
    setReviewMode(false);
    setImportUrl('');
    setEditingId(null);
  };

  // --- Sub-Components (Render Functions) ---

  const renderSidebar = () => (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          {ICONS.Admin}
          <span>商家後台</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">v2.4.0 Pro</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setCurrentView('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'analytics' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800'}`}
        >
          {ICONS.Analytics} 數據總覽
        </button>
        <button
          onClick={() => setCurrentView('menu')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'menu' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800'}`}
        >
          {ICONS.MealPlan} 菜單管理
        </button>
        <button
          onClick={() => setCurrentView('store')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'store' ? 'bg-primary-600 text-white' : 'hover:bg-slate-800'}`}
        >
          {ICONS.Store} 店家資訊
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onBack}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-all"
        >
          {ICONS.Logout} 返回 App
        </button>
      </div>
    </aside>
  );

  const renderAnalytics = () => {
    // Mock Data for Analytics Visualization
    const trafficData = [45, 62, 58, 85, 92, 115, 128]; // Last 7 days
    const maxTraffic = Math.max(...trafficData);
    const topMeals = [
      { name: '舒肥雞胸藜麥餐盒', clicks: 342, growth: '+12%' },
      { name: '香煎鮭魚五穀飯', clicks: 215, growth: '+5%' },
      { name: '炙燒鮪魚波奇碗', clicks: 184, growth: '-2%' },
    ];

    // Simple SVG Line Chart logic
    const chartHeight = 60;
    const chartWidth = 200;
    const points = trafficData.map((val, i) => {
      const x = (i / (trafficData.length - 1)) * chartWidth;
      const y = chartHeight - (val / maxTraffic) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">營運數據總覽</h2>
            <p className="text-slate-500 text-sm mt-1">統計區間: 過去 30 天</p>
          </div>
          <button className="text-primary-600 text-sm font-bold bg-primary-50 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors">
            下載完整報表
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 p-4 opacity-10 text-blue-500 group-hover:scale-110 transition-transform">{ICONS.Activity}</div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">總曝光數 (Impressions)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">12,500</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">↑ 15%</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">潛在觸及客群</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 p-4 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform">{ICONS.Sparkles}</div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">導流點擊 (Clicks)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">850</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">↑ 8%</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">有效轉換率 6.8%</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 p-4 opacity-10 text-purple-500 group-hover:scale-110 transition-transform">{ICONS.Location}</div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">實際導航 (Navigations)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">120</span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">↑ 22%</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">高意圖到店顧客</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute right-0 top-0 p-4 opacity-10 text-amber-500 group-hover:scale-110 transition-transform">{ICONS.Calories}</div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">預估帶動營收</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">$24,000</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">基於平均客單價 $200</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Trend Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              {ICONS.Analytics} 流量趨勢 (過去 7 天)
            </h3>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {trafficData.map((val, idx) => (
                <div key={idx} className="w-full flex flex-col justify-end group">
                  <div
                    className="w-full bg-primary-100 rounded-t-lg group-hover:bg-primary-500 transition-colors relative"
                    style={{ height: `${(val / maxTraffic) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}次
                    </div>
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-2">Day {idx + 1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Meals Ranking */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              {ICONS.ThumbsUp} 熱門餐點排行
            </h3>
            <div className="space-y-5">
              {topMeals.map((meal, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">#{idx + 1} {meal.name}</span>
                    <span className={`text-xs font-bold ${meal.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-400'}`}>
                      {meal.growth}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: `${(meal.clicks / 400) * 100}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-500 w-10 text-right">{meal.clicks}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 mb-2 font-bold uppercase">優化建議</p>
              <p className="text-sm text-slate-700">
                「炙燒鮪魚」點擊率略有下降，建議更新餐點圖片或調整價格以提升吸引力。
              </p>
            </div>
          </div>
        </div>

        {/* Billing Preview */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                {ICONS.Check} 本月結算預覽
              </h3>
              <p className="text-slate-400 text-sm">計費週期：2023/10/01 - 2023/10/31</p>
            </div>

            <div className="flex gap-8 text-center md:text-right">
              <div>
                <p className="text-xs text-slate-400 mb-1">有效導流數</p>
                <p className="text-2xl font-bold">850 次</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">費率</p>
                <p className="text-2xl font-bold">$5 <span className="text-sm text-slate-500">/次</span></p>
              </div>
              <div className="border-l border-slate-700 pl-8">
                <p className="text-xs text-emerald-400 mb-1 font-bold">本期應繳金額</p>
                <p className="text-4xl font-black tracking-tight">$4,250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStoreInfo = () => (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-slate-800">店家基本資訊</h2>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">

        {/* Basic Info */}
        <div className="space-y-2">
          <label className="font-bold text-slate-700 flex items-center gap-2">
            {ICONS.Store} 商店名稱
          </label>
          <input
            type="text"
            value={storeProfile.name}
            onChange={(e) => setStoreProfile({ ...storeProfile, name: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-slate-700 flex items-center gap-2">
            <Phone className="w-4 h-4" /> 聯絡電話
          </label>
          <input
            type="tel"
            value={storeProfile.phone}
            onChange={(e) => setStoreProfile({ ...storeProfile, phone: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-slate-700 flex items-center gap-2">
            {ICONS.Location} 營業地址
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={storeProfile.address}
              onChange={(e) => setStoreProfile({ ...storeProfile, address: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* GPS Section */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <label className="font-bold text-slate-700 flex items-center gap-2 text-sm">
            {ICONS.Location} GPS 座標設定 (LBS 推薦用)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1">緯度 (Latitude)</span>
              <input
                type="text"
                value={storeProfile.lat}
                onChange={(e) => setStoreProfile({ ...storeProfile, lat: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1">經度 (Longitude)</span>
              <input
                type="text"
                value={storeProfile.lng}
                onChange={(e) => setStoreProfile({ ...storeProfile, lng: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="text-primary-600">ⓘ</span>
            系統將依據此座標計算與用戶的距離，精準的座標能提升推薦排序。
          </p>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-slate-700 flex items-center gap-2">
            {ICONS.Timer} 營業時間
          </label>
          <input
            type="text"
            value={storeProfile.hours}
            onChange={(e) => setStoreProfile({ ...storeProfile, hours: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          onClick={handleSaveStore}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> 更新資訊
        </button>
      </div>
    </div>
  );

  const renderMenuManager = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">菜單管理</h2>
        <div className="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm">
          <button
            onClick={() => setMenuMode('manual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${menuMode === 'manual' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            手動輸入
          </button>
          <button
            onClick={() => setMenuMode('ai')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${menuMode === 'ai' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-purple-50 hover:text-purple-600'}`}
          >
            {ICONS.Sparkles} AI 智慧匯入
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Input Area */}
        <div>
          {menuMode === 'ai' ? (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-8 rounded-2xl shadow-sm text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <div className="w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
              </div>

              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-purple-600">
                {isAnalyzing ? ICONS.Loading : ICONS.Link}
              </div>

              {isAnalyzing ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-900">AI 正在分析網頁結構...</h3>
                  <div className="w-64 h-2 bg-purple-200 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-purple-600 animate-[loading_1.5s_ease-in-out_infinite] w-1/2 rounded-full"></div>
                  </div>
                  <p className="text-sm text-purple-600">正在解析營養成分與餐點描述</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">貼上外送平台連結</h3>
                    <p className="text-purple-600 text-sm mt-1">支援 UberEats, Foodpanda 或官方網站</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://www.ubereats.com/..."
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                      className="flex-1 p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <button
                      onClick={handleAiImport}
                      disabled={!importUrl}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all active:scale-95"
                    >
                      開始解析
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${reviewMode ? 'border-amber-400 ring-4 ring-amber-50' : 'border-slate-100'}`}>
              {reviewMode && (
                <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-start gap-3">
                  {ICONS.Alert}
                  <div>
                    <p className="font-bold text-sm">AI 匯入完成，請人工核對！</p>
                    <p className="text-xs opacity-80 mt-1">營養素與熱量為 AI 估算值，可能存在誤差。</p>
                  </div>
                </div>
              )}

              <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                {editingId ? '修改餐點資訊' : (reviewMode ? '審核並上架' : '新增餐點資訊')}
              </h3>

              <form id="meal-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">餐點圖片 URL</label>
                  <div className="flex gap-2">
                    <input
                      id="meal-image-url"
                      type="text"
                      required
                      value={form.imageUrl}
                      onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                      className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
                    />
                    <button type="button" className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200">{ICONS.Upload}</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">餐點名稱</label>
                  <input
                    id="meal-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={`w-full p-2 border rounded-lg text-sm font-medium ${reviewMode ? 'bg-amber-50 border-amber-300' : 'border-slate-200'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      {ICONS.Calories} 熱量 (kcal)
                    </label>
                    <input
                      id="meal-calories"
                      type="number"
                      required
                      value={form.calories}
                      onChange={e => setForm({ ...form, calories: e.target.value })}
                      className={`w-full p-2 border rounded-lg text-sm ${reviewMode ? 'bg-amber-50 border-amber-300' : 'border-slate-200'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">價格 ($)</label>
                    <input
                      id="meal-price"
                      type="number"
                      required
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">三大營養素 (g) - {reviewMode ? 'AI 估算' : '選填'}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-xs text-blue-500 font-bold block mb-1">蛋白質</span>
                      <input id="meal-protein" type="number" placeholder="Protein" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} className="w-full p-1.5 text-center text-sm border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <span className="text-xs text-emerald-500 font-bold block mb-1">脂肪</span>
                      <input id="meal-fat" type="number" placeholder="Fat" value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })} className="w-full p-1.5 text-center text-sm border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <span className="text-xs text-amber-500 font-bold block mb-1">碳水</span>
                      <input id="meal-carbs" type="number" placeholder="Carbs" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} className="w-full p-1.5 text-center text-sm border border-slate-200 rounded-lg" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold transition-all mt-2 shadow-lg ${reviewMode
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-800/30'
                    }`}
                >
                  {editingId ? '確認修改' : (reviewMode ? '確認無誤，立即上架' : '確認上架')}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">已上架餐點庫</h3>
            <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-500 font-mono">Total: {meals.length}</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {meals.slice().reverse().map((meal, index) => (
              <div key={meal.id} className="flex gap-3 items-start p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 group transition-colors relative">
                <img src={meal.imageUrl} alt={meal.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 truncate text-sm">{meal.name}</h4>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === meal.id ? null : meal.id);
                        }}
                        className="text-slate-300 hover:text-slate-600 p-1"
                      >
                        {ICONS.More}
                      </button>

                      {activeDropdownId === meal.id && (
                        <div className="dropdown-menu absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-xl z-10 w-32 py-1 flex flex-col">
                          <button
                            className="text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full flex items-center gap-2"
                            onClick={() => handleEditClick(meal)}
                          >
                            <span className="w-4 flex justify-center">{ICONS.Sparkles}</span> 編輯
                          </button>
                          <button className="text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full flex items-center gap-2">
                            <span className="w-4 flex justify-center">{ICONS.Close}</span> 刪除
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">${meal.price} · {meal.calories} kcal</p>

                  {/* Status Badge Simulation */}
                  <div className="mt-2 flex gap-1">
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-100">
                        {ICONS.Alert} 審核中
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {ICONS.Check} 已發佈
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">店家資訊已更新！</span>
        </div>
      )}

      {renderSidebar()}

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">HealthGenie Merchant</h1>
            <p className="text-slate-400 text-sm">歡迎回來，{storeProfile.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500">
              {ICONS.Profile}
            </div>
          </div>
        </header>

        {currentView === 'analytics' && renderAnalytics()}
        {currentView === 'menu' && renderMenuManager()}
        {currentView === 'store' && renderStoreInfo()}
      </main>
    </div>
  );
};