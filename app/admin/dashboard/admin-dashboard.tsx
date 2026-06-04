"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  LogOut,
  Trash2,
  Edit,
  BookOpen,
  FolderOpen,
  Check,
  Undo2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  deleteResource,
  deleteCategory,
  setResourceStatus,
} from "@/lib/actions";
import { ResourceForm } from "./resource-form";
import { CategoryForm } from "./category-form";

interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  type: string;
  status: string;
  submittedBy: string | null;
  categoryName: string | null;
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  createdAt: Date;
}

interface AdminDashboardProps {
  resources: Resource[];
  categories: Category[];
  userEmail: string;
}

const TYPE_LABELS: Record<string, string> = {
  workshop: "Workshop",
  article: "Article",
  tool: "Tool",
  case_study: "Case Study",
  guide: "Guide",
  video: "Video",
};

type StatusFilter = "pending" | "published" | "draft" | "all";

export function AdminDashboard({
  resources,
  categories,
  userEmail,
}: AdminDashboardProps) {
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [tab, setTab] = useState<"resources" | "categories">("resources");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const pendingCount = resources.filter((r) => r.status === "pending").length;
  const publishedCount = resources.filter(
    (r) => r.status === "published"
  ).length;
  const draftCount = resources.filter((r) => r.status === "draft").length;

  const filtered =
    statusFilter === "all"
      ? resources
      : resources.filter((r) => r.status === statusFilter);

  const handleDeleteResource = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteResource(id);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
    }
  };

  const statusFilters: { key: StatusFilter; label: string; count: number }[] = [
    { key: "pending", label: "Pending review", count: pendingCount },
    { key: "published", label: "Live", count: publishedCount },
    { key: "draft", label: "Drafts", count: draftCount },
    { key: "all", label: "All", count: resources.length },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Stack Daily"
              width={180}
              height={48}
              className="h-12 w-auto"
            />
            <span className="text-zinc-500 text-sm">/ admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">{userEmail}</span>
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/admin";
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 p-1 bg-zinc-900/50 rounded-xl w-fit">
          <button
            onClick={() => setTab("resources")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "resources"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Content ({resources.length})
          </button>
          <button
            onClick={() => setTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "categories"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Categories ({categories.length})
          </button>
        </div>

        {/* Resources Tab */}
        {tab === "resources" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light">Content</h1>
              <button
                onClick={() => {
                  setEditingResource(null);
                  setShowResourceForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Content
              </button>
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap items-center gap-1 mb-6 p-1 bg-zinc-900/50 rounded-xl w-fit">
              {statusFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === f.key
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {f.key === "pending" && f.count > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                  {f.label}
                  <span className="text-xs text-zinc-500">{f.count}</span>
                </button>
              ))}
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="font-medium text-white truncate">
                          {resource.title}
                        </h3>
                        <StatusBadge status={resource.status} />
                        <span className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded-full">
                          {TYPE_LABELS[resource.type] || resource.type}
                        </span>
                        {resource.categoryName && (
                          <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 rounded-full">
                            {resource.categoryName}
                          </span>
                        )}
                        {resource.submittedBy === "claude" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-violet-500/10 text-violet-300 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            Claude draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 truncate">
                        /{resource.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 ml-4">
                      {/* Approve → publish */}
                      {resource.status !== "published" && (
                        <button
                          onClick={() =>
                            setResourceStatus(resource.id, "published")
                          }
                          title="Approve & publish"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Publish
                        </button>
                      )}
                      {/* Unpublish → back to draft */}
                      {resource.status === "published" && (
                        <>
                          <Link
                            href={`/resources/${resource.slug}`}
                            target="_blank"
                            title="View live"
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              setResourceStatus(resource.id, "draft")
                            }
                            title="Unpublish (back to draft)"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            Unpublish
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setEditingResource(resource.id);
                          setShowResourceForm(true);
                        }}
                        title="Edit"
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(resource.id)}
                        title="Delete"
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
                <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 mb-4">
                  {statusFilter === "pending"
                    ? "Nothing waiting for review"
                    : "Nothing here yet"}
                </p>
                <button
                  onClick={() => {
                    setEditingResource(null);
                    setShowResourceForm(true);
                  }}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Add content
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Categories Tab */}
        {tab === "categories" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-light">Categories</h1>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color || "#ef4444" }}
                      />
                      <div>
                        <h3 className="font-medium text-white">
                          {category.name}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          /{category.slug}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
                <FolderOpen className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 mb-4">No categories yet</p>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Add your first category
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Resource Form Modal */}
      {showResourceForm && (
        <ResourceForm
          categories={categories}
          editingId={editingResource}
          onClose={() => {
            setShowResourceForm(false);
            setEditingResource(null);
          }}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm onClose={() => setShowCategoryForm(false)} />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-300",
    pending: "bg-amber-500/10 text-amber-300",
    draft: "bg-zinc-700/40 text-zinc-400",
  };
  const labels: Record<string, string> = {
    published: "Live",
    pending: "Pending",
    draft: "Draft",
  };
  return (
    <span
      className={`px-2 py-0.5 text-xs rounded-full ${
        styles[status] || styles.draft
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
