import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowRight,
  HiOutlineXMark,
} from "react-icons/hi2";
import home from "../image/home.jpg"

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileFilterOpen]);

  const scrollToProducts = () => {
    const element = document.getElementById("product-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/products/categories");
      setCategories(data);
    } catch (error) {
      // Logic for Aran food-based categories
      setCategories(["Pure Ghee", "Wild Honey", "Cold Pressed", "Spices"]);
    }
  };

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

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    value ? newParams.set(key, value) : newParams.delete(key);
    setSearchParams(newParams);
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="bg-[#e8e3da] min-h-screen font-sans selection:bg-[#3D4035] selection:text-white">
      {/* --- 1. ARAN HERITAGE HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 overflow-hidden">
        {/* Background Large Text Overlay - Changed to PROVISIONS */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none select-none">
          <h1 className="text-[22vw] leading-none font-black text-[#3D4035] opacity-[0.05] translate-y-1/4 uppercase">
            ARAN
          </h1>
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Subtext & CTA */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <p className="text-[#6B705C] text-sm lg:text-base leading-relaxed max-w-[260px] mb-8 font-medium">
              Experience the purity of slow-made kitchen essentials. From
              wild-harvested honey to bilona-churned ghee, delivered from our
              home to yours.
            </p>
            <button
              onClick={scrollToProducts}
              className="bg-[#3D4035] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg"
            >
              Explore Harvest
            </button>
          </div>

          {/* Center Column: Main Headline & Food-Focused Image */}
          <div className="lg:col-span-6 order-1 lg:order-2 text-center relative py-2">
            <h2 className="text-6xl md:text-8xl lg:text-[100px] font-bold text-[#3D4035] leading-[0.85] tracking-tighter uppercase mb-[-15px] lg:mb-[-30px] z-20 relative">
              Purely <br /> Home <br /> made
            </h2>

            <div className="relative w-full max-w-sm mx-auto aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl border-[10px] border-white mt-4">
              <img
                src={home}
                alt="Aran Pure Honey"
                className="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
              {/* Floating Quality Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-md p-5 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F3E5AB] rounded-2xl flex-shrink-0 flex items-center justify-center text-[#3D4035] font-bold text-xs">
                  100%
                </div>
                <p className="text-[11px] text-[#3D4035] leading-tight font-bold uppercase tracking-tight text-left">
                  Traditionally Sourced <br />{" "}
                  <span className="text-[#8C8C83] font-medium">
                    No added preservatives
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Trust Markers */}
          <div className="lg:col-span-3 order-3 flex flex-col items-end justify-between h-full py-10">
            <div className="hidden lg:block w-40 h-40 rounded-full border border-dashed border-[#3D4035]/20 p-2 animate-spin-slow">
              <div className="w-full h-full rounded-full bg-[#3D4035]/5 flex items-center justify-center text-center p-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#3D4035]">
                  Lab Tested • Pure • Organic •
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#3D4035]">9.2k+</p>
              <p className="text-[10px] text-[#8C8C83] font-bold uppercase tracking-widest">
                Happy Kitchens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. THE PANTRY NAVIGATION (Filter Strip) --- */}
      <div className="sticky top-0 z-40 bg-[#F9F6F0]/90 backdrop-blur-xl border-y border-[#3D4035]/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3D4035]/40 mr-4">
              Filter By:
            </span>
            {["All Items", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateFilter("category", cat === "All Items" ? "" : cat)
                }
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.15em] font-bold transition-all ${
                  category === cat || (!category && cat === "All Items")
                    ? "bg-[#3D4035] text-white"
                    : "text-[#3D4035]/60 hover:bg-[#3D4035]/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 text-[#3D4035] font-black text-[10px] uppercase tracking-widest"
          >
            <HiOutlineAdjustmentsHorizontal className="text-lg" />
            Sort Pantry
          </button>

          <select
            value={sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="bg-transparent text-[10px] uppercase font-black tracking-widest border-none focus:ring-0 cursor-pointer text-[#3D4035]"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Lowest Price</option>
            <option value="price_desc">Premium Range</option>
          </select>
        </div>
      </div>

      {/* --- 3. PRODUCT GRID --- */}
      <main id="product-grid" className="max-w-7xl mx-auto px-6 py-20">
        <header className="mb-20 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-[#3D4035] uppercase tracking-tighter">
            {category || "The Full Pantry"}
          </h3>
          <p className="text-[#8C8C83] mt-4 font-medium uppercase text-[10px] tracking-[0.3em]">
            Small Batches • Hand Bottled • Traceable
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-6">
                <div className="aspect-square bg-[#3D4035]/5 rounded-[3rem]" />
                <div className="h-4 bg-[#3D4035]/5 w-2/3 mx-auto rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-24">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* --- 4. THE ARAN METHOD (Dark Section) --- */}
      <section className="bg-[#3D4035] text-[#F9F6F0] py-32 px-6 rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <span className="text-[#F3E5AB] text-xs font-bold uppercase tracking-[0.5em]">
              Our Promise
            </span>
            <h2 className="text-5xl lg:text-8xl font-bold leading-[0.9] mt-8 mb-12 uppercase tracking-tighter">
              Kitchen <br />
              <span className="italic font-light opacity-50">Sanctuary.</span>
            </h2>
            <p className="text-xl opacity-80 leading-relaxed max-w-xl font-light">
              Aran is born from the belief that what we eat should be as pure as
              nature intended. No additives, no industrial processing—just the
              honest taste of home.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-12">
            {[
              {
                num: "01",
                title: "Ancient Methods",
                desc: "Using stone-ground and bilona methods to preserve nutrients.",
              },
              {
                num: "02",
                title: "Direct Sourcing",
                desc: "Working with local farmers and wild-harvesters directly.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <span className="text-[#F3E5AB] font-bold text-2xl font-serif italic">
                  {item.num}
                </span>
                <div>
                  <h4 className="text-lg font-bold uppercase tracking-widest mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm opacity-60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. MOBILE DRAWER --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-[#3D4035]/80 backdrop-blur-md flex items-end">
          <div className="bg-[#F9F6F0] w-full p-10 rounded-t-[4rem] shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#3D4035]">
                Categories
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 bg-white rounded-full"
              >
                <HiOutlineXMark size={24} className="text-[#3D4035]" />
              </button>
            </div>
            <div className="space-y-2">
              {["All Essentials", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    updateFilter(
                      "category",
                      cat === "All Essentials" ? "" : cat,
                    )
                  }
                  className="w-full py-5 text-left border-b border-[#3D4035]/5 font-bold uppercase tracking-[0.2em] text-[11px] text-[#3D4035]"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
