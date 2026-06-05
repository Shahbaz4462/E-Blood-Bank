"use client";

import { useEffect, useRef, useState } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  province: string;
  country: string;
  address: string;
}

interface MapSelectionProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (data: LocationData) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function MapSelection({ initialLat, initialLng, onLocationSelect }: MapSelectionProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // default to Islamabad center
  const defaultLat = initialLat || 33.6844;
  const defaultLng = initialLng || 73.0479;

  useEffect(() => {
    let active = true;

    // Load Leaflet stylesheet and script dynamically
    const loadLeaflet = async () => {
      if (window.L) {
        setMapLoaded(true);
        return;
      }

      // Check if Leaflet CSS is already injected
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Check if Leaflet JS is already injected
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => {
          if (active) setMapLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        // script tag exists, check periodically until window.L is ready
        const checkL = setInterval(() => {
          if (window.L) {
            clearInterval(checkL);
            if (active) setMapLoaded(true);
          }
        }, 100);
      }
    };

    loadLeaflet();

    return () => {
      active = false;
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = window.L;
    
    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Custom Icon
    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Create Marker
    const marker = L.marker([defaultLat, defaultLng], { icon: customIcon, draggable: true }).addTo(map);
    markerRef.current = marker;

    const reverseGeocode = async (lat: number, lng: number) => {
      setIsGeocoding(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.suburb || addr.village || addr.county || "";
          const province = addr.state || addr.region || "";
          const country = addr.country || "";
          const fullAddress = data.display_name || "";

          onLocationSelect({
            latitude: lat,
            longitude: lng,
            city,
            province,
            country,
            address: fullAddress,
          });
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      } finally {
        setIsGeocoding(false);
      }
    };

    // Initial reverse geocode if creating from default
    if (!initialLat || !initialLng) {
      reverseGeocode(defaultLat, defaultLng);
    }

    // Map Click Handler: move marker and reverse geocode
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      reverseGeocode(lat, lng);
    });

    // Marker Drag End Handler: reverse geocode
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      reverseGeocode(position.lat, position.lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mapLoaded]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !window.L || !mapInstanceRef.current) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const { lat, lon, display_name } = results[0];
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lon);

          const L = window.L;
          mapInstanceRef.current.setView([latitude, longitude], 15);
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          }

          // Parse search query address detail
          const detailRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const detailData = detailRes.ok ? await detailRes.json() : {};
          const addr = detailData.address || {};
          const city = addr.city || addr.town || addr.suburb || addr.village || addr.county || "";
          const province = addr.state || addr.region || "";
          const country = addr.country || "";

          onLocationSelect({
            latitude,
            longitude,
            city,
            province,
            country,
            address: display_name,
          });
        } else {
          alert("Location not found. Please try a different query.");
        }
      }
    } catch (err) {
      console.error("Location search error:", err);
      alert("Error searching location.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search location (e.g. G-9 Islamabad)"
          className="flex-grow text-sm input-field"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="btn-primary text-sm font-medium whitespace-nowrap"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="relative border border-border rounded-xl overflow-hidden shadow-inner bg-background-secondary h-64 w-full z-0">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-muted font-medium text-sm animate-pulse">
            Loading interactive map canvas...
          </div>
        )}
        <div ref={mapContainerRef} className="h-full w-full" />
        {isGeocoding && (
          <div className="absolute bottom-2 right-2 bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-medium text-foreground shadow-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Analyzing coordinates...
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted font-medium leading-relaxed">
        📍 You can click on the map or drag the blue pin to set your exact location coordinates.
      </p>
    </div>
  );
}
