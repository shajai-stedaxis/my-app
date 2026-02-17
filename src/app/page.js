"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const url = editingId ? `/api/users/${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Operation failed');

      await fetchUsers();
      setFormData({ name: '', email: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name || '', email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-pink-400 to-cyan-400 drop-shadow-lg">
            User Management
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Create, Read, Update, Delete</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">
                {editingId ? 'Edit User' : 'Add New User'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all placeholder-gray-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all placeholder-gray-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all active:scale-95"
                >
                  {editingId ? 'Update User' : 'Create User'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setFormData({ name: '', email: '' }); }}
                    className="w-full bg-white/10 hover:bg-white/20 text-gray-300 font-medium py-2 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                )}
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <div className="text-center py-20 text-gray-400 animate-pulse">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white/5 rounded-2xl border border-dashed border-white/10">
                No users found. Add one!
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 flex justify-between items-center hover:bg-white/10 transition-all group shadow-sm hover:shadow-md"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      {user.name || 'Unnamed'}
                    </h3>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                    <p className="text-xs text-gray-600 mt-1 font-mono">ID: {user.id}</p>
                  </div>
                  <div className="flex gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
