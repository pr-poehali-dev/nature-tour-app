import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Icon from "@/components/ui/icon";

type IconName = string;

const TRAILS_DATA = [
  {
    id: 1,
    name: "Большой Иремель",
    color: "#ff7d0a",
    difficulty: "medium",
    difficultyLabel: "Средняя",
    length: "14.2 км",
    time: "6–8 часов",
    elevation: "+780 м",
    rating: 4.8,
    reviews: 234,
    description: "Главный маршрут парка к вершине Большой Иремель (1582 м). Проходит через субальпийские луга и курумники. Незабываемые виды на Южный Урал.",
    coords: [
      [54.4980, 58.8430],
      [54.5050, 58.8360],
      [54.5130, 58.8280],
      [54.5220, 58.8200],
      [54.5290, 58.8130],
      [54.5350, 58.8060],
      [54.5390, 58.7980],
    ] as [number, number][],
    points: [
      { icon: "Droplets", label: "Родник «Холодный»", color: "#7bb3d0", lat: 54.513, lng: 58.828 },
      { icon: "Tent", label: "Стоянка «Еловая»", color: "#2d8b3f", lat: 54.525, lng: 58.812 },
      { icon: "Shield", label: "Пост егерей", color: "#b47535", lat: 54.505, lng: 58.842 },
    ],
    summit: { lat: 54.5390, lng: 58.7980, label: "Бол. Иремель 1582м" },
  },
  {
    id: 2,
    name: "Малый Иремель",
    color: "#2d8b3f",
    difficulty: "easy",
    difficultyLabel: "Лёгкая",
    length: "9.5 км",
    time: "4–5 часов",
    elevation: "+560 м",
    rating: 4.6,
    reviews: 189,
    description: "Более короткий маршрут к вершине Малый Иремель (1449 м). Подходит для семей с детьми и начинающих туристов.",
    coords: [
      [54.4980, 58.8430],
      [54.5010, 58.8380],
      [54.5040, 58.8330],
      [54.5060, 58.8270],
      [54.5080, 58.8220],
    ] as [number, number][],
    points: [
      { icon: "Droplets", label: "Родник «Лесной»", color: "#7bb3d0", lat: 54.504, lng: 58.833 },
      { icon: "Shield", label: "Информационный щит", color: "#b47535", lat: 54.501, lng: 58.840 },
    ],
    summit: { lat: 54.5080, lng: 58.8220, label: "Мал. Иремель 1449м" },
  },
  {
    id: 3,
    name: "Тыгынский перевал",
    color: "#e53e3e",
    difficulty: "hard",
    difficultyLabel: "Сложная",
    length: "22.8 км",
    time: "10–12 часов",
    elevation: "+1050 м",
    rating: 4.9,
    reviews: 87,
    description: "Экспедиционный маршрут для опытных туристов через Тыгынский перевал. Требует физической подготовки и специального снаряжения.",
    coords: [
      [54.4980, 58.8430],
      [54.5060, 58.8520],
      [54.5150, 58.8600],
      [54.5240, 58.8680],
      [54.5320, 58.8740],
      [54.5410, 58.8780],
      [54.5490, 58.8720],
    ] as [number, number][],
    points: [
      { icon: "Droplets", label: "Родник «Перевальный»", color: "#7bb3d0", lat: 54.515, lng: 58.860 },
      { icon: "Tent", label: "Биваковая зона", color: "#2d8b3f", lat: 54.532, lng: 58.874 },
      { icon: "Shield", label: "Контрольный пост", color: "#b47535", lat: 54.506, lng: 58.852 },
      { icon: "Tent", label: "Стоянка «Вершинная»", color: "#2d8b3f", lat: 54.545, lng: 58.877 },
    ],
    summit: { lat: 54.5490, lng: 58.8720, label: "Тыгын. перевал 1410м" },
  },
];

const USER_LOCATION: [number, number] = [54.5020, 58.8450];

function createPoiIcon(emoji: string, color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color}22;border:1.5px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:14px;cursor:pointer;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
    ">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function createSummitIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:26px;height:26px;border-radius:50%;
      background:${color};
      display:flex;align-items:center;justify-content:center;
      font-size:12px;color:white;font-weight:bold;
      box-shadow:0 0 12px ${color}88;
      border:2px solid white;
    ">▲</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:20px;height:20px">
      <div style="
        position:absolute;inset:-8px;border-radius:50%;
        background:rgba(255,125,10,0.2);
        animation:pulse-ring 1.8s ease-out infinite;
      "></div>
      <div style="
        width:20px;height:20px;border-radius:50%;
        background:#ff7d0a;border:2.5px solid white;
        box-shadow:0 0 10px rgba(255,125,10,0.7);
      "></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

type Trail = typeof TRAILS_DATA[0];

interface Props {
  onTrailSelect: (trail: Trail | null) => void;
  selectedTrailId: number | null;
}

export default function ParkMap({ onTrailSelect, selectedTrailId }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Init map
    const map = L.map(containerRef.current, {
      center: [54.512, 58.845],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // OpenTopoMap — рельеф с горами
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      opacity: 0.92,
    }).addTo(map);

    // Attribution compact
    L.control.attribution({ prefix: false, position: "bottomleft" })
      .addAttribution('<a href="https://opentopomap.org">OpenTopoMap</a>')
      .addTo(map);

    // Draw trails
    TRAILS_DATA.forEach((trail) => {
      const polyline = L.polyline(trail.coords, {
        color: trail.color,
        weight: 4,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      polylinesRef.current.push(polyline);

      polyline.on("click", () => onTrailSelect(trail));

      // Hover glow
      polyline.on("mouseover", () => polyline.setStyle({ weight: 6, opacity: 1 }));
      polyline.on("mouseout", () => polyline.setStyle({ weight: 4, opacity: 0.9 }));

      // Summit marker
      const summitMarker = L.marker([trail.summit.lat, trail.summit.lng], {
        icon: createSummitIcon(trail.color),
      }).addTo(map);
      summitMarker.on("click", () => onTrailSelect(trail));

      // POI markers
      trail.points.forEach((poi) => {
        const emoji = poi.icon === "Droplets" ? "💧" : poi.icon === "Tent" ? "⛺" : "🛡️";
        const marker = L.marker([poi.lat, poi.lng], {
          icon: createPoiIcon(emoji, poi.color),
        }).addTo(map);
        marker.bindTooltip(poi.label, {
          direction: "top",
          offset: [0, -16],
          className: "park-tooltip",
        });
      });
    });

    // User location
    L.marker(USER_LOCATION, { icon: createUserIcon() }).addTo(map);

    // Zoom control
    L.control.zoom({ position: "topright" }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Highlight selected trail
  useEffect(() => {
    polylinesRef.current.forEach((pl, i) => {
      if (selectedTrailId === null) {
        pl.setStyle({ weight: 4, opacity: 0.9 });
      } else if (TRAILS_DATA[i]?.id === selectedTrailId) {
        pl.setStyle({ weight: 6, opacity: 1 });
        mapRef.current?.fitBounds(pl.getBounds(), { padding: [40, 40] });
      } else {
        pl.setStyle({ weight: 3, opacity: 0.4 });
      }
    });
  }, [selectedTrailId]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export { TRAILS_DATA };
export type { Trail };
