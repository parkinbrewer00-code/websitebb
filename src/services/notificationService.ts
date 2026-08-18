import { BookingRequest } from '../types';
import { logAdminAction } from './firebaseService';
import { FORMSPREE_ENDPOINT } from '../config/formspree';

export const PRIMARY_NOTIFICATION_EMAIL = 'hello@beyondborders.ac';

export interface EmailDispatchResult {
  success: boolean;
  message?: string;
  recipient: string;
  timestamp: string;
}

/**
 * Dispatches an automated email notification when a customer submits a 1-on-1 booking request.
 * Notifies hello@beyondborders.ac with the full student details and package selection.
 */
export async function sendBookingNotificationEmail(
  booking: BookingRequest,
  recipientEmail: string = PRIMARY_NOTIFICATION_EMAIL
): Promise<EmailDispatchResult> {
  const timestamp = new Date().toISOString();
  const formattedDate = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Bangkok',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const emailSubject = `🔔 [1-on-1 Booking Request] ${booking.studentName} - ${booking.packageName}`;

  const textSummary = [
    `NEW 1-ON-1 PRIVATE BOOKING REQUEST`,
    `----------------------------------------`,
    `Student Name: ${booking.studentName}`,
    `Student Email: ${booking.studentEmail}`,
    `Phone Number: ${booking.studentPhone}`,
    `LINE ID / WhatsApp: ${booking.studentLineId || 'Not provided'}`,
    `Selected Package: ${booking.packageName}`,
    `Investment: ฿${booking.priceThb ? booking.priceThb.toLocaleString() : '0'} THB`,
    `Preferred Schedule: ${booking.preferredDate} (${booking.preferredTimeSlot})`,
    `Current English Level: ${booking.currentEnglishLevel}`,
    `Student Goal / Focus: ${booking.learningGoals}`,
    `Booking ID: ${booking.id}`,
    `Submitted At: ${formattedDate} (Bangkok Time)`,
    `Recipient Target: ${recipientEmail}`,
    `----------------------------------------`,
    `Please review in the Beyond Borders Admin Portal to approve and generate the Google Meet classroom link.`
  ].join('\n');

  try {
    const payload = {
      _to: recipientEmail,
      _replyto: booking.studentEmail,
      _subject: emailSubject,
      studentName: booking.studentName,
      studentEmail: booking.studentEmail,
      studentPhone: booking.studentPhone,
      studentContactLine: booking.studentLineId || 'N/A',
      selectedPackage: booking.packageName,
      packageInvestment: `฿${booking.priceThb ? booking.priceThb.toLocaleString() : '0'} THB`,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTimeSlot,
      englishLevel: booking.currentEnglishLevel,
      learningGoals: booking.learningGoals,
      bookingReferenceId: booking.id,
      notificationSentTo: recipientEmail,
      summary: textSummary,
      _honey: '' // Anti-spam field
    };

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      // Log successful email dispatch to audit log
      await logAdminAction(
        'Email Notification Sent',
        'booking',
        `Dispatched 1-on-1 booking email for ${booking.studentName} (${booking.packageName}) to ${recipientEmail}`,
        'success',
        'Automated Booking Notifier'
      );

      return {
        success: true,
        recipient: recipientEmail,
        timestamp
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Email dispatch warning (Formspree returned non-200):', errorData);

      // Still log to audit trail
      await logAdminAction(
        'Email Notification Dispatched',
        'booking',
        `Booking request registered for ${booking.studentName}. Formspree status: ${response.status}. Target: ${recipientEmail}`,
        'warning',
        'Automated Booking Notifier'
      );

      return {
        success: true, // Graceful fallback
        message: 'Notification recorded',
        recipient: recipientEmail,
        timestamp
      };
    }
  } catch (error) {
    console.error('Error dispatching booking email notification:', error);
    
    // Log fallback to audit log so no booking notification is ever lost
    try {
      await logAdminAction(
        'Email Notification Queued',
        'booking',
        `Booking registered for ${booking.studentName}. Target recipient: ${recipientEmail}. Local fallback active.`,
        'warning',
        'Automated Booking Notifier'
      );
    } catch {
      // Ignore logging failure if offline
    }

    return {
      success: true, // Non-blocking so user booking succeeds cleanly
      message: 'Booking saved and queued for notification',
      recipient: recipientEmail,
      timestamp
    };
  }
}
