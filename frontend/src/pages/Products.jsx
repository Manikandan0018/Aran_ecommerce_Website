import { useEffect, useState, useContext, useCallback } from "react";
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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH RELATED
  ========================= */
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

  /* =========================
     FETCH PRODUCT
  ========================= */
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);

      if (data.variants?.length > 0) {
        setSelectedVariant(data.variants[0]);
      }

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

  /* =========================
     ADD TO CART
  ========================= */
  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: selectedVariant.price,
        weight: selectedVariant.weight,
      },
      qty,
    );

    toast.success("Added to Cart");
  };

  /* =========================
     WHATSAPP ORDER
  ========================= */
  const handleWhatsAppOrder = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const phoneNumber = "917826920882"; // without + or spaces

    const message =
      `Hello! I want to order:\n\n` +
      `Product: ${product.name}\n` +
      `Weight: ${selectedVariant.weight}\n` +
      `Price: ₹${selectedVariant.price}\n` +
      `Quantity: ${qty}\n\n` +
      `Link: ${window.location.href}`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
      <div className="max-w-[1440px] mx-auto sm:px-4 pt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* IMAGE + CART */}
          <div className="lg:w-[40%] bg-white p-4 rounded-sm shadow-sm">
            <div className="border border-gray-100 rounded-sm bg-white">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-[400px] object-contain p-4"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#ff9f00] text-white h-12 font-bold flex items-center justify-center gap-2"
              >
                <HiShoppingCart /> ADD TO CART
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-[#25D366] text-white h-12 font-bold"
              >
                Order WhatsApp
              </button>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
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

              <h1 className="text-xl font-medium text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#388e3c] text-white text-[12px] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                  {product.rating || "New"} <HiStar />
                </span>
                <span className="text-sm text-gray-500">
                  {product.numReviews || 0} Reviews
                </span>
              </div>

              {/* PRICE */}
              <div className="text-3xl font-bold text-gray-900">
                ₹{selectedVariant?.price}
              </div>

              {/* VARIANT SELECTOR */}
              <div className="mt-5">
                <p className="text-sm font-semibold mb-2">Select Weight</p>

                <div className="flex gap-3 flex-wrap">
                  {product.variants?.map((variant) => (
                    <button
                      key={variant.weight}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        selectedVariant?.weight === variant.weight
                          ? "border-[#2874f0] bg-[#2874f0] text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {variant.weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* QTY */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-sm font-semibold">Quantity</span>

                <input
                  type="number"
                  value={qty}
                  min={1}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-16 border p-1 text-center"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <h3 className="text-lg font-bold mb-3">Product Details</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* REVIEWS */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
              <Suspense
                fallback={<div className="h-40 bg-gray-50 animate-pulse" />}
              >
                <ReviewSection productId={product._id} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-sm shadow-sm">
            <h2 className="text-xl font-bold mb-6">You might also like</h2>

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
