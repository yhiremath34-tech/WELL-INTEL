import React, { useState } from 'react';
import { Users, Shield, UserCheck, Mail, Calendar, Search } from 'lucide-react';
import { UserProfile, UserRole } from '../types/user';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-01',
    email: 'admin.director@wellintel.gov.in',
    full_name: 'Dr. Ramesh Bhatt (Admin)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'admin',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2026-09-21T09:00:00Z',
  },
  {
    id: 'usr-demo-01',
    email: 'citizen.scout@wellintel.org',
    full_name: 'Aditi Hegde',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'user',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2026-09-20T12:00:00Z',
  },
  {
    id: 'usr-field-02',
    email: 'kavoor.field@wellintel.org',
    full_name: 'Suresh Poojary',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'field_officer',
    created_at: '2024-03-15T09:30:00Z',
    updated_at: '2026-09-18T14:00:00Z',
  },
  {
    id: 'usr-field-03',
    email: 'udupi.scout@wellintel.org',
    full_name: 'Nandita Rao',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'field_officer',
    created_at: '2024-05-20T11:00:00Z',
    updated_at: '2026-09-19T10:30:00Z',
  },
];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            User & Field Officer Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage access control, field officer privileges, and administrator authorization
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-slate-300">
          {users.length} Active System Users
        </span>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-navy-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Observer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role Status</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3 text-right">Access Permission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-navy-850/60 transition-colors">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
                  />
                  <div>
                    <span className="font-semibold text-white">{u.full_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">ID: {u.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-slate-300">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      u.role === 'admin'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : u.role === 'field_officer'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-slate-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="p-1.5 rounded-lg bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="user">Citizen Observer</option>
                    <option value="field_officer">Field Officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
