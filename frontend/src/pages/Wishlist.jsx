import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineArrowLeft,
  HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo?.token) return;
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/wishlist", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setWishlistItems(data);
    } catch {
      toast.error("Failed to load collection");
    } finally {
      setLoading(false);
    }
  };

  // We pass this function to handle removing items while staying on the page
  const handleRemove = async (id) => {
    try {
      await API.delete(`/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setWishlistItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from collection");
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* 1. HEADER SECTION */}
      <header className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B0B0A8] font-bold">
              Your Personal
            </p>
            <h1 className="text-5xl md:text-6xl font-serif text-[#3D4035] tracking-tighter">
              Curated{" "}
              <span className="italic font-light text-[#8C8C83]">
                Collection
              </span>
            </h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#3D4035] border-b border-[#3D4035] pb-1 hover:opacity-60 transition-opacity"
          >
            <HiOutlineArrowLeft />
            Back to Home
          </Link>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#F3F4F0] rounded-[3rem]"
              />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-[4rem] p-16 lg:p-32 text-center border border-[#F0F0EB] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E5EADD]/30 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-20 h-20 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <HiOutlineHeart className="text-3xl text-[#B0B0A8]" />
              </div>
              <h2 className="text-3xl font-serif text-[#3D4035] mb-4">
                Your sanctuary is empty.
              </h2>
              <p className="text-[#8C8C83] font-light max-w-xs mx-auto mb-10 leading-relaxed">
                Save the pieces that speak to you and they will appear in this
                collection.
              </p>
              <Link
                to="/"
                className="bg-[#3D4035] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#2C2E27] transition-all inline-block shadow-xl shadow-[#3d403520]"
              >
                Begin Exploring
              </Link>
            </div>
          </div>
        ) : (
          /* WISHLIST GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-10 lg:gap-y-20">
            {wishlistItems.map((item) => (
              <div key={item._id} className="relative group">
                {/* Wrap ProductCard with a remove button overlay 
                   that matches the high-end UI 
                */}
                <ProductCard product={item} />

                {/* REMOVE BUTTON - Perfectly placed for mobile & desktop */}
                <button
                  onClick={() => handleRemove(item._id)}
                  className="absolute top-4 left-4 z-40 bg-white/90 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center text-[#3D4035] shadow-sm hover:bg-red-50 hover:text-red-500 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                  title="Remove from collection"
                >
                  <HiOutlineXMark className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 3. SUBTLE FOOTER NOTE */}
      <footer className="py-12 text-center border-t border-[#F0F0EB]">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#B0B0A8] font-medium">
          Botanica — Sourced with Intention
        </p>
      </footer>
    </div>
  );
};

export default Wishlist;
