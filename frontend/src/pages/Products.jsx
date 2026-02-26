import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import ReviewSection from "../components/ReviewSection";
import { CartContext } from "../context/CartContext";
import {
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiStar,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineReceiptRefund,
} from "react-icons/hi2";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      if (data.category) fetchRelatedProducts(data.category);
    } catch (error) {
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const { data } = await API.get(`/products?category=${category}`);
      const filtered = (data.products || data).filter((p) => p._id !== id);
      setRelated(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCartHandler = () => {
    if (!product.countInStock) return toast.error("Out of stock");
    addToCart(product, qty);
    toast.success("Added to your selection");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]">
        <div className="w-12 h-12 border-2 border-[#3D4035]/10 border-t-[#3D4035] rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <p className="p-20 text-center font-serif text-[#3D4035]">
        Item not found
      </p>
    );

  return (
    <div className="bg-[#F9F6F0] min-h-screen pb-20 selection:bg-[#3D4035] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* 1. NAVIGATION */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#8C8C83] hover:text-[#3D4035] transition-all mb-10 group"
        >
          <HiOutlineArrowLeft className="mr-2 group-hover:-translate-x-2 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Return to Pantry
          </span>
        </button>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* 2. LEFT: PRODUCT VISUAL (FULL VISIBILITY) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-[#3D4035]/5 shadow-sm flex items-center justify-center aspect-square relative group">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/800"}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Artisanal Seal */}
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full border border-dashed border-[#3D4035]/20 flex items-center justify-center animate-spin-slow">
                <span className="text-[8px] font-bold text-[#3D4035] uppercase text-center tracking-tighter">
                  Handmade • Pure • Aran
                </span>
              </div>
            </div>
          </div>

          {/* 3. RIGHT: STORY & ACTIONS */}
          <div className="lg:col-span-5 space-y-10">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#3D4035] text-[#F3E5AB] text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {product.category}
                </span>
                <span className="text-[#8C8C83] text-[9px] font-bold uppercase tracking-widest">
                  Batch No: {product._id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-[#3D4035] tracking-tighter leading-[0.9] uppercase">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <HiStar
                      key={i}
                      className={`text-sm ${i < (product.rating || 5) ? "text-[#D4AF37]" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <p className="text-[#8C8C83] text-[11px] font-bold uppercase tracking-widest">
                  {product.numReviews || 0} Kitchen Reviews
                </p>
              </div>
            </header>

            <div className="space-y-6">
              <div className="flex items-baseline gap-4">
                <p className="text-5xl font-black text-[#3D4035] tracking-tighter italic">
                  ₹{product.price.toLocaleString()}
                </p>
                <p className="text-[#B0B0A8] line-through text-lg font-medium opacity-60">
                  ₹{(product.price * 1.2).toFixed(0)}
                </p>
              </div>
              <p className="text-[#6B705C] leading-relaxed text-lg font-medium italic opacity-90">
                "
                {product.description ||
                  "A traditionally extracted essence, crafted in small batches to ensure the highest nutritional potency for your family."}
                "
              </p>
            </div>

            {/* TRUST MARKERS */}
            <div className="grid grid-cols-2 gap-6 py-8 border-y border-[#3D4035]/10">
              <div className="flex gap-4">
                <HiOutlineShieldCheck className="text-2xl text-[#3D4035]" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3D4035]">
                    100% Traceable
                  </h4>
                  <p className="text-[11px] text-[#8C8C83]">
                    Sourced from local farms
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <HiOutlineSparkles className="text-2xl text-[#3D4035]" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#3D4035]">
                    No Chemicals
                  </h4>
                  <p className="text-[11px] text-[#8C8C83]">
                    Zero preservatives added
                  </p>
                </div>
              </div>
            </div>

            {/* QUANTITY & ADD TO BAG */}
            {product.countInStock > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white p-2 rounded-3xl border border-[#3D4035]/5 shadow-sm">
                  <div className="flex items-center">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-14 h-14 flex items-center justify-center text-xl font-bold text-[#3D4035] hover:bg-[#F9F6F0] rounded-2xl transition-all"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-black text-lg text-[#3D4035]">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty(Math.min(product.countInStock, qty + 1))
                      }
                      className="w-14 h-14 flex items-center justify-center text-xl font-bold text-[#3D4035] hover:bg-[#F9F6F0] rounded-2xl transition-all"
                    >
                      +
                    </button>
                  </div>
                  <span className="pr-6 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {product.countInStock < 10
                      ? `Only ${product.countInStock} Left`
                      : "In Stock"}
                  </span>
                </div>

                <button
                  onClick={addToCartHandler}
                  className="w-full bg-[#3D4035] text-[#F3E5AB] py-6 rounded-[2rem] font-black tracking-[0.3em] uppercase text-[11px] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl shadow-[#3D4035]/20"
                >
                  <HiOutlineShoppingBag className="text-xl" />
                  Add to Collection
                </button>
              </div>
            ) : (
              <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100 text-center">
                <p className="text-red-600 font-black uppercase text-xs tracking-[0.2em]">
                  Batch Sold Out
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RELATED HARVEST */}
        {related.length > 0 && (
          <div className="mt-40">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
                  The Aran Pantry
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#3D4035] uppercase tracking-tighter mt-2">
                  Complete the Kitchen
                </h2>
              </div>
              <button
                onClick={() => navigate("/")}
                className="text-[11px] font-black uppercase tracking-widest border-b-2 border-[#3D4035] pb-1"
              >
                View All
              </button>
            </header>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {related.slice(0, 4).map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS SECTION */}
        <div className="mt-40 pt-20 border-t border-[#3D4035]/10">
          <ReviewSection productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default Product;
