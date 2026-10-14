import React from 'react';
import { 
  FileQuestion, 
  BookOpenCheck, 
  GraduationCap,
  FileText
} from 'lucide-react';

export type MainTabType = 'qa' | 'papers' | 'questionsOnly' | 'examPattern';

interface BottomNavProps {
  currentTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-xl py-1 px-2 no-print">
      <div className="max-w-lg mx-auto grid grid-cols-4 gap-1 sm:gap-1.5">
        
        {/* Tab 1: प्रश्न + उत्तर / Q & A */}
        <button
          onClick={() => onTabChange('qa')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'qa'
              ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="पाठ्यक्रम अनुसार प्रश्न और विस्तृत मॉडल उत्तर"
        >
          <BookOpenCheck className={`w-4 h-4 ${currentTab === 'qa' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] leading-tight font-extrabold mt-0.5 truncate">
            प्रश्न + उत्तर
          </span>
        </button>

        {/* Tab 2: पुराने पेपर्स / Previous Year Papers (Requested by User) */}
        <button
          onClick={() => onTabChange('papers')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            currentTab === 'papers'
              ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="पिछले वर्षों के मूल पेपर्स एवं सम्पूर्ण विस्तृत हल"
        >
          <FileText className={`w-4 h-4 ${currentTab === 'papers' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] leading-tight font-extrabold mt-0.5 truncate">
            पुराने पेपर्स
          </span>
          <span className="absolute -top-1 -right-0.5 px-1 py-0.2 rounded-full text-[8px] font-black bg-amber-500 text-white">
            10
          </span>
        </button>

        {/* Tab 3: केवल प्रश्न / Questions Only */}
        <button
          onClick={() => onTabChange('questionsOnly')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'questionsOnly'
              ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="केवल प्रश्न बैंक"
        >
          <FileQuestion className={`w-4 h-4 ${currentTab === 'questionsOnly' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] leading-tight font-extrabold mt-0.5 truncate">
            केवल प्रश्न
          </span>
        </button>

        {/* Tab 4: परीक्षा पैटर्न / Exam Scheme */}
        <button
          onClick={() => onTabChange('examPattern')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'examPattern'
              ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="परीक्षा पैटर्न व अंक योजना"
        >
          <GraduationCap className={`w-4 h-4 ${currentTab === 'examPattern' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] leading-tight font-extrabold mt-0.5 truncate">
            परीक्षा पैटर्न
          </span>
        </button>

      </div>
    </nav>
  );
};

