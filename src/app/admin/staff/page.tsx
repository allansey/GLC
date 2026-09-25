"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Users, Facebook, Linkedin, Mail } from "lucide-react";

interface Staff {
    id: string;
    name: string;
    role: string;
    bio: string;
    image_url: string;
    facebook_url?: string;
    linkedin_url?: string;
    email?: string;
    display_order: number;
    is_active: boolean;
}

export default function StaffPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        image_url: "",
        facebook_url: "",
        linkedin_url: "",
        email: "",
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("staff")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            setStaff(data || []);
        } catch (error) {
            console.error("Error fetching staff:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                const { error } = await supabase
                    .from("staff")
                    .update(formData)
                    .eq("id", editingStaff.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("staff")
                    .insert([formData]);
                if (error) throw error;
            }

            resetForm();
            fetchStaff();
        } catch (error) {
            console.error("Error saving staff:", error);
            alert("Failed to save staff member");
        }
    };

    const handleEdit = (member: Staff) => {
        setEditingStaff(member);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio || "",
            image_url: member.image_url || "",
            facebook_url: member.facebook_url || "",
            linkedin_url: member.linkedin_url || "",
            email: member.email || "",
            display_order: member.display_order,
            is_active: member.is_active,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;
        try {
            const { error } = await supabase.from("staff").delete().eq("id", id);
            if (error) throw error;
            fetchStaff();
        } catch (error) {
            console.error("Error deleting staff:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            bio: "",
            image_url: "",
            facebook_url: "",
            linkedin_url: "",
            email: "",
            display_order: 0,
            is_active: true,
        });
        setEditingStaff(null);
        setShowForm(false);
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-primary mb-2">
                        Staff Management
                    </h1>
                    <p className="text-foreground/60">
                        Manage church leadership team
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Staff Member
                </button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                                <input
                                    type="url"
                                    value={formData.facebook_url}
                                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                                <input
                                    type="url"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                                {editingStaff ? "Update Member" : "Add Member"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-foreground/60">Loading staff members...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member) => (
                        <div key={member.id} className="bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden hover:shadow-md transition-all">
                            <div className="aspect-square bg-gray-100 relative">
                                <img
                                    src={member.image_url || "/assets/images/placeholder-pastor.jpg"}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-sm text-secondary font-medium mb-4">{member.role}</p>
                                <div className="flex gap-2 mb-4">
                                    {member.facebook_url && <Facebook className="w-4 h-4 text-gray-400" />}
                                    {member.linkedin_url && <Linkedin className="w-4 h-4 text-gray-400" />}
                                    {member.email && <Mail className="w-4 h-4 text-gray-400" />}
                                </div>
                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
