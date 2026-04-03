import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Activity, 
  BarChart3, 
  PieChart 
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    categoryData: [],
    recentActivity: [],
    monthlyTrends: [],
    weeklyTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [trendView, setTrendView] = useState('monthly');
  const { user } = useAuth();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await dashboardAPI.getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Chart Data Preparation
  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [summary.totalIncome, summary.totalExpense],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  const monthlyTrendLabels = summary.monthlyTrends.map(d => monthNames[d._id]);
  const monthlyTrendIncome = summary.monthlyTrends.map(d => d.totalIncome);
  const monthlyTrendExpense = summary.monthlyTrends.map(d => d.totalExpense);

  const weeklyTrendLabels = summary.weeklyTrends.map(d => `W${d._id.week} ${d._id.year}`);
  const weeklyTrendIncome = summary.weeklyTrends.map(d => d.totalIncome);
  const weeklyTrendExpense = summary.weeklyTrends.map(d => d.totalExpense);

  const activeTrendLabels = trendView === 'weekly' ? weeklyTrendLabels : monthlyTrendLabels;
  const activeTrendIncome = trendView === 'weekly' ? weeklyTrendIncome : monthlyTrendIncome;
  const activeTrendExpense = trendView === 'weekly' ? weeklyTrendExpense : monthlyTrendExpense;

  const trendData = {
    labels: activeTrendLabels,
    datasets: [
      {
        label: 'Income',
        data: activeTrendIncome,
        backgroundColor: '#10B981',
      },
      {
        label: 'Expense',
        data: activeTrendExpense,
        backgroundColor: '#EF4444',
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl animate-pulse">Loading Analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Financial Insights</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Income</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Expense</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(summary.totalExpense)}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl text-red-600">
                <TrendingDown className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Net Balance</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {formatCurrency(Math.abs(summary.netBalance))}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <IndianRupee className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - Visible to All */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-800">Trends</h2>
              </div>
              <select
                className="p-2 border rounded-lg text-sm"
                value={trendView}
                onChange={(e) => setTrendView(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="h-64">
              <Bar 
                data={trendData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } }
                }} 
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-800">Income vs Expense</h2>
            </div>
            <div className="h-64 flex justify-center">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Category Wise Totals & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-800">Category Breakdown</h2>
            </div>
            <div className="space-y-4">
              {summary.categoryData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="capitalize font-medium text-gray-700">{item._id}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.type}
                    </span>
                    <span className="font-bold text-gray-900">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {summary.recentActivity.map((record) => (
                <div key={record._id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-gray-800 capitalize">{record.category}</p>
                    <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
