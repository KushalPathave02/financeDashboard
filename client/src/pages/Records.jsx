import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recordsAPI } from '../services/api';
import Navbar from '../components/Navbar';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', startDate: '', endDate: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'income',
    category: '',
    date: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const { isAdmin, isAnalyst } = useAuth();

  useEffect(() => {
    fetchRecords();
  }, [filter, search, page, limit]);

  const fetchRecords = async () => {
    try {
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;
      if (search) params.search = search;
      params.page = page;
      params.limit = limit;
      const res = await recordsAPI.getAll(params);
      setRecords(res.data?.data || []);
      setMeta(res.data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await recordsAPI.update(editId, formData);
      } else {
        await recordsAPI.create(formData);
      }
      setShowModal(false);
      setEditId(null);
      setFormData({ amount: '', type: 'income', category: '', date: '', notes: '' });
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record');
    }
  };

  const handleEdit = (record) => {
    setEditId(record._id);
    setFormData({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date?.split('T')[0] || '',
      notes: record.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await recordsAPI.delete(id);
        fetchRecords();
      } catch (err) {
        console.error('Failed to delete record:', err);
      }
    }
  };

  const handleFilterChange = (next) => {
    setPage(1);
    setFilter(next);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Records</h1>
          {isAdmin && (
            <button
              onClick={() => {
                setEditId(null);
                setFormData({ amount: '', type: 'income', category: '', date: '', notes: '' });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Record
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="p-2 border rounded-lg"
              value={filter.type}
              onChange={(e) => handleFilterChange({ ...filter, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                className="p-2 border rounded-lg"
                value={filter.startDate}
                onChange={(e) => handleFilterChange({ ...filter, startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                className="p-2 border rounded-lg"
                value={filter.endDate}
                onChange={(e) => handleFilterChange({ ...filter, endDate: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Search category or notes"
              className="p-2 border rounded-lg"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
            <select
              className="p-2 border rounded-lg"
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(parseInt(e.target.value, 10));
              }}
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-left">Notes</th>
                {isAdmin && <th className="p-4 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="border-t">
                    <td className="p-4">{formatDate(record.date)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        record.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="p-4 capitalize">{record.category}</td>
                    <td className={`p-4 text-right font-medium ${
                      record.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                    </td>
                    <td className="p-4 text-gray-600">{record.notes}</td>
                    {isAdmin && (
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <div className="text-sm text-gray-600">
            Showing {records.length} of {meta.total}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <div className="text-sm text-gray-700">
              Page {meta.page} of {meta.totalPages}
            </div>
            <button
              className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages || 1))}
              disabled={page >= (meta.totalPages || 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editId ? 'Edit Record' : 'Add Record'}
            </h2>
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Notes</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;
