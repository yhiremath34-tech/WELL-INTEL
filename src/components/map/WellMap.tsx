import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import { Well } from '../../types/well';
import { createWellMarkerIcon, createUserLocationIcon } from './CustomMarkers';

interface WellMapProps {
  wells: Well[];
  selectedWell: Well | null;
  onSelectWell: (well: Well) => void;
  userLocation: { latitude: number; longitude: number };
  radiusKm?: number;
  className?: string;
  onLocateMe?: () => void;
}

// Controller to smoothly pan to selected well or location
const MapController: React.FC<{
  center?: [number, number];
  zoom?: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
};

export const WellMap: React.FC<WellMapProps> = ({
  wells,
  selectedWell,
  onSelectWell,
  userLocation,
  radiusKm = 30,
  className = 'h-full w-full relative',
  onLocateMe,
}) => {
  const [mapStyle, setMapStyle] = useState<'dark' | 'light' | 'satellite' | 'osm'>('dark');
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    selectedWell ? selectedWell.latitude : userLocation.latitude,
    selectedWell ? selectedWell.longitude : userLocation.longitude,
  ]);
  const [zoomLevel, setZoomLevel] = useState<number>(selectedWell ? 14 : 11);

  useEffect(() => {
    if (selectedWell) {
      setMapCenter([selectedWell.latitude, selectedWell.longitude]);
      setZoomLevel(14);
    }
  }, [selectedWell]);

  const tileLayers = {
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    },
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Maxar, Earthstar Geographics',
    },
  };

  const handleCenterUser = () => {
    setMapCenter([userLocation.latitude, userLocation.longitude]);
    setZoomLevel(12);
    if (onLocateMe) onLocateMe();
  };

  return (
    <div className={className}>
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <MapController center={mapCenter} zoom={zoomLevel} />

        <TileLayer
          attribution={tileLayers[mapStyle].attribution}
          url={tileLayers[mapStyle].url}
          maxZoom={19}
        />

        {/* User Location Radar Marker & Radius Overlay */}
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={createUserLocationIcon()}
        />

        {radiusKm > 0 && (
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#38BDF8',
              fillColor: '#0284C7',
              fillOpacity: 0.08,
              weight: 1.5,
              dashArray: '4 6',
            }}
          />
        )}

        {/* Well Markers */}
        {wells.map((well) => {
          const isSelected = selectedWell?.id === well.id;
          return (
            <Marker
              key={well.id}
              position={[well.latitude, well.longitude]}
              icon={createWellMarkerIcon(well.status, isSelected)}
              eventHandlers={{
                click: () => onSelectWell(well),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Floating Map Controls HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Style Switcher */}
        <div className="bg-navy-950/90 backdrop-blur-md p-1 rounded-xl border border-cyan-500/25 shadow-xl flex items-center gap-1">
          {(['dark', 'light', 'satellite'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                mapStyle === style
                  ? 'bg-water-500 text-white shadow-sm shadow-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Station Count Pill */}
        <div className="bg-navy-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/20 text-xs text-slate-300 font-mono flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>
            {wells.length} stations visible within {radiusKm} km
          </span>
        </div>
      </div>

      {/* Action Buttons: Locate Me */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleCenterUser}
          className="p-3 rounded-xl bg-navy-950/90 hover:bg-navy-900 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 shadow-xl transition-all group"
          title="Center on My Location"
        >
          <Crosshair className="w-5 h-5 group-hover:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
