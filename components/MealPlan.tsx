import React, { useMemo, useState } from 'react';
import { ICONS, MOCK_STATS } from '../constants';
import { MealRecommendation, UserProfile } from '../types';
import { calculateHealthTargets } from '../utils/health';
import { MapPin, Navigation, Info, SlidersHorizontal, X, Check } from 'lucide-react';

interface MealPlanProps {
  userProfile: UserProfile;
  meals: MealRecommendation[];
}

interface FilterState {
  maxPrice: number;
  maxDistance: number;
  onlyHighProtein: boolean;
  excludeNuts: boolean;
}

export const MealPlan: React.FC<MealPlanProps> = ({ userProfile, meals }) => {
  // Filters State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 300,
    maxDistance: 3,
    onlyHighProtein: false,
    excludeNuts: false,
  });

  // Draft state for modal interaction
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);

  // Calculate Target and Remaining Budget
  const { dailyCalories } = useMemo(() => calculateHealthTargets(userProfile), [userProfile]);
  const consumedCalories = MOCK_STATS.calories.current;
  const remainingBudget = Math.max(0, dailyCalories - consumedCalories);

  // ==========================================
  // 推薦排序與過濾邏輯
  // ==========================================
  const recommendedMeals = useMemo(() => {
    return meals
      .filter(meal => {
        // 1. Existing Calorie Budget Logic
        const fitsCalorieBudget = meal.calories <= remainingBudget || meal.calories <= 400;

        // 2. Price Filter
        const fitsPrice = meal.price <= filters.maxPrice;

        // 3. Distance Filter
        const fitsDistance = meal.distance <= filters.maxDistance;

        // 4. High Protein (Assume > 25g is high)
        const fitsProtein = filters.onlyHighProtein ? meal.macros.protein >= 25 : true;

        // 5. Exclude Nuts (Simple keyword check in name since no ingredient list)
        const nutKeywords = ['堅果', '花生', '腰果', '杏仁', '核桃'];
        const hasNuts = filters.excludeNuts
          ? nutKeywords.some(keyword => meal.name.includes(keyword))
          : false;

        return fitsCalorieBudget && fitsPrice && fitsDistance && fitsProtein && !hasNuts;
      })
      .sort((a, b) => {
        // 排序公式：綜合分數 = (距離 * 權重) - 蛋白質含量
        const scoreA = (a.distance * 50) - a.macros.protein;
        const scoreB = (b.distance * 50) - b.macros.protein;
        return scoreA - scoreB;
      });
  }, [remainingBudget, meals, filters]);

  const handleNavigation = (name: string, merchant: string) => {
    // Construct Google Maps Search URL
    const query = encodeURIComponent(`${merchant} ${name}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const openFilterModal = () => {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setIsFilterOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto relative">
      <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {ICONS.MealPlan} 智能飲食推薦
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">
              剩餘熱量預算: {remainingBudget} kcal
            </span>
            {filters.onlyHighProtein && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                高蛋白
              </span>
            )}
            <span className="text-xs text-slate-400">
              (已過濾: &lt;${filters.maxPrice}, &lt;{filters.maxDistance}km)
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openFilterModal}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            調整偏好
          </button>
        </div>
      </header>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                篩選偏好
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">預算上限</label>
                  <span className="text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded text-sm">
                    ${draftFilters.maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={draftFilters.maxPrice}
                  onChange={(e) => setDraftFilters({ ...draftFilters, maxPrice: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>$50</span>
                  <span>$500</span>
                </div>
              </div>

              {/* Distance Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">最大距離</label>
                  <span className="text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded text-sm">
                    {draftFilters.maxDistance} km
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={draftFilters.maxDistance}
                  onChange={(e) => setDraftFilters({ ...draftFilters, maxDistance: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0.5 km</span>
                  <span>5.0 km</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 mb-2 block">飲食偏好</label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${draftFilters.onlyHighProtein ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {draftFilters.onlyHighProtein && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">僅顯示高蛋白餐點 (&gt;25g)</span>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={draftFilters.onlyHighProtein}
                    onChange={(e) => setDraftFilters({ ...draftFilters, onlyHighProtein: e.target.checked })}
                  />
                </label>

                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${draftFilters.excludeNuts ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {draftFilters.excludeNuts && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">排除堅果類</span>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={draftFilters.excludeNuts}
                    onChange={(e) => setDraftFilters({ ...draftFilters, excludeNuts: e.target.checked })}
                  />
                </label>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-3 text-slate-600 font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 text-white font-bold bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all active:scale-95"
              >
                套用設定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UI Display */}
      {recommendedMeals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-slate-600 font-bold">找不到符合條件的餐點</h3>
          <p className="text-slate-400 text-sm mt-2">請嘗試放寬篩選條件，例如增加預算或距離。</p>
          <button
            onClick={() => setFilters({ maxPrice: 500, maxDistance: 5, onlyHighProtein: false, excludeNuts: false })}
            className="mt-4 text-primary-600 font-medium hover:underline"
          >
            重置所有篩選
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedMeals.map((meal) => (
            <div key={meal.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {meal.distance} km
                </div>
                {meal.macros.protein > 30 && (
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                    High Protein
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{meal.name}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                      {meal.merchant}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      ${meal.price}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      {ICONS.Delivery} 可外送
                    </div>
                  </div>
                </div>

                {/* Macros Tags */}
                <div className="flex gap-2 mb-4 text-xs text-slate-600">
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100">
                    🔥 {meal.calories} kcal
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                    🥩 P: {meal.macros.protein}g
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    C:{meal.macros.carbs}g F:{meal.macros.fat}g
                  </div>
                  <button
                    onClick={() => handleNavigation(meal.name, meal.merchant)}
                    className="bg-slate-900 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    導航前往
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};