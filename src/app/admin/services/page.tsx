"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Plus, Trash2, Edit2, Save, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface Service {
    id: string;
    name: string;
    time: string;
    description: string;
    image_url?: string;
    display_order: number;
    is_active: boolean;
}

export default function ServicesAdminPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("services")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService?.name || !editingService?.time) return;

        setIsSaving(true);
        try {
            if (editingService.id) {
                const { error } = await supabase
                    .from("services")
                    .update(editingService)
                    .eq("id", editingService.id);
                if (error) throw error;
                toast.success("Service updated successfully!");
            } else {
                const { error } = await supabase
                    .from("services")
                    .insert([editingService]);
                if (error) throw error;
                toast.success("Service added successfully!");
            }
            setShowModal(false);
            fetchServices();
        } catch (error) {
            console.error("Error saving service:", error);
            toast.error("Failed to save service");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            const { error } = await supabase
                .from("services")
                .delete()
                .eq("id", id);
            if (error) throw error;
            toast.success("Service deleted successfully!");
            fetchServices();
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Failed to delete service");
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-primary mb-2">
                        Service Times
                    </h1>
                    <p className="text-foreground/60">
                        Manage when your services happen
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingService({ name: "", time: "", description: "", image_url: "", display_order: services.length, is_active: true });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add Service
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-foreground/60">Loading services...</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6 relative group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingService(service);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-heading text-primary mb-1">{service.name}</h3>
                            <p className="text-secondary font-bold text-sm mb-3">{service.time}</p>
                            <p className="text-foreground/60 text-sm line-clamp-2">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 bg-primary text-white flex justify-between items-center">
                                <h2 className="text-xl font-bold">{editingService?.id ? "Edit Service" : "Add Service"}</h2>
                                <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Service Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingService?.name || ""}
                                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                        placeholder="e.g., Sunday Worship"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time Range</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingService?.time || ""}
                                        onChange={(e) => setEditingService({ ...editingService, time: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                        placeholder="e.g., 9:00 AM - 11:30 AM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={editingService?.description || ""}
                                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                        placeholder="A short description of the service"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={editingService?.image_url || ""}
                                        onChange={(e) => setEditingService({ ...editingService, image_url: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                        placeholder="/assets/images/worship.jfif"
                                    />
                                    {editingService?.image_url && (
                                        <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={editingService.image_url}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                                        <input
                                            type="number"
                                            value={editingService?.display_order || 0}
                                            onChange={(e) => setEditingService({ ...editingService, display_order: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6 gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={editingService?.is_active ?? true}
                                            onChange={(e) => setEditingService({ ...editingService, is_active: e.target.checked })}
                                            className="w-5 h-5 accent-secondary"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">Is Active</label>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Service"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
