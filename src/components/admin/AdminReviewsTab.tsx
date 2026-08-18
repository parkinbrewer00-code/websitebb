import React, { useState } from 'react';
import { 
  Star, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  User, 
  Sparkles, 
  CheckCircle, 
  Quote,
  Eye,
  EyeOff
} from 'lucide-react';
import { StudentReview } from '../../types';

interface AdminReviewsTabProps {
  reviews: StudentReview[];
  onSaveReview: (review: Partial<StudentReview>) => Promise<void>;
  onDeleteReview: (reviewId: string) => Promise<void>;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  reviews,
  onSaveReview,
  onDeleteReview
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<Partial<StudentReview> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleStartNewReview = () => {
    setEditingReview({
      id: `review-${Date.now()}`,
      studentName: '',
      roleEn: 'Marketing Manager, Tech Startup',
      roleTh: 'ผู้จัดการฝ่ายการตลาด, บริษัทเทคโนโลยี',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      quoteEn: 'Teacher Kym tailored the coaching directly to my real meetings. I went from nervous to presenting confidently in front of our US leadership team!',
      quoteTh: 'ครูคิมปรับบทเรียนเข้ากับการทำงานจริง จากคนที่กลัวการพรีเซนต์ ตอนนี้พูดในที่ประชุมทีมผู้บริหารต่างประเทศได้อย่างมั่นใจ ไหลลื่นขึ้นเยอะมากค่ะ!',
      courseTakenEn: 'Workplace Fluency + 5 Private 1-on-1 Sessions',
      courseTakenTh: 'คอร์สภาษาอังกฤษสำหรับทำงาน + เรียนตัวต่อตัว 5 คาบ',
      isFeatured: true,
      isApproved: true
    });
    setIsEditing(true);
  };

  const handleEditReview = (rev: StudentReview) => {
    setEditingReview({ ...rev });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !editingReview.studentName || !editingReview.quoteTh) {
      alert('Please provide student name and quote in Thai.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveReview(editingReview);
      setIsEditing(false);
      setEditingReview(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await onDeleteReview(reviewId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Student Reviews & Transformations</h2>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-semibold">
              {reviews.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage authentic student testimonials, career outcomes, and ratings displayed on the website.
          </p>
        </div>

        <button
          onClick={handleStartNewReview}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Editor Form Modal */}
      {isEditing && editingReview && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-xl relative animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                Review Editor
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {editingReview.studentName ? `Edit Review: ${editingReview.studentName}` : 'Add Student Testimonial'}
              </h3>
            </div>
            <button
              onClick={() => { setIsEditing(false); setEditingReview(null); }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Student Name & Avatar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Name (e.g. คุณธนภัทร (ภัทร)) *
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.studentName || ''}
                  onChange={e => setEditingReview({ ...editingReview, studentName: e.target.value })}
                  placeholder="Student Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Avatar Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editingReview.avatar || ''}
                    onChange={e => setEditingReview({ ...editingReview, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                  />
                  {editingReview.avatar && (
                    <img
                      src={editingReview.avatar}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Profession / Role (EN & TH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Profession / Role (Thai) *
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.roleTh || ''}
                  onChange={e => setEditingReview({ ...editingReview, roleTh: e.target.value })}
                  placeholder="e.g. Senior Software Engineer, Agoda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Profession / Role (English)
                </label>
                <input
                  type="text"
                  value={editingReview.roleEn || ''}
                  onChange={e => setEditingReview({ ...editingReview, roleEn: e.target.value })}
                  placeholder="e.g. Senior Software Engineer, Agoda"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>
            </div>

            {/* Course Taken & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Star Rating (1 to 5)
                </label>
                <select
                  value={editingReview.rating || 5}
                  onChange={e => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-400"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                  <option value={3}>★★★☆☆ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Taken (Thai)
                </label>
                <input
                  type="text"
                  value={editingReview.courseTakenTh || ''}
                  onChange={e => setEditingReview({ ...editingReview, courseTakenTh: e.target.value })}
                  placeholder="e.g. คอร์สพูดคล่องในที่ทำงาน + เรียนเดี่ยว 5 คาบ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Taken (English)
                </label>
                <input
                  type="text"
                  value={editingReview.courseTakenEn || ''}
                  onChange={e => setEditingReview({ ...editingReview, courseTakenEn: e.target.value })}
                  placeholder="e.g. 5-Session 1-on-1 Package"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>
            </div>

            {/* Quotes (TH & EN) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Review Quote (Thai) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingReview.quoteTh || ''}
                  onChange={e => setEditingReview({ ...editingReview, quoteTh: e.target.value })}
                  placeholder="ความประทับใจและผลลัพธ์ที่ได้จากการเรียนกับครูคิม..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Review Quote (English)
                </label>
                <textarea
                  rows={4}
                  value={editingReview.quoteEn || ''}
                  onChange={e => setEditingReview({ ...editingReview, quoteEn: e.target.value })}
                  placeholder="English translation of the student testimonial..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingReview.isFeatured ?? true}
                  onChange={e => setEditingReview({ ...editingReview, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-slate-900 rounded border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Feature prominently on Homepage Testimonials
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingReview.isApproved ?? true}
                  onChange={e => setEditingReview({ ...editingReview, isApproved: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Approved / Published
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditingReview(null); }}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Review'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={rev.studentName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{rev.studentName}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{rev.roleTh || rev.roleEn}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {rev.isFeatured && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-semibold">
                      Featured
                    </span>
                  )}
                  {rev.isApproved ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic relative">
                <Quote className="w-3.5 h-3.5 text-slate-300 absolute top-2 right-2 opacity-50" />
                <p className="line-clamp-4">"{rev.quoteTh || rev.quoteEn}"</p>
              </div>

              {(rev.courseTakenTh || rev.courseTakenEn) && (
                <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700">Course:</span>
                  <span className="truncate">{rev.courseTakenTh || rev.courseTakenEn}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
              <span className="text-[10px] text-slate-400 font-mono">
                ID: {rev.id}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEditReview(rev)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Review"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {deleteConfirmId === rev.id ? (
                  <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="px-2 py-1 bg-rose-600 text-white font-semibold text-[10px] rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-1.5 py-1 text-slate-600 text-[10px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(rev.id)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete Review"
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
