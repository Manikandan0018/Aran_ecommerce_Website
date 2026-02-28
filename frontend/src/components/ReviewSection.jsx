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
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiUserCircle,
} from "react-icons/hi2";

/* =========================
   STAR RATING (Memoized)
========================= */
const StarRating = React.memo(({ value, onChange, isEditable }) => {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!isEditable}
          onClick={() => isEditable && onChange(s)}
        >
          <HiStar
            className={`text-lg ${
              s <= value ? "text-[#D4AF37]" : "text-[#E8E8E1]"
            }`}
          />
        </button>
      ))}
    </div>
  );
});

/* =========================
   REVIEW ITEM (Memoized)
========================= */
const ReviewItem = React.memo(
  ({
    review,
    user,
    editingReview,
    setEditingReview,
    editComment,
    setEditComment,
    editRating,
    setEditRating,
    updateReviewHandler,
    deleteReviewHandler,
  }) => {
    const formattedDate = useMemo(() => {
      return new Date(review.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    }, [review.createdAt]);

    const isOwner = user && review.user === user._id;

    return (
      <div className="bg-white rounded-[2.5rem] p-8 border border-[#3D4035]/5 shadow-sm">
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-3">
            <HiUserCircle className="text-3xl text-[#3D4035]" />
            <div>
              <p className="font-black uppercase text-[#3D4035]">
                {review.name}
              </p>
              <p className="text-xs text-[#8C8C83] uppercase tracking-widest">
                {formattedDate}
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
              isEditable
            />
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="w-full bg-[#F9F6F0] rounded-xl p-4"
            />
            <div className="flex gap-4">
              <button
                onClick={() => updateReviewHandler(review._id)}
                className="text-sm font-bold text-[#3D4035]"
              >
                Save
              </button>
              <button
                onClick={() => setEditingReview(null)}
                className="text-sm text-[#8C8C83]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#6B705C] text-lg italic">"{review.comment}"</p>

            {isOwner && (
              <div className="flex gap-6 mt-6">
                <button
                  onClick={() => {
                    setEditingReview(review._id);
                    setEditComment(review.comment);
                    setEditRating(review.rating);
                  }}
                  className="flex items-center gap-2 text-xs uppercase"
                >
                  <HiOutlinePencilSquare /> Edit
                </button>

                <button
                  onClick={() => deleteReviewHandler(review._id)}
                  className="flex items-center gap-2 text-xs uppercase text-red-500"
                >
                  <HiOutlineTrash /> Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);

/* =========================
   MAIN COMPONENT
========================= */
const ReviewSection = ({ productId }) => {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [loading, setLoading] = useState(true);

  /* FETCH REVIEWS */
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/reviews/${productId}/reviews`);
      setReviews(data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  /* SUBMIT REVIEW */
  const submitReviewHandler = useCallback(
    async (e) => {
      e.preventDefault();

      if (!comment.trim()) return toast.error("Please write a review");
      if (!user) return toast.error("Login required");

      try {
        await API.post(
          `/reviews/${productId}/reviews`,
          { rating, comment },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        setComment("");
        setRating(5);
        toast.success("Review added");
        fetchReviews();
      } catch (error) {
        toast.error("Failed to post review");
      }
    },
    [comment, rating, user, productId, fetchReviews],
  );

  /* DELETE REVIEW */
  const deleteReviewHandler = useCallback(
    async (reviewId) => {
      if (!window.confirm("Delete this review?")) return;

      try {
        await API.delete(`/reviews/${productId}/reviews/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success("Deleted");
        fetchReviews();
      } catch {
        toast.error("Delete failed");
      }
    },
    [productId, user, fetchReviews],
  );

  /* UPDATE REVIEW */
  const updateReviewHandler = useCallback(
    async (reviewId) => {
      try {
        await API.put(
          `/reviews/${productId}/reviews/${reviewId}`,
          {
            rating: editRating,
            comment: editComment,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        toast.success("Updated");
        setEditingReview(null);
        fetchReviews();
      } catch {
        toast.error("Update failed");
      }
    },
    [productId, editRating, editComment, user, fetchReviews],
  );

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-4xl font-bold mb-10">Kitchen Stories</h2>

      {/* REVIEW FORM */}
      {user && (
        <form onSubmit={submitReviewHandler} className="mb-12 space-y-4">
          <StarRating value={rating} onChange={setRating} isEditable />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 rounded-xl"
          />
          <button className="bg-black text-white px-6 py-3 rounded-xl">
            Post Review
          </button>
        </form>
      )}

      {/* REVIEW LIST */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              user={user}
              editingReview={editingReview}
              setEditingReview={setEditingReview}
              editComment={editComment}
              setEditComment={setEditComment}
              editRating={editRating}
              setEditRating={setEditRating}
              updateReviewHandler={updateReviewHandler}
              deleteReviewHandler={deleteReviewHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
