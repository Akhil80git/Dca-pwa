import { PYPSubject, PYPPaper } from './pypTypes';
import { pypFundamentalsPapers } from './pypFundamentalsData';
import { pypPCPackagePapers } from './pypPCPackageData';
import { pypMSAccessPapers } from './pypMSAccessData';

export * from './pypTypes';
export { pypFundamentalsPapers } from './pypFundamentalsData';
export { pypPCPackagePapers } from './pypPCPackageData';
export { pypMSAccessPapers } from './pypMSAccessData';

export const allPreviousYearSubjects: PYPSubject[] = [
  {
    id: 'fundamentals',
    name: 'कंप्यूटर फंडामेंटल्स',
    englishName: 'Computer Fundamentals and AI',
    code: '1DCA1',
    semester: 'Sem-I',
    color: 'from-blue-600 to-indigo-700',
    icon: 'Cpu',
    description: 'दिसम्बर 2023/जनवरी 2024, मई/जून 2025 एवं दिसम्बर 2025/जनवरी 2026 के तीनों मूल पेपर्स विस्तृत हिंदी मॉडल उत्तरों सहित।',
    papers: pypFundamentalsPapers
  },
  {
    id: 'pcpackages',
    name: 'पीसी पैकेज',
    englishName: 'PC Packages (Windows, Word, Excel, PowerPoint, Outlook)',
    code: '1DCA2',
    semester: 'Sem-I',
    color: 'from-emerald-600 to-teal-700',
    icon: 'FileSpreadsheet',
    description: 'मई/जून 2025, दिसंबर 2025/जनवरी 2026 एवं मई/जून 2026 के तीनों मूल पेपर्स विस्तृत हिंदी मॉडल उत्तरों सहित।',
    papers: pypPCPackagePapers
  },
  {
    id: 'msaccess',
    name: 'एम.एस. एक्सेस',
    englishName: 'Database Using MS Access',
    code: '1DCA3(B)',
    semester: 'Sem-I',
    color: 'from-rose-600 to-red-700',
    icon: 'Database',
    description: 'दिसम्बर 2024/जनवरी 2025, मई/जून 2025, दिसम्बर 2025/जनवरी 2026 एवं मई/जून 2026 के चारों मूल पेपर्स विस्तृत हिंदी मॉडल उत्तरों सहित।',
    papers: pypMSAccessPapers
  }
];

export const getAllPreviousYearPapers = (): PYPPaper[] => {
  return [
    ...pypFundamentalsPapers,
    ...pypPCPackagePapers,
    ...pypMSAccessPapers
  ];
};

export const getPapersBySubjectId = (subjectId: string): PYPPaper[] => {
  const subject = allPreviousYearSubjects.find(s => s.id === subjectId);
  return subject ? subject.papers : [];
};
