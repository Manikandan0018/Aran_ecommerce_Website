import { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

import banner1 from "../image/des1.png";
import banner2 from "../image/des2.png";
import banner3 from "../image/des3.png";

import mobile1 from "../image/home1.png";
import mobile2 from "../image/home2.png";
import mobile3 from "../image/home3.png";

// Desktop banners
const desktopBanners = [
  { image: banner1, productId: "699ec72ecc4a55f2c47c7547" },
  { image: banner2, productId: "69bd6b412aa405602a4bf73f" },
  { image: banner3, productId: "699ec620cc4a55f2c47c7538" },
];

// Mobile banners
const mobileBanners = [
  { image: mobile1, productId: "699ec72ecc4a55f2c47c7547" },
  { image: mobile2, productId: "69bd6b412aa405602a4bf73f" },
  { image: mobile3, productId: "699ec620cc4a55f2c47c7538" },
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();
  // Get all filters from URL
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const searchTerm = searchParams.get("search") || ""; // Crucial fix for search

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Logic
// Inside Home.js - Update your fetchData inside useEffect
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Construct query
      let query = `/products?category=${encodeURIComponent(category)}&sort=${sort}`;
      if (searchTerm) query += `&keyword=${encodeURIComponent(searchTerm)}`;

      const [catRes, prodRes] = await Promise.all([
        API.get("/products/categories"),
        API.get(query),
      ]);

     const normalizedMap = new Map();

     catRes.data.forEach((cat) => {
       if (!cat) return;

       const cleaned = cat.trim().toLowerCase(); // normalize for comparison

       // Store only first properly formatted version
       if (!normalizedMap.has(cleaned)) {
         normalizedMap.set(
           cleaned,
           cat
             .trim()
             .toLowerCase()
             .replace(/\b\w/g, (l) => l.toUpperCase()), // Title Case
         );
       }
     });

     setCategories([...normalizedMap.values()]);
      
      setProducts(prodRes.data.products || prodRes.data);
    } catch (error) {
      console.error("Data fetch error", error);
      // Fallback unique categories
      setCategories(["Pure Ghee", "Wild Honey", "Cold Pressed", "Spices"]);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [category, sort, searchTerm]);
  
  
  const updateFilter = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      // Reset to page 1 when filter changes
      newParams.delete("page");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
      {/* 1. HERO BANNER - Reduced height for faster "Above the fold" loading */}
      {!searchTerm && (
        <section className="bg-white">
          <div className="max-w-[1600px] mx-auto relative w-full h-full md:h-[350px] lg:h-160 bg-[#2874f0] overflow-hidden">
            {/* Desktop Slider */}
            <div className="hidden z-90 md:block h-full">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                loop
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-full w-full"
              >
                {desktopBanners.map((banner, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => navigate(`/product/${banner.productId}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={banner.image}
                      alt={`Banner ${index}`}
                      className="w-full h-full object-contain cursor-pointer"
                      loading="eager"
                      onClick={() =>
                        navigate(
                          `/product/${
                            window.innerWidth >= 768
                              ? desktopBanners[activeIndex].productId
                              : mobileBanners[activeIndex].productId
                          }`,
                        )
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Mobile Slider */}
            <div className="block z-91 md:hidden h-full">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="h-full w-full"
              >
                {mobileBanners.map((banner, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => navigate(`/product/${banner.productId}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={banner.image}
                      alt={`Banner ${index}`}
                      className="w-full h-full object-contain cursor-pointer"
                      loading="eager"
                      onClick={() =>
                        navigate(
                          `/product/${
                            window.innerWidth >= 768
                              ? desktopBanners[activeIndex].productId
                              : mobileBanners[activeIndex].productId
                          }`,
                        )
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="absolute inset-0 mt-70 w-fit h-fit  z-90 flex flex-col justify-center px-6 md:px-16 text-white bg-gradient-to-r from-black/50 to-transparent">
              {" "}
              <h1 className="text-2xl md:text-5xl font-black italic mb-2 tracking-tight">
                NATURE'S BEST
              </h1>
              <p className="text-sm md:text-xl font-medium mb-4 text-yellow-400">
                Pure. Organic. Delivered.
              </p>
              <button
                onClick={() =>
                  navigate(
                    `/product/${
                      window.innerWidth >= 768
                        ? desktopBanners[activeIndex].productId
                        : mobileBanners[activeIndex].productId
                    }`,
                  )
                }
                className="w-fit px-6 py-2 bg-white text-[#2874f0] font-bold rounded-sm text-sm uppercase shadow-lg transition-transform active:scale-95"
              >
                Shop Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. STICKY CATEGORY BAR */}
      <div className="bg-white shadow-sm border-b sticky top-[64px] md:top-[80px] z-[40]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center overflow-x-auto gap-3 no-scrollbar">
          {/* Explicit All Items Button */}
          <button
            onClick={() => updateFilter("category", "")}
            className={`text-xs md:text-sm font-bold whitespace-nowrap px-4 py-1.5 rounded-full transition-all ${
              !category
                ? "bg-[#2874f0] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Items
          </button>

          {/* Map through Unique Categories */}
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat)}
              className={`text-xs md:text-sm font-bold whitespace-nowrap px-4 py-1.5 rounded-full transition-all ${
                category === cat
                  ? "bg-[#2874f0] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. PRODUCT LISTING */}
      <main className="max-w-[1400px] mx-auto px-2 md:px-4 py-4">
        {/* Search Header */}
        {(searchTerm || category) && (
          <div className="bg-white p-4 mb-2 shadow-sm rounded-sm flex justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              Showing {products.length} results for
              <span className="text-gray-900 ml-1">
                "{searchTerm || category}"
              </span>
            </p>
            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="text-xs font-bold border-none bg-gray-50 p-1.5 outline-none cursor-pointer"
            >
              <option value="">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        )}

        {/* LOADING SHIMMER / GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white aspect-[2/3] animate-pulse rounded-sm"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white shadow-sm rounded-sm">
                <p className="text-gray-400 font-medium italic">
                  No products matched your search.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
