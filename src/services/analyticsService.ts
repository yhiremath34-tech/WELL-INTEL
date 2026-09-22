import type { Well } from '../types/well';

export interface GroundwaterSummary {
  totalWells: number;
  activeWells: number;
  alertWells: number;
  maintenanceWells: number;
  inactiveWells: number;
  avgWaterLevel: number; // in meters
  avgDepth: number;
  avgYield: number;
  waterQualityStats: {
    good: number;
    moderate: number;
    salinity: number;
    fluoride: number;
    critical: number;
  };
  wellTypeDistribution: {
    borewell: number;
    openDug: number;
    tubeWell: number;
    piezometer: number;
  };
}

export interface EnvironmentalInsight {
  id: string;
  category: 'RECHARGE' | 'DEPLETION_RISK' | 'SALINITY' | 'SYSTEM_HEALTH' | 'EXTRACTION';
  title: string;
  summary: string;
  confidenceScore: number; // 0-100%
  severity: 'optimal' | 'warning' | 'critical' | 'info';
  metrics: { label: string; value: string }[];
  recommendation: string;
  generatedAt: string;
}

export const analyticsService = {
  calculateSummary(wells: Well[]): GroundwaterSummary {
    if (!wells || wells.length === 0) {
      return {
        totalWells: 0,
        activeWells: 0,
        alertWells: 0,
        maintenanceWells: 0,
        inactiveWells: 0,
        avgWaterLevel: 0,
        avgDepth: 0,
        avgYield: 0,
        waterQualityStats: { good: 0, moderate: 0, salinity: 0, fluoride: 0, critical: 0 },
        wellTypeDistribution: { borewell: 0, openDug: 0, tubeWell: 0, piezometer: 0 },
      };
    }

    const total = wells.length;
    let sumWaterLevel = 0;
    let sumDepth = 0;
    let sumYield = 0;

    let active = 0;
    let alert = 0;
    let maintenance = 0;
    let inactive = 0;

    const quality = { good: 0, moderate: 0, salinity: 0, fluoride: 0, critical: 0 };
    const types = { borewell: 0, openDug: 0, tubeWell: 0, piezometer: 0 };

    wells.forEach((w) => {
      sumWaterLevel += w.water_level || 0;
      sumDepth += w.depth || 0;
      sumYield += w.yield || 0;

      if (w.status === 'ACTIVE') active++;
      else if (w.status === 'ALERT') alert++;
      else if (w.status === 'MAINTENANCE') maintenance++;
      else if (w.status === 'INACTIVE') inactive++;

      if (w.water_quality === 'Good') quality.good++;
      else if (w.water_quality === 'Moderate') quality.moderate++;
      else if (w.water_quality === 'High Salinity') quality.salinity++;
      else if (w.water_quality === 'Fluoride Concern') quality.fluoride++;
      else if (w.water_quality === 'Critical') quality.critical++;

      if (w.well_type === 'Borewell') types.borewell++;
      else if (w.well_type === 'Open Dug Well') types.openDug++;
      else if (w.well_type === 'Tube Well') types.tubeWell++;
      else if (w.well_type === 'Monitoring Piezometer') types.piezometer++;
    });

    return {
      totalWells: total,
      activeWells: active,
      alertWells: alert,
      maintenanceWells: maintenance,
      inactiveWells: inactive,
      avgWaterLevel: Math.round((sumWaterLevel / total) * 10) / 10,
      avgDepth: Math.round((sumDepth / total) * 10) / 10,
      avgYield: Math.round(sumYield / total),
      waterQualityStats: quality,
      wellTypeDistribution: types,
    };
  },

  /**
   * Generates rule-based environmental insights derived from actual telemetry measurements
   */
  generateEnvironmentalInsights(wells: Well[]): EnvironmentalInsight[] {
    const summary = this.calculateSummary(wells);
    const insights: EnvironmentalInsight[] = [];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Rule 1: Water table depth evaluation
    if (summary.avgWaterLevel < 25) {
      insights.push({
        id: 'ins-1',
        category: 'RECHARGE',
        title: 'Favorable Aquifer Water Table Elevation',
        summary: `Average water depth stands at ${summary.avgWaterLevel}m bgl, indicating stable shallow and intermediate unconfined storage levels across active observation nodes.`,
        confidenceScore: 94,
        severity: 'optimal',
        metrics: [
          { label: 'Mean Water Table', value: `${summary.avgWaterLevel} m bgl` },
          { label: 'Active Ratio', value: `${Math.round((summary.activeWells / summary.totalWells) * 100)}%` },
        ],
        recommendation: 'Maintain standard seasonal observation intervals. Ensure artificial recharge trenching remains unobstructed.',
        generatedAt: now,
      });
    } else {
      insights.push({
        id: 'ins-1-depletion',
        category: 'DEPLETION_RISK',
        title: 'Elevated Dynamic Drawdown Detected',
        summary: `Average groundwater head has depressed to ${summary.avgWaterLevel}m bgl. Higher extraction demand is accelerating cone of depression formation in deep fractures.`,
        confidenceScore: 89,
        severity: 'warning',
        metrics: [
          { label: 'Mean Water Table', value: `${summary.avgWaterLevel} m bgl` },
          { label: 'Deep Borewells', value: `${summary.wellTypeDistribution.borewell} units` },
        ],
        recommendation: 'Recommend rotational pumping schedules during peak afternoon hours and mandatory rooftop rainwater recharge integration.',
        generatedAt: now,
      });
    }

    // Rule 2: Coastal Saline Intrusion and Mineral Alert
    const vulnerableWells = summary.waterQualityStats.salinity + summary.waterQualityStats.critical;
    if (vulnerableWells > 0) {
      insights.push({
        id: 'ins-2-salinity',
        category: 'SALINITY',
        title: 'Coastal Wedge & Saline Ingress Monitoring',
        summary: `${vulnerableWells} coastal/estuarine wells show elevated chloride and electrical conductivity signatures in proximity to tidal channels.`,
        confidenceScore: 91,
        severity: 'warning',
        metrics: [
          { label: 'Affected Stations', value: `${vulnerableWells} wells` },
          { label: 'Piezometers Active', value: `${summary.wellTypeDistribution.piezometer} units` },
        ],
        recommendation: 'Limit heavy continuous withdrawal within 3 km of high tide zones to prevent landward freshwater barrier retreat.',
        generatedAt: now,
      });
    }

    // Rule 3: High-yield infrastructure status
    insights.push({
      id: 'ins-3-infra',
      category: 'EXTRACTION',
      title: 'Groundwater Extraction & Yield Balance',
      summary: `Estimated aggregate sustainable yield across monitored units is ${summary.avgYield.toLocaleString()} L/hr per operational borehole.`,
      confidenceScore: 96,
      severity: 'info',
      metrics: [
        { label: 'Avg Well Yield', value: `${summary.avgYield} L/hr` },
        { label: 'Total Monitored', value: `${summary.totalWells} stations` },
      ],
      recommendation: 'Routine calibration of acoustic level sensors and electromagnetic flowmeters suggested before pre-monsoon survey.',
      generatedAt: now,
    });

    return insights;
  }
};
