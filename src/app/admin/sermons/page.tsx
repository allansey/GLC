"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Video, Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import type { Sermon } from "@/types/database";

export default function SermonsPage() {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        speaker: "",
        date: "",
        description: "",
        scripture_reference: "",
        series: "",
        video_url: "",
        audio_url: "",
        thumbnail_url: "",
        notes_url: "",
        is_featured: false,
        is_published: true,
    });

    useEffect(() => {
        fetchSermons();
    }, []);

    const fetchSermons = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("sermons")
                .select("*")
                .order("date", { ascending: false });

            if (error) throw error;
            setSermons(data || []);
        } catch (error) {
            console.error("Error fetching sermons:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSermon) {
                const { error } = await supabase
                    .from("sermons")
                    .update(formData)
                    .eq("id", editingSermon.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("sermons")
                    .insert([formData]);

                if (error) throw error;
            }

            resetForm();
            fetchSermons();
        } catch (error) {
            console.error("Error saving sermon:", error);
            alert("Failed to save sermon");
        }
    };

    const handleEdit = (sermon: Sermon) => {
        setEditingSermon(sermon);
        setFormData({
            title: sermon.title,
            speaker: sermon.speaker,
            date: sermon.date,
            description: sermon.description || "",
            scripture_reference: sermon.scripture_reference || "",
            series: sermon.series || "",
            video_url: sermon.video_url || "",
            audio_url: sermon.audio_url || "",
            thumbnail_url: sermon.thumbnail_url || "",
            notes_url: sermon.notes_url || "",
            is_featured: sermon.is_featured,
            is_published: sermon.is_published,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sermon?")) return;

        try {
            const { error } = await supabase
                .from("sermons")
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchSermons();
        } catch (error) {
            console.error("Error deleting sermon:", error);
            alert("Failed to delete sermon");
        }
    };

    const togglePublished = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("sermons")
                .update({ is_published: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            fetchSermons();
        } catch (error) {
            console.error("Error toggling sermon status:", error);
        }
    };

    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("sermons")
                .update({ is_featured: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            fetchSermons();
        } catch (error) {
            console.error("Error toggling featured status:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            speaker: "",
            date: "",
            description: "",
            scripture_reference: "",
            series: "",
            video_url: "",
            audio_url: "",
            thumbnail_url: "",
            notes_url: "",
            is_featured: false,
            is_published: true,
        });
        setEditingSermon(null);
        setShowForm(false);
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-2">
                        Sermons Management
                    </h1>
                    <p className="text-foreground/60">
                        Upload and manage sermon content
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    Add Sermon
                </button>
            </div>

            {/* Sermon Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                        {editingSermon ? "Edit Sermon" : "Add New Sermon"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Speaker *
                                </label>
                                <input
                                    type="text"
                                    value={formData.speaker}
                                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Series
                                </label>
                                <input
                                    type="text"
                                    value={formData.series}
                                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                                    placeholder="e.g., Faith Series"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scripture Reference
                                </label>
                                <input
                                    type="text"
                                    value={formData.scripture_reference}
                                    onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                                    placeholder="e.g., John 3:16"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.video_url}
                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    placeholder="YouTube or Vimeo URL"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Audio URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.audio_url}
                                    onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                                    placeholder="Audio file URL"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thumbnail URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.thumbnail_url}
                                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                    placeholder="Image URL"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes URL (PDF)
                                </label>
                                <input
                                    type="url"
                                    value={formData.notes_url}
                                    onChange={(e) => setFormData({ ...formData, notes_url: e.target.value })}
                                    placeholder="PDF URL"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 sm:gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                                    Featured Sermon
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                                    Published
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                {editingSermon ? "Update Sermon" : "Add Sermon"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 sm:flex-none px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Sermons List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-foreground/60">Loading sermons...</div>
                </div>
            ) : sermons.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-primary/10 p-12 text-center">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                        No sermons yet
                    </h3>
                    <p className="text-gray-600">
                        Click "Add Sermon" to upload your first sermon
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sermons.map((sermon, index) => (
                        <motion.div
                            key={sermon.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-md transition-all hover:border-primary/20 group"
                        >
                            {sermon.thumbnail_url && (
                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={sermon.thumbnail_url}
                                        alt={sermon.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 font-heading group-hover:text-primary transition-colors">
                                            {sermon.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium">
                                            {sermon.speaker} • {new Date(sermon.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {sermon.is_featured && (
                                        <Star className="w-5 h-5 text-secondary fill-secondary flex-shrink-0" />
                                    )}
                                </div>

                                {sermon.series && (
                                    <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded border border-accent/20 mb-3">
                                        {sermon.series}
                                    </span>
                                )}

                                {sermon.scripture_reference && (
                                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                                        <span className="text-primary/60">📖</span> {sermon.scripture_reference}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex gap-1">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${sermon.is_published
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-gray-50 text-gray-600 border-gray-200"
                                            }`}>
                                            {sermon.is_published ? "Published" : "Draft"}
                                        </span>
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => toggleFeatured(sermon.id, sermon.is_featured)}
                                            className="p-2 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors"
                                            title="Toggle Featured"
                                        >
                                            <Star className={`w-4 h-4 ${sermon.is_featured ? 'fill-yellow-600 text-yellow-600' : ''}`} />
                                        </button>
                                        <button
                                            onClick={() => togglePublished(sermon.id, sermon.is_published)}
                                            className="p-2 text-gray-500 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                                            title={sermon.is_published ? "Unpublish" : "Publish"}
                                        >
                                            {sermon.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(sermon)}
                                            className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sermon.id)}
                                            className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
