import {
  useEffect,
  useState,
  useContext,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineArrowLeft,
  HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext"; // Import Context
import API from "../services/api";

// ✅ Lazy load ProductCard
const ProductCard = lazy(() => import("../components/ProductCard"));

const Wishlist = () => {
  const { user } = useContext(AuthContext); // Use centralized Auth
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch Wishlist using Token from Context
  const fetchWishlist = useCallback(async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.get("/wishlist", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setWishlistItems(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ✅ Remove from Wishlist
  const handleRemove = useCallback(
    async (id) => {
      if (!user?.token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        await API.delete(`/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setWishlistItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Removed from wishlist");
      } catch (error) {
        console.error(error);
        toast.error("Remove failed");
      }
    },
    [user?.token, navigate],
  );

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-10">
      <header className="pt-10 pb-6 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center bg-white p-6 shadow-sm rounded-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              My Wishlist{" "}
              <span className="text-gray-400 text-lg">
                ({wishlistItems.length})
              </span>
            </h1>
          </div>
          <Link
            to="/"
            className="text-sm font-bold text-[#2874f0] flex items-center gap-2 hover:underline"
          >
            <HiOutlineArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-white rounded-sm border border-gray-100 shadow-sm"
              />
            ))}
          </div>
        ) : !user ? (
          <div className="bg-white p-20 text-center shadow-sm rounded-sm">
            <HiOutlineHeart className="text-6xl mx-auto mb-4 text-gray-200" />
            <h2 className="text-xl font-bold mb-2">Missing Wishlist?</h2>
            <p className="text-gray-500 mb-6">
              Login to see the items you added previously
            </p>
            <Link
              to="/login"
              className="bg-[#2874f0] text-white px-10 py-3 rounded-sm font-bold uppercase text-sm shadow-md"
            >
              Login
            </Link>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white p-20 text-center shadow-sm rounded-sm">
            <img
              src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4dda-b051-35c0518177a8.png?q=90"
              className="w-48 mx-auto mb-4 opacity-50 grayscale"
              alt="Empty"
            />
            <h2 className="text-xl font-bold text-gray-800">Empty Wishlist</h2>
            <p className="text-gray-500 mt-2">
              You have no items in your wishlist. Start adding!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Suspense
              fallback={
                <div className="p-10 text-center col-span-full">
                  Loading collection...
                </div>
              }
            >
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="relative group bg-white p-2 hover:shadow-xl transition-shadow border border-gray-100"
                >
                  {/* Remove Button - Positioned top right of the card */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-2 right-2 z-40 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors"
                    title="Remove item"
                  >
                    <HiOutlineXMark className="text-xl" />
                  </button>

                  <ProductCard product={item} />
                </div>
              ))}
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
