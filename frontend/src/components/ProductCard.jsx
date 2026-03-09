import { Link, useNavigate } from "react-router-dom";
import { HiOutlineHeart, HiHeart, HiStar } from "react-icons/hi2";
import { useContext, useState, useCallback, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import API from "../services/api";
import React from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const userInfo = useMemo(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  }, []);

  /* ================================
     DEFAULT VARIANT
  ================================= */
  const defaultVariant = useMemo(() => {
    if (product?.variants?.length > 0) return product.variants[0];

    return {
      weight: "Default",
      price: product.price || 0,
    };
  }, [product]);

  /* ================================
     WISHLIST HANDLER
  ================================= */
  const wishlistHandler = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userInfo?.token) {
        toast.error("Please login first");
        return;
      }

      if (loadingWishlist) return;

      try {
        setLoadingWishlist(true);

        if (isWishlisted) {
          await API.delete(`/wishlist/${product._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });

          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          await API.post(
            `/wishlist/${product._id}`,
            {},
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            },
          );

          setIsWishlisted(true);
          toast.success("Added to wishlist");
        }
      } catch {
        toast.error("Wishlist error");
      } finally {
        setLoadingWishlist(false);
      }
    },
    [isWishlisted, product._id, userInfo, loadingWishlist],
  );

  /* ================================
     ADD TO CART
  ================================= */
  const addToCartHandler = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      addToCart(
        {
          ...product,
          weight: defaultVariant.weight,
          price: defaultVariant.price,
        },
        1,
      );

      toast.success("Added to Cart", {
        autoClose: 900,
        position: "top-center",
      });
    },
    [addToCart, product, defaultVariant],
  );

  /* ================================
     BUY NOW
  ================================= */
  const buyNowHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        ...product,
        weight: defaultVariant.weight,
        price: defaultVariant.price,
      },
      1,
    );

    navigate("/checkout");
  };

  /* ================================
     PRICE CALCULATION
  ================================= */
  const discountPrice = defaultVariant.price;
  const originalPrice = product.mrp || Math.round(discountPrice * 1.25);

  const discountPercentage = Math.round(
    ((originalPrice - discountPrice) / originalPrice) * 100,
  );

  return (
    <div className="group bg-white border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full relative">
      {/* WISHLIST */}
      <button
        onClick={wishlistHandler}
        disabled={loadingWishlist}
        className="absolute top-2 right-2 z-10 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
      >
        {isWishlisted ? (
          <HiHeart className="text-xl text-red-500" />
        ) : (
          <HiOutlineHeart className="text-xl" />
        )}
      </button>

      {/* PRODUCT IMAGE */}
      <Link to={`/product/${product._id}`} className="block p-2">
        <div className="aspect-square w-full bg-[#f9f9f9] overflow-hidden flex items-center justify-center">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="px-3 pb-3 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 h-10">
            {product.name}
          </h3>
        </Link>

        {/* RATING */}
        <div className="flex items-center gap-2 mb-1.5">
          {product.rating > 0 ? (
            <div className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {product.rating.toFixed(1)}
              <HiStar className="text-[10px]" />
            </div>
          ) : (
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">
              NEW
            </span>
          )}

          <span className="text-gray-400 text-xs">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* PACK */}
        <div className="text-xs text-gray-500 mb-1">
          Pack: {defaultVariant.weight}
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">
            ₹{discountPrice?.toLocaleString()}
          </span>

          <span className="text-xs text-gray-400 line-through">
            ₹{originalPrice.toLocaleString()}
          </span>

          <span className="text-[#388e3c] text-xs font-bold">
            {discountPercentage}% off
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-auto grid grid-cols-2 gap-1.5">
          <button
            onClick={addToCartHandler}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] font-bold py-2 rounded-sm uppercase"
          >
            Add to Cart
          </button>

          <button
            onClick={buyNowHandler}
            className="bg-[#fb641b] hover:bg-[#f4511e] text-white text-[10px] font-bold py-2 rounded-sm uppercase"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
