"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";
import type { ContactSubmission } from "@/types/database";

export default function ContactsPage() {
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">("all");

    useEffect(() => {
        fetchContacts();
    }, [filter]);

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from("contact_submissions")
                .select("*")
                .order("created_at", { ascending: false });

            if (filter !== "all") {
                query = query.eq("status", filter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setContacts(data || []);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: "new" | "read" | "replied") => {
        try {
            const { error } = await supabase
                .from("contact_submissions")
                .update({ status })
                .eq("id", id);

            if (error) throw error;
            fetchContacts();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteContact = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;
        try {
            const { error } = await supabase
                .from("contact_submissions")
                .delete()
                .eq("id", id);
            
            if (error) throw error;
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            alert("Failed to delete submission");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            new: "bg-blue-100 text-blue-800",
            read: "bg-yellow-100 text-yellow-800",
            replied: "bg-green-100 text-green-800",
        };
        return styles[status as keyof typeof styles] || styles.new;
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary mb-2">
                    Contact Submissions
                </h1>
                <p className="text-foreground/60">
                    Manage and respond to contact form submissions
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 flex-wrap">
                {["all", "new", "read", "replied"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === status
                                ? "bg-primary text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-foreground/60">Loading contacts...</div>
                </div>
            ) : contacts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No submissions found
                    </h3>
                    <p className="text-gray-600">
                        {filter === "all"
                            ? "No contact form submissions yet"
                            : `No ${filter} submissions`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {contacts.map((contact, index) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {contact.name}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                                contact.status
                                            )}`}
                                        >
                                            {contact.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1 truncate">
                                            <Mail className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{contact.email}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 flex-shrink-0" />
                                            {new Date(contact.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="font-semibold text-gray-900 mb-2">
                                    Subject: {contact.subject}
                                </p>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {contact.message}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {contact.status !== "read" && (
                                    <button
                                        onClick={() => updateStatus(contact.id, "read")}
                                        className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                                {contact.status !== "replied" && (
                                    <button
                                        onClick={() => updateStatus(contact.id, "replied")}
                                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                    >
                                        Mark as Replied
                                    </button>
                                )}
                                <a
                                    href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                    className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                                >
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => deleteContact(contact.id)}
                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-1 sm:ml-auto"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
