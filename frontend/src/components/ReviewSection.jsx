import React, { useEffect, useState, useContext, useCallback } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { HiStar, HiCheckCircle } from "react-icons/hi2";

const ReviewSection = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  
  const fetchReviews = useCallback(async () => {
  try {
    // If your backend route is /api/reviews/:productId/reviews
    const { data } = await API.get(`/reviews/${productId}/reviews`);
    setReviews(data);
  } catch (err) {
    console.error("Fetch error:", err.response?.data);
  } finally {
    setLoading(false);
  }
  }, [productId]);
  
  

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/reviews/${productId}/reviews`, { rating, comment });
      toast.success("Review added successfully!");
      setComment("");
      setShowForm(false);
      fetchReviews(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <div className="border border-gray-100 rounded-sm bg-white mt-4">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold">Ratings & Reviews</h2>
        <button
          onClick={() =>
            user ? setShowForm(!showForm) : toast.error("Please login")
          }
          className="shadow-md border border-gray-200 px-6 py-2 font-bold text-sm rounded-sm hover:bg-gray-50"
        >
          {showForm ? "Cancel" : "Rate Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmitReview} className="p-6 bg-gray-50 border-b">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">Rating (1-5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border p-2 w-24"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="w-full border p-3 text-sm mb-2"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#fb641b] text-white px-10 py-2 font-bold rounded-sm"
          >
            SUBMIT
          </button>
        </form>
      )}

      <div className="divide-y divide-gray-100">
        {reviews.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 ${r.rating >= 4 ? "bg-green-600" : "bg-orange-500"}`}
                >
                  {r.rating} <HiStar className="text-[9px]" />
                </span>
                <p className="font-bold text-sm">
                  {r.comment.substring(0, 30)}...
                </p>
              </div>
              <p className="text-sm text-gray-700 mb-2">{r.comment}</p>
              <div className="flex items-center gap-4 text-[11px] text-gray-400">
                <span className="font-bold text-gray-800">{r.name}</span>
                <span className="flex items-center gap-1">
                  <HiCheckCircle /> Certified Buyer
                </span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
