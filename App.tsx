import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MealPlan } from './components/MealPlan';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
import { ActivityLevel, AppTab, Gender, UserProfile, MealRecommendation, DailyStats } from './types';
import { MOCK_MEALS, MOCK_STATS } from './constants';

const INITIAL_PROFILE: UserProfile = {
  gender: Gender.MALE,
  age: 28,
  height: 175,
  weight: 70,
  activityLevel: ActivityLevel.MODERATE,
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [meals, setMeals] = useState<MealRecommendation[]>(MOCK_MEALS);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  // Lifted Stats State for dynamic updates
  const [dailyStats, setDailyStats] = useState<DailyStats>(MOCK_STATS);

  useEffect(() => {
    // Check for API key on mount to show helpful error if missing
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleAddMeal = (newMeal: MealRecommendation) => {
    setMeals((prev) => [...prev, newMeal]);
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
            onSave={setUserProfile} 
            onAdminAccess={() => setCurrentTab(AppTab.ADMIN)} 
          />
        );
      case AppTab.ADMIN:
        return (
          <AdminPanel 
            meals={meals} 
            onAddMeal={handleAddMeal} 
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
            請確保環境變數中包含 <code>API_KEY</code>。<br/>
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
