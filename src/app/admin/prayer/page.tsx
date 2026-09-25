"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Heart, Trash2, CheckCircle, XCircle, Lock, Globe, Eye } from "lucide-react";
import type { PrayerRequest } from "@/types/database";

export default function PrayerRequestsPage() {
    const [requests, setRequests] = useState<PrayerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("prayer_requests")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
        try {
            const { error } = await supabase
                .from("prayer_requests")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;
            fetchRequests();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this request?")) return;

        try {
            const { error } = await supabase
                .from("prayer_requests")
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchRequests();
        } catch (error) {
            console.error("Error deleting request:", error);
            alert("Failed to delete request");
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-2">
                    Prayer Requests
                </h1>
                <p className="text-foreground/60">
                    Review and manage prayer requests
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Requests</p>
                        <h3 className="text-2xl font-bold text-gray-900">{requests.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                        <Eye className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pending Review</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {requests.filter(r => r.status === 'pending').length}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/10 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Approved Public</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {requests.filter(r => r.status === 'approved' && !r.is_private).length}
                        </h3>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-foreground/60">Loading requests...</div>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-primary/10 p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                        No requests yet
                    </h3>
                </div>
            ) : (
                <div className="grid gap-6">
                    {requests.map((request, index) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-sm border border-primary/10 p-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 font-heading">
                                            {request.name}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${request.status === 'approved'
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : request.status === 'rejected'
                                                ? "bg-red-50 text-red-700 border-red-200"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            }`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                        {request.is_private ? (
                                            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                <Lock className="w-3 h-3" /> Private
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                <Globe className="w-3 h-3" /> Public
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {new Date(request.created_at).toLocaleString()} • {request.email || "No email provided"}
                                    </p>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {request.request}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {request.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'approved')}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Reject"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {request.status !== 'pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(request.id, 'pending')}
                                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                            title="Mark as Pending"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(request.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
