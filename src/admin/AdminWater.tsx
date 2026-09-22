import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Plus,
  Search,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Gauge,
  Activity,
} from 'lucide-react';
import { wellService } from '../services/wellService';
import { Well } from '../types/well';

interface WaterRecord {
  id: string;
  wellCode: string;
  wellName: string;
  district: string;
  ph: number;
  tds: number;
  fluoride: number;
  temp: number;
  status: 'Good' | 'Moderate' | 'Critical';
  lastTested: string;
}

export const AdminWater: React.FC = () => {
  const [records, setRecords] = useState<WaterRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<WaterRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadWaterData() {
      const wells = await wellService.getWells();
      const mapped: WaterRecord[] = wells.map((w, idx) => ({
        id: `wt-${w.id}`,
        wellCode: w.well_code,
        wellName: w.name,
        district: w.district,
        ph: Number((6.8 + (idx % 12) * 0.15).toFixed(1)),
        tds: 240 + (idx % 15) * 45,
        fluoride: Number((0.4 + (idx % 8) * 0.2).toFixed(2)),
        temp: 24.5 + (idx % 5) * 0.8,
        status:
          w.water_quality === 'Good'
            ? 'Good'
            : w.water_quality === 'Critical' || w.water_quality === 'High Salinity'
            ? 'Critical'
            : 'Moderate',
        lastTested: w.last_inspected || '2026-09-18',
      }));
      setRecords(mapped);
    }
    loadWaterData();
  }, []);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.wellName.toLowerCase().includes(search.toLowerCase()) ||
      r.wellCode.toLowerCase().includes(search.toLowerCase()) ||
      r.district.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === selectedRecord.id ? selectedRecord : r))
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Droplets className="w-3.5 h-3.5" />
            <span>Water Quality Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Water Quality & Chemical Telemetry Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit and calibrate physical parameters: pH acidity, Total Dissolved Solids (TDS), Fluorides, and Thermal readings
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Potable / Good Grade</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {records.filter((r) => r.status === 'Good').length} Wells
          </div>
          <span className="text-[11px] text-slate-400">Within BIS 10500 standards</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Moderate / High TDS</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {records.filter((r) => r.status === 'Moderate').length} Wells
          </div>
          <span className="text-[11px] text-slate-400">Recommended for RO treatment</span>
        </div>

        <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Critical Salinity / Contamination</span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            {records.filter((r) => r.status === 'Critical').length} Wells
          </div>
          <span className="text-[11px] text-slate-400">Restricted consumption advisory active</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by well code, station name, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-navy-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500 font-mono"
        >
          <option value="ALL">All Water Quality Statuses</option>
          <option value="Good">Good (Potable)</option>
          <option value="Moderate">Moderate</option>
          <option value="Critical">Critical Alert</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Station Code</th>
                <th className="py-3 px-4">Station / District</th>
                <th className="py-3 px-4">pH</th>
                <th className="py-3 px-4">TDS (ppm)</th>
                <th className="py-3 px-4">Fluoride (mg/L)</th>
                <th className="py-3 px-4">Quality Status</th>
                <th className="py-3 px-4">Last Tested</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-navy-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-rose-300">{item.wellCode}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{item.wellName}</div>
                    <span className="text-[10px] text-slate-400">{item.district}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{item.ph}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{item.tds}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{item.fluoride}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        item.status === 'Good'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {item.lastTested}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedRecord(item);
                        setIsEditModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-colors"
                    >
                      Calibrate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Calibrate Modal */}
      {isEditModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Calibrate Sensor: {selectedRecord.wellCode}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateRecord} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedRecord.ph}
                  onChange={(e) =>
                    setSelectedRecord({ ...selectedRecord, ph: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Total Dissolved Solids (TDS ppm)</label>
                <input
                  type="number"
                  value={selectedRecord.tds}
                  onChange={(e) =>
                    setSelectedRecord({ ...selectedRecord, tds: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Fluoride (mg/L)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedRecord.fluoride}
                  onChange={(e) =>
                    setSelectedRecord({ ...selectedRecord, fluoride: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Quality Assessment</label>
                <select
                  value={selectedRecord.status}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      status: e.target.value as 'Good' | 'Moderate' | 'Critical',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white"
                >
                  <option value="Good">Good</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
                >
                  Save Calibration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
