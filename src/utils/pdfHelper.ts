import { OnlineCourse } from '../types';

/**
 * Escapes characters for PDF text stream
 */
function escapePdfText(str: string): string {
  return str.replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, ' ');
}

/**
 * Creates a valid, standalone PDF 1.4 Document Blob
 */
export function createCoursePdfBlob(course: OnlineCourse): Blob {
  const title = course.titleEn || 'Beyond Borders Course Handbook';
  const subtitle = `${course.level} • ${course.durationHours || 'Self-Paced'} • Lifetime Access`;
  const teacher = 'Teacher Kym (BA in TEFL, University of Essex • CELTA)';
  const highlights = (course.highlightsEn && course.highlightsEn.length > 0)
    ? course.highlightsEn
    : [
        'Foundational Grammar & Tense Structures',
        'Phonetic Stress and Pronunciation Drills',
        'Conversational Fluency and Natural Idioms',
        'Workplace and Daily Communication Scenarios'
      ];

  const streamLines = [
    `BT /F1 20 Tf 50 780 Td (${escapePdfText(title)}) Tj ET`,
    `BT /F1 11 Tf 50 758 Td (${escapePdfText(subtitle)}) Tj ET`,
    `BT /F1 10 Tf 50 740 Td (${escapePdfText('Instructor: ' + teacher)}) Tj ET`,
    `0.2 0.25 0.67 rg 50 725 495 2 re f 0 g`, // Divider line
    `BT /F1 14 Tf 50 695 Td (${escapePdfText('COURSE CURRICULUM & STUDY GUIDE')}) Tj ET`,
    `BT /F1 11 Tf 50 670 Td (${escapePdfText('Welcome to your official course materials! Keep this workbook for daily practice.')}) Tj ET`,
    `BT /F1 12 Tf 50 635 Td (${escapePdfText('Key Learning Objectives & Takeaways:')}) Tj ET`
  ];

  highlights.slice(0, 6).forEach((h, idx) => {
    const yPos = 605 - idx * 28;
    streamLines.push(
      `0.92 0.94 0.98 rg 50 ${yPos - 6} 495 22 re f 0.2 0.25 0.67 RG 1 w 50 ${yPos - 6} 495 22 re s 0 g`,
      `BT /F1 10 Tf 60 ${yPos} Td ([${idx + 1}] ${escapePdfText(h)}) Tj ET`
    );
  });

  const notesStartY = 605 - Math.min(highlights.length, 6) * 28 - 25;
  streamLines.push(
    `BT /F1 12 Tf 50 ${notesStartY} Td (${escapePdfText('Student Practice & Notes Section:')}) Tj ET`,
    `0.85 0.85 0.85 RG [3 3] 0 d 1 w 50 ${notesStartY - 100} 495 90 re s 0 g [] 0 d`,
    `BT /F1 9 Tf 60 ${notesStartY - 25} Td (${escapePdfText('1. Write down new vocabulary words and pronunciation tips here during your course lessons.')}) Tj ET`,
    `BT /F1 9 Tf 60 ${notesStartY - 45} Td (${escapePdfText('2. Practice sentence structures out loud with Teacher Kym\'s rhythm exercises.')}) Tj ET`,
    `BT /F1 9 Tf 60 ${notesStartY - 65} Td (${escapePdfText('3. Review your personal feedback notes before your live practice sessions.')}) Tj ET`,
    `0.2 0.25 0.67 rg 50 60 495 1.5 re f 0 g`,
    `BT /F1 9 Tf 50 45 Td (${escapePdfText('Beyond Borders English Academy • Official Course Workbook • Lifetime Access')}) Tj ET`,
    `BT /F1 9 Tf 440 45 Td (${escapePdfText('Page 1 of 1')}) Tj ET`
  );

  const contentStream = streamLines.join('\n');
  const streamLen = contentStream.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length ${streamLen} >>
stream
${contentStream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000234 00000 n 
0000000312 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${420 + streamLen}
%%EOF`;

  return new Blob([pdfBody], { type: 'application/pdf' });
}

/**
 * Convert an uploaded file into a Base64 data URL with formatted metadata
 */
export function processUploadedPdfFile(file: File): Promise<{ dataUrl: string; name: string; size: string }> {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      reject(new Error('Only PDF files are supported. Please upload a .pdf file.'));
      return;
    }

    // Limit to 15MB for Firestore performance
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error('File size exceeds 15MB limit. Please choose a smaller PDF.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeBytes = file.size;
      let formattedSize = `${(sizeBytes / 1024).toFixed(1)} KB`;
      if (sizeBytes >= 1024 * 1024) {
        formattedSize = `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
      }

      resolve({
        dataUrl,
        name: file.name,
        size: formattedSize
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Safely trigger a download for a course PDF file
 */
export function downloadCoursePdf(course: OnlineCourse) {
  const filename = course.handoutPdfName || `${course.titleEn.replace(/[^a-zA-Z0-9]/g, '_')}_Workbook.pdf`;
  
  if (course.handoutPdfUrl && course.handoutPdfUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = course.handoutPdfUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  } else if (course.handoutPdfUrl && (course.handoutPdfUrl.startsWith('http://') || course.handoutPdfUrl.startsWith('https://'))) {
    const link = document.createElement('a');
    link.href = course.handoutPdfUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Fallback: Generate real PDF Blob
  const blob = createCoursePdfBlob(course);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Open PDF in a new tab for previewing
 */
export function previewCoursePdf(course: OnlineCourse) {
  if (course.handoutPdfUrl && (course.handoutPdfUrl.startsWith('data:') || course.handoutPdfUrl.startsWith('http'))) {
    const win = window.open(course.handoutPdfUrl, '_blank');
    if (!win) {
      downloadCoursePdf(course);
    }
  } else {
    const blob = createCoursePdfBlob(course);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
