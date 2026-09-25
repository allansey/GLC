"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Copy, Check, Gift, ArrowDownCircle, Banknote, Calendar } from "lucide-react";

interface Donation {
    id: string;
    donor_name: string | null;
    email: string | null;
    amount: number;
    type: string;
    date: string;
    reference_id: string | null;
}

export default function DonationsAdminPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("donations")
                .select("*")
                .order("date", { ascending: false });

            if (error) throw error;
            setDonations(data || []);
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string, id: string) => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const totalGiven = donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const thisMonthDonations = donations.filter(d => {
        const dDate = new Date(d.date);
        const now = new Date();
        return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
    });
    const totalThisMonth = thisMonthDonations.reduce((sum, d) => sum + Number(d.amount), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading text-primary mb-2">
                    Donations Dashboard
                </h1>
                <p className="text-foreground/60">
                    Track and manage all online monetary contributions.
                </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-700 rounded-full">
                        <Banknote className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Received (All Time)</p>
                        <h2 className="text-3xl font-bold text-gray-900">₵{totalGiven.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-700 rounded-full">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">This Month</p>
                        <h2 className="text-3xl font-bold text-gray-900">₵{totalThisMonth.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
                    <div className="p-4 bg-purple-100 text-purple-700 rounded-full">
                        <Gift className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Transactions</p>
                        <h2 className="text-3xl font-bold text-gray-900">{donations.length}</h2>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                </div>
                
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Loading records...</div>
                ) : donations.length === 0 ? (
                    <div className="text-center py-12">
                        <ArrowDownCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No donations yet</h3>
                        <p className="text-gray-500">When someone gives online, it will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">Donor</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">Amount (₵)</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-900">Reference ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {donations.map((d) => (
                                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{d.donor_name || "Anonymous"}</p>
                                            <p className="text-sm text-gray-500">{d.email || "No email"}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {Number(d.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                                {d.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(d.date).toLocaleDateString()} at {new Date(d.date).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {d.reference_id ? (
                                                <div className="flex items-center gap-2 text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded w-max">
                                                    {d.reference_id.substring(0, 10)}...
                                                    <button onClick={() => handleCopy(d.reference_id!, d.id)} className="text-gray-400 hover:text-gray-900">
                                                        {copiedId === d.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic text-sm">Manual Entry</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
