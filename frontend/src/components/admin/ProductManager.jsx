import { useEffect, useState, useMemo, useCallback, memo } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePlus,
} from "react-icons/hi2";

/* ALL UNITS */
const units = ["mg", "g", "kg", "ml", "L"];

/* ===============================
   PRODUCT CARD
================================ */
const ProductCard = memo(({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition p-5 flex flex-col">
      {/* IMAGE */}
      <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-4">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* NAME */}
      <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>

      {/* CATEGORY */}
      <p className="text-xs text-gray-400 uppercase tracking-wider">
        {product.category}
      </p>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {product.description}
      </p>

      {/* STOCK */}
      <div className="mt-2 text-sm">
        {product.countInStock > 0 ? (
          <span className="text-emerald-600 font-semibold">
            In Stock: {product.countInStock}
          </span>
        ) : (
          <span className="text-red-500 font-semibold">Out of Stock</span>
        )}
      </div>

      {/* VARIANTS */}
      <div className="mt-3 space-y-1">
        {product.variants?.map((v, i) => (
          <div
            key={i}
            className="flex justify-between text-sm bg-slate-50 px-3 py-1 rounded-lg"
          >
            <span>
              {v.value}
              {v.unit}
            </span>
            <span className="font-semibold">₹{v.price}</span>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-100 rounded-lg hover:bg-emerald-500 hover:text-white transition"
        >
          <HiOutlinePencilSquare />
          Edit
        </button>

        <button
          onClick={() => onDelete(product._id)}
          className="px-4 py-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
        >
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
});

/* ===============================
   PRODUCT MANAGER
================================ */
const ProductManager = () => {
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo")),
    [],
  );

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    countInStock: "",
    images: [],
    variants: [{ value: "", unit: "g", price: "" }],
  });

  /* FETCH PRODUCTS */
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await API.get("/admin/products");
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

  /* INPUT CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* VARIANT CHANGE */
  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;

    setForm({
      ...form,
      variants: updated,
    });
  };

  /* ADD VARIANT */
  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { value: "", unit: "g", price: "" }],
    });
  };

  /* REMOVE VARIANT */
  const removeVariant = (index) => {
    if (form.variants.length === 1) {
      toast.error("At least one variant required");
      return;
    }

    const updated = form.variants.filter((_, i) => i !== index);

    setForm({
      ...form,
      variants: updated,
    });
  };

  /* IMAGE UPLOAD */
  const imageUploadHandler = async (e) => {
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
  };
    

  /* EDIT PRODUCT */
  const editHandler = (product) => {
    setEditingProduct(product._id);

    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      countInStock: product.countInStock,
      images: product.images,
      variants: product.variants,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* SUBMIT PRODUCT */
  const submitHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    /* REMOVE EMPTY VARIANTS */
    const cleanVariants = form.variants.filter(
      (v) => v.value && v.unit && v.price,
    );

    const payload = {
      ...form,
      variants: cleanVariants,
    };

    try {
      if (editingProduct) {
        const { data } = await API.put(
          `/admin/products/${editingProduct}`,
          payload,
          config,
        );

        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct ? data : p)),
        );

        toast.success("Product updated");
      } else {
        const { data } = await API.post("/admin/products", payload, config);

        setProducts((prev) => [data, ...prev]);

        toast.success("Product added");
      }

      resetForm();
    } catch {
      toast.error("Save failed");
    }
  };

  /* DELETE PRODUCT */
  const deleteHandler = async (id) => {
    if (!window.confirm("Remove product?")) return;

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
  };

  console.log(products.length);
  /* RESET FORM */
  const resetForm = () => {
    setEditingProduct(null);

    setForm({
      name: "",
      category: "",
      description: "",
      countInStock: "",
      images: [],
      variants: [{ value: "", unit: "g", price: "" }],
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-10">
      {/* FORM */}
      <div className="lg:col-span-4">
        <form
          onSubmit={submitHandler}
          className="bg-white p-8 rounded-2xl space-y-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full p-4 bg-slate-50 rounded-xl"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-4 bg-slate-50 rounded-xl"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-4 bg-slate-50 rounded-xl"
          />

          <input
            name="countInStock"
            value={form.countInStock}
            onChange={handleChange}
            placeholder="Stock"
            type="number"
            className="w-full p-4 bg-slate-50 rounded-xl"
          />

          {/* VARIANTS */}
          <div className="space-y-3">
            {form.variants.map((variant, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="number"
                  placeholder="Value"
                  value={variant.value}
                  onChange={(e) =>
                    handleVariantChange(i, "value", e.target.value)
                  }
                  className="w-1/3 p-3 bg-slate-50 rounded-xl"
                />

                <select
                  value={variant.unit}
                  onChange={(e) =>
                    handleVariantChange(i, "unit", e.target.value)
                  }
                  className="w-1/3 p-3 bg-slate-50 rounded-xl"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(i, "price", e.target.value)
                  }
                  className="w-1/3 p-3 bg-slate-50 rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 text-sm text-blue-600"
            >
              <HiOutlinePlus />
              Add Variant
            </button>
          </div>

          <input type="file" onChange={imageUploadHandler} />

          {form.images.length > 0 && (
            <img
              src={form.images[0]}
              alt="preview"
              className="w-32 h-32 object-cover rounded-lg mt-3"
            />
          )}

          <button
            disabled={uploading}
            className="w-full py-4 bg-black text-white rounded-xl disabled:opacity-50"
          >
            {uploading
              ? "Uploading Image..."
              : editingProduct
                ? "Update Product"
                : "Add Product"}
          </button>
        </form>
      </div>

      {/* PRODUCT GRID */}
      <div className="lg:col-span-8 grid sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto">
        {" "}
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={editHandler}
              onDelete={deleteHandler}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductManager;
