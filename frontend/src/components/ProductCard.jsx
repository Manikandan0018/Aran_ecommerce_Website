import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiStar,
} from "react-icons/hi2";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import API from "../services/api";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const wishlistHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo?.token) return toast.error("Please sign in first");

    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
      } else {
        await API.post(
          `/wishlist/${product._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
      }

      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Removed" : "Saved to favorites");
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="group flex flex-col bg-white md:rounded-[2rem] border border-[#3D4035]/10 overflow-hidden transition-all duration-300 hover:shadow-xl h-[400px] md:h-[560px]">
      {/* IMAGE AREA */}
      <div className="relative aspect-square bg-[#FBFBFA] p-4 flex items-center justify-center overflow-hidden">
        <Link
          to={`/product/${product._id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400"}
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist */}
        <button
          onClick={wishlistHandler}
          className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm shadow-sm rounded-full flex items-center justify-center text-[#3D4035] z-20"
        >
          {isWishlisted ? (
            <HiHeart className="text-red-500 text-lg" />
          ) : (
            <HiOutlineHeart className="text-lg" />
          )}
        </button>

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#3D4035] text-[#F3E5AB] text-[8px] md:text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
            Homemade
          </span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 md:p-6 flex flex-col flex-1 bg-white">
        {/* Category + Rating */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] md:text-[10px] text-[#8C8C83] uppercase tracking-widest font-bold">
            {product.category}
          </span>

          <div className="flex items-center gap-1">
            <HiStar className="text-[#D4AF37] text-xs" />
            <span className="text-[10px] md:text-xs font-bold text-[#3D4035]">
              {product.rating > 0 ? product.rating.toFixed(1) : "New"}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[#3D4035] font-bold text-sm md:text-lg leading-tight mb-2 hover:text-black">
            {product.name}
          </h3>
        </Link>

        {/* DESCRIPTION (No layout shift anymore) */}
        <div className="mb-4 flex flex-col">
          <div
            className={`transition-all duration-300 ${
              isExpanded
                ? "max-h-[120px] overflow-y-auto"
                : "max-h-[40px] overflow-hidden"
            }`}
          >
            <p className="text-[#6B705C] text-[11px] md:text-xs leading-relaxed">
              {product.description ||
                "Pure, authentic homemade quality from Aran Heritage."}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-[#3D4035] text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2 border-b border-[#3D4035] w-fit"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        </div>

        {/* PRICE + BUTTON */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[#3D4035] font-black text-lg md:text-2xl tracking-tighter">
            ₹{product.price?.toLocaleString()}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
              toast.success("Added to Bag");
            }}
            className="h-10 w-10 md:h-12 md:w-auto md:px-6 bg-[#3D4035] text-white rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
          >
            <HiOutlineShoppingBag className="text-lg" />
            <span className="hidden md:inline text-[11px] font-black uppercase tracking-widest">
              Add to Bag
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
