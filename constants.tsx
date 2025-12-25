import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  UserCircle,
  Activity,
  Droplets,
  Flame,
  MapPin,
  Camera,
  Wand2,
  Loader2,
  ChevronRight,
  Upload,
  Send,
  Settings,
  Dumbbell,
  Footprints,
  ThumbsUp,
  ThumbsDown,
  Minus,
  CheckCircle2,
  Timer,
  Bike,
  BarChart3,
  Store,
  Sparkles,
  Link2,
  AlertCircle,
  LogOut,
  MoreHorizontal,
  Moon,
  List,
  X
} from 'lucide-react';
import { MealRecommendation, TaskCategory, TaskItem } from './types';

export const ICONS = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  MealPlan: <UtensilsCrossed className="w-5 h-5" />,
  Profile: <UserCircle className="w-5 h-5" />,
  Admin: <Settings className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Water: <Droplets className="w-5 h-5" />,
  Calories: <Flame className="w-5 h-5" />,
  Location: <MapPin className="w-4 h-4" />,
  Camera: <Camera className="w-5 h-5" />,
  Magic: <Wand2 className="w-5 h-5" />,
  Loading: <Loader2 className="w-5 h-5 animate-spin" />,
  ArrowRight: <ChevronRight className="w-4 h-4" />,
  Upload: <Upload className="w-5 h-5" />,
  Send: <Send className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-6 h-6" />,
  Footprints: <Footprints className="w-6 h-6" />,
  ThumbsUp: <ThumbsUp className="w-4 h-4" />,
  ThumbsDown: <ThumbsDown className="w-4 h-4" />,
  Minus: <Minus className="w-4 h-4" />,
  Check: <CheckCircle2 className="w-6 h-6" />,
  Timer: <Timer className="w-4 h-4" />,
  Delivery: <Bike className="w-3 h-3" />,
  Analytics: <BarChart3 className="w-5 h-5" />,
  Store: <Store className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Link: <Link2 className="w-4 h-4" />,
  Alert: <AlertCircle className="w-4 h-4" />,
  Logout: <LogOut className="w-5 h-5" />,
  More: <MoreHorizontal className="w-4 h-4" />,
  Moon: <Moon className="w-5 h-5" />,
  List: <List className="w-4 h-4" />,
  Close: <X className="w-4 h-4" />
};

export const MOCK_STATS = {
  calories: { current: 1250, target: 2200 },
  steps: { current: 5430, target: 8000 },
  water: { current: 1200, target: 2500 } // ml
};

export const MOCK_TASKS: TaskItem[] = [
  {
    id: 't1',
    title: '晨間伸展 10 分鐘',
    category: TaskCategory.EXERCISE,
    isCompleted: true,
    description: '喚醒肌肉'
  },
  {
    id: 't2',
    title: '下肢肌力訓練 (深蹲)',
    category: TaskCategory.EXERCISE,
    isCompleted: false,
    description: '目標 4 組 x 12 下'
  },
  {
    id: 't3',
    title: '記錄午餐熱量',
    category: TaskCategory.NUTRITION,
    isCompleted: false,
    description: '使用 AI 拍照功能'
  },
  {
    id: 't4',
    title: '喝水目標 2000cc',
    category: TaskCategory.NUTRITION,
    isCompleted: false,
    description: '目前進度: 1200cc'
  },
  {
    id: 't5',
    title: '睡前冥想',
    category: TaskCategory.HABITS,
    isCompleted: false,
    description: '放鬆身心 10 分鐘'
  }
];

// 初始模擬資料庫
// 注意：這部分資料之後建議改由 Python Backend (如 FastAPI) 提供 API 獲取
export const MOCK_MEALS: MealRecommendation[] = [
  {
    id: 'm1',
    name: '舒肥雞胸藜麥餐盒',
    merchant: 'Muscle Fuel 健康餐',
    distance: 0.3,
    calories: 450,
    macros: { protein: 42, fat: 8, carbs: 45 },
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    price: 160
  },
  {
    id: 'm2',
    name: '香煎鮭魚五穀飯',
    merchant: 'Daily Fresh 輕食',
    distance: 1.2,
    calories: 580,
    macros: { protein: 35, fat: 18, carbs: 60 },
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    price: 220
  },
  {
    id: 'm3',
    name: '低脂牛腱滷味拼盤',
    merchant: '老張健康滷',
    distance: 0.5,
    calories: 320,
    macros: { protein: 30, fat: 10, carbs: 15 },
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    price: 130
  },
  {
    id: 'm4',
    name: '炙燒鮪魚波奇碗 (Poke)',
    merchant: 'Halo Poke',
    distance: 0.8,
    calories: 480,
    macros: { protein: 28, fat: 12, carbs: 55 },
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    price: 190
  },
  {
    id: 'm5',
    name: '增肌牛肉漢堡 (無麵包)',
    merchant: 'Burger Fit',
    distance: 2.5,
    calories: 520,
    macros: { protein: 45, fat: 25, carbs: 10 },
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    price: 200
  },
  {
    id: 'm6',
    name: '義式烤蔬菜溫沙拉',
    merchant: 'Green Day',
    distance: 0.4,
    calories: 280,
    macros: { protein: 12, fat: 15, carbs: 30 },
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    price: 150
  },
  {
    id: 'm7',
    name: '宮保雞丁低卡餐',
    merchant: '台味輕食光',
    distance: 1.5,
    calories: 650,
    macros: { protein: 35, fat: 25, carbs: 65 },
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    price: 120
  },
  {
    id: 'm8',
    name: '希臘優格高蛋白碗',
    merchant: 'Yogurt House',
    distance: 0.6,
    calories: 350,
    macros: { protein: 25, fat: 5, carbs: 40 },
    imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
    price: 140
  }
];