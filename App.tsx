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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) {
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
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">API Key Missing</h1>
          <p className="text-slate-300">
            請確保環境變數中包含 <code>API_KEY</code>。<br />
            This app requires a valid Google Gemini API Key to function.
          </p>
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
