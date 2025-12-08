'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { colors, borderRadius, spacing, shadows, typography } from '@/lib/design-tokens';

// Fix for default marker icons in React-Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons for origin and destination
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${color};
        border: 3px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: ${shadows.md};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: #FFFFFF;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

const originIcon = createCustomIcon(colors.primary);
const destinationIcon = createCustomIcon('#002D72');

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationCoordinates) => void;
  initialLocation?: LocationCoordinates;
  label?: string;
  placeholder?: string;
  markerType?: 'origin' | 'destination';
}

// Component to handle map clicks
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to recenter map when location changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  label = 'Select Location',
  placeholder = 'Click on the map to select a location',
  markerType = 'origin',
}: LocationPickerProps) {
  // Bahrain center coordinates
  const BAHRAIN_CENTER: [number, number] = [26.0667, 50.5577];
  const BAHRAIN_BOUNDS: L.LatLngBoundsExpression = [
    [25.5, 50.3], // Southwest
    [26.3, 50.8], // Northeast
  ];

  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(
    initialLocation || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : BAHRAIN_CENTER
  );

  const markerIcon = markerType === 'origin' ? originIcon : destinationIcon;

  const handleMapClick = async (lat: number, lng: number) => {
    // Validate coordinates are within Bahrain bounds
    if (lat < 25.5 || lat > 26.3 || lng < 50.3 || lng > 50.8) {
      setError('Please select a location within Bahrain');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setError('');
    const location: LocationCoordinates = { lat, lng };
    
    // Reverse geocoding to get address
    try {
      const address = await reverseGeocode(lat, lng);
      location.address = address;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      location.address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    setSelectedLocation(location);
    setMapCenter([lat, lng]);
    onLocationSelect(location);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a location to search');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsSearching(true);
    setError('');
    try {
      const result = await geocodeAddress(searchQuery);
      if (result) {
        handleMapClick(result.lat, result.lng);
        setSearchQuery(result.address || searchQuery);
      } else {
        setError('Location not found. Please try a different search.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      setError('Failed to search location. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Label */}
      <label
        style={{
          display: 'block',
          fontFamily: typography.fontFamily,
          fontSize: typography.size.base,
          fontWeight: typography.weight.medium,
          lineHeight: typography.lineHeight.tight,
          color: colors.text.secondary,
          marginBottom: spacing.sm,
          letterSpacing: typography.letterSpacing.tight,
        }}
      >
        {label}
      </label>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginBottom: spacing.md,
            padding: spacing.md,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: borderRadius.md,
            color: '#ef4444',
            fontFamily: typography.fontFamily,
            fontSize: typography.size.sm,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Search Input */}
      <div style={{ marginBottom: spacing.lg }}>
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            style={{
              flex: 1,
              height: '63px',
              padding: `${spacing.xs} ${spacing.md}`,
              background: colors.background.card,
              border: `2px solid ${colors.border.default}`,
              borderRadius: borderRadius.lg,
              color: colors.text.primary,
              fontFamily: typography.fontFamily,
              fontSize: typography.size.base,
              lineHeight: typography.lineHeight.relaxed,
              letterSpacing: typography.letterSpacing.tight,
              outline: 'none',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            style={{
              width: '63px',
              height: '63px',
              minWidth: '63px',
              minHeight: '63px',
              background: isSearching ? colors.text.tertiary : colors.primaryGradient,
              border: 'none',
              borderRadius: borderRadius.lg,
              color: colors.text.primary,
              cursor: isSearching ? 'not-allowed' : 'pointer',
              boxShadow: shadows.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {isSearching ? '⏳' : '🔍'}
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
          border: `2px solid ${colors.border.default}`,
          boxShadow: shadows.md,
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          maxBounds={BAHRAIN_BOUNDS}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />
          <MapRecenter center={mapCenter} />
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={markerIcon}
            />
          )}
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div
          style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            background: colors.overlay.light,
            border: `2px solid ${colors.border.light}`,
            borderRadius: borderRadius.lg,
          }}
        >
          <p
            style={{
              fontFamily: typography.fontFamily,
              fontSize: typography.size.base,
              lineHeight: typography.lineHeight.normal,
              color: colors.text.secondary,
              margin: 0,
              marginBottom: spacing.xs,
            }}
          >
            <strong>Selected:</strong>
          </p>
          <p
            style={{
              fontFamily: typography.fontFamily,
              fontSize: typography.size.base,
              lineHeight: typography.lineHeight.relaxed,
              color: colors.text.tertiary,
              margin: 0,
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Forward geocoding: Convert address to coordinates
 * Uses Nominatim API (OpenStreetMap)
 */
async function geocodeAddress(address: string): Promise<LocationCoordinates | null> {
  try {
    const query = encodeURIComponent(`${address}, Bahrain`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=bh`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocoding: Convert coordinates to address
 * Uses Nominatim API (OpenStreetMap)
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
