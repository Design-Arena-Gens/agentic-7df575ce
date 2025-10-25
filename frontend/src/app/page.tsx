"use client";

import { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/api";
import CakeCard, { Cake } from "@/components/CakeCard";
import FilterBar from "@/components/FilterBar";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import CheckoutModal from "@/components/CheckoutModal";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const HomePage = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [nameFilter, setNameFilter] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const items = useCartStore((state) => state.items);
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    hydrateAuth();
    fetchCakes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | boolean> = {};
      if (nameFilter.trim()) params.name = nameFilter.trim();
      if (minPrice > 0) params.minPrice = minPrice;
      if (maxPrice > 0) params.maxPrice = maxPrice;
      if (featuredOnly) params.featured = true;
      const { data } = await apiClient.get<Cake[]>("/api/cakes", { params });
      setCakes(data.map((cake) => ({
        ...cake,
        price: Number(cake.price),
      })));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load cakes");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setMinPrice(0);
    setMaxPrice(0);
    setFeaturedOnly(false);
    fetchCakes();
  };

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const handleCheckout = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }

    try {
      const payload = {
        items: items.map((item) => ({ cakeId: item.id, quantity: item.quantity })),
        receiptEmail: user.email,
      };
      const { data } = await apiClient.post("/api/orders/checkout", payload);
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setCheckoutOpen(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to start checkout");
    }
  };

  const handleCheckoutSuccess = () => {
    setSuccessMessage("Payment successful! Your cakes are on the way.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Header onLoginClick={() => setAuthOpen(true)} onCartClick={() => setCartOpen(true)} />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-3xl bg-gradient-to-r from-pink-500 to-red-400 p-10 text-white shadow-xl">
          <h2 className="text-3xl font-semibold">Exquisite cakes for every celebration</h2>
          <p className="mt-2 max-w-xl text-sm text-white/80">
            Discover handcrafted delights baked fresh daily. Customize, filter, and find your next show-stopping centerpiece.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="rounded-full bg-white/20 px-4 py-2">Premium ingredients</div>
            <div className="rounded-full bg-white/20 px-4 py-2">Same-day delivery</div>
            <div className="rounded-full bg-white/20 px-4 py-2">Custom designs</div>
          </div>
        </section>

        <section className="mt-10">
          <FilterBar
            name={nameFilter}
            setName={setNameFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            featuredOnly={featuredOnly}
            setFeaturedOnly={setFeaturedOnly}
            onApply={fetchCakes}
            onReset={handleResetFilters}
          />
        </section>

        <section className="mt-10 min-h-[200px]">
          {loading && <p className="text-center text-gray-500">Loading cakes...</p>}
          {error && (
            <p className="text-center text-red-500">
              {error}
            </p>
          )}
          {!loading && cakes.length === 0 && (
            <p className="text-center text-gray-500">No cakes found. Adjust your filters and try again.</p>
          )}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        </section>
      </main>

      {successMessage && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-white p-4 shadow-xl">
          <p className="text-sm font-semibold text-gray-800">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="mt-2 text-xs font-semibold text-pink-500 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <CheckoutModal
        open={checkoutOpen}
        clientSecret={clientSecret}
        orderId={orderId}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default HomePage;
