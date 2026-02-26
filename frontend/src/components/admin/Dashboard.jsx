import { useEffect, useState } from "react";
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

const Dashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    todayOrders: 0,
    graphData: [],
    categoryData: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      setStats({
        ...stats,
        ...data,
      });
    } catch (error) {
      console.error("Stats fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#3D4035] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">
          Analytics Overview
        </p>
        <h1 className="text-3xl lg:text-4xl font-serif text-[#3D4035]">
          Performance Dashboard
        </h1>
      </div>

      {/* STATS GRID - Responsive 1 to 5 columns */}
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

      {/* CHARTS SECTION */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* REVENUE GRAPH */}
        <div className="lg:col-span-2 bg-white p-6 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl text-slate-800">
              Revenue Stream
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
              Live Data
            </span>
          </div>

          <div className="h-[300px] lg:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.graphData || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D4035" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3D4035" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3D4035"
                  strokeWidth={4}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY BREAKDOWN */}
        <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-serif text-xl text-slate-800 mb-8">
            Category Mix
          </h3>

          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData || []}>
                <XAxis dataKey="name" hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="sales" radius={[12, 12, 12, 12]} barSize={40}>
                  {(stats.categoryData || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 space-y-4">
            {(stats.categoryData || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-xs text-slate-500 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {item.sales}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
