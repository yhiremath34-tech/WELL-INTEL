import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { GroundwaterSummary } from '../../services/analyticsService';

interface GroundwaterChartsProps {
  summary: GroundwaterSummary;
}

const STATUS_COLORS = {
  Active: '#14B8A6',
  Alert: '#F43F5E',
  Maintenance: '#F59E0B',
  Inactive: '#64748B',
};

export const GroundwaterCharts: React.FC<GroundwaterChartsProps> = ({ summary }) => {
  // Status Donut Data
  const statusData = [
    { name: 'Active', value: summary.activeWells, color: STATUS_COLORS.Active },
    { name: 'Alert', value: summary.alertWells, color: STATUS_COLORS.Alert },
    { name: 'Maintenance', value: summary.maintenanceWells, color: STATUS_COLORS.Maintenance },
    { name: 'Inactive', value: summary.inactiveWells, color: STATUS_COLORS.Inactive },
  ].filter((d) => d.value > 0);

  // Well Types Data
  const typeData = [
    { name: 'Borewell', count: summary.wellTypeDistribution.borewell },
    { name: 'Open Well', count: summary.wellTypeDistribution.openDug },
    { name: 'Tube Well', count: summary.wellTypeDistribution.tubeWell },
    { name: 'Piezometer', count: summary.wellTypeDistribution.piezometer },
  ];

  // Water Quality Breakdown Data
  const qualityData = [
    { name: 'Good Potable', count: summary.waterQualityStats.good, fill: '#10B981' },
    { name: 'Moderate', count: summary.waterQualityStats.moderate, fill: '#38BDF8' },
    { name: 'High Salinity', count: summary.waterQualityStats.salinity, fill: '#F59E0B' },
    { name: 'Fluoride Concern', count: summary.waterQualityStats.fluoride, fill: '#FB923C' },
    { name: 'Critical', count: summary.waterQualityStats.critical, fill: '#F43F5E' },
  ];

  // Simulated 12-month regional water table trend (in meters below ground level)
  const trendData = [
    { month: 'Oct 25', level: 16.2, recharge: 1400 },
    { month: 'Nov 25', level: 17.5, recharge: 1350 },
    { month: 'Dec 25', level: 19.1, recharge: 1250 },
    { month: 'Jan 26', level: 21.0, recharge: 1100 },
    { month: 'Feb 26', level: 23.4, recharge: 950 },
    { month: 'Mar 26', level: 26.8, recharge: 800 },
    { month: 'Apr 26', level: 29.5, recharge: 700 },
    { month: 'May 26', level: 31.2, recharge: 650 },
    { month: 'Jun 26', level: 22.1, recharge: 1600 },
    { month: 'Jul 26', level: 15.4, recharge: 2200 },
    { month: 'Aug 26', level: 14.8, recharge: 2450 },
    { month: 'Sep 26', level: summary.avgWaterLevel || 18.4, recharge: 1900 },
  ];

  return (
    <div className="space-y-8">
      {/* Chart 1: Water Level Trends Over Time */}
      <div className="p-6 rounded-3xl glass-card border border-cyan-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <div>
            <h4 className="text-base font-bold text-white tracking-wide">
              Regional Groundwater Table Fluctuation
            </h4>
            <p className="text-xs text-slate-400">
              12-Month Telemetry Trend (Meters Below Ground Level & Recharge Volume)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Depth (mbgl)
            </span>
            <span className="flex items-center gap-1.5 text-teal-300">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              Recharge (L/hr)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waterLevelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[10, 35]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#071A2B',
                  borderColor: 'rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="#38BDF8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#waterLevelGrad)"
                name="Water Level (m bgl)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of secondary charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 2: Status Donut */}
        <div className="p-6 rounded-3xl glass-card border border-cyan-500/20 shadow-xl flex flex-col">
          <h4 className="text-base font-bold text-white mb-1">Station Status Distribution</h4>
          <p className="text-xs text-slate-400 mb-4">Operational status across {summary.totalWells} monitored nodes</p>

          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#071A2B" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071A2B',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(val) => <span className="text-xs text-slate-300 mr-2">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Types Distribution */}
        <div className="p-6 rounded-3xl glass-card border border-cyan-500/20 shadow-xl flex flex-col">
          <h4 className="text-base font-bold text-white mb-1">Well Structure Taxonomy</h4>
          <p className="text-xs text-slate-400 mb-4">Physical well construction categories</p>

          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071A2B',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#14B8A6" radius={[6, 6, 0, 0]} name="Station Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Water Quality Distribution */}
        <div className="p-6 rounded-3xl glass-card border border-cyan-500/20 shadow-xl lg:col-span-2">
          <h4 className="text-base font-bold text-white mb-1">Potability & Mineral Classification</h4>
          <p className="text-xs text-slate-400 mb-4">Chemical and salinity screening results</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071A2B',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Wells Evaluated">
                  {qualityData.map((entry, index) => (
                    <Cell key={`q-cell-${index}`} fill={entry.fill} />
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
