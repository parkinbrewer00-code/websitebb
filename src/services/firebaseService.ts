import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  OnlineCourse,
  PrivatePackage,
  StudentReview,
  BookingRequest,
  CalendarSlot,
  MediaFile,
  SiteSettings,
  TeacherProfile,
  AdminAuditLog,
  AdminSession
} from '../types';
import { ONLINE_COURSES, PRIVATE_PACKAGES, TESTIMONIALS, TEACHER_PROFILE } from '../data/mockData';

// Collection references
const COURSES_COLLECTION = 'courses';
const REVIEWS_COLLECTION = 'reviews';
const PACKAGES_COLLECTION = 'packages';
const BOOKINGS_COLLECTION = 'bookings';
const CALENDAR_COLLECTION = 'calendar_slots';
const MEDIA_COLLECTION = 'media_files';
const SETTINGS_COLLECTION = 'site_settings';
const AUDIT_LOGS_COLLECTION = 'admin_audit_logs';

// ==========================================
// 1. INITIAL SEEDING HELPERS
// ==========================================
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    // Check courses
    const coursesSnap = await getDocs(collection(db, COURSES_COLLECTION));
    if (coursesSnap.empty) {
      console.log('Seeding initial courses into Firestore...');
      for (const course of ONLINE_COURSES) {
        await setDoc(doc(db, COURSES_COLLECTION, course.id), {
          ...course,
          createdAt: new Date().toISOString()
        });
      }
    }

    // Check packages
    const packagesSnap = await getDocs(collection(db, PACKAGES_COLLECTION));
    if (packagesSnap.empty) {
      console.log('Seeding initial packages into Firestore...');
      for (const pkg of PRIVATE_PACKAGES) {
        await setDoc(doc(db, PACKAGES_COLLECTION, pkg.id), {
          ...pkg,
          createdAt: new Date().toISOString()
        });
      }
    }

    // Check reviews
    const reviewsSnap = await getDocs(collection(db, REVIEWS_COLLECTION));
    if (reviewsSnap.empty) {
      console.log('Seeding initial reviews into Firestore...');
      for (const t of TESTIMONIALS) {
        await setDoc(doc(db, REVIEWS_COLLECTION, t.id), {
          id: t.id,
          studentName: t.name,
          roleEn: t.roleEn,
          roleTh: t.roleTh,
          avatar: t.avatar,
          rating: 5,
          quoteEn: t.quoteEn,
          quoteTh: t.quoteTh,
          courseTakenEn: t.courseTakenEn,
          courseTakenTh: t.courseTakenTh,
          isFeatured: true,
          isApproved: true,
          createdAt: new Date().toISOString()
        });
      }
    }

    // Seed default sample calendar slots for this week if empty
    const calendarSnap = await getDocs(collection(db, CALENDAR_COLLECTION));
    if (calendarSnap.empty) {
      const today = new Date();
      const sampleTimeSlots = [
        '10:00 - 11:00',
        '11:30 - 12:30',
        '14:00 - 15:00',
        '16:00 - 17:00',
        '19:00 - 20:00',
        '20:30 - 21:30'
      ];
      for (let i = 1; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        for (const slot of sampleTimeSlots) {
          const slotId = `${dateStr}_${slot.replace(/[^0-9]/g, '')}`;
          await setDoc(doc(db, CALENDAR_COLLECTION, slotId), {
            id: slotId,
            date: dateStr,
            timeSlot: slot,
            isBooked: false,
            isBlocked: false,
            note: 'Available 1-on-1 slot'
          });
        }
      }
    }

    // Check settings
    const settingsDoc = await getDoc(doc(db, SETTINGS_COLLECTION, 'general'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, SETTINGS_COLLECTION, 'general'), {
        contactEmail: 'hello@beyondborders.ac',
        whatsappNumber: '+447351264979',
        teacherName: 'Teacher Kym',
        teacherNameTh: 'ครูคิม',
        notificationEnabled: true,
        announcementEn: '🎉 Special Promotion: Book your first 1-on-1 private pack and get full access to study materials!',
        announcementTh: '🎉 โปรโมชั่นพิเศษ: จองแพ็กเกจเรียนส่วนตัว 1-1 รับเอกสารและคลังสื่อการเรียนฟรี!'
      });
    }
  } catch (error) {
    console.warn('Initial seeding notice (using local fallback if offline):', error);
  }
}

// ==========================================
// 2. COURSES CRUD
// ==========================================
export async function getCourses(): Promise<OnlineCourse[]> {
  try {
    const snap = await getDocs(collection(db, COURSES_COLLECTION));
    if (snap.empty) return ONLINE_COURSES;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as OnlineCourse));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return ONLINE_COURSES;
  }
}

export function subscribeCourses(callback: (courses: OnlineCourse[]) => void) {
  return onSnapshot(collection(db, COURSES_COLLECTION), (snap) => {
    if (!snap.empty) {
      const courses = snap.docs.map(d => ({ id: d.id, ...d.data() } as OnlineCourse));
      callback(courses);
    } else {
      callback(ONLINE_COURSES);
    }
  }, (err) => {
    console.error('Courses subscription error:', err);
    callback(ONLINE_COURSES);
  });
}

export async function saveCourse(course: Partial<OnlineCourse>): Promise<string> {
  const courseId = course.id || `course-${Date.now()}`;
  const data = {
    ...course,
    id: courseId,
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(db, COURSES_COLLECTION, courseId), data, { merge: true });
  return courseId;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await deleteDoc(doc(db, COURSES_COLLECTION, courseId));
}

// ==========================================
// 3. PACKAGES & PRICING CRUD
// ==========================================
export async function getPackages(): Promise<PrivatePackage[]> {
  try {
    const snap = await getDocs(collection(db, PACKAGES_COLLECTION));
    if (snap.empty) return PRIVATE_PACKAGES;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PrivatePackage));
  } catch (error) {
    console.error('Error fetching packages:', error);
    return PRIVATE_PACKAGES;
  }
}

export function subscribePackages(callback: (packages: PrivatePackage[]) => void) {
  return onSnapshot(collection(db, PACKAGES_COLLECTION), (snap) => {
    if (!snap.empty) {
      const pkgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as PrivatePackage));
      // Sort by price ascending
      pkgs.sort((a, b) => (a.priceThb || 0) - (b.priceThb || 0));
      callback(pkgs);
    } else {
      callback(PRIVATE_PACKAGES);
    }
  }, (err) => {
    console.error('Packages subscription error:', err);
    callback(PRIVATE_PACKAGES);
  });
}

export async function savePackage(pkg: Partial<PrivatePackage>): Promise<string> {
  const pkgId = pkg.id || `pkg-${Date.now()}`;
  const data = {
    ...pkg,
    id: pkgId,
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(db, PACKAGES_COLLECTION, pkgId), data, { merge: true });
  return pkgId;
}

export async function deletePackage(pkgId: string): Promise<void> {
  await deleteDoc(doc(db, PACKAGES_COLLECTION, pkgId));
}

// ==========================================
// 4. REVIEWS & TESTIMONIALS CRUD
// ==========================================
export async function getReviews(): Promise<StudentReview[]> {
  try {
    const snap = await getDocs(collection(db, REVIEWS_COLLECTION));
    if (snap.empty) {
      return TESTIMONIALS.map(t => ({
        id: t.id,
        studentName: t.name,
        roleEn: t.roleEn,
        roleTh: t.roleTh,
        avatar: t.avatar,
        rating: 5,
        quoteEn: t.quoteEn,
        quoteTh: t.quoteTh,
        courseTakenEn: t.courseTakenEn,
        courseTakenTh: t.courseTakenTh,
        isFeatured: true,
        isApproved: true
      }));
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentReview));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export function subscribeReviews(callback: (reviews: StudentReview[]) => void) {
  return onSnapshot(collection(db, REVIEWS_COLLECTION), (snap) => {
    if (!snap.empty) {
      const reviews = snap.docs.map(d => ({ id: d.id, ...d.data() } as StudentReview));
      callback(reviews);
    } else {
      callback(TESTIMONIALS.map(t => ({
        id: t.id,
        studentName: t.name,
        roleEn: t.roleEn,
        roleTh: t.roleTh,
        avatar: t.avatar,
        rating: 5,
        quoteEn: t.quoteEn,
        quoteTh: t.quoteTh,
        courseTakenEn: t.courseTakenEn,
        courseTakenTh: t.courseTakenTh,
        isFeatured: true,
        isApproved: true
      })));
    }
  }, (err) => {
    console.error('Reviews subscription error:', err);
  });
}

export async function saveReview(review: Partial<StudentReview>): Promise<string> {
  const reviewId = review.id || `review-${Date.now()}`;
  const data = {
    ...review,
    id: reviewId,
    isApproved: review.isApproved ?? true,
    isFeatured: review.isFeatured ?? true,
    rating: review.rating || 5,
    updatedAt: new Date().toISOString()
  };
  await setDoc(doc(db, REVIEWS_COLLECTION, reviewId), data, { merge: true });
  return reviewId;
}

export async function deleteReview(reviewId: string): Promise<void> {
  await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));
}

// ==========================================
// 5. 1-ON-1 BOOKINGS & APPOINTMENTS CRUD
// ==========================================
export async function getBookings(): Promise<BookingRequest[]> {
  try {
    const snap = await getDocs(collection(db, BOOKINGS_COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingRequest));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export function subscribeBookings(callback: (bookings: BookingRequest[]) => void) {
  return onSnapshot(collection(db, BOOKINGS_COLLECTION), (snap) => {
    const bookings = snap.docs.map(d => ({ id: d.id, ...d.data() } as BookingRequest));
    // Sort latest first
    bookings.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    callback(bookings);
  }, (err) => {
    console.error('Bookings subscription error:', err);
  });
}

export async function createBooking(booking: Partial<BookingRequest> & Omit<BookingRequest, 'id'>): Promise<string> {
  const bookingId = ('id' in booking && booking.id) ? (booking.id as string) : `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullBooking: BookingRequest = {
    ...booking,
    id: bookingId,
    status: booking.status || 'pending',
    createdAt: booking.createdAt || new Date().toISOString()
  };
  await setDoc(doc(db, BOOKINGS_COLLECTION, bookingId), fullBooking);

  // If there is a matching calendar slot, mark it as booked
  if (booking.preferredDate && booking.preferredTimeSlot) {
    try {
      const slotId = `${booking.preferredDate}_${booking.preferredTimeSlot.replace(/[^0-9]/g, '')}`;
      await setDoc(doc(db, CALENDAR_COLLECTION, slotId), {
        id: slotId,
        date: booking.preferredDate,
        timeSlot: booking.preferredTimeSlot,
        isBooked: true,
        bookingId: bookingId,
        isBlocked: false,
        note: `Booked by ${booking.studentName}`
      }, { merge: true });
    } catch (e) {
      console.warn('Could not auto-bind slot:', e);
    }
  }

  return bookingId;
}

export const saveBookingRequest = createBooking;
export const createBookingRequest = createBooking;

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  updates?: { meetingLink?: string; adminNotes?: string; preferredDate?: string; preferredTimeSlot?: string }
): Promise<void> {
  await updateDoc(doc(db, BOOKINGS_COLLECTION, bookingId), {
    status,
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteBooking(bookingId: string): Promise<void> {
  await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
}

// ==========================================
// 6. CALENDAR SLOTS & AVAILABILITY
// ==========================================
export async function getCalendarSlots(date?: string): Promise<CalendarSlot[]> {
  try {
    let q = collection(db, CALENDAR_COLLECTION);
    const snap = await getDocs(q);
    let slots = snap.docs.map(d => ({ id: d.id, ...d.data() } as CalendarSlot));
    if (date) {
      slots = slots.filter(s => s.date === date);
    }
    return slots;
  } catch (error) {
    console.error('Error fetching calendar slots:', error);
    return [];
  }
}

export function subscribeCalendarSlots(callback: (slots: CalendarSlot[]) => void) {
  return onSnapshot(collection(db, CALENDAR_COLLECTION), (snap) => {
    const slots = snap.docs.map(d => ({ id: d.id, ...d.data() } as CalendarSlot));
    callback(slots);
  }, (err) => {
    console.error('Calendar subscription error:', err);
  });
}

export async function saveCalendarSlot(slot: CalendarSlot): Promise<void> {
  await setDoc(doc(db, CALENDAR_COLLECTION, slot.id), slot, { merge: true });
}

export async function bulkSaveCalendarSlots(slots: CalendarSlot[]): Promise<number> {
  if (!slots || slots.length === 0) return 0;
  const chunkSize = 400;
  let count = 0;
  for (let i = 0; i < slots.length; i += chunkSize) {
    const chunk = slots.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    for (const slot of chunk) {
      const slotRef = doc(db, CALENDAR_COLLECTION, slot.id);
      batch.set(slotRef, slot, { merge: true });
      count++;
    }
    await batch.commit();
  }
  return count;
}

export async function deleteCalendarSlot(slotId: string): Promise<void> {
  await deleteDoc(doc(db, CALENDAR_COLLECTION, slotId));
}

export async function toggleBlockDate(dateStr: string, isBlocked: boolean): Promise<void> {
  // Get all slots for this date and mark them blocked
  const snap = await getDocs(collection(db, CALENDAR_COLLECTION));
  const docsToUpdate = snap.docs.filter(d => d.data().date === dateStr);
  for (const docItem of docsToUpdate) {
    await updateDoc(doc(db, CALENDAR_COLLECTION, docItem.id), {
      isBlocked,
      note: isBlocked ? 'Teacher Unavailable / Holiday' : 'Available slot'
    });
  }
}

// ==========================================
// 7. MEDIA & FILES LIBRARY
// ==========================================
export async function getMediaFiles(): Promise<MediaFile[]> {
  try {
    const snap = await getDocs(collection(db, MEDIA_COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaFile));
  } catch (error) {
    console.error('Error fetching media files:', error);
    return [];
  }
}

export function subscribeMediaFiles(callback: (files: MediaFile[]) => void) {
  return onSnapshot(collection(db, MEDIA_COLLECTION), (snap) => {
    const files = snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaFile));
    files.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''));
    callback(files);
  }, (err) => {
    console.error('Media subscription error:', err);
  });
}

export async function saveMediaFile(file: Omit<MediaFile, 'id'>): Promise<string> {
  const fileId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const data: MediaFile = {
    ...file,
    id: fileId,
    uploadedAt: new Date().toISOString()
  };
  await setDoc(doc(db, MEDIA_COLLECTION, fileId), data);
  return fileId;
}

export async function deleteMediaFile(fileId: string): Promise<void> {
  await deleteDoc(doc(db, MEDIA_COLLECTION, fileId));
}

// ==========================================
// 8. SITE SETTINGS & TEACHER PROFILE
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const snap = await getDoc(doc(db, SETTINGS_COLLECTION, 'general'));
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  await setDoc(doc(db, SETTINGS_COLLECTION, 'general'), settings, { merge: true });
}

// ==========================================
// 9. ADMIN SECURITY & AUDIT LOGGING
// ==========================================
export async function logAdminAction(
  action: string,
  category: AdminAuditLog['category'],
  details: string,
  status: 'success' | 'warning' | 'error' = 'success',
  actor: string = 'Teacher Kym (Admin)'
): Promise<void> {
  try {
    const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const logItem: AdminAuditLog = {
      id: logId,
      action,
      category,
      details,
      timestamp: new Date().toISOString(),
      actor,
      status,
      ipOrDevice: typeof navigator !== 'undefined' ? `${navigator.platform || 'Web'} • ${navigator.userAgent.slice(0, 40)}...` : 'Web Browser'
    };
    await setDoc(doc(db, AUDIT_LOGS_COLLECTION, logId), logItem);
  } catch (error) {
    console.warn('Could not write audit log to firestore:', error);
  }
}

export function subscribeAuditLogs(callback: (logs: AdminAuditLog[]) => void) {
  return onSnapshot(collection(db, AUDIT_LOGS_COLLECTION), (snap) => {
    const logs = snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminAuditLog));
    logs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    callback(logs);
  }, (err) => {
    console.error('Audit logs subscription error:', err);
  });
}

export async function exportDatabaseBackup(): Promise<string> {
  try {
    const [coursesSnap, pkgsSnap, reviewsSnap, bookingsSnap, slotsSnap, settingsSnap] = await Promise.all([
      getDocs(collection(db, COURSES_COLLECTION)),
      getDocs(collection(db, PACKAGES_COLLECTION)),
      getDocs(collection(db, REVIEWS_COLLECTION)),
      getDocs(collection(db, BOOKINGS_COLLECTION)),
      getDocs(collection(db, CALENDAR_COLLECTION)),
      getDoc(doc(db, SETTINGS_COLLECTION, 'general'))
    ]);

    const backupData = {
      exportedAt: new Date().toISOString(),
      platform: 'Beyond Borders Admin System',
      version: '2.0-secure',
      data: {
        courses: coursesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        packages: pkgsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        reviews: reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        bookings: bookingsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        calendarSlots: slotsSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        settings: settingsSnap.exists() ? settingsSnap.data() : null
      }
    };

    return JSON.stringify(backupData, null, 2);
  } catch (err) {
    console.error('Error generating database backup:', err);
    throw err;
  }
}

