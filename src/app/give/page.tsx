"use client";

import { useState } from "react";
import { CreditCard, Gift, Heart, Building, Copy, Check, Lock, Smartphone } from "lucide-react";
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const PaystackButton = dynamic(() => import('@/components/ui/PaystackButton'), {
  ssr: false,
});

export default function GivePage() {
    const [amount, setAmount] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [copiedBank, setCopiedBank] = useState(false);
    const [copiedMomo, setCopiedMomo] = useState(false);
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [giveType, setGiveType] = useState("tithe");

    const bankAccountNumber = "1234567890"; // Configurable bank account
    const momoNumber = "0240000000"; // Configurable MoMo number

    const handleSuccessReset = () => {
        setAmount("");
        setCustomAmount("");
        setDonorName("");
        setDonorEmail("");
    };

    const handleCopyBank = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(bankAccountNumber);
            setCopiedBank(true);
            toast.success("Bank account number copied!");
            setTimeout(() => setCopiedBank(false), 2000);
        }
    };

    const handleCopyMomo = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(momoNumber);
            setCopiedMomo(true);
            toast.success("Mobile Money number copied!");
            setTimeout(() => setCopiedMomo(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary mb-6">
                        Give Online
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                        <br />
                        <span className="text-sm font-medium text-secondary mt-2 block">- 2 Corinthians 9:7</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Online Giving Form */}
                    <div
                        className="bg-white rounded-2xl shadow-sm border border-primary/10 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">
                                Secure Online Giving
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        placeholder="For your receipt"
                                        value={donorEmail}
                                        onChange={(e) => setDonorEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Amount (GHS)
                                </label>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    {["50", "100", "200", "500", "1000"].map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => {
                                                setAmount(val);
                                                setCustomAmount("");
                                            }}
                                            className={`py-3 px-4 rounded-lg border font-medium transition-all ${amount === val
                                                ? "bg-primary text-white border-primary shadow-md"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-primary/50"
                                                }`}
                                        >
                                            GH₵ {val}
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        placeholder="Custom"
                                        value={customAmount}
                                        onChange={(e) => {
                                            setCustomAmount(e.target.value);
                                            setAmount("");
                                        }}
                                        className={`py-3 px-4 rounded-lg border font-medium transition-all outline-none ${customAmount
                                            ? "border-primary ring-1 ring-primary"
                                            : "border-gray-200 focus:border-primary/50"
                                            }`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Giving Type
                                </label>
                                <select 
                                    value={giveType}
                                    onChange={(e) => setGiveType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                                >
                                    <option value="tithe">Tithe</option>
                                    <option value="offering">Offering</option>
                                    <option value="thanksgiving">Thanksgiving</option>
                                    <option value="project">Building Project</option>
                                    <option value="other">Other Donation</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <PaystackButton 
                                    amount={parseFloat(amount || customAmount) || 0}
                                    donorName={donorName}
                                    donorEmail={donorEmail}
                                    giveType={giveType}
                                    onSuccessReset={handleSuccessReset}
                                />
                                <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                                    <Lock className="w-3.5 h-3.5 text-secondary" />
                                    <span>256-Bit SSL Encrypted & Secure Payment Processing via Paystack</span>
                                </p>
                            </div>

                            {/* Supported Payment Badges */}
                            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-gray-600">
                                <span className="px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200">💳 Visa</span>
                                <span className="px-3 py-1.5 bg-gray-100 rounded-md border border-gray-200">💳 Mastercard</span>
                                <span className="px-3 py-1.5 bg-amber-50 text-amber-900 rounded-md border border-amber-200">📱 MTN MoMo</span>
                                <span className="px-3 py-1.5 bg-red-50 text-red-900 rounded-md border border-red-200">📱 Telecel Cash</span>
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-md border border-blue-200">📱 AT Money</span>
                            </div>
                        </div>
                    </div>

                    {/* Bank Transfer & MoMo Details */}
                    <div className="space-y-6">
                        {/* Bank Card */}
                        <div className="bg-gradient-to-br from-[#1b4e2e] via-[#143d23] to-[#0e2c19] text-white rounded-2xl shadow-xl p-8 relative overflow-hidden border border-emerald-700/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-white/10 rounded-full text-secondary">
                                        <Building className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold font-heading">
                                        Bank Transfer
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-emerald-200/70 text-xs uppercase tracking-wider mb-1">Bank Name</p>
                                        <p className="text-xl font-semibold">Ecobank Ghana</p>
                                    </div>
                                    <div>
                                        <p className="text-emerald-200/70 text-xs uppercase tracking-wider mb-1">Account Name</p>
                                        <p className="text-xl font-semibold">Gracelove Chapel</p>
                                    </div>
                                    <div>
                                        <p className="text-emerald-200/70 text-xs uppercase tracking-wider mb-1">Account Number</p>
                                        <div className="flex items-center gap-3">
                                            <p className="text-2xl font-bold font-mono tracking-wider text-secondary">{bankAccountNumber}</p>
                                            <button
                                                type="button"
                                                onClick={handleCopyBank}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                                title="Copy Account Number"
                                            >
                                                {copiedBank ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-secondary" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-emerald-200/70 text-xs uppercase tracking-wider mb-1">Branch</p>
                                        <p className="text-lg">Kumasi Main Branch</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Money & In Person */}
                        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold font-heading text-gray-900">
                                    Mobile Money & Other Ways to Give
                                </h2>
                            </div>

                            <div className="space-y-4 text-gray-700">
                                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-semibold text-amber-900">Direct MoMo Transfer</p>
                                        <p className="text-lg font-bold text-gray-900 font-mono mt-0.5">{momoNumber}</p>
                                        <p className="text-xs text-gray-600">Account Name: Gracelove Chapel</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyMomo}
                                        className="px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-900 hover:bg-amber-100/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {copiedMomo ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-amber-800" />}
                                        {copiedMomo ? "Copied" : "Copy"}
                                    </button>
                                </div>

                                <div className="flex items-start gap-3 pt-2">
                                    <span className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-gray-900">In Person:</strong> You can give during any of our Sunday or Midweek services using offering envelopes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
