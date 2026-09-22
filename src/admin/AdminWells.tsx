import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { wellService } from '../services/wellService';
import { Well, WellStatus, WellType, WaterQuality } from '../types/well';
import { getStatusBadge, getQualityBadge } from '../lib/utils';

export const AdminWells: React.FC = () => {
  const [wells, setWells] = useState<Well[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<WellStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWell, setEditingWell] = useState<Well | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modal Form Fields
  const [formData, setFormData] = useState({
    well_code: '',
    name: '',
    latitude: 12.9224,
    longitude: 74.8681,
    village: '',
    taluk: 'Mangaluru',
    district: 'Dakshina Kannada',
    status: 'ACTIVE' as WellStatus,
    well_type: 'Borewell' as WellType,
    depth: 60.0,
    water_level: 18.0,
    water_quality: 'Good' as WaterQuality,
    yield: 1200,
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const loadWells = async () => {
    setIsLoading(true);
    try {
      const data = await wellService.getWells({
        searchQuery,
        status: selectedStatus,
      });
      setWells(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWells();
  }, [searchQuery, selectedStatus]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingWell(null);
    setFormData({
      well_code: `W-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      latitude: 12.9224,
      longitude: 74.8681,
      village: 'Kavoor',
      taluk: 'Mangaluru',
      district: 'Dakshina Kannada',
      status: 'ACTIVE',
      well_type: 'Borewell',
      depth: 65,
      water_level: 19.5,
      water_quality: 'Good',
      yield: 1200,
      description: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (well: Well) => {
    setEditingWell(well);
    setFormData({
      well_code: well.well_code,
      name: well.name,
      latitude: well.latitude,
      longitude: well.longitude,
      village: well.village,
      taluk: well.taluk,
      district: well.district,
      status: well.status,
      well_type: well.well_type,
      depth: well.depth,
      water_level: well.water_level,
      water_quality: well.water_quality,
      yield: well.yield,
      description: well.description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Well name is required.';
    if (!formData.well_code.trim()) errors.well_code = 'Well code is required.';
    if (isNaN(formData.latitude) || formData.latitude < 8 || formData.latitude > 20) {
      errors.latitude = 'Enter a valid latitude in Karnataka (8 to 20).';
    }
    if (isNaN(formData.longitude) || formData.longitude < 74 || formData.longitude > 79) {
      errors.longitude = 'Enter a valid longitude in Karnataka (74 to 79).';
    }
    if (!formData.village.trim()) errors.village = 'Village name is required.';
    if (!formData.district.trim()) errors.district = 'District is required.';
    if (formData.depth <= 0) errors.depth = 'Depth must be positive.';
    if (formData.water_level <= 0 || formData.water_level > formData.depth) {
      errors.water_level = 'Water level must be positive and less than total depth.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add / Edit
  const handleSaveWell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingWell) {
      await wellService.updateWell(editingWell.id, {
        ...formData,
      });
    } else {
      await wellService.createWell({
        ...formData,
        last_inspected: new Date().toISOString().split('T')[0],
      });
    }

    setIsModalOpen(false);
    loadWells();
  };

  // Delete Action
  const handleDeleteWell = async (id: string) => {
    await wellService.deleteWell(id);
    setDeleteConfirmId(null);
    loadWells();
  };

  // Pagination calculation
  const totalPages = Math.ceil(wells.length / pageSize) || 1;
  const paginatedWells = wells.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Station Registry Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, calibrate, and oversee telemetry coordinates across Karnataka districts
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Borewell</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by code, name, village..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="ALERT">Alert Flagged</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Wells Table */}
      <div className="rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name & Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Depth</th>
                <th className="px-4 py-3">Water Level</th>
                <th className="px-4 py-3">Quality</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                    Loading well database...
                  </td>
                </tr>
              ) : paginatedWells.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No matching wells found in registry.
                  </td>
                </tr>
              ) : (
                paginatedWells.map((w) => {
                  const statusBadge = getStatusBadge(w.status);
                  const qualityBadge = getQualityBadge(w.water_quality);
                  return (
                    <tr key={w.id} className="hover:bg-navy-850/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-cyan-300">
                        {w.well_code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white truncate max-w-xs">{w.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {w.village}, {w.district}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{w.well_type}</td>
                      <td className="px-4 py-3 font-mono">{w.depth} m</td>
                      <td className="px-4 py-3 font-mono text-cyan-300 font-bold">
                        {w.water_level} m
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-medium ${qualityBadge.text}`}>
                          {w.water_quality}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(w)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                            title="Edit well record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(w.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition-colors"
                            title="Delete well record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page {currentPage} of {totalPages} ({wells.length} wells total)
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-navy-950 border border-slate-700 disabled:opacity-40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-navy-950 border border-slate-700 disabled:opacity-40 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Well Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingWell ? `Edit Station ${editingWell.well_code}` : 'Register New Station'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Provide field calibration parameters and GPS geolocation
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWell} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Code */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Well Code *
                    </label>
                    <input
                      type="text"
                      value={formData.well_code}
                      onChange={(e) => setFormData({ ...formData, well_code: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    {formErrors.well_code && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">
                        {formErrors.well_code}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Station Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Kavoor Community Borewell #4"
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Latitude (° N) *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: parseFloat(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    {formErrors.latitude && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">
                        {formErrors.latitude}
                      </span>
                    )}
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Longitude (° E) *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: parseFloat(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    {formErrors.longitude && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">
                        {formErrors.longitude}
                      </span>
                    )}
                  </div>

                  {/* Village */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Village / Ward *
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Operational Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="ALERT">ALERT</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  {/* Well Type */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Well Type
                    </label>
                    <select
                      value={formData.well_type}
                      onChange={(e) =>
                        setFormData({ ...formData, well_type: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Borewell">Borewell</option>
                      <option value="Open Dug Well">Open Dug Well</option>
                      <option value="Tube Well">Tube Well</option>
                      <option value="Monitoring Piezometer">Monitoring Piezometer</option>
                    </select>
                  </div>

                  {/* Depth */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Total Depth (meters) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.depth}
                      onChange={(e) =>
                        setFormData({ ...formData, depth: parseFloat(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Water Level */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Current Water Level (m bgl) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.water_level}
                      onChange={(e) =>
                        setFormData({ ...formData, water_level: parseFloat(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    {formErrors.water_level && (
                      <span className="text-[10px] text-rose-400 mt-0.5 block">
                        {formErrors.water_level}
                      </span>
                    )}
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Water Quality Grade
                    </label>
                    <select
                      value={formData.water_quality}
                      onChange={(e) =>
                        setFormData({ ...formData, water_quality: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Good">Good</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High Salinity">High Salinity</option>
                      <option value="Fluoride Concern">Fluoride Concern</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* Yield */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Pump Yield (L/hr)
                    </label>
                    <input
                      type="number"
                      value={formData.yield}
                      onChange={(e) =>
                        setFormData({ ...formData, yield: parseInt(e.target.value) || 0 })
                      }
                      className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Hydrogeological Field Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Aquifer lithology, casing specs, recharge details..."
                    className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-water-500 to-cyan-400 text-navy-950 hover:brightness-110 shadow-md shadow-cyan-500/20"
                  >
                    {editingWell ? 'Save Changes' : 'Register Station'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-navy-950 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Well Record Removal</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete this station from the active spatial registry? This
                action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteWell(deleteConfirmId)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
