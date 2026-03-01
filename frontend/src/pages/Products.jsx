import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import { lazy, Suspense } from "react";
import { CartContext } from "../context/CartContext";
import {
  HiShoppingCart,
  HiStar,
  HiChevronRight,
  HiShieldCheck,
  HiArrowPath,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";

const ReviewSection = lazy(() => import("../components/ReviewSection"));

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // WhatsApp Redirect Logic
  const handleWhatsAppOrder = () => {
    const phoneNumber = "91XXXXXXXXXX"; // Replace with your actual WhatsApp Number
    const message = `Hello! I want to order:
*Product:* ${product.name}
*Price:* ₹${product.price}
*Quantity:* ${qty}
*Link:* ${window.location.href}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  const fetchRelatedProducts = useCallback(
    async (category) => {
      try {
        const { data } = await API.get(`/products?category=${category}`);
        const filtered = (data.products || data).filter((p) => p._id !== id);
        setRelated(filtered);
      } catch (error) {
        console.error(error);
      }
    },
    [id],
  );

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      if (data.category) fetchRelatedProducts(data.category);
    } catch {
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  }, [id, fetchRelatedProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [fetchProduct]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="p-20 text-center text-gray-500">Product Not Found</div>
    );

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
      <div className="max-w-[1440px] mx-auto sm:px-4 pt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* LEFT: IMAGE & WHATSAPP ACTIONS */}
          <div className="lg:w-[40%] bg-white p-4 h-fit lg:sticky lg:top-24 rounded-sm shadow-sm">
            <div className="border border-gray-100 rounded-sm relative overflow-hidden bg-white">
              <img
                src={product.images?.[0] || product.image}
                alt={product.name}
                className="w-full h-[350px] md:h-[450px] object-contain p-4 transition-transform hover:scale-105 duration-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={() => {
                  addToCart(product, qty);
                  toast.success("Added to Cart");
                }}
                className="flex-1 cursor-pointer bg-[#ff9f00] text-white h-10 sm:h-15 rounded-sm font-bold flex items-center justify-center gap-2 text-base shadow-sm hover:brightness-95 transition-all"
              >
                <HiShoppingCart className="text-xl" /> ADD TO CART
              </button>
            
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:w-[60%] space-y-4">
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <nav className="flex items-center gap-1 text-[12px] text-gray-500 mb-2">
                <span
                  className="hover:text-[#2874f0] cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Home
                </span>
                <HiChevronRight />
                <span className="capitalize">{product.category}</span>
              </nav>

              <h1 className="text-xl font-medium text-gray-900 leading-snug mb-2">
                {product.name}
              </h1>

              {/* ORIGINAL RATING DISPLAY */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#388e3c] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                  {product.rating > 0 ? product.rating : "No Rating"}{" "}
                  <HiStar className="text-[10px]" />
                </span>
                <span className="text-sm font-bold text-gray-500">
                  {product.numReviews || 0} Ratings & Reviews
                </span>
              </div>

              {/* PRICE SECTION */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price?.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-gray-500 line-through text-lg">
                      ₹{product.oldPrice.toLocaleString()}
                    </span>
                    <span className="text-[#388e3c] font-bold text-lg">
                      {Math.round(
                        ((product.oldPrice - product.price) /
                          product.oldPrice) *
                          100,
                      )}
                      % off
                    </span>
                  </>
                )}
              </div>
              <p className="text-[12px] text-[#388e3c] font-bold mt-1">
                Special Price
              </p>
            </div>

            {/* TRUST BADGES - CUSTOMIZED FOR WHATSAPP/LOCAL STORE */}
            <div className="bg-white p-6 rounded-sm shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 border border-gray-50 rounded-md">
                <HiArrowPath className="text-2xl text-[#2874f0]" />
                <div className="leading-tight">
                  <p className="text-sm font-bold">Easy Return</p>
                  <p className="text-[11px] text-gray-500">
                    7 Days Replacement
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-50 rounded-md">
                <HiShieldCheck className="text-2xl text-[#2874f0]" />
                <div className="leading-tight">
                  <p className="text-sm font-bold">GST Invoice</p>
                  <p className="text-[11px] text-gray-500">
                    100% Genuine Product
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-50 rounded-md">
                <HiChatBubbleLeftRight className="text-2xl text-[#25D366]" />
                <div className="leading-tight">
                  <p className="text-sm font-bold">24/7 Support</p>
                  <p className="text-[11px] text-gray-500">
                    Order via WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">
                Product Details
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* REVIEWS SECTION */}
            <div className="bg-white p-6 rounded-sm shadow-sm" id="reviews">
              <h3 className="text-lg font-bold mb-6 text-gray-800">
                Ratings & Reviews
              </h3>
              <Suspense
                fallback={
                  <div className="h-40 bg-gray-50 animate-pulse rounded-sm" />
                }
              >
                <ReviewSection productId={product._id} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* RELATED SECTION */}
        {related.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-sm shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {related.slice(0, 5).map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
