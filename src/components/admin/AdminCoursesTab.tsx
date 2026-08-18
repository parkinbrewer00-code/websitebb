import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Layers, 
  Clock, 
  Tag, 
  Eye, 
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  FileText,
  UploadCloud,
  Download,
  ExternalLink,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { OnlineCourse, CourseModule } from '../../types';
import { processUploadedPdfFile, downloadCoursePdf, previewCoursePdf } from '../../utils/pdfHelper';

interface AdminCoursesTabProps {
  courses: OnlineCourse[];
  onSaveCourse: (course: Partial<OnlineCourse>) => Promise<void>;
  onDeleteCourse: (courseId: string) => Promise<void>;
}

export const AdminCoursesTab: React.FC<AdminCoursesTabProps> = ({
  courses,
  onSaveCourse,
  onDeleteCourse
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Partial<OnlineCourse> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state helpers
  const [highlightInputEn, setHighlightInputEn] = useState('');
  const [highlightInputTh, setHighlightInputTh] = useState('');

  const handleStartNewCourse = () => {
    setEditingCourse({
      id: `course-${Date.now()}`,
      titleEn: '',
      titleTh: '',
      subtitleEn: '',
      subtitleTh: '',
      descriptionEn: '',
      descriptionTh: '',
      coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa1b424d?w=600&auto=format&fit=crop&q=80',
      level: 'A1 - Beginner',
      lessonsCount: 20,
      durationHours: '8 ชั่วโมง',
      priceThb: 1490,
      originalPriceThb: 2900,
      isComingSoon: false,
      popular: false,
      studentsCount: 0,
      rating: 5.0,
      highlightsEn: ['Foundational Grammar for Thai Speakers', 'Real-world practical conversation'],
      highlightsTh: ['แกรมม่าพื้นฐานที่ออกแบบมาเพื่อคนไทยโดยเฉพาะ', 'บทสนทนาใช้งานได้จริง'],
      syllabus: []
    });
    setPdfUploadError(null);
    setIsEditing(true);
  };

  const handleEditCourse = (course: OnlineCourse) => {
    setEditingCourse({ ...course });
    setPdfUploadError(null);
    setIsEditing(true);
  };

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCourse) return;

    setIsUploadingPdf(true);
    setPdfUploadError(null);
    try {
      const result = await processUploadedPdfFile(file);
      setEditingCourse({
        ...editingCourse,
        handoutPdfUrl: result.dataUrl,
        handoutPdfName: result.name,
        handoutPdfSize: result.size,
        handoutPdfUploadedAt: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('PDF upload error:', err);
      setPdfUploadError(err.message || 'Failed to process PDF file.');
    } finally {
      setIsUploadingPdf(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePdf = () => {
    if (!editingCourse) return;
    setEditingCourse({
      ...editingCourse,
      handoutPdfUrl: undefined,
      handoutPdfName: undefined,
      handoutPdfSize: undefined,
      handoutPdfUploadedAt: undefined
    });
  };

  const handleAddHighlight = () => {
    if (!editingCourse) return;
    if (highlightInputEn.trim() || highlightInputTh.trim()) {
      setEditingCourse({
        ...editingCourse,
        highlightsEn: [...(editingCourse.highlightsEn || []), highlightInputEn.trim() || highlightInputTh.trim()],
        highlightsTh: [...(editingCourse.highlightsTh || []), highlightInputTh.trim() || highlightInputEn.trim()]
      });
      setHighlightInputEn('');
      setHighlightInputTh('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    if (!editingCourse) return;
    setEditingCourse({
      ...editingCourse,
      highlightsEn: (editingCourse.highlightsEn || []).filter((_, i) => i !== index),
      highlightsTh: (editingCourse.highlightsTh || []).filter((_, i) => i !== index)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editingCourse.titleEn || !editingCourse.titleTh) {
      alert('Please provide both English and Thai titles for the course.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveCourse(editingCourse);
      setIsEditing(false);
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      await onDeleteCourse(courseId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete course');
    }
  };

  return (
    <div className="space-y-6 antialiased">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <span>Online Courses</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage self-paced online curricula, digital PDF workbooks, pricing, and student enrollment status.
          </p>
        </div>

        <button
          onClick={handleStartNewCourse}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Course Edit/Create Modal/Drawer Form */}
      {isEditing && editingCourse && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 relative">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                Course Editor
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {editingCourse.titleEn ? `Edit: ${editingCourse.titleEn}` : 'Create New Online Course'}
              </h3>
            </div>
            <button
              onClick={() => { setIsEditing(false); setEditingCourse(null); }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Titles (EN & TH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.titleEn || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, titleEn: e.target.value })}
                  placeholder="e.g. A1 - Beginner English"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title (Thai) *
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.titleTh || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, titleTh: e.target.value })}
                  placeholder="e.g. A1 - ปูพื้นฐานภาษาอังกฤษตั้งแต่เริ่มต้น"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                />
              </div>
            </div>

            {/* Subtitles (EN & TH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle (English)
                </label>
                <input
                  type="text"
                  value={editingCourse.subtitleEn || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, subtitleEn: e.target.value })}
                  placeholder="Short tagline in English"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle (Thai)
                </label>
                <input
                  type="text"
                  value={editingCourse.subtitleTh || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, subtitleTh: e.target.value })}
                  placeholder="คำอธิบายสรุปสั้นๆ ภาษาไทย"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
                />
              </div>
            </div>

            {/* Level, Price, Original Price, Duration, Lessons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learner Level
                </label>
                <select
                  value={editingCourse.level || 'A1 - Beginner'}
                  onChange={e => setEditingCourse({ ...editingCourse, level: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                >
                  <option value="A1 - Beginner">A1 - Beginner</option>
                  <option value="A2 - Pre Intermediate">A2 - Pre Intermediate</option>
                  <option value="B1 - Intermediate">B1 - Intermediate</option>
                  <option value="B2 - Upper Intermediate">B2 - Upper Intermediate</option>
                  <option value="C1 - Advanced">C1 - Advanced</option>
                  <option value="Workplace & Business">Workplace & Business</option>
                  <option value="Pronunciation & Accent">Pronunciation & Accent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Price (THB) *
                </label>
                <input
                  type="number"
                  required
                  value={editingCourse.priceThb || 0}
                  onChange={e => setEditingCourse({ ...editingCourse, priceThb: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Original Price (THB)
                </label>
                <input
                  type="number"
                  value={editingCourse.originalPriceThb || 0}
                  onChange={e => setEditingCourse({ ...editingCourse, originalPriceThb: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lessons Count
                </label>
                <input
                  type="number"
                  value={editingCourse.lessonsCount || 20}
                  onChange={e => setEditingCourse({ ...editingCourse, lessonsCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration (e.g. 8 ชม.)
                </label>
                <input
                  type="text"
                  value={editingCourse.durationHours || '8 ชั่วโมง'}
                  onChange={e => setEditingCourse({ ...editingCourse, durationHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Cover Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={editingCourse.coverImage || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
                {editingCourse.coverImage && (
                  <img
                    src={editingCourse.coverImage}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                )}
              </div>
            </div>

            {/* Course PDF Handout / Student Study Material Upload */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <label className="text-xs font-bold text-slate-900">
                      Course PDF Handout & Workbook (Digital Download)
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload a PDF course handbook, syllabus worksheet, or study notes for student instant access upon enrollment.
                  </p>
                </div>
                {editingCourse.handoutPdfUrl && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    PDF Attached
                  </span>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf,.pdf"
                onChange={handlePdfFileUpload}
                className="hidden"
                id="course-pdf-file-input"
              />

              {editingCourse.handoutPdfUrl ? (
                /* PDF Attached Card */
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {editingCourse.handoutPdfName || 'Course_Handout_Workbook.pdf'}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{editingCourse.handoutPdfSize || 'Ready for Download'}</span>
                        {editingCourse.handoutPdfUploadedAt && (
                          <>
                            <span>•</span>
                            <span>{new Date(editingCourse.handoutPdfUploadedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => previewCoursePdf(editingCourse as OnlineCourse)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Preview PDF in new window"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadCoursePdf(editingCourse as OnlineCourse)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      title="Test download"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPdf}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Remove PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty / Upload Drop Zone */
                <div className="space-y-2.5">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50 rounded-xl p-4 text-center cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center mx-auto mb-1.5 transition-colors">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {isUploadingPdf ? 'Processing PDF file...' : 'Click to Upload PDF Course Material'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supports .pdf documents up to 15 MB
                    </p>
                  </div>

                  {/* Optional External PDF URL Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase shrink-0">Or PDF URL:</span>
                    <input
                      type="url"
                      value={editingCourse.handoutPdfUrl || ''}
                      onChange={e => setEditingCourse({
                        ...editingCourse,
                        handoutPdfUrl: e.target.value,
                        handoutPdfName: e.target.value ? (editingCourse.titleEn ? `${editingCourse.titleEn.replace(/\s+/g, '_')}_Material.pdf` : 'Course_Handout.pdf') : undefined,
                        handoutPdfSize: 'Cloud Document'
                      })}
                      placeholder="https://drive.google.com/... or https://example.com/handout.pdf"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>
              )}

              {pdfUploadError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pdfUploadError}</span>
                </div>
              )}
            </div>

            {/* Toggles: Coming Soon & Popular */}
            <div className="flex flex-wrap items-center gap-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingCourse.isComingSoon || false}
                  onChange={e => setEditingCourse({ ...editingCourse, isComingSoon: e.target.checked })}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Mark as "Coming Soon"
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingCourse.popular || false}
                  onChange={e => setEditingCourse({ ...editingCourse, popular: e.target.checked })}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Highlight with "Popular" Badge
                </span>
              </label>
            </div>

            {/* Highlights List Builder */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Highlights (What Students Learn)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={highlightInputEn}
                  onChange={e => setHighlightInputEn(e.target.value)}
                  placeholder="Highlight in English"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
                <input
                  type="text"
                  value={highlightInputTh}
                  onChange={e => setHighlightInputTh(e.target.value)}
                  placeholder="จุดเด่นภาษาไทย"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {(editingCourse.highlightsEn || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
                    <span className="truncate mr-2">✓ {item} {editingCourse.highlightsTh?.[idx] ? `(${editingCourse.highlightsTh[idx]})` : ''}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditingCourse(null); }}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Course'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <img
                  src={course.coverImage || 'https://images.unsplash.com/photo-1546410531-bb4caa1b424d?w=600&auto=format&fit=crop&q=80'}
                  alt={course.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white/95 text-slate-800 font-bold text-[10px] uppercase shadow-2xs">
                    {course.level}
                  </span>
                  {course.isComingSoon && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-amber-950 font-bold text-[10px] uppercase shadow-2xs">
                      Coming Soon
                    </span>
                  )}
                  {course.popular && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold text-[10px] uppercase shadow-2xs">
                      ★ Popular
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm line-clamp-1">{course.titleEn}</h3>
                  <p className="text-[11px] text-slate-200 line-clamp-1">{course.titleTh}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    {course.lessonsCount} บทเรียน
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {course.durationHours}
                  </span>
                  <span className="font-bold text-slate-900">
                    ฿{course.priceThb.toLocaleString()}
                  </span>
                </div>

                {course.subtitleEn && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.subtitleEn}
                  </p>
                )}

                {course.highlightsEn && course.highlightsEn.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    {course.highlightsEn.slice(0, 2).map((hl, i) => (
                      <div key={i} className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <span className="text-slate-700 font-bold">✓</span>
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* PDF Handout Indicator */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className={`w-3.5 h-3.5 ${course.handoutPdfUrl ? 'text-slate-800' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-semibold truncate ${course.handoutPdfUrl ? 'text-slate-800' : 'text-slate-400'}`}>
                      {course.handoutPdfUrl 
                        ? (course.handoutPdfName || 'PDF Attached')
                        : 'Default Workbook'}
                    </span>
                    {course.handoutPdfSize && (
                      <span className="text-[10px] text-slate-400 font-mono">({course.handoutPdfSize})</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => previewCoursePdf(course)}
                    className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Preview PDF material"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
              <div className="text-[11px] text-slate-400 font-mono">
                ID: {course.id}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Edit Course"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {deleteConfirmId === course.id ? (
                  <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="px-2 py-1 bg-rose-600 text-white font-semibold text-[10px] rounded cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-1.5 py-1 text-slate-600 text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(course.id)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
