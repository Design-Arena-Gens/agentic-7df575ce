"use client";

interface FilterBarProps {
  name: string;
  setName: (value: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
  featuredOnly: boolean;
  setFeaturedOnly: (value: boolean) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterBar = ({
  name,
  setName,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  featuredOnly,
  setFeaturedOnly,
  onApply,
  onReset,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-lg lg:flex-row lg:items-end">
      <div className="flex flex-1 flex-col">
        <label className="text-sm font-medium text-gray-600" htmlFor="name">
          Search by name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Chocolate, vanilla..."
          className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 focus:border-pink-500 focus:outline-none"
        />
      </div>
      <div className="grid flex-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-600" htmlFor="minPrice">
            Min price ($)
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            value={minPrice}
            onChange={(event) => setMinPrice(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 focus:border-pink-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600" htmlFor="maxPrice">
            Max price ($)
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2 focus:border-pink-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <label className="text-sm font-medium text-gray-600" htmlFor="featured">
          Highlighted cakes
        </label>
        <div className="mt-3 flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={featuredOnly}
            onChange={(event) => setFeaturedOnly(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
          />
          <span className="text-sm text-gray-600">Only show featured delights</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 to-red-400 px-6 py-2 text-sm font-semibold text-white shadow hover:from-pink-600 hover:to-red-500"
        >
          Apply filters
        </button>
        <button
          onClick={onReset}
          className="flex-1 rounded-2xl border border-gray-200 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
