"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Save, RefreshCw, FileText, ImageIcon, MapPin, Phone, Globe } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, { id: string; value: string; description: string }>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*");

            if (error) throw error;

            const settingsMap = data.reduce((acc, curr) => ({
                ...acc,
                [curr.key]: { id: curr.id, value: curr.value, description: curr.description }
            }), {});
            setSettings(settingsMap);
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (key: string) => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("site_settings")
                .update({ value: settings[key].value })
                .eq("key", key);

            if (error) throw error;
            alert(`${settings[key].description || key} updated successfully!`);
        } catch (error) {
            console.error("Error saving setting:", error);
            alert("Failed to save setting");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBulkSave = async () => {
        setIsSaving(true);
        try {
            for (const key in settings) {
                await supabase
                    .from("site_settings")
                    .update({ value: settings[key].value })
                    .eq("key", key);
            }
            alert("All settings saved successfully!");
            fetchSettings();
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save some settings");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-primary mb-2">
                        Site Settings
                    </h1>
                    <p className="text-foreground/60">
                        Manage Home and About page content
                    </p>
                </div>
                <button
                    onClick={handleBulkSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    Save All Changes
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <div className="text-foreground/60">Loading settings...</div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-secondary" />
                            Welcome Section
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Welcome Heading
                                </label>
                                <input
                                    type="text"
                                    value={settings.welcome_heading?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        welcome_heading: { ...settings.welcome_heading, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Welcome Text
                                </label>
                                <textarea
                                    value={settings.welcome_text?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        welcome_text: { ...settings.welcome_text, value: e.target.value }
                                    })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Mission & Vision */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-secondary" />
                            Mission & Vision
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Our Mission
                                </label>
                                <textarea
                                    value={settings.mission_text?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        mission_text: { ...settings.mission_text, value: e.target.value }
                                    })}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Our Vision
                                </label>
                                <textarea
                                    value={settings.vision_text?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        vision_text: { ...settings.vision_text, value: e.target.value }
                                    })}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-secondary" />
                            Church Contact Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Church Address</label>
                                <input
                                    type="text"
                                    value={settings.church_address?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        church_address: { ...settings.church_address, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Church Phone</label>
                                <input
                                    type="text"
                                    value={settings.church_phone?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        church_phone: { ...settings.church_phone, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Church Email</label>
                                <input
                                    type="email"
                                    value={settings.church_email?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        church_email: { ...settings.church_email, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
                                <input
                                    type="text"
                                    value={settings.office_hours?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        office_hours: { ...settings.office_hours, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-primary/10 p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-secondary" />
                            Social Media Links
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                                <input
                                    type="text"
                                    value={settings.facebook_url?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        facebook_url: { ...settings.facebook_url, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                                <input
                                    type="text"
                                    value={settings.instagram_url?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        instagram_url: { ...settings.instagram_url, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                                <input
                                    type="text"
                                    value={settings.youtube_url?.value || ""}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        youtube_url: { ...settings.youtube_url, value: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
