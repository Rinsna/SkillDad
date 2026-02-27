import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import ModernButton from '../ui/ModernButton';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StripePaymentForm = ({ transactionId, clientSecret, amount, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/dashboard/payment-callback?transactionId=${transactionId}&status=processing`,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
        wallets: {
            googlePay: 'auto',
            applePay: 'auto'
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard className="text-primary" size={20} />
                        <span className="text-white font-bold text-sm">Amount to Pay</span>
                    </div>
                    <span className="text-xl font-black text-primary">₹{amount}</span>
                </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <PaymentElement id="payment-element" options={paymentElementOptions} />
            </div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-2"
                    >
                        <ShieldCheck size={16} />
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <ModernButton
                    type="submit"
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                    className="flex-1 !py-4"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Pay Now"
                    )}
                </ModernButton>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-4 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
                >
                    Cancel
                </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 font-black uppercase tracking-widest mt-4">
                <ShieldCheck size={12} />
                PCI-DSS Compliant • SSL Secure • Powered by Stripe
            </div>
        </form>
    );
};

export default StripePaymentForm;
