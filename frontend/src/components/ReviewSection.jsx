import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import {
  HiStar,
  HiCheckCircle,
  HiHandThumbUp,
  HiHandThumbDown,
} from "react-icons/hi2";

const ReviewSection = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await API.get(`/reviews/${productId}/reviews`);
      setReviews(data);
    } catch {
      toast.error("Reviews error");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="border border-gray-100 rounded-sm">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <h2 className="text-xl font-bold">Ratings & Reviews</h2>
        <button className="shadow-md border border-gray-200 px-6 py-2 font-bold text-sm rounded-sm hover:bg-gray-50">
          Rate Product
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {reviews.map((r) => (
          <div key={r._id} className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 ${r.rating >= 4 ? "bg-[#388e3c]" : "bg-orange-500"}`}
              >
                {r.rating} <HiStar className="text-[9px]" />
              </span>
              <p className="font-bold text-sm text-gray-900">
                {r.comment.slice(0, 20)}...
              </p>
            </div>
            <p className="text-sm text-gray-700 mb-4">{r.comment}</p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500">
              <span className="font-bold text-gray-900">{r.name}</span>
              <span className="flex items-center gap-1 text-gray-400">
                <HiCheckCircle /> Certified Buyer
              </span>
              <span>{new Date(r.createdAt).toLocaleDateString()}</span>

              <div className="flex items-center gap-4 ml-auto">
                <button className="flex items-center gap-1 hover:text-[#2874f0]">
                  <HiHandThumbUp /> 12
                </button>
                <button className="flex items-center gap-1 hover:text-red-500">
                  <HiHandThumbDown /> 2
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
