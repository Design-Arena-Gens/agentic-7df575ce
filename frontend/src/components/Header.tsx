"use client";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { FiShoppingBag, FiUser } from "react-icons/fi";

interface HeaderProps {
  onLoginClick: () => void;
  onCartClick: () => void;
}

const Header = ({ onLoginClick, onCartClick }: HeaderProps) => {
  const { user, clear } = useAuthStore();
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-pink-500 p-2 text-white shadow-lg">
            <FiShoppingBag size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Velvet Slice</h1>
            <p className="text-xs uppercase tracking-wide text-pink-500">Artisan cake boutique</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <FiUser />
              <span>Sign in</span>
            </button>
          )}
          {user && (
            <button
              onClick={clear}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Sign out
            </button>
          )}
          <button
            onClick={onCartClick}
            className="relative rounded-full bg-gradient-to-r from-pink-500 to-red-400 p-3 text-white shadow-lg hover:from-pink-600 hover:to-red-500"
            aria-label="Open cart"
          >
            <FiShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-pink-500">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
