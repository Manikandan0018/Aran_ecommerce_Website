import { useEffect, useState, useMemo, useCallback, memo } from "react";

import {
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineArrowTrendingUp,
  HiOutlineCurrencyRupee,
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
   MEMOIZED STAT CARD
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
          ? `₹${Number(value).toLocaleString()}`
          : Number(value).toLocaleString()}
      </p>
    </div>
  );
});

const Dashboard = () => {
  /* =========================
     STABLE USER INFO
  ========================= */
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo")),
    [],
  );

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH STATS (STABLE)
  ========================= */
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setStats(data); // fixed
    } catch (error) {
      console.error("Stats fetch error", error);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /* =========================
     MEMOIZED DATA
  ========================= */
  const graphData = useMemo(() => stats?.graphData || [], [stats]);

  const categoryData = useMemo(() => stats?.categoryData || [], [stats]);

  if (loading || !stats)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#3D4035] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">
          Analytics Overview
        </p>
        <h1 className="text-3xl lg:text-4xl font-serif text-[#3D4035]">
          Performance Dashboard
        </h1>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
        <StatCard
          icon={HiOutlineCurrencyRupee}
          label="Today"
          value={stats.todayOrders}
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* REVENUE GRAPH */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-[2.5rem] border shadow-sm">
          <h3 className="font-serif text-xl mb-6">Revenue Stream</h3>

          <div className="h-[350px] w-full">
            <ResponsiveContainer>
              <AreaChart data={graphData}>
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
          </div>
        </div>

        {/* CATEGORY BAR */}
        <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border shadow-sm">
          <h3 className="font-serif text-xl mb-6">Category Mix</h3>

          <div className="h-[350px] w-full">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" />
                <Tooltip />

                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
