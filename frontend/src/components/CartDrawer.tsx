"use client";

import { useCartStore } from "@/store/cartStore";
import { FiX, FiPlus, FiMinus, FiTrash } from "react-icons/fi";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer = ({ open, onClose, onCheckout }: CartDrawerProps) => {
  const { items, increment, decrement, remove } = useCartStore();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex ${open ? "" : "pointer-events-none"}`}
    >
      <div
        className={`flex-1 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`relative w-full max-w-md transform bg-white p-6 shadow-2xl transition-all ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2"
          aria-label="Close cart"
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900">Your cart</h2>
        <p className="text-sm text-gray-500">Sweet treats just a click away</p>

        <div className="mt-6 space-y-4 overflow-y-auto pb-32">
          {items.length === 0 && (
            <p className="rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-600">
              Your cart is empty. Add some cake!
            </p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-100 p-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500">
                    <FiTrash />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decrement(item.id)}
                      className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                    >
                      <FiMinus />
                    </button>
                    <span className="text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-xl font-semibold text-gray-900">${total.toFixed(2)}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={onCheckout}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-pink-500 to-red-400 py-3 text-sm font-semibold text-white shadow hover:from-pink-600 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Proceed to checkout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
