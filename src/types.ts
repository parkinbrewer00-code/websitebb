export type Language = 'th' | 'en';

export interface TeacherProfile {
  name: string;
  nameTh: string;
  titleEn: string;
  titleTh: string;
  avatar: string;
  bioEn: string;
  bioTh: string;
  credentialsEn: string[];
  credentialsTh: string[];
  stats: {
    studentsTaught: number;
    hoursTaught: number;
    rating: number;
    reviewCount: number;
  };
  teachingPhilosophyEn: string;
  teachingPhilosophyTh: string;
  audioIntroUrl?: string;
}

export interface CourseModule {
  titleEn: string;
  titleTh: string;
  duration: string;
  lessons: { titleEn: string; titleTh: string; duration: string; isFreePreview?: boolean }[];
}

export interface OnlineCourse {
  id: string;
  titleEn: string;
  titleTh: string;
  subtitleEn: string;
  subtitleTh: string;
  descriptionEn: string;
  descriptionTh: string;
  coverImage: string;
  level: string; // e.g. "Beginner to Intermediate", "Intermediate to Advanced"
  lessonsCount: number;
  durationHours: string;
  priceThb: number;
  originalPriceThb: number;
  badge?: string;
  popular?: boolean;
  isComingSoon?: boolean;
  studentsCount: number;
  rating: number;
  highlightsEn: string[];
  highlightsTh: string[];
  syllabus: CourseModule[];
  handoutPdfUrl?: string; // Data URL or storage link for course PDF handout
  handoutPdfName?: string; // Filename e.g. "A1_Beginner_English_Handbook.pdf"
  handoutPdfSize?: string; // File size e.g. "3.2 MB"
  handoutPdfUploadedAt?: string; // Timestamp
  createdAt?: string;
}

export interface PrivatePackage {
  id: string;
  nameEn: string;
  nameTh: string;
  subtitleEn: string;
  subtitleTh: string;
  sessionsCount: number;
  sessionDuration: string; // e.g. "60 นาที / คาบ"
  priceThb: number;
  pricePerSessionThb: number;
  originalPriceThb: number;
  popular?: boolean;
  badgeTh?: string;
  badgeEn?: string;
  featuresEn: string[];
  featuresTh: string[];
  targetAudienceEn: string;
  targetAudienceTh: string;
  createdAt?: string;
}

export interface StudentReview {
  id: string;
  studentName: string;
  roleEn: string;
  roleTh: string;
  avatar: string;
  rating: number;
  quoteEn: string;
  quoteTh: string;
  courseTakenEn: string;
  courseTakenTh: string;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt?: string;
}

export interface BookingRequest {
  id: string;
  packageId: string;
  packageName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentLineId?: string; // WhatsApp or Line
  preferredDate: string; // YYYY-MM-DD
  preferredTimeSlot: string; // e.g. "19:00 - 20:00"
  learningGoals: string;
  currentEnglishLevel: string;
  priceThb: number;
  sessionsCount?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  adminNotes?: string;
  createdAt?: string;
}

export interface CalendarSlot {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:00 - 15:00"
  isBooked: boolean;
  bookingId?: string;
  isBlocked: boolean;
  note?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  fileType: 'image' | 'pdf' | 'doc' | 'audio';
  size: string;
  category: 'avatar' | 'course_cover' | 'worksheet' | 'document';
  uploadedAt: string;
}

export interface SiteSettings {
  contactEmail: string;
  whatsappNumber: string;
  teacherName: string;
  teacherNameTh: string;
  notificationEnabled: boolean;
  announcementEn?: string;
  announcementTh?: string;
  masterPin?: string;
  adminEmail?: string;
  autoLockMinutes?: number;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  category: 'auth' | 'booking' | 'course' | 'package' | 'review' | 'security' | 'media' | 'settings';
  details: string;
  timestamp: string;
  actor: string;
  status: 'success' | 'warning' | 'error';
  ipOrDevice?: string;
}

export interface AdminSession {
  token: string;
  email: string;
  role: 'superadmin' | 'teacher';
  loginTime: string;
  expiresAt: number;
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  thaiPhonetic: string;
  partOfSpeech: string;
  meaningEn: string;
  meaningTh: string;
  exampleEn: string;
  exampleTh: string;
  category: string;
  difficulty: string;
  thaiTip?: string;
  isSaved?: boolean;
}
