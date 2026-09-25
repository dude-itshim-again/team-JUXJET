import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Challenge } from '../../types';
import { useNavigate } from 'react-router-dom';

interface LeafletMapProps {
  challenges: Challenge[];
  selectedCategory?: string;
  height?: string;
  onSelectChallenge?: (challenge: Challenge) => void;
  interactivePicker?: boolean;
  onLocationPick?: (lat: number, lng: number) => void;
  pickedLocation?: { lat: number; lng: number };
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  challenges,
  selectedCategory,
  height = '420px',
  onSelectChallenge,
  interactivePicker = false,
  onLocationPick,
  pickedLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const navigate = useNavigate();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center the map on Jharkhand for the state-specific experience.
    const initialLat = pickedLocation ? pickedLocation.lat : 23.3441;
    const initialLng = pickedLocation ? pickedLocation.lng : 85.3096;
    const initialZoom = pickedLocation ? 10 : 8;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      scrollWheelZoom: true
    });

    // OpenStreetMap tiles avoid provider API-key overlays in the map view.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const markerLayerGroup = L.layerGroup().addTo(map);
    markersRef.current = markerLayerGroup;
    mapInstanceRef.current = map;

    // Interactive picker click handler
    if (interactivePicker && onLocationPick) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationPick(Number(lat.toFixed(5)), Number(lng.toFixed(5)));
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    const filtered = selectedCategory
      ? challenges.filter(c => c.category === selectedCategory)
      : challenges;

    filtered.forEach(ch => {
      if (!ch.location || !ch.location.lat || !ch.location.lng) return;

      const markerColor =
        ch.priority === 'Critical'
          ? '#DC2626'
          : ch.priority === 'High'
          ? '#EA580C'
          : ch.status === 'Pilot'
          ? '#059669'
          : '#173B65';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([ch.location.lat, ch.location.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 200px; padding: 2px;">
          <span style="font-size: 10px; font-weight: 700; color: #173B65; text-transform: uppercase;">
            ${ch.category}
          </span>
          <h4 style="font-size: 13px; font-weight: 600; margin: 4px 0; color: #0F172A; line-height: 1.3;">
            ${ch.title}
          </h4>
          <p style="font-size: 11px; color: #64748B; margin: 4px 0;">
            📍 ${ch.location.district}, ${ch.location.state}
          </p>
          <div style="margin-top: 6px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #EEF2F6; color: #334155; font-weight: 600;">
              ${ch.status}
            </span>
            <button id="btn-view-${ch.id}" style="
              font-size: 11px;
              background: #173B65;
              color: white;
              border: none;
              padding: 3px 8px;
              border-radius: 4px;
              cursor: pointer;
            ">
              View Details →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-${ch.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectChallenge) {
              onSelectChallenge(ch);
            } else {
              navigate(`/challenges/${ch.id}`);
            }
          };
        }
      });

      markersRef.current?.addLayer(marker);
    });
  }, [challenges, selectedCategory]);

  // Update pickedLocation marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (pickedLocation) {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([pickedLocation.lat, pickedLocation.lng]);
      } else {
        const pickerIcon = L.divIcon({
          className: 'picker-marker',
          html: `<div style="background:#E7A23B;width:32px;height:32px;border-radius:50%;border:3px solid #173B65;box-shadow:0 0 10px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:16px;">🎯</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        pickerMarkerRef.current = L.marker([pickedLocation.lat, pickedLocation.lng], { icon: pickerIcon }).addTo(
          mapInstanceRef.current
        );
      }
      mapInstanceRef.current.panTo([pickedLocation.lat, pickedLocation.lng]);
    }
  }, [pickedLocation]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur px-3 py-1.5 rounded-md shadow-sm border border-slate-200 text-[11px] text-slate-700 flex items-center gap-3 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span> Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Pilot / Solution
        </span>
      </div>
    </div>
  );
};
