import React, { useState, useMemo } from 'react';
import { 
  allPreviousYearSubjects, 
  PYPSubject, 
  PYPPaper, 
  PYPQuestion 
} from '../data/previousYearPapersData';
import { 
  FileText, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  Printer, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Calendar, 
  Clock, 
  Award, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  Cpu, 
  FileSpreadsheet, 
  Database,
  Layers
} from 'lucide-react';

interface PreviousYearPapersViewProps {
  onBookmarkQuestion?: (id: string) => void;
  bookmarkedIds?: string[];
}

export const PreviousYearPapersView: React.FC<PreviousYearPapersViewProps> = ({
  onBookmarkQuestion,
  bookmarkedIds = []
}) => {
  // Active subject state: 'fundamentals' | 'pcpackages' | 'msaccess'
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('fundamentals');

  const currentSubject = useMemo(() => {
    return allPreviousYearSubjects.find(s => s.id === selectedSubjectId) || allPreviousYearSubjects[0];
  }, [selectedSubjectId]);

  // Active paper within subject
  const [selectedPaperId, setSelectedPaperId] = useState<string>(() => {
    return allPreviousYearSubjects[0].papers[0].id;
  });

  // When subject changes, select first paper of that subject
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = allPreviousYearSubjects.find(s => s.id === subjectId);
    if (sub && sub.papers.length > 0) {
      setSelectedPaperId(sub.papers[0].id);
      setActiveUnitFilter('all');
    }
  };

  const currentPaper: PYPPaper = useMemo(() => {
    const found = currentSubject.papers.find(p => p.id === selectedPaperId);
    return found || currentSubject.papers[0];
  }, [currentSubject, selectedPaperId]);

  // Unit filter: 'all' | 1 | 2 | 3 | 4 | 5
  const [activeUnitFilter, setActiveUnitFilter] = useState<'all' | number>('all');

  // Search keyword inside this paper
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expand / collapse all answers
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Font size multiplier: 'sm' | 'base' | 'lg'
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle single question
  const toggleQuestion = (qId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [qId]: prev[qId] === false ? true : prev[qId] === true ? false : false // default is true in our view
    }));
  };

  const isQuestionExpanded = (qId: string): boolean => {
    // If user explicitly set, respect it; default is true for open study
    return expandedQuestions[qId] !== false;
  };

  const handleExpandAll = () => {
    const map: Record<string, boolean> = {};
    currentPaper.units.forEach(u => {
      u.questions.forEach(q => {
        map[q.id] = true;
      });
    });
    setExpandedQuestions(map);
  };

  const handleCollapseAll = () => {
    const map: Record<string, boolean> = {};
    currentPaper.units.forEach(u => {
      u.questions.forEach(q => {
        map[q.id] = false;
      });
    });
    setExpandedQuestions(map);
  };

  const handleCopy = (question: PYPQuestion) => {
    const textToCopy = `प्रश्न: ${question.question}\n\nउत्तर सारांश:\n${question.answer.summary}\n\n${question.answer.sections.map(s => `${s.heading}\n${s.content}\n${s.points ? s.points.join('\n') : ''}`).join('\n\n')}\n\nपरीक्षा टिप: ${question.answer.examTip || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(question.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered units based on unit filter and search
  const filteredUnits = useMemo(() => {
    return currentPaper.units
      .filter(unit => activeUnitFilter === 'all' || unit.unitNumber === activeUnitFilter)
      .map(unit => {
        if (!searchQuery.trim()) return unit;
        const qLower = searchQuery.toLowerCase();
        const matchedQuestions = unit.questions.filter(q => 
          q.question.toLowerCase().includes(qLower) ||
          q.answer.summary.toLowerCase().includes(qLower) ||
          q.answer.sections.some(s => 
            s.heading.toLowerCase().includes(qLower) ||
            s.content.toLowerCase().includes(qLower) ||
            (s.points && s.points.some(p => p.toLowerCase().includes(qLower)))
          )
        );
        return {
          ...unit,
          questions: matchedQuestions
        };
      })
      .filter(unit => unit.questions.length > 0);
  }, [currentPaper, activeUnitFilter, searchQuery]);

  const totalQuestionsInPaper = useMemo(() => {
    return currentPaper.units.reduce((acc, u) => acc + u.questions.length, 0);
  }, [currentPaper]);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-4 h-4" />;
      case 'Database': return <Database className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const fontSizeClass = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-loose'
  }[fontSize];

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner: Old Papers Section */}
      <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/90 via-slate-50 to-teal-50/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-teal-950/30 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>विश्वविद्यालय परीक्षा पिछले वर्षों के प्रश्न-पत्र (Previous Year Papers)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              पुराने प्रश्न-पत्र एवं सम्पूर्ण विस्तृत हिंदी मॉडल उत्तर
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              कंप्यूटर फंडामेंटल्स, पीसी पैकेज और एम.एस. एक्सेस के पिछले 4 सत्रों के मूल परीक्षा प्रश्न-पत्र। प्रत्येक इकाई के मुख्य व अथवा (Or) दोनों प्रश्नों के 16 अंक प्राप्त करने योग्य विस्तृत मॉडल उत्तर।
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-2xs cursor-pointer no-print"
              title="पूरा प्रश्न पत्र प्रिंट करें या PDF सेव करें"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>प्रिंट / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. SUBJECT SELECTOR TABS (3 Subjects) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 no-print">
        {allPreviousYearSubjects.map(sub => {
          const isSelected = sub.id === selectedSubjectId;
          return (
            <button
              key={sub.id}
              onClick={() => handleSubjectChange(sub.id)}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-slate-100/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected 
                    ? 'bg-gradient-to-br from-indigo-600 to-teal-500 text-white shadow-xs' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {getSubjectIcon(sub.icon)}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {sub.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    कोड: {sub.code} ({sub.papers.length} पेपर्स)
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                isSelected 
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {sub.papers.length} सत्र
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. PAPER SESSION SELECTOR TABS for Current Subject */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 no-print">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-2 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>परीक्षा सत्र चुनें:</span>
        </span>
        {currentSubject.papers.map(p => {
          const isSelected = p.id === selectedPaperId;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPaperId(p.id);
                setActiveUnitFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <span>{p.session}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-black ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                पेपर {p.paperNumber}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. CURRENT PAPER HEADER & EXAM INSTRUCTIONS CARD */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 sm:p-5 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {currentPaper.subjectName} — पेपर {currentPaper.paperNumber}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
              परीक्षा सत्र: {currentPaper.session}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>पूर्णांक: {currentPaper.totalMarks}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>उत्तीर्णांक: {currentPaper.passMarks}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>समय: {currentPaper.timeAllowed}</span>
            </span>
          </div>
        </div>

        {/* Paper Instructions */}
        <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>परीक्षार्थियों हेतु सामान्य निर्देश:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            {currentPaper.instructions.map((ins, i) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. TOOLBAR: Search, Unit Filter & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 no-print">
        
        {/* Unit Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveUnitFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeUnitFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            सभी इकाइयाँ ({totalQuestionsInPaper})
          </button>
          {currentPaper.units.map(u => (
            <button
              key={u.unitNumber}
              onClick={() => setActiveUnitFilter(u.unitNumber)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeUnitFilter === u.unitNumber
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              इकाई {u.unitNumber} ({u.questions.length})
            </button>
          ))}
        </div>

        {/* Right side controls: Search, Expand All, Font Size */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Quick in-paper search */}
          <div className="relative">
            <input
              type="text"
              placeholder="प्रश्न या उत्तर में खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 sm:w-48 pl-7 pr-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* Expand/Collapse All */}
          <button
            onClick={handleExpandAll}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
            title="सभी उत्तर खोलें"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCollapseAll}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
            title="सभी उत्तर समेटें"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFontSize(prev => prev === 'lg' ? 'base' : 'sm')}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
              title="फॉन्ट छोटा करें"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold px-1 select-none text-slate-500">
              {fontSize === 'sm' ? 'A-' : fontSize === 'base' ? 'A' : 'A+'}
            </span>
            <button
              onClick={() => setFontSize(prev => prev === 'sm' ? 'base' : 'lg')}
              className="p-1 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
              title="फॉन्ट बड़ा करें"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 5. QUESTIONS AND COMPREHENSIVE HINDI ANSWERS LIST */}
      <div className="space-y-6">
        {filteredUnits.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              "{searchQuery}" के लिए इस पेपर में कोई प्रश्न नहीं मिला।
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveUnitFilter('all'); }}
              className="mt-2 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              फिल्टर हटाएं और सभी प्रश्न देखें
            </button>
          </div>
        ) : (
          filteredUnits.map(unit => (
            <div key={unit.unitNumber} className="space-y-3">
              
              {/* Unit Header Badge */}
              <div className="flex items-center justify-between bg-slate-200/80 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-300/80 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-black uppercase tracking-wider">
                    {unit.unitRoman}
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {unit.title}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {unit.questions.length} प्रश्न
                </span>
              </div>

              {/* Note if unit has partial content */}
              {unit.note && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>{unit.note}</span>
                </div>
              )}

              {/* Unit Questions */}
              <div className="space-y-3">
                {unit.questions.map(q => {
                  const isExpanded = isQuestionExpanded(q.id);
                  const isBookmarked = bookmarkedIds.includes(q.id);

                  return (
                    <div 
                      key={q.id}
                      id={`pyp-${q.id}`}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      
                      {/* Question Header */}
                      <div className="p-3.5 sm:p-4 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-start justify-between gap-3">
                          
                          <div className="flex-1 flex items-start gap-2.5">
                            {/* Question Number Badge */}
                            <span className={`px-2 py-1 rounded-lg text-xs font-black flex-shrink-0 ${
                              q.isOrQuestion 
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700' 
                                : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
                            }`}>
                              {q.isOrQuestion ? 'अथवा (OR)' : `प्र. ${q.questionNumber}`}
                            </span>

                            {/* Full Question Text */}
                            <div className="flex-1">
                              <h3 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white leading-snug whitespace-pre-line">
                                {q.question}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                  [अंक: {q.marks || 16}]
                                </span>
                                {q.isOrQuestion && (
                                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                                    ★ वैकल्पिक प्रश्न (Or Option)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Bookmark, Copy, Expand */}
                          <div className="flex items-center gap-1 flex-shrink-0 no-print">
                            {onBookmarkQuestion && (
                              <button
                                onClick={() => onBookmarkQuestion(q.id)}
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  isBookmarked
                                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-600'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                                }`}
                                title={isBookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
                              >
                                {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            <button
                              onClick={() => handleCopy(q)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                              title="उत्तर कॉपी करें"
                            >
                              {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => toggleQuestion(q.id)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                              title={isExpanded ? 'उत्तर समेटें' : 'उत्तर देखें'}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                        </div>
                      </div>

                      {/* Comprehensive Large Hindi Answer Area */}
                      {isExpanded && (
                        <div className={`p-4 sm:p-6 space-y-4 ${fontSizeClass} bg-white dark:bg-slate-900 answer-content`}>
                          
                          {/* Summary Card */}
                          <div className="rounded-xl border border-indigo-100 dark:border-indigo-950/80 bg-indigo-50/70 dark:bg-indigo-950/30 p-3 sm:p-4 text-slate-800 dark:text-slate-200 font-medium">
                            <div className="text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>उत्तर सारांश (Model Answer Summary)</span>
                            </div>
                            <p>{q.answer.summary}</p>
                          </div>

                          {/* Structured Detailed Sections */}
                          {q.answer.sections.map((sec, idx) => (
                            <div key={idx} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 first:border-t-0 first:pt-0">
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                                <span className="w-1.5 h-4 rounded-full bg-indigo-600"></span>
                                <span>{sec.heading}</span>
                              </h4>
                              
                              <p className="text-slate-700 dark:text-slate-300">
                                {sec.content}
                              </p>

                              {/* Numbered / Bullet Points */}
                              {sec.points && (
                                <ul className="space-y-1.5 pl-2 sm:pl-4 text-slate-700 dark:text-slate-300">
                                  {sec.points.map((pt, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {/* Comparative Tables if present */}
                              {sec.table && (
                                <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs sm:text-sm">
                                    <thead className="bg-slate-100 dark:bg-slate-800">
                                      <tr>
                                        {sec.table.headers.map((th, thIdx) => (
                                          <th key={thIdx} className="px-3 py-2 text-left font-black text-slate-800 dark:text-slate-200">
                                            {th}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                                      {sec.table.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                          {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Exam Scoring Advice Tip */}
                          {q.answer.examTip && (
                            <div className="rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/30 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-extrabold">परीक्षा 16/16 अंक टिप: </span>
                                <span>{q.answer.examTip}</span>
                              </div>
                            </div>
                          )}

                          {/* Key Technical Terms */}
                          {q.answer.keyTerms && q.answer.keyTerms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                मुख्य शब्दावली:
                              </span>
                              {q.answer.keyTerms.map((term, tIdx) => (
                                <span 
                                  key={tIdx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700"
                                >
                                  {term}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
