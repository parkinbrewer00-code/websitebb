import React, { useState, useRef } from 'react';
import { 
  FolderOpen, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Filter,
  Layers
} from 'lucide-react';
import { MediaFile } from '../../types';

interface AdminMediaLibraryTabProps {
  mediaFiles: MediaFile[];
  onUploadMediaFile: (file: Omit<MediaFile, 'id'>) => Promise<string>;
  onDeleteMediaFile: (fileId: string) => Promise<void>;
}

export const AdminMediaLibraryTab: React.FC<AdminMediaLibraryTabProps> = ({
  mediaFiles,
  onUploadMediaFile,
  onDeleteMediaFile
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual URL upload form
  const [manualName, setManualName] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualCategory, setManualCategory] = useState<'avatar' | 'course_cover' | 'worksheet' | 'document'>('course_cover');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const fileType = file.type.startsWith('image/') ? 'image' :
                         file.type.startsWith('audio/') ? 'audio' :
                         file.name.endsWith('.pdf') ? 'pdf' : 'doc';

        const category = fileType === 'image' ? 'course_cover' : 'worksheet';
        const sizeStr = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;

        await onUploadMediaFile({
          name: file.name,
          url: dataUrl,
          fileType,
          size: sizeStr,
          category,
          uploadedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error(err);
        alert('Failed to upload file');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualUrl.trim()) return;

    setIsUploading(true);
    try {
      await onUploadMediaFile({
        name: manualName.trim(),
        url: manualUrl.trim(),
        fileType: 'image',
        size: 'Web Link',
        category: manualCategory,
        uploadedAt: new Date().toISOString()
      });
      setManualName('');
      setManualUrl('');
    } catch (err) {
      console.error(err);
      alert('Failed to add media link');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFiles = selectedCategory === 'all'
    ? mediaFiles
    : mediaFiles.filter(f => f.category === selectedCategory || f.fileType === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Media & File Library</h2>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
              {mediaFiles.length} Assets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Store course cover images, student avatars, downloadable worksheets, and audio clips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,audio/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload File / Image'}</span>
          </button>
        </div>
      </div>

      {/* Manual Web Image Link Adder */}
      <form onSubmit={handleAddManualUrl} className="bg-white p-4 rounded-2xl border border-slate-200">
        <h3 className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-slate-600" />
          <span>Quick Add Web Image or Unsplash Link</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="File / Asset Name (e.g. Business Course Cover)"
            value={manualName}
            onChange={e => setManualName(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
          />
          <input
            type="url"
            placeholder="Image URL (https://...)"
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400 bg-white"
          />
          <button
            type="submit"
            disabled={isUploading || !manualName || !manualUrl}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Add to Library
          </button>
        </div>
      </form>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Files' },
          { id: 'course_cover', label: 'Course Covers' },
          { id: 'avatar', label: 'Student Avatars' },
          { id: 'worksheet', label: 'Worksheets & PDFs' },
          { id: 'image', label: 'All Images' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No media files in this category</h3>
          <p className="text-xs text-slate-400 mt-1">Upload images or worksheets to access them anywhere in the app.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const isImage = file.fileType === 'image' || file.url.startsWith('data:image') || file.url.includes('unsplash') || file.url.includes('.png') || file.url.includes('.jpg');
            const isCopied = copiedId === file.id;

            return (
              <div
                key={file.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                {/* Media Preview Box */}
                <div className="h-36 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {isImage ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : file.fileType === 'pdf' ? (
                    <div className="flex flex-col items-center text-rose-500">
                      <FileText className="w-10 h-10" />
                      <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider">PDF Document</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <FileText className="w-10 h-10" />
                      <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider">{file.fileType}</span>
                    </div>
                  )}

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-semibold uppercase backdrop-blur-xs">
                    {file.category || file.fileType}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3.5">
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{file.size}</span>
                    <span>{file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : ''}</span>
                  </div>

                  {/* Copy URL & Delete */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(file)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy URL'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteMediaFile(file.id)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
