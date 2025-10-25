"use client";

import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/api";
import { useCartStore } from "@/store/cartStore";

interface CheckoutModalProps {
  open: boolean;
  clientSecret: string | null;
  orderId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const stripePromise = getStripe();

const CheckoutModal = ({ open, clientSecret, orderId, onClose, onSuccess }: CheckoutModalProps) => {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    stripePromise.then((stripe) => setStripeReady(Boolean(stripe)));
  }, []);

  if (!open) {
    return null;
  }

  if (!stripeReady) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="rounded-3xl bg-white p-8 text-center shadow-2xl">
          <p className="text-sm text-gray-600">
            Stripe is not configured. Provide a publishable key to enable payments.
          </p>
          <button onClick={onClose} className="mt-4 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret || !orderId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="rounded-3xl bg-white p-8 text-center shadow-2xl">
          <p className="text-sm text-gray-600">Unable to start checkout. Please try again.</p>
          <button onClick={onClose} className="mt-4 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm
            orderId={orderId}
            clientSecret={clientSecret}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};

interface CheckoutFormProps {
  orderId: number;
  clientSecret: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutForm = ({ orderId, clientSecret, onClose, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const user = useAuthStore((state) => state.user);
  const clearCart = useCartStore((state) => state.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardElementOptions = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "16px",
          color: "#1f2937",
          "::placeholder": {
            color: "#9ca3af",
          },
        },
        invalid: {
          color: "#ef4444",
        },
      },
    }),
    []
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setSubmitting(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Unable to load payment form");
      setSubmitting(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: user?.email,
          name: user?.fullName,
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (!paymentIntent) {
      setError("Payment did not complete");
      setSubmitting(false);
      return;
    }

    try {
      await apiClient.post("/api/orders/confirm", {
        orderId,
        paymentIntentId: paymentIntent.id,
      });
      clearCart();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to confirm order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Complete your purchase</h2>
        <p className="text-sm text-gray-500">Secure payment powered by Stripe</p>
      </div>
      <div className="rounded-2xl border border-gray-200 p-4 shadow-inner">
        <CardElement options={cardElementOptions} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="rounded-full bg-gradient-to-r from-pink-500 to-red-400 px-6 py-2 text-sm font-semibold text-white shadow hover:from-pink-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Processing..." : "Pay now"}
        </button>
      </div>
    </form>
  );
};

export default CheckoutModal;
