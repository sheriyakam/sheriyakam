export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  period: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface ResumeData {
  id?: string;
  userId?: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experiences: WorkExperience[];
  education: Education[];
  certifications: string[];
}

export interface TailoredVersion {
  id: string;
  baseResumeId: string;
  targetJobTitle: string;
  targetCompany: string;
  targetJobDescription: string;
  initialScore: number;
  finalScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  confirmedSkills: string[];
  rewrittenSummary: string;
  rewrittenExperiences: WorkExperience[];
  coverLetter: string;
  createdAt: string;
}

export interface LinkedInProfileData {
  originalHeadline: string;
  optimizedHeadline: string;
  originalAbout: string;
  optimizedAbout: string;
  missingSkills: string[];
  completenessScore: number;
}
