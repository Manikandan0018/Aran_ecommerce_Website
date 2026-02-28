import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
} from "react-icons/hi2";
import home from "../image/home.jpg";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /* =========================
     BODY SCROLL LOCK
  ========================= */
  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "unset";
  }, [isMobileFilterOpen]);

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/products/categories");
        setCategories(data);
      } catch {
        setCategories(["Pure Ghee", "Wild Honey", "Cold Pressed", "Spices"]);
      }
    };

    fetchCategories();
  }, []);

  /* =========================
     FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();
        if (category) query.append("category", category);
        if (sort) query.append("sort", sort);

        const { data } = await API.get(`/products?${query.toString()}`);

        setProducts(data.products || data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sort]);

  /* =========================
     UPDATE FILTER
  ========================= */
  const updateFilter = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);

      value ? newParams.set(key, value) : newParams.delete(key);

      setSearchParams(newParams);
      setIsMobileFilterOpen(false);
    },
    [searchParams, setSearchParams],
  );

  /* =========================
     MEMOIZED CATEGORY LIST
  ========================= */
  const categoryList = useMemo(
    () => ["All Items", ...categories],
    [categories],
  );

  /* =========================
     MEMOIZED PRODUCT GRID
  ========================= */
  const productGrid = useMemo(
    () =>
      products.map((product) => (
        <ProductCard key={product._id} product={product} />
      )),
    [products],
  );

  return (
    <div className="bg-[#e8e3da] min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-bold text-[#3D4035] uppercase">
            Purely Homemade
          </h2>

          <img
            src={home}
            alt="Aran Products"
            className="mx-auto mt-10 rounded-[60px] shadow-xl"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-40 bg-[#F9F6F0]/90 backdrop-blur-xl border-y">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="hidden lg:flex gap-3">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateFilter("category", cat === "All Items" ? "" : cat)
                }
                className={`px-6 py-2 rounded-full text-xs font-bold ${
                  category === cat || (!category && cat === "All Items")
                    ? "bg-[#3D4035] text-white"
                    : "text-[#3D4035]/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden"
          >
            <HiOutlineAdjustmentsHorizontal />
          </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-64 bg-[#3D4035]/5 rounded-3xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {productGrid}
          </div>
        )}
      </main>

      {/* MOBILE FILTER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-end">
          <div className="bg-white w-full p-8 rounded-t-3xl">
            <div className="flex justify-between mb-6">
              <h2>Categories</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <HiOutlineXMark />
              </button>
            </div>

            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateFilter("category", cat === "All Items" ? "" : cat)
                }
                className="block w-full py-3 text-left"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
