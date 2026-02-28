import { useEffect, useState, useMemo, useCallback, memo } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCloudArrowUp,
  HiOutlineSquares2X2,
} from "react-icons/hi2";

/* ===============================
   MEMOIZED PRODUCT CARD
================================ */
const ProductCard = memo(({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="aspect-square bg-slate-50 rounded-[1.8rem] overflow-hidden mb-5 relative shadow-inner">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-sm">
          ₹{product.price}
        </div>
      </div>

      <div className="space-y-3 px-1">
        <div>
          <h3 className="font-serif text-slate-900 text-base truncate">
            {product.name}
          </h3>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
            {product.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              product.countInStock > 0 ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-tighter ${
              product.countInStock > 0 ? "text-slate-600" : "text-red-400"
            }`}
          >
            {product.countInStock > 0
              ? `${product.countInStock} Available`
              : "Sold Out"}
          </span>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
          >
            <HiOutlinePencilSquare className="text-sm" />
            Edit
          </button>

          <button
            onClick={() => onDelete(product._id)}
            className="px-4 py-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <HiOutlineTrash className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
});

const ProductManager = () => {
  /* ===============================
     MEMOIZED USER INFO
  ================================ */
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo")),
    [],
  );

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

  /* ===============================
     FETCH PRODUCTS (ONCE)
  ================================ */
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.products || data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ===============================
     HANDLERS
  ================================ */
  const handleChange = useCallback((e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const imageUploadHandler = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await API.post("/upload", formData);
      setForm((prev) => ({
        ...prev,
        images: [data.imageUrl],
      }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  /* ===============================
     CREATE / UPDATE (OPTIMISTIC)
  ================================ */
  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        if (editingProduct) {
          const { data } = await API.put(
            `/admin/products/${editingProduct}`,
            form,
            config,
          );

          setProducts((prev) =>
            prev.map((p) => (p._id === editingProduct ? data : p)),
          );

          toast.success("Product updated");
        } else {
          const { data } = await API.post("/admin/products", form, config);

          setProducts((prev) => [data, ...prev]);
          toast.success("Product added");
        }

        resetForm();
      } catch {
        toast.error("Save failed");
      }
    },
    [editingProduct, form, userInfo],
  );

  const editHandler = useCallback((product) => {
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
  }, []);

  const deleteHandler = useCallback(
    async (id) => {
      if (!window.confirm("Remove this product?")) return;

      try {
        await API.delete(`/admin/products/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setProducts((prev) => prev.filter((p) => p._id !== id));

        toast.success("Product removed");
      } catch {
        toast.error("Delete failed");
      }
    },
    [userInfo],
  );

  const resetForm = useCallback(() => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      category: "",
      countInStock: "",
      description: "",
      images: [],
    });
  }, []);

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="max-w-[1600px] mx-auto">
      <header className="flex flex-col sm:flex-row justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-serif">Inventory Manager</h1>
          <p className="text-slate-500 text-sm">Manage your collection.</p>
        </div>

        {editingProduct && (
          <button onClick={resetForm} className="px-6 py-3 rounded-xl border">
            Cancel Edit
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* FORM */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border">
            <h2 className="mb-6 flex items-center gap-2">
              <HiOutlinePlus />
              {editingProduct ? "Edit Product" : "New Product"}
            </h2>

            <form onSubmit={submitHandler} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full p-4 bg-slate-50 rounded-xl"
              />

              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-4 bg-slate-50 rounded-xl"
              />

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full p-4 bg-slate-50 rounded-xl"
              />

              <input
                name="countInStock"
                type="number"
                value={form.countInStock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full p-4 bg-slate-50 rounded-xl"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-4 bg-slate-50 rounded-xl"
              />

              <input type="file" onChange={imageUploadHandler} />

              <button
                disabled={uploading}
                className="w-full py-4 bg-black text-white rounded-xl"
              >
                {uploading
                  ? "Uploading..."
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </form>
          </div>
        </div>

        {/* GRID */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineSquares2X2 />
            <span>Collection ({products.length})</span>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={editHandler}
                  onDelete={deleteHandler}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
