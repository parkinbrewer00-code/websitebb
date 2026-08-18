import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Tag
} from 'lucide-react';
import { PrivatePackage } from '../../types';

interface AdminPackagesTabProps {
  packages: PrivatePackage[];
  onSavePackage: (pkg: Partial<PrivatePackage>) => Promise<void>;
  onDeletePackage: (pkgId: string) => Promise<void>;
}

export const AdminPackagesTab: React.FC<AdminPackagesTabProps> = ({
  packages,
  onSavePackage,
  onDeletePackage
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPkg, setEditingPkg] = useState<Partial<PrivatePackage> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [featureInputEn, setFeatureInputEn] = useState('');
  const [featureInputTh, setFeatureInputTh] = useState('');

  const handleStartNewPackage = () => {
    setEditingPkg({
      id: `pkg-${Date.now()}`,
      nameEn: 'Custom 1-on-1 Package',
      nameTh: 'แพ็กเกจเรียนส่วนตัวพิเศษ',
      subtitleEn: 'Focused 1-on-1 private coaching designed for rapid fluency and confidence.',
      subtitleTh: 'เรียนสดตัวต่อตัว ออกแบบบทเรียนเฉพาะบุคคลเพื่อผลลัพธ์ที่รวดเร็ว',
      sessionsCount: 5,
      sessionDuration: '60 นาที / คาบ',
      priceThb: 3600,
      pricePerSessionThb: 720,
      originalPriceThb: 4500,
      popular: false,
      badgeEn: 'Best Value',
      badgeTh: 'แนะนำสุดคุ้ม',
      featuresEn: [
        '60-minute live 1-on-1 private coaching with Teacher Kym',
        'Customized curriculum based directly on your work or goals',
        'Detailed written notes and vocabulary recap after every class',
        'Direct WhatsApp chat access for quick speaking questions'
      ],
      featuresTh: [
        'เรียนสดตัวต่อตัว 60 นาทีเต็ม ผ่าน Google Meet / Zoom กับครูคิม',
        'ปรับแต่งเนื้อหาการสอนตามเป้าหมายจริง (สัมภาษณ์งาน, พรีเซนต์, ประชุม)',
        'รับเอกสารโน้ตสรุปคำศัพท์และข้อควรแก้หลังจบคลาสทุกครั้ง',
        'สิทธิ์สอบถามข้อสงสัยผ่าน WhatsApp ส่วนตัวกับครูผู้สอน'
      ],
      targetAudienceEn: 'Ideal for learners seeking personalized attention and swift progress.',
      targetAudienceTh: 'เหมาะสำหรับผู้ที่ต้องการพัฒนาทักษะการพูดแบบเร่งรัดและตรงจุด'
    });
    setIsEditing(true);
  };

  const handleEditPackage = (pkg: PrivatePackage) => {
    setEditingPkg({ ...pkg });
    setIsEditing(true);
  };

  const handleAddFeature = () => {
    if (!editingPkg) return;
    if (featureInputEn.trim() || featureInputTh.trim()) {
      setEditingPkg({
        ...editingPkg,
        featuresEn: [...(editingPkg.featuresEn || []), featureInputEn.trim() || featureInputTh.trim()],
        featuresTh: [...(editingPkg.featuresTh || []), featureInputTh.trim() || featureInputEn.trim()]
      });
      setFeatureInputEn('');
      setFeatureInputTh('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPkg) return;
    setEditingPkg({
      ...editingPkg,
      featuresEn: (editingPkg.featuresEn || []).filter((_, i) => i !== index),
      featuresTh: (editingPkg.featuresTh || []).filter((_, i) => i !== index)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg || !editingPkg.nameEn || !editingPkg.nameTh) {
      alert('Please provide package names in both English and Thai.');
      return;
    }

    // Calculate price per session
    const sessions = editingPkg.sessionsCount || 1;
    const price = editingPkg.priceThb || 0;
    const perSession = Math.round(price / sessions);

    setIsSubmitting(true);
    try {
      await onSavePackage({
        ...editingPkg,
        pricePerSessionThb: editingPkg.pricePerSessionThb || perSession
      });
      setIsEditing(false);
      setEditingPkg(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (pkgId: string) => {
    try {
      await onDeletePackage(pkgId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete package');
    }
  };

  return (
    <div className="space-y-6 antialiased">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-slate-700" />
            <span>Private 1-on-1 Packages & Pricing</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage session packages, bundle rates, lesson inclusions, and custom highlight badges.
          </p>
        </div>

        <button
          onClick={handleStartNewPackage}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Package Form Modal / Editor */}
      {isEditing && editingPkg && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 relative">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                Package Editor
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {editingPkg.nameEn ? `Edit: ${editingPkg.nameEn}` : 'Create New 1-on-1 Package'}
              </h3>
            </div>
            <button
              onClick={() => { setIsEditing(false); setEditingPkg(null); }}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Names (EN & TH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingPkg.nameEn || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, nameEn: e.target.value })}
                  placeholder="e.g. 5-Session Intensive Mastery"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package Name (Thai) *
                </label>
                <input
                  type="text"
                  required
                  value={editingPkg.nameTh || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, nameTh: e.target.value })}
                  placeholder="e.g. แพ็กเกจติวเข้ม 5 คาบ"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>
            </div>

            {/* Subtitles (EN & TH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Subtitle (English)
                </label>
                <input
                  type="text"
                  value={editingPkg.subtitleEn || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, subtitleEn: e.target.value })}
                  placeholder="Short description in English"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Subtitle (Thai)
                </label>
                <input
                  type="text"
                  value={editingPkg.subtitleTh || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, subtitleTh: e.target.value })}
                  placeholder="คำอธิบายสรุปสั้นๆ ภาษาไทย"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>
            </div>

            {/* Sessions count, Session Duration, Price, Original Price */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Sessions
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editingPkg.sessionsCount || 1}
                  onChange={e => setEditingPkg({ ...editingPkg, sessionsCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Duration
                </label>
                <input
                  type="text"
                  value={editingPkg.sessionDuration || '60 นาที / คาบ'}
                  onChange={e => setEditingPkg({ ...editingPkg, sessionDuration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package Price (THB) *
                </label>
                <input
                  type="number"
                  required
                  value={editingPkg.priceThb || 0}
                  onChange={e => setEditingPkg({ ...editingPkg, priceThb: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Original Price (THB)
                </label>
                <input
                  type="number"
                  value={editingPkg.originalPriceThb || 0}
                  onChange={e => setEditingPkg({ ...editingPkg, originalPriceThb: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              </div>
            </div>

            {/* Badges & Popular */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="sm:col-span-1 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingPkg.popular || false}
                    onChange={e => setEditingPkg({ ...editingPkg, popular: e.target.checked })}
                    className="w-4 h-4 text-slate-900 rounded focus:ring-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Set as "Popular / Best Value"
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Badge Text (English)
                </label>
                <input
                  type="text"
                  value={editingPkg.badgeEn || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, badgeEn: e.target.value })}
                  placeholder="e.g. Most Popular"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Badge Text (Thai)
                </label>
                <input
                  type="text"
                  value={editingPkg.badgeTh || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, badgeTh: e.target.value })}
                  placeholder="e.g. ยอดนิยมสูงสุด"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Features Included List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Included Features & Perks (Bilingual)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInputEn}
                  onChange={e => setFeatureInputEn(e.target.value)}
                  placeholder="Feature in English"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
                <input
                  type="text"
                  value={featureInputTh}
                  onChange={e => setFeatureInputTh(e.target.value)}
                  placeholder="สิทธิประโยชน์ภาษาไทย"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {(editingPkg.featuresEn || []).map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
                    <span className="truncate mr-2">✓ {feat} {editingPkg.featuresTh?.[idx] ? `(${editingPkg.featuresTh[idx]})` : ''}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Audience (English)
                </label>
                <input
                  type="text"
                  value={editingPkg.targetAudienceEn || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, targetAudienceEn: e.target.value })}
                  placeholder="e.g. Perfect for job interview candidates."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Audience (Thai)
                </label>
                <input
                  type="text"
                  value={editingPkg.targetAudienceTh || ''}
                  onChange={e => setEditingPkg({ ...editingPkg, targetAudienceTh: e.target.value })}
                  placeholder="e.g. เหมาะสำหรับผู้เตรียมตัวสอบสัมภาษณ์งาน"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditingPkg(null); }}
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
                <span>{isSubmitting ? 'Saving...' : 'Save Package'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => {
          const isPopular = pkg.popular;
          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl border ${
                isPopular ? 'border-slate-900 shadow-sm' : 'border-slate-200/90 shadow-2xs'
              } p-5 hover:border-slate-400 transition-colors flex flex-col justify-between relative`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{pkg.badgeEn || 'Popular'}</span>
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mt-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{pkg.nameEn}</h3>
                    <p className="text-xs text-slate-500">{pkg.nameTh}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-slate-900">
                      ฿{pkg.priceThb.toLocaleString()}
                    </div>
                    {pkg.originalPriceThb > pkg.priceThb && (
                      <div className="text-[11px] text-slate-400 line-through">
                        ฿{pkg.originalPriceThb.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="my-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {pkg.sessionsCount} คาบ ({pkg.sessionDuration})
                  </span>
                  <span className="text-emerald-800 font-bold">
                    ~฿{Math.round(pkg.priceThb / pkg.sessionsCount).toLocaleString()} / คาบ
                  </span>
                </div>

                {pkg.subtitleEn && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {pkg.subtitleEn}
                  </p>
                )}

                {/* Features preview */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {(pkg.featuresEn || []).slice(0, 3).map((feat, i) => (
                    <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                  {(pkg.featuresEn || []).length > 3 && (
                    <div className="text-[10px] text-slate-400 pl-5">
                      + {(pkg.featuresEn || []).length - 3} more perks
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {pkg.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Edit Package"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === pkg.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <button
                        onClick={() => handleDelete(pkg.id)}
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
                      onClick={() => setDeleteConfirmId(pkg.id)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
