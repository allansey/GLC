"use client";

import { usePaystackPayment } from 'react-paystack';
import { Heart } from 'lucide-react';
import { supabase } from "@/lib/supabase/client";
import toast from 'react-hot-toast';

interface Props {
  amount: number;
  donorName: string;
  donorEmail: string;
  giveType: string;
  onSuccessReset: () => void;
}

export default function PaystackButton({ amount, donorName, donorEmail, giveType, onSuccessReset }: Props) {
    const config = {
        reference: (new Date()).getTime().toString(),
        email: donorEmail || "anonymous@church.org",
        amount: Math.round(amount * 100), // Paystack amount is in pesewas (integer)
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    };

    const initializePayment = usePaystackPayment(config as any);

    const onSuccess = async (reference: any) => {
        try {
            const { error } = await supabase.from('donations').insert([
                {
                    donor_name: donorName || null,
                    email: donorEmail || null,
                    amount: amount,
                    type: giveType,
                    reference_id: reference?.reference || config.reference
                }
            ]);
            
            if (error) throw error;
            
            toast.success("Thank you! Your donation was received successfully.");
            onSuccessReset();
        } catch (error) {
            console.error("Error recording donation:", error);
            toast.success("Payment completed successfully!");
            onSuccessReset();
        }
    };

    const onClose = () => {
        toast("Payment window closed.", { icon: "ℹ️" });
    };

    return (
        <button 
            type="button"
            onClick={() => {
                if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
                    toast.error("Online card payment is currently being set up. Please use Bank Transfer or Mobile Money below.");
                    return;
                }
                if (!donorEmail) {
                    toast.error("Please provide an email address for your receipt.");
                    return;
                }
                if (!(amount > 0)) {
                    toast.error("Please select or enter a valid donation amount.");
                    return;
                }
                // Call initializePayment and pass callbacks
                try {
                    initializePayment({ onSuccess, onClose } as any);
                } catch (err) {
                    console.error("Payment init error:", err);
                    toast.error("Could not initialize payment. Please try again.");
                }
            }}
            className="w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 cursor-pointer"
        >
            <Heart className="w-5 h-5" />
            Give Now
        </button>
    );
}
