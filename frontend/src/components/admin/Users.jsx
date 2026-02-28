import { useEffect, useState, useMemo, useCallback, memo } from "react";
import API from "../../services/api";
import {
  HiOutlineUserCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

/* ===============================
   USER ROW COMPONENT (MEMOIZED)
================================ */
const UserRow = memo(({ user, onToggle, onDelete }) => {
  return (
    <tr className="hover:bg-[#FAF9F6]/30 transition-colors">
      <td className="p-8">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 bg-[#3D4035]/5 text-[#3D4035] rounded-full flex items-center justify-center font-serif">
            {user.name?.charAt(0)}
          </div>
          <div>
            <p
              className={`font-serif text-lg text-[#3D4035] ${
                user.isBlocked ? "opacity-40" : ""
              }`}
            >
              {user.name}
            </p>
            <p className="text-xs text-[#B0B0A8]">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="p-8">
        <span
          className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
            user.isBlocked
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-700"
          }`}
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      </td>

      <td className="p-8 text-right space-x-3">
        <button
          onClick={() => onToggle(user)}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
            user.isBlocked
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white"
          }`}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>

        <button
          onClick={() => onDelete(user._id)}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
        >
          Delete
        </button>
      </td>
    </tr>
  );
});

const Users = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH USERS
  ================================ */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      const userList = Array.isArray(data) ? data : data?.users || [];

      const customersOnly = userList.filter((u) => !u.isAdmin);

      setUsers(customersOnly);
    } catch (error) {
      console.error(
        "Users Fetch Error:",
        error.response?.data || error.message,
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ===============================
     OPTIMIZED SEARCH (useMemo)
  ================================ */
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term),
    );
  }, [searchTerm, users]);

  /* ===============================
     OPTIMISTIC DELETE
  ================================ */
  const deleteUser = useCallback(
    async (id) => {
      if (!window.confirm("Delete this customer account?")) return;

      const originalUsers = users;
      setUsers((prev) => prev.filter((u) => u._id !== id));

      try {
        await API.delete(`/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
      } catch (error) {
        setUsers(originalUsers); // rollback
        alert("Delete failed.");
      }
    },
    [users, userInfo.token],
  );

  /* ===============================
     OPTIMISTIC BLOCK / UNBLOCK
  ================================ */
  const toggleBlockStatus = useCallback(
    async (user) => {
      const updatedUsers = users.map((u) =>
        u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u,
      );

      setUsers(updatedUsers);

      try {
        await API.put(
          `/admin/users/${user._id}/block`,
          { isBlocked: !user.isBlocked },
          { headers: { Authorization: `Bearer ${userInfo.token}` } },
        );
      } catch (error) {
        fetchUsers(); // fallback reload
        alert("Update failed.");
      }
    },
    [users, userInfo.token, fetchUsers],
  );

  /* ===============================
     LOADING STATE
  ================================ */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-5 h-5 border-2 border-[#3D4035]/20 border-t-[#3D4035] rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto bg-[#FAF9F6] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#3D4035]">
            <HiOutlineShieldCheck className="text-xl" />
            <h1 className="text-4xl font-serif tracking-tight">
              Customer List
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#B0B0A8] font-bold">
            {users.length} Total Customers
          </p>
        </div>

        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B0A8] text-lg" />
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full md:w-96 pl-12 pr-6 py-4 rounded-full border border-[#3D4035]/5 outline-none bg-white text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-[#3D4035]/10">
          <HiOutlineUserCircle className="mx-auto text-6xl text-gray-100 mb-4" />
          <p className="text-[#B0B0A8] font-serif text-xl italic">
            No customers found.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#3D4035]/5 overflow-hidden">
          <table className="w-full text-left hidden md:table">
            <thead>
              <tr className="bg-[#FAF9F6]/50 border-b border-[#3D4035]/5">
                <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8]">
                  Customer
                </th>
                <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-[#B0B0A8]">
                  Status
                </th>
                <th className="p-8 text-[10px] uppercase tracking-widest font-bold text-right text-[#B0B0A8]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onToggle={toggleBlockStatus}
                  onDelete={deleteUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
