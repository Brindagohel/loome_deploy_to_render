import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '@/store/admin/dashboard-slice';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  rejected: '#ef4444',
  unknown: '#94a3b8',
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function AdminAnalytics() {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        Loading analytics...
      </div>
    );
  }

  const {
    totalRevenue, totalOrders, totalProducts, totalUsers,
    ordersByStatus, revenueByDay, topProducts, lowStockProducts,
  } = stats;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} />
        <StatCard icon={Package} label="Total Products" value={totalProducts} />
        <StatCard icon={Users} label="Total Users" value={totalUsers} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Revenue — last 7 days
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Orders by Status
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ status, count }) => `${status}: ${count}`}
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell key={index} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top selling products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
            Top Selling Products
          </h2>
          {topProducts && topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="title" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0f172a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">No paid orders yet</p>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Low Stock Alerts
          </h2>
          {lowStockProducts && lowStockProducts.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {lowStockProducts.map((product) => (
                <li key={product._id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-700">{product.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    product.totalStock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {product.totalStock} left
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">All products are well stocked</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
