import { useEffect, useState, memo } from "react";
import {
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import API from "../../services/api";

const COLORS = ["#3D4035", "#6B705C", "#A5A58D", "#B7B7A4"];

/* =========================
   STAT CARD
========================= */
const StatCard = memo(({ icon: Icon, label, value, color }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color}`}
      >
        <Icon className="text-2xl" />
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-1">
        {label}
      </p>

      <p className="text-2xl lg:text-3xl font-serif text-[#3D4035]">
        {label === "Revenue"
          ? `₹${Number(value || 0).toLocaleString()}`
          : Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
});

/* =========================
   DASHBOARD
========================= */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchStats = async () => {
    if (!userInfo?.token) return;

    try {
      const { data } = await API.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setStats(data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#3D4035] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!stats)
    return (
      <div className="text-center text-gray-500 mt-20">
        Failed to load dashboard
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">
            Analytics Overview
          </p>

          <h1 className="text-3xl lg:text-4xl font-serif text-[#3D4035]">
            Performance Dashboard
          </h1>
        </div>

        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-[#3D4035] text-white rounded-lg text-sm hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={HiOutlineUsers}
          label="Users"
          value={stats.totalUsers}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={HiOutlineShoppingBag}
          label="Orders"
          value={stats.totalOrders}
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          icon={HiOutlineCube}
          label="Products"
          value={stats.totalProducts}
          color="bg-purple-50 text-purple-600"
        />

        <StatCard
          icon={HiOutlineArrowTrendingUp}
          label="Revenue"
          value={stats.totalRevenue}
          color="bg-[#3D4035] text-white"
        />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* REVENUE */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-[2.5rem] border shadow-sm">
          <h3 className="font-serif text-xl mb-6">Revenue Stream</h3>

          <div className="h-[350px] w-full">
            {stats.graphData?.length ? (
              <ResponsiveContainer>
                <AreaChart data={stats.graphData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3D4035"
                    strokeWidth={3}
                    fillOpacity={0.2}
                    fill="#3D4035"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 pt-32">
                No revenue data
              </div>
            )}
          </div>
        </div>

        {/* CATEGORY */}
        <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border shadow-sm">
          <h3 className="font-serif text-xl mb-6">Category Mix</h3>

          <div className="h-[350px] w-full">
            {stats.categoryData?.length ? (
              <ResponsiveContainer>
                <BarChart data={stats.categoryData}>
                  <XAxis dataKey="name" />
                  <Tooltip />

                  <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 pt-32">
                No category data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
