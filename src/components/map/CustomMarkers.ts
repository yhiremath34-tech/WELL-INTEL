import L from 'leaflet';
import { WellStatus } from '../../types/well';

export function createWellMarkerIcon(status: WellStatus, isSelected: boolean = false) {
  let pulseColor = '#14B8A6';
  let pinBg = '#0E7490';
  let borderColor = '#38BDF8';

  if (status === 'ALERT') {
    pulseColor = '#F43F5E';
    pinBg = '#BE123C';
    borderColor = '#FDA4AF';
  } else if (status === 'INACTIVE') {
    pulseColor = '#64748B';
    pinBg = '#475569';
    borderColor = '#94A3B8';
  } else if (status === 'MAINTENANCE') {
    pulseColor = '#F59E0B';
    pinBg = '#D97706';
    borderColor = '#FDE68A';
  }

  const selectedRing = isSelected
    ? `<div style="position:absolute; inset:-8px; border-radius:50%; border:2px solid #38BDF8; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
    : '';

  const html = `
    <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
      ${selectedRing}
      <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:${pulseColor}; opacity:0.35; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width:24px; height:24px; border-radius:50%; background:${pinBg}; border:2px solid ${borderColor}; box-shadow:0 0 12px ${pulseColor}; display:flex; align-items:center; justify-content:center; color:white; font-size:11px; font-weight:bold;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-well-pin',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

export function createUserLocationIcon() {
  const html = `
    <div style="position:relative; width:38px; height:38px; display:flex; align-items:center; justify-content:center;">
      <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:#38BDF8; opacity:0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width:22px; height:22px; border-radius:50%; background:#0284C7; border:3px solid #FFFFFF; box-shadow:0 0 15px #38BDF8; display:flex; align-items:center; justify-content:center;">
        <div style="width:6px; height:6px; border-radius:50%; background:#FFFFFF;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-user-pin',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
}
