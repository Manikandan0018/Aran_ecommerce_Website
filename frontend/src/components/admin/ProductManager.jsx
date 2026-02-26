import { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCloudArrowUp,
  HiOutlineSquares2X2,
} from "react-icons/hi2";

const ProductManager = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    countInStock: "",
    description: "",
    images: [],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/products");
      setProducts(data.products || data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const imageUploadHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await API.post("/upload", formData);
      setForm((prev) => ({ ...prev, images: [data.imageUrl] }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct}`, form, config);
        toast.success("Product updated");
      } else {
        await API.post("/admin/products", form, config);
        toast.success("Product added to collection");
      }
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Save failed");
    }
  };

  const editHandler = (product) => {
    setEditingProduct(product._id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
      images: product.images || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?"))
      return;
    try {
      await API.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("Product removed");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      category: "",
      countInStock: "",
      description: "",
      images: [],
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">
            Inventory Manager
          </h1>
          <p className="text-slate-500 text-sm">
            Curate and manage your product collection.
          </p>
        </div>
        {editingProduct && (
          <button
            onClick={resetForm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white transition-all shadow-sm"
          >
            Cancel Edit
          </button>
        )}
      </header>

      {/* RESPONSIVE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* ✅ FORM SECTION (Stacks on top for Mobile) */}
        <div className="lg:col-span-4 order-1 lg:order-1">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100 lg:sticky lg:top-8">
            <h2 className="text-lg font-serif text-slate-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <HiOutlinePlus className="text-emerald-600" />
              </div>
              {editingProduct ? "Edit Selection" : "New Entry"}
            </h2>

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  Product Name
                </label>
                <input
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-200 rounded-2xl p-4 text-sm outline-none transition-all"
                  placeholder="e.g. Organic Serum"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    onChange={handleChange}
                    value={form.price}
                    className="w-full bg-slate-50 border border-transparent focus:border-emerald-200 rounded-2xl p-4 text-sm outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                    Stock
                  </label>
                  <input
                    name="countInStock"
                    type="number"
                    onChange={handleChange}
                    value={form.countInStock}
                    className="w-full bg-slate-50 border border-transparent focus:border-emerald-200 rounded-2xl p-4 text-sm outline-none transition-all"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  Category
                </label>
                <input
                  name="category"
                  onChange={handleChange}
                  value={form.category}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-200 rounded-2xl p-4 text-sm outline-none transition-all"
                  placeholder="Skincare"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  value={form.description}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-200 rounded-2xl p-4 text-sm outline-none transition-all min-h-[120px] resize-none"
                  placeholder="The story behind this product..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">
                  Cover Media
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    onChange={imageUploadHandler}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-2xl p-6 text-center group-hover:border-emerald-400 transition-colors">
                    {form.images.length > 0 ? (
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={form.images[0]}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded-xl shadow-md border-2 border-white"
                        />
                        <span className="text-xs text-emerald-600 font-bold">
                          Image Ready
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <HiOutlineCloudArrowUp className="text-3xl text-slate-300 mb-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Upload Image
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                disabled={uploading}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 active:scale-95"
              >
                {uploading
                  ? "Uploading..."
                  : editingProduct
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </form>
          </div>
        </div>

        {/* ✅ INVENTORY GRID SECTION */}
        <div className="lg:col-span-8 order-2 lg:order-2">
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <HiOutlineSquares2X2 />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Collection Summary ({products.length})
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-white rounded-[2.5rem] border border-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white p-5 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="aspect-square bg-slate-50 rounded-[1.8rem] overflow-hidden mb-5 relative shadow-inner">
                    <img
                      src={p.images?.[0] || "https://via.placeholder.com/300"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={p.name}
                    />
                    <div className="absolute top-3 right-3 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-sm">
                      ₹{p.price}
                    </div>
                  </div>

                  <div className="space-y-3 px-1">
                    <div>
                      <h3 className="font-serif text-slate-900 text-base truncate">
                        {p.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                        {p.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${p.countInStock > 0 ? "bg-emerald-400" : "bg-red-400"}`}
                      />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-tighter ${p.countInStock > 0 ? "text-slate-600" : "text-red-400"}`}
                      >
                        {p.countInStock > 0
                          ? `${p.countInStock} Available`
                          : "Sold Out"}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => editHandler(p)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        <HiOutlinePencilSquare className="text-sm" /> Edit
                      </button>
                      <button
                        onClick={() => deleteHandler(p._id)}
                        className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <HiOutlineTrash className="text-sm" />
                      </button>
                    </div>
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

export default ProductManager;
