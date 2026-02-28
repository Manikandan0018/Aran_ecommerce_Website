import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import { lazy, Suspense } from "react";
import { CartContext } from "../context/CartContext";
import {
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiStar,
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
  
  /* =========================
     FETCH PRODUCT
  ========================= */
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get(`/products/${id}`);
      setProduct(data);

      if (data.category) {
        fetchRelatedProducts(data.category);
      }
    } catch {
      toast.error("Product not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [fetchProduct]);

  /* =========================
     MEMOIZED VALUES
  ========================= */

  const stars = useMemo(() => {
    return [...Array(5)].map((_, i) => (
      <HiStar
        key={i}
        className={`text-sm ${
          i < (product?.rating || 5) ? "text-[#D4AF37]" : "text-gray-200"
        }`}
      />
    ));
  }, [product]);

  const formattedPrice = useMemo(() => {
    return product?.price?.toLocaleString();
  }, [product]);

  /* =========================
     HANDLERS
  ========================= */

  const addToCartHandler = useCallback(() => {
    if (!product?.countInStock) {
      toast.error("Out of stock");
      return;
    }
    addToCart(product, qty);
    toast.success("Added to your selection");
  }, [product, qty, addToCart]);

  const increaseQty = useCallback(() => {
    setQty((prev) => Math.min(product.countInStock, prev + 1));
  }, [product]);

  const decreaseQty = useCallback(() => {
    setQty((prev) => Math.max(1, prev - 1));
  }, []);

  /* =========================
     LOADING STATE
  ========================= */

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
    <div className="bg-[#F9F6F0] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-10"
        >
          <HiOutlineArrowLeft className="mr-2" />
          Back
        </button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* IMAGE */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[4rem] p-10 flex items-center justify-center aspect-square">
              <img
                src={product.images?.[0]}
                alt={product.name}
                loading="lazy" // ✅ Lazy load
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-5 space-y-8">
            <h1 className="text-5xl font-bold uppercase">{product.name}</h1>

            <div className="flex items-center gap-2">{stars}</div>

            <p className="text-4xl font-black">₹{formattedPrice}</p>

            {/* QUANTITY */}
            {product.countInStock > 0 && (
              <div className="flex items-center gap-6">
                <button onClick={decreaseQty}>-</button>
                <span>{qty}</span>
                <button onClick={increaseQty}>+</button>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              className="w-full bg-[#3D4035] text-white py-4 rounded-xl"
            >
              <HiOutlineShoppingBag className="inline mr-2" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl mb-10">Complete the Kitchen</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {related.slice(0, 4).map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        <div className="mt-40 pt-20 border-t border-[#3D4035]/10">
          <Suspense
            fallback={
              <div className="text-center py-10 text-[#3D4035]">
                Loading reviews...
              </div>
            }
          >
            <ReviewSection productId={product._id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Product;
