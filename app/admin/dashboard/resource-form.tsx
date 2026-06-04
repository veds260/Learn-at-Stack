"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Loader2,
  Video,
  FileText,
  Users,
  Calendar,
  ImagePlus,
  Trash2,
  Link2,
  Plus,
  Twitter,
} from "lucide-react";
import { createResource, updateResource, getResource } from "@/lib/actions";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import type { GalleryImage, EmbedItem } from "@/lib/db/schema";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface ResourceFormProps {
  categories: Category[];
  editingId: string | null;
  onClose: () => void;
}

const TYPE_OPTIONS = [
  { value: "workshop", label: "Workshop" },
  { value: "article", label: "Article" },
  { value: "tool", label: "Tool" },
  { value: "case_study", label: "Case Study" },
  { value: "guide", label: "Guide" },
  { value: "video", label: "Video" },
];

export function ResourceForm({
  categories,
  editingId,
  onClose,
}: ResourceFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingResource, setFetchingResource] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    type: "article",
    status: "draft",
    categoryId: "",
    externalUrl: "",
    author: "",
    videoUrl: "",
    transcript: "",
    eventDate: "",
    speakers: "",
    gallery: [] as GalleryImage[],
    embeds: [] as EmbedItem[],
  });

  useEffect(() => {
    if (editingId) {
      setFetchingResource(true);
      getResource(editingId).then((resource) => {
        if (resource) {
          setFormData({
            title: resource.title,
            slug: resource.slug,
            description: resource.description || "",
            content: resource.content || "",
            thumbnail: resource.thumbnail || "",
            type: resource.type,
            status: resource.status || "draft",
            categoryId: resource.categoryId || "",
            externalUrl: resource.externalUrl || "",
            author: resource.author || "",
            videoUrl: resource.videoUrl || "",
            transcript: resource.transcript || "",
            eventDate: resource.eventDate
              ? new Date(resource.eventDate).toISOString().slice(0, 10)
              : "",
            speakers: resource.speakers || "",
            gallery: resource.gallery || [],
            embeds: resource.embeds || [],
          });
        }
        setFetchingResource(false);
      });
    }
  }, [editingId]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: editingId ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateResource(editingId, formData);
      } else {
        await createResource(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving resource:", error);
    } finally {
      setLoading(false);
    }
  };

  const { type } = formData;
  const isWorkshop = type === "workshop";
  const isTool = type === "tool";
  const isCaseStudy = type === "case_study";
  const hasVideo = isWorkshop || type === "video";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950 z-10">
          <h2 className="text-xl font-light">
            {editingId ? "Edit Content" : "Add Content"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {fetchingResource ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:border-zinc-600 transition-colors"
                >
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:border-zinc-600 transition-colors"
                >
                  <option value="draft">Draft (hidden)</option>
                  <option value="pending">Pending review</option>
                  <option value="published">Published (live)</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                placeholder="Content title"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors font-mono text-sm"
                placeholder="content-slug"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:border-zinc-600 transition-colors"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors resize-none"
                placeholder="Brief description for the card"
              />
            </div>

            {/* Workshop / Video URL */}
            {hasVideo && (
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  <Video className="w-4 h-4 inline mr-2" />
                  Video URL (YouTube, Vimeo, or direct link)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-zinc-600 mt-2">
                  Upload the workshop replay to YouTube, then paste the link. It
                  embeds at the top of the page.
                </p>
              </div>
            )}

            {/* Workshop meta: date + speakers */}
            {isWorkshop && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Workshop date
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventDate: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white focus:border-zinc-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Speakers
                  </label>
                  <input
                    type="text"
                    value={formData.speakers}
                    onChange={(e) =>
                      setFormData({ ...formData, speakers: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                    placeholder="@elizacreatez, @auntiepaca"
                  />
                </div>
              </div>
            )}

            {/* Tool external URL (prominent) */}
            {isTool && (
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  <Link2 className="w-4 h-4 inline mr-2" />
                  Tool link
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, externalUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                  placeholder="https://... (where members can use the tool)"
                />
              </div>
            )}

            {/* Case study screenshot gallery */}
            {isCaseStudy && (
              <GalleryUploader
                gallery={formData.gallery}
                onChange={(gallery) => setFormData({ ...formData, gallery })}
              />
            )}

            {/* Embedded X posts (clips, tool demos, win posts) */}
            <EmbedsEditor
              embeds={formData.embeds}
              onChange={(embeds) => setFormData({ ...formData, embeds })}
            />

            {/* Content (article body) */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                {isWorkshop
                  ? "Workshop write-up"
                  : isTool
                  ? "How to use it (optional)"
                  : isCaseStudy
                  ? "The story"
                  : "Content"}
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) =>
                  setFormData({ ...formData, content: html })
                }
                placeholder={
                  isWorkshop
                    ? "The article breaking down the workshop..."
                    : "Start writing..."
                }
              />
            </div>

            {/* Workshop transcript (source material, collapsible on public page) */}
            {isWorkshop && (
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Transcript (source, optional)
                </label>
                <textarea
                  value={formData.transcript}
                  onChange={(e) =>
                    setFormData({ ...formData, transcript: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors resize-none font-mono text-xs"
                  placeholder="Paste the Fathom transcript here. Shown in a collapsible section on the workshop page."
                />
              </div>
            )}

            {/* Thumbnail URL */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                placeholder="https://..."
              />
            </div>

            {/* External URL (non-tool types) */}
            {!isTool && (
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  External URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, externalUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                  placeholder="https://notion.so/..."
                />
              </div>
            )}

            {/* Author */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                placeholder="Author name"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// Multi-image uploader for case study screenshots (uses /api/upload → Cloudinary).
function GalleryUploader({
  gallery,
  onChange,
}: {
  gallery: GalleryImage[];
  onChange: (gallery: GalleryImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          if (url) uploaded.push({ url, caption: "" });
        }
      }
      onChange([...gallery, ...uploaded]);
    } catch (err) {
      console.error("Gallery upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const updateCaption = (idx: number, caption: string) => {
    const next = [...gallery];
    next[idx] = { ...next[idx], caption };
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(gallery.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-2">
        <ImagePlus className="w-4 h-4 inline mr-2" />
        Screenshots
      </label>

      {gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {gallery.map((img, idx) => (
            <div
              key={idx}
              className="relative group border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption || `Screenshot ${idx + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <input
                type="text"
                value={img.caption || ""}
                onChange={(e) => updateCaption(idx, e.target.value)}
                placeholder="Caption (optional)"
                className="w-full px-3 py-2 bg-zinc-950/80 border-t border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 w-full justify-center border border-dashed border-zinc-700 rounded-xl text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <ImagePlus className="w-4 h-4" />
            Add screenshots
          </>
        )}
      </button>
    </div>
  );
}

// Repeater for embedding X/Twitter posts (workshop clips, tool demos, wins).
function EmbedsEditor({
  embeds,
  onChange,
}: {
  embeds: EmbedItem[];
  onChange: (embeds: EmbedItem[]) => void;
}) {
  const update = (idx: number, patch: Partial<EmbedItem>) => {
    const next = [...embeds];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };
  const remove = (idx: number) => onChange(embeds.filter((_, i) => i !== idx));
  const add = () => onChange([...embeds, { url: "", caption: "" }]);

  return (
    <div>
      <label className="block text-sm text-zinc-400 mb-2">
        <Twitter className="w-4 h-4 inline mr-2" />
        X posts to embed
      </label>

      {embeds.length > 0 && (
        <div className="space-y-2 mb-3">
          {embeds.map((e, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-zinc-900/50 border border-zinc-800 rounded-xl"
            >
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  value={e.url}
                  onChange={(ev) => update(idx, { url: ev.target.value })}
                  placeholder="https://x.com/user/status/123..."
                  className="w-full px-3 py-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors font-mono"
                />
                <input
                  type="text"
                  value={e.caption || ""}
                  onChange={(ev) => update(idx, { caption: ev.target.value })}
                  placeholder="Caption (optional)"
                  className="w-full px-3 py-2 bg-zinc-950/50 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:border-zinc-600 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 px-4 py-2.5 w-full justify-center border border-dashed border-zinc-700 rounded-xl text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add X post
      </button>
      <p className="text-xs text-zinc-600 mt-2">
        Paste X post links. They render as embedded posts, so workshop clips and
        tool demos show up natively and your clippers get a home.
      </p>
    </div>
  );
}
