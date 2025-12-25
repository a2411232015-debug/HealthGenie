import React from 'react';
import { AppTab } from '../types';
import { ICONS } from '../constants';

interface LayoutProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  children: React.ReactNode;
}

const NavItem: React.FC<{ 
  tab: AppTab; 
  label: string; 
  icon: React.ReactNode; 
  isActive: boolean; 
  onClick: () => void; 
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 transition-all duration-300 border-r-4
      ${isActive 
        ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' 
        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-medium'
      }`}
  >
    <span className={isActive ? 'text-primary-500' : ''}>{icon}</span>
    <span>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentTab, onTabChange, children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white flex-col border-r border-slate-200 fixed h-full z-10">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2 text-primary-600 font-black text-2xl tracking-tight">
            <span className="bg-primary-600 text-white p-1 rounded-lg">{ICONS.Activity}</span>
            HealthGenie
          </div>
        </div>
        
        <nav className="flex-1 mt-8 space-y-2">
          <NavItem 
            tab={AppTab.DASHBOARD} 
            label="今日概覽" 
            icon={ICONS.Dashboard} 
            isActive={currentTab === AppTab.DASHBOARD} 
            onClick={() => onTabChange(AppTab.DASHBOARD)} 
          />
          <NavItem 
            tab={AppTab.MEAL_PLAN} 
            label="飲食推薦" 
            icon={ICONS.MealPlan} 
            isActive={currentTab === AppTab.MEAL_PLAN} 
            onClick={() => onTabChange(AppTab.MEAL_PLAN)} 
          />
          <NavItem 
            tab={AppTab.PROFILE} 
            label="個人設定" 
            icon={ICONS.Profile} 
            isActive={currentTab === AppTab.PROFILE} 
            onClick={() => onTabChange(AppTab.PROFILE)} 
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 pb-24 md:pb-12 max-w-[1600px] mx-auto w-full">
        {children}
      </main>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {[
          { tab: AppTab.DASHBOARD, label: "概覽", icon: ICONS.Dashboard },
          { tab: AppTab.MEAL_PLAN, label: "推薦", icon: ICONS.MealPlan },
          { tab: AppTab.PROFILE, label: "設定", icon: ICONS.Profile },
        ].map(item => (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={`flex flex-col items-center p-2 rounded-xl w-20 transition-all ${
              currentTab === item.tab ? 'text-primary-600 bg-primary-50' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};