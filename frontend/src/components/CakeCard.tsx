"use client";

import { useCartStore } from "@/store/cartStore";

export interface Cake {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  featured: boolean;
  flavor: string;
  tags: string[];
}

interface CakeCardProps {
  cake: Cake;
}

const CakeCard = ({ cake }: CakeCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: cake.id,
      name: cake.name,
      price: cake.price,
      imageUrl: cake.imageUrl,
      quantity: 1,
    });
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
        <img
          src={cake.imageUrl}
          alt={cake.name}
          className="h-full w-full object-cover"
        />
        {cake.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{cake.name}</h3>
          <span className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-600">
            ${cake.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">{cake.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cake.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-6 rounded-full bg-gradient-to-r from-pink-500 to-red-400 py-2 text-sm font-semibold text-white shadow hover:from-pink-600 hover:to-red-500"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default CakeCard;
