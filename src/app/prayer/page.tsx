"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Lock, Globe, Heart } from "lucide-react";

interface PrayerRequest {
    id: string;
    name: string;
    request: string;
    created_at: string;
}

export default function PrayerPage() {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        request: "",
        is_private: false,
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/prayer');
            const data = await res.json();
            if (data.data) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error("Error fetching prayer requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const res = await fetch('/api/prayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to submit request');

            setStatus('success');
            setMessage("Your prayer request has been submitted. It will be reviewed shortly.");
            setFormData({ name: "", email: "", request: "", is_private: false });
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
                        Prayer Wall
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
                        <br />
                        <span className="text-sm font-medium text-secondary mt-2 block">- Philippians 4:6</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Prayer Request Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-8 sticky top-24">
                            <h2 className="text-2xl font-bold font-heading text-primary mb-6">
                                Share a Request
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        We'll only use this to update you on your request.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prayer Request
                                    </label>
                                    <textarea
                                        value={formData.request}
                                        onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all resize-none"
                                        placeholder="Share your prayer request here..."
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_private: !formData.is_private })}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.is_private ? 'bg-primary' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_private ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {formData.is_private ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        <span>{formData.is_private ? "Keep Private" : "Share on Wall"}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {status === 'submitting' ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Request</>}
                                </button>

                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-lg text-sm ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                                    >
                                        {message}
                                    </motion.div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Prayer Wall */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-heading text-gray-900">
                                Recent Prayers
                            </h2>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                {requests.length} Prayers Shared
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading prayers...</p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No prayers yet</h3>
                                <p className="text-gray-500">Be the first to share a prayer request.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {requests.map((req, index) => (
                                    <motion.div
                                        key={req.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                                    {req.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{req.name}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(req.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Heart className="w-5 h-5 text-gray-300" />
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">
                                            {req.request}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-500">
                                            <span className="text-secondary">🙏</span> Praying for this
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
