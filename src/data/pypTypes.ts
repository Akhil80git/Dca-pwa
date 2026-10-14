export interface PYPSection {
  heading: string;
  content: string;
  points?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  steps?: string[];
  diagramText?: string;
}

export interface PYPAnswer {
  summary: string;
  sections: PYPSection[];
  examTip?: string;
  keyTerms?: string[];
}

export interface PYPQuestion {
  id: string;
  questionNumber: number;
  isOrQuestion?: boolean; // true if this is the 'अथवा' alternative question
  question: string;
  marks?: number;
  answer: PYPAnswer;
}

export interface PYPUnit {
  unitNumber: number;
  unitRoman: string;
  title: string;
  note?: string; // e.g. "इस पेपर के पृष्ठ 3 के प्रश्न अस्पष्ट होने के कारण..."
  questions: PYPQuestion[];
}

export interface PYPPaper {
  id: string;
  paperNumber: number;
  session: string; // e.g. 'दिसम्बर 2023 / जनवरी 2024'
  academicYear: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: 'Sem-I' | 'Sem-II';
  totalMarks: number;
  passMarks: number;
  timeAllowed: string;
  instructions: string[];
  units: PYPUnit[];
}

export interface PYPSubject {
  id: string;
  name: string;
  englishName: string;
  code: string;
  semester: 'Sem-I' | 'Sem-II';
  color: string;
  icon: string;
  description: string;
  papers: PYPPaper[];
}
