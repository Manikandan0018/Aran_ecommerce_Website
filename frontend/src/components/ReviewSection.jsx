import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import {
  HiStar,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiUserCircle,
} from "react-icons/hi2";

const ReviewSection = ({ productId }) => {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/reviews/${productId}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please share your experience");
    if (!user) return toast.error("Login required");

    try {
      await API.post(
        `/reviews/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      toast.success("Thank you for your story");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to post");
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    if (!window.confirm("Remove this review?")) return;
    try {
      await API.delete(`/reviews/${productId}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Review removed");
      fetchReviews();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const updateReviewHandler = async (reviewId) => {
    try {
      await API.put(
        `/reviews/${productId}/reviews/${reviewId}`,
        { rating: editRating, comment: editComment },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      toast.success("Review updated");
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const StarRating = ({ value, onChange, isEditable }) => (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!isEditable}
          onClick={() => onChange(s)}
          className={`transition-all ${isEditable ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <HiStar
            className={`text-lg ${s <= value ? "text-[#D4AF37]" : "text-[#E8E8E1]"}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-[#3D4035]/10 pb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3D4035] uppercase tracking-tighter mt-2">
            Kitchen Stories
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[#8C8C83]">
          <HiOutlineChatBubbleBottomCenterText className="text-xl" />
          <span className="text-xs font-bold uppercase tracking-widest">
            {reviews.length} Reviews
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16">
        {/* LEFT: FORM */}
        <div className="lg:col-span-4">
          {user ? (
            <div className="bg-white rounded-[2.5rem] p-8 border border-[#3D4035]/5 sticky top-32 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#3D4035] mb-6">
                Share Your Experience
              </h3>
              <form onSubmit={submitReviewHandler} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#8C8C83] uppercase tracking-widest">
                    Your Rating
                  </p>
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    isEditable={true}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-[#8C8C83] uppercase tracking-widest">
                    Your Story
                  </p>
                  <textarea
                    placeholder="Describe the aroma, taste, or quality..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#F9F6F0] border-none rounded-2xl p-4 text-sm text-[#3D4035] outline-none focus:ring-1 focus:ring-[#3D4035]/20 transition-all min-h-[150px] resize-none placeholder:text-[#8C8C83]/50"
                  />
                </div>

                <button className="w-full bg-[#3D4035] text-[#F3E5AB] py-5 rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] hover:bg-black transition-all shadow-xl shadow-[#3D4035]/10">
                  Post to Community
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/50 rounded-[2.5rem] p-10 text-center border border-dashed border-[#3D4035]/20">
              <p className="text-[#3D4035] text-sm font-medium italic opacity-60 leading-relaxed">
                "Please sign in to share your journey with our artisanal
                harvest."
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: LIST */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-40 bg-white/50 rounded-[2.5rem] animate-pulse"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white/30 rounded-[3rem] border border-dashed border-[#3D4035]/10">
              <p className="text-[#8C8C83] font-medium italic text-lg uppercase tracking-widest opacity-50">
                No stories shared yet
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-[2.5rem] p-8 border border-[#3D4035]/5 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F9F6F0] rounded-full flex items-center justify-center text-[#3D4035]">
                        <HiUserCircle className="text-3xl" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#3D4035] uppercase tracking-wider">
                          {review.name}
                        </p>
                        <p className="text-[10px] text-[#8C8C83] font-bold uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    {editingReview !== review._id && (
                      <StarRating value={review.rating} isEditable={false} />
                    )}
                  </div>

                  {editingReview === review._id ? (
                    <div className="space-y-4">
                      <StarRating
                        value={editRating}
                        onChange={setEditRating}
                        isEditable={true}
                      />
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full bg-[#F9F6F0] border-none rounded-xl p-4 text-sm text-[#3D4035] outline-none"
                      />
                      <div className="flex gap-4">
                        <button
                          onClick={() => updateReviewHandler(review._id)}
                          className="text-[10px] font-black text-[#3D4035] uppercase tracking-widest underline underline-offset-4"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingReview(null)}
                          className="text-[10px] font-black text-[#8C8C83] uppercase tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="text-[#6B705C] text-lg font-medium italic leading-relaxed">
                        "{review.comment}"
                      </p>

                      {user && review.user === user._id && (
                        <div className="flex gap-6 mt-8 pt-6 border-t border-[#F9F6F0]">
                          <button
                            onClick={() => {
                              setEditingReview(review._id);
                              setEditComment(review.comment);
                              setEditRating(review.rating);
                            }}
                            className="flex items-center gap-2 text-[#3D4035] opacity-40 hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest"
                          >
                            <HiOutlinePencilSquare /> Edit
                          </button>
                          <button
                            onClick={() => deleteReviewHandler(review._id)}
                            className="flex items-center gap-2 text-red-400 opacity-40 hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest"
                          >
                            <HiOutlineTrash /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Decorative background element */}
                  <div className="absolute -bottom-4 -right-4 text-[#F9F6F0] -z-0 select-none">
                    <HiOutlineChatBubbleBottomCenterText className="text-8xl transform -rotate-12" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
