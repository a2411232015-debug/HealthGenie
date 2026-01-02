import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MealPlan } from './components/MealPlan';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { ActivityLevel, AppTab, Gender, UserProfile, MealRecommendation, DailyStats, WeightData } from './types';
import { MOCK_MEALS, MOCK_STATS } from './constants';

const INITIAL_PROFILE: UserProfile = {
  gender: Gender.MALE,
  age: 28,
  height: 175,
  weight: 70,
  activityLevel: ActivityLevel.MODERATE,
};

const INITIAL_WEIGHT_HISTORY: WeightData[] = [
  { date: '12/20', weight: 71.5 },
  { date: '12/21', weight: 71.2 },
  { date: '12/22', weight: 71.0 },
  { date: '12/23', weight: 70.8 },
  { date: '12/24', weight: 70.5 },
  { date: '12/25', weight: 70.2 },
  { date: '今日', weight: 70.0 },
];

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.DASHBOARD);

  // -- Persistent States --
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [meals, setMeals] = useState<MealRecommendation[]>(() => {
    const saved = localStorage.getItem('meals');
    return saved ? JSON.parse(saved) : MOCK_MEALS;
  });

  const [dailyStats, setDailyStats] = useState<DailyStats>(() => {
    const saved = localStorage.getItem('dailyStats');
    return saved ? JSON.parse(saved) : MOCK_STATS;
  });

  const [weightHistory, setWeightHistory] = useState<WeightData[]>(() => {
    const saved = localStorage.getItem('weightHistory');
    return saved ? JSON.parse(saved) : INITIAL_WEIGHT_HISTORY;
  });

  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // -- Persistence Effects --
  useEffect(() => { localStorage.setItem('userProfile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('meals', JSON.stringify(meals)); }, [meals]);
  useEffect(() => { localStorage.setItem('dailyStats', JSON.stringify(dailyStats)); }, [dailyStats]);
  useEffect(() => { localStorage.setItem('weightHistory', JSON.stringify(weightHistory)); }, [weightHistory]);

  useEffect(() => {
    // Check for API key on mount to show helpful error if missing
    const envKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const localKey = localStorage.getItem('gemini_api_key');
    if (!envKey && !localKey) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleAddMeal = (newMeal: MealRecommendation) => {
    setMeals((prev) => [...prev, newMeal]);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    if (newProfile.weight !== userProfile.weight) {
      const todayString = new Date().toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
      setWeightHistory(prev => {
        const newHistory = [...prev];
        // If last entry is today, update it; otherwise push new
        if (newHistory[newHistory.length - 1].date === '今日' || newHistory[newHistory.length - 1].date === todayString) {
          newHistory[newHistory.length - 1] = { date: '今日', weight: newProfile.weight };
          return [...newHistory];
        }
        return [...newHistory, { date: '今日', weight: newProfile.weight }].slice(-7);
      });
    }
    setUserProfile(newProfile);
  };

  const handleAddCalories = (calories: number) => {
    setDailyStats(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        current: prev.calories.current + calories
      }
    }));
  };

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.DASHBOARD:
        return (
          <Dashboard
            userProfile={userProfile}
            stats={dailyStats}
            onAddCalories={handleAddCalories}
          />
        );
      case AppTab.MEAL_PLAN:
        return <MealPlan userProfile={userProfile} meals={meals} />;
      case AppTab.PROFILE:
        return (
          <Profile
            data={userProfile}
            weightHistory={weightHistory}
            onSave={handleUpdateProfile}
            onAdminAccess={() => setCurrentTab(AppTab.ADMIN)}
          />
        );
      case AppTab.ADMIN:
        return (
          <AdminPanel
            meals={meals}
            onAddMeal={handleAddMeal}
            onUpdateMeal={(updatedMeal) => {
              setMeals(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
            }}
            onBack={() => setCurrentTab(AppTab.DASHBOARD)}
          />
        );
      default:
        return (
          <Dashboard
            userProfile={userProfile}
            stats={dailyStats}
            onAddCalories={handleAddCalories}
          />
        );
    }
  };

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 text-primary-400">Welcome to HealthGenie</h1>
          <p className="text-slate-300 mb-6">
            To use this app, please enter your Google Gemini API Key.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('apiKey') as HTMLInputElement;
            if (input.value.trim()) {
              localStorage.setItem('gemini_api_key', input.value.trim());
              setApiKeyMissing(false);
              window.location.reload();
            }
          }} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-slate-400 mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                name="apiKey"
                id="apiKey"
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="AIza..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Start App
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">
              Your key is stored locally in your browser.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
