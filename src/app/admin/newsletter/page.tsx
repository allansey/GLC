"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Trash2, Send, Users, CheckCircle, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import type { NewsletterSubscriber } from "@/types/database";

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: "",
        content: "",
    });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("newsletter_subscribers")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setSubscribers(data || []);
        } catch (error) {
            console.error("Error fetching subscribers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this subscriber?")) return;

        try {
            const { error } = await supabase
                .from("newsletter_subscribers")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("Subscriber removed successfully!");
            fetchSubscribers();
        } catch (error) {
            console.error("Error deleting subscriber:", error);
            toast.error("Failed to delete subscriber");
        }
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`Are you sure you want to send this newsletter to all ${subscribers.filter(s => s.is_active).length} active subscribers?`)) return;

        setSending(true);
        const toastId = toast.loading("Sending newsletter to subscribers...");
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error("You must be logged in as an admin to send newsletters.");
            }

            const res = await fetch("/api/newsletter/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(emailData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send newsletter");

            toast.success(data.message || "Newsletter sent successfully!", { id: toastId });
            setShowEmailForm(false);
            setEmailData({ subject: "", content: "" });
        } catch (error: any) {
            console.error("Error sending email:", error);
            toast.error(error.message || "Failed to send email", { id: toastId });
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-2">
                        Newsletter
                    </h1>
                    <p className="text-foreground/60">
                        Manage subscribers and send updates
                    </p>
                </div>
                <button
                    onClick={() => setShowEmailForm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md font-medium w-full sm:w-auto"
                >
                    <Send className="w-5 h-5" />
                    Send Newsletter
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Subscribers</p>
                            <h3 className="text-2xl font-bold text-gray-900">{subscribers.length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Active</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {subscribers.filter(s => s.is_active).length}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Inactive</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {subscribers.filter(s => !s.is_active).length}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Send Newsletter Modal */}
                <AnimatePresence>
                    {showEmailForm && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                                    <h2 className="text-xl font-bold">New Newsletter Broadcast</h2>
                                    <button onClick={() => setShowEmailForm(false)} className="hover:rotate-90 transition-transform">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleSendEmail} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
                                        <input
                                            type="text"
                                            required
                                            value={emailData.subject}
                                            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            placeholder="What's the news?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                                        <textarea
                                            required
                                            rows={10}
                                            value={emailData.content}
                                            onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all font-sans"
                                            placeholder="Start writing your update here... Newlines will be converted to paragraphs."
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold text-lg hover:bg-secondary/90 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            {sending ? "Sending Broadcast..." : "Send to All Active Subscribers"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowEmailForm(false)}
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

                {/* Subscribers List */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Registered Audience
                        </h3>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                            {subscribers.length} Total
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-foreground/60 text-sm">Loading audience data...</p>
                        </div>
                    ) : subscribers.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/20">
                            <Mail className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 italic">No subscribers found yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Subscribed On</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {subscribers.map((subscriber) => (
                                        <tr key={subscriber.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="hidden sm:flex w-8 h-8 bg-primary/5 rounded-lg items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    {subscriber.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ring-1 ring-inset ${subscriber.is_active
                                                    ? "bg-green-50 text-green-700 ring-green-600/20"
                                                    : "bg-red-50 text-red-700 ring-red-600/20"
                                                    }`}>
                                                    {subscriber.is_active ? "Active" : "Bounced"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(subscriber.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => handleDelete(subscriber.id)}
                                                    className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Permanently remove"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
