import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineArrowLeft,
  HiOutlineXMark,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import API from "../services/api";

// ✅ Lazy load ProductCard (improves first paint)
const ProductCard = lazy(() => import("../components/ProductCard"));

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Memoize token (avoid parsing every render)
  const token = useMemo(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo?.token;
  }, []);

  // ✅ Memoized fetch
  const fetchWishlist = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const { data } = await API.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlistItems(data);
    } catch {
      toast.error("Failed to load collection");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ✅ Memoized remove
  const handleRemove = useCallback(
    async (id) => {
      try {
        await API.delete(`/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlistItems((prev) => prev.filter((item) => item._id !== id));

        toast.success("Removed from collection");
      } catch {
        toast.error("Remove failed");
      }
    },
    [token],
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <header className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-serif text-[#3D4035]">
              Curated Collection
            </h1>
          </div>

          <Link to="/" className="text-xs uppercase">
            <HiOutlineArrowLeft className="inline mr-2" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-24">
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
          <div className="text-center py-20">
            <HiOutlineHeart className="text-4xl mx-auto mb-4" />
            <p>Your collection is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
            <Suspense fallback={<div>Loading products...</div>}>
              {wishlistItems.map((item) => (
                <div key={item._id} className="relative group">
                  <ProductCard product={item} />

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-4 left-4 z-40 bg-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <HiOutlineXMark />
                  </button>
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
