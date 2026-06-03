import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Координаты верифицированы по OpenTopoMap / OpenStreetMap ─────────────────
// Тюлюк (деревня, старт): 54.5635°N 58.8267°E
// КПП природного парка:   54.5463°N 58.8284°E
// Большой Иремель:        54.5197°N 58.8424°E  (1582м, официальная вершина)
// Малый Иремель:          54.5148°N 58.8652°E  (1449м)
// Сукташ:                 54.5342°N 58.8215°E  (скальный останец, сев. часть)
// Обзорная:               54.5302°N 58.8292°E  (видовая точка плато)
// Большой Синяк:          54.5078°N 58.8208°E  (южн.отрог)
// Жеребчик:               54.5358°N 58.8032°E  (сев-зап.отрог)

const TYULYUK: [number, number] = [54.5635, 58.8267];
const KPP: [number, number] = [54.5463, 58.8284];

const TRAILS_DATA = [
  {
    id: 1,
    name: "Большой Иремель",
    color: "#ff7d0a",
    difficulty: "medium",
    difficultyLabel: "Средняя",
    length: "14.2 км",
    time: "6–8 часов",
    elevation: "+860 м",
    rating: 4.9,
    reviews: 312,
    description:
      "Главный маршрут парка — от деревни Тюлюк до высшей точки Южного Урала (1582 м). Через еловый лес, субальпийские луга и курумники.",
    coords: [
      [54.5635, 58.8267], // Тюлюк
      [54.5580, 58.8272],
      [54.5530, 58.8278],
      [54.5463, 58.8284], // КПП
      [54.5415, 58.8305],
      [54.5360, 58.8350],
      [54.5300, 58.8375],
      [54.5248, 58.8400],
      [54.5197, 58.8424], // Большой Иремель
    ] as [number, number][],
    points: [
      { icon: "Shield", label: "КПП парка", color: "#b47535", lat: 54.5463, lng: 58.8284 },
      { icon: "Droplets", label: "Родник у КПП", color: "#7bb3d0", lat: 54.5450, lng: 58.8290 },
      { icon: "Tent", label: "Стоянка «Поляна Тыгын»", color: "#2d8b3f", lat: 54.5360, lng: 58.8350 },
    ],
    summit: { lat: 54.5197, lng: 58.8424, label: "Большой Иремель 1582м" },
  },
  {
    id: 2,
    name: "Малый Иремель",
    color: "#4da85e",
    difficulty: "easy",
    difficultyLabel: "Лёгкая",
    length: "12.8 км",
    time: "5–6 часов",
    elevation: "+690 м",
    rating: 4.6,
    reviews: 198,
    description:
      "Маршрут от Тюлюка до вершины Малый Иремель (1449 м). Идёт через КПП, затем уходит на восток к соседней вершине по седловине.",
    coords: [
      [54.5635, 58.8267], // Тюлюк
      [54.5580, 58.8272],
      [54.5530, 58.8278],
      [54.5463, 58.8284], // КПП
      [54.5415, 58.8305],
      [54.5360, 58.8350],
      [54.5300, 58.8375],
      [54.5248, 58.8400],
      [54.5220, 58.8455], // седловина
      [54.5188, 58.8530],
      [54.5160, 58.8590],
      [54.5148, 58.8652], // Малый Иремель
    ] as [number, number][],
    points: [
      { icon: "Shield", label: "КПП парка", color: "#b47535", lat: 54.5463, lng: 58.8284 },
      { icon: "Droplets", label: "Родник на седловине", color: "#7bb3d0", lat: 54.5220, lng: 58.8455 },
    ],
    summit: { lat: 54.5148, lng: 58.8652, label: "Малый Иремель 1449м" },
  },
  {
    id: 3,
    name: "Сукташ",
    color: "#7bb3d0",
    difficulty: "easy",
    difficultyLabel: "Лёгкая",
    length: "9.2 км",
    time: "3–5 часов",
    elevation: "+590 м",
    rating: 4.5,
    reviews: 94,
    description:
      "Маршрут на Сукташ (1393 м) — северную вершину массива с характерными скальными останцами. Хорошо видна из деревни. Тропа уходит западнее КПП.",
    coords: [
      [54.5635, 58.8267], // Тюлюк
      [54.5595, 58.8255],
      [54.5550, 58.8240],
      [54.5505, 58.8228],
      [54.5460, 58.8218],
      [54.5415, 58.8213],
      [54.5375, 58.8213],
      [54.5342, 58.8215], // Сукташ
    ] as [number, number][],
    points: [
      { icon: "Droplets", label: "Родник «Сукташский»", color: "#7bb3d0", lat: 54.5505, lng: 58.8228 },
    ],
    summit: { lat: 54.5342, lng: 58.8215, label: "Сукташ 1393м" },
  },
  {
    id: 4,
    name: "Обзорная",
    color: "#c084fc",
    difficulty: "easy",
    difficultyLabel: "Лёгкая",
    length: "7.6 км",
    time: "3–4 часа",
    elevation: "+520 м",
    rating: 4.6,
    reviews: 156,
    description:
      "Видовая точка Обзорная (1320 м) на краю плато. Отличная панорама на весь Иремельский массив и долину Тюлюка. Маршрут для первого похода в парк.",
    coords: [
      [54.5635, 58.8267], // Тюлюк
      [54.5595, 58.8255],
      [54.5550, 58.8240],
      [54.5505, 58.8228],
      [54.5460, 58.8220],
      [54.5415, 58.8240],
      [54.5360, 58.8265],
      [54.5302, 58.8292], // Обзорная
    ] as [number, number][],
    points: [
      { icon: "Tent", label: "Место отдыха", color: "#2d8b3f", lat: 54.5415, lng: 58.8240 },
    ],
    summit: { lat: 54.5302, lng: 58.8292, label: "Обзорная 1320м" },
  },
  {
    id: 5,
    name: "Большой Синяк",
    color: "#e53e3e",
    difficulty: "hard",
    difficultyLabel: "Сложная",
    length: "17.8 км",
    time: "8–10 часов",
    elevation: "+820 м",
    rating: 4.7,
    reviews: 48,
    description:
      "Южный отрог Большого Иремеля. Малохоженая тропа через густой лес. Уходит от КПП на юго-запад. Требует навигатора и опыта ориентирования.",
    coords: [
      [54.5635, 58.8267], // Тюлюк
      [54.5580, 58.8272],
      [54.5530, 58.8278],
      [54.5463, 58.8284], // КПП
      [54.5415, 58.8305],
      [54.5360, 58.8350],
      [54.5300, 58.8375],
      [54.5248, 58.8400],
      [54.5197, 58.8424], // плато (мимо вершины Б.Иремель)
      [54.5155, 58.8360],
      [54.5110, 58.8295],
      [54.5078, 58.8208], // Большой Синяк
    ] as [number, number][],
    points: [
      { icon: "Shield", label: "КПП парка", color: "#b47535", lat: 54.5463, lng: 58.8284 },
      { icon: "Tent", label: "Стоянка «Синяк»", color: "#2d8b3f", lat: 54.5155, lng: 58.8360 },
    ],
    summit: { lat: 54.5078, lng: 58.8208, label: "Большой Синяк 1067м" },
  },
  {
    id: 6,
    name: "Жеребчик",
    color: "#f59e0b",
    difficulty: "medium",
    difficultyLabel: "Средняя",
    length: "10.6 км",
    time: "4–6 часов",
    elevation: "+450 м",
    rating: 4.8,
    reviews: 82,
    description:
      "Маршрут на Жеребчик (1183 м) — северо-западный отрог Иремельского массива. Тропа уходит из Тюлюка на запад. У вершины знаменитая деревянная скульптура «Золотая Баба».",
    coords: [
      [54.5635, 58.8267], // Тюлюк
      [54.5618, 58.8220],
      [54.5598, 58.8175],
      [54.5572, 58.8135],
      [54.5540, 58.8100],
      [54.5505, 58.8070],
      [54.5465, 58.8050],
      [54.5420, 58.8038],
      [54.5380, 58.8033],
      [54.5358, 58.8032], // Жеребчик
    ] as [number, number][],
    points: [
      { icon: "Tent", label: "«Золотая Баба» (скульптура)", color: "#b47535", lat: 54.5358, lng: 58.8032 },
      { icon: "Droplets", label: "Родник у хребта", color: "#7bb3d0", lat: 54.5540, lng: 58.8100 },
    ],
    summit: { lat: 54.5358, lng: 58.8032, label: "Жеребчик 1183м" },
  },
];

// ─── Иконки ────────────────────────────────────────────────────────────────────
function createPoiIcon(emoji: string, color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color}22;border:1.5px solid ${color};display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4);">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function createSummitIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:12px;color:white;font-weight:bold;box-shadow:0 0 12px ${color}88;border:2px solid white;cursor:pointer;">▲</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function createTyulyukIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;border-radius:50%;background:rgba(15,10,5,0.92);border:2px solid #ff7d0a;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 0 14px rgba(255,125,10,0.55);cursor:pointer;">🏠</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function createUserIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:20px;height:20px"><div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(255,125,10,0.2);animation:pulse-ring 1.8s ease-out infinite;"></div><div style="width:20px;height:20px;border-radius:50%;background:#ff7d0a;border:2.5px solid white;box-shadow:0 0 10px rgba(255,125,10,0.7);"></div></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// ─── Типы ──────────────────────────────────────────────────────────────────────
type Trail = typeof TRAILS_DATA[0];

interface Props {
  onTrailSelect: (trail: Trail | null) => void;
  selectedTrailId: number | null;
}

// ─── Компонент ─────────────────────────────────────────────────────────────────
export default function ParkMap({ onTrailSelect, selectedTrailId }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [54.540, 58.828],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      opacity: 0.94,
    }).addTo(map);

    L.control.attribution({ prefix: false, position: "bottomleft" })
      .addAttribution('<a href="https://opentopomap.org">OpenTopoMap</a>')
      .addTo(map);

    // Тюлюк
    const tyulyukMarker = L.marker(TYULYUK, { icon: createTyulyukIcon() }).addTo(map);
    tyulyukMarker.bindTooltip("д. Тюлюк — старт всех маршрутов", {
      direction: "right",
      offset: [18, 0],
      className: "park-tooltip",
    });

    // Тропы
    TRAILS_DATA.forEach((trail) => {
      const polyline = L.polyline(trail.coords, {
        color: trail.color,
        weight: 4,
        opacity: 0.88,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      polylinesRef.current.push(polyline);

      polyline.on("click", () => onTrailSelect(trail));
      polyline.on("mouseover", () => polyline.setStyle({ weight: 6, opacity: 1 }));
      polyline.on("mouseout", () => {
        const sel = trail.id === selectedTrailId;
        polyline.setStyle({ weight: sel ? 6 : 4, opacity: sel ? 1 : 0.88 });
      });

      // Вершина
      const summitMarker = L.marker([trail.summit.lat, trail.summit.lng], {
        icon: createSummitIcon(trail.color),
      }).addTo(map);
      summitMarker.on("click", () => onTrailSelect(trail));
      summitMarker.bindTooltip(trail.summit.label, {
        direction: "top",
        offset: [0, -16],
        className: "park-tooltip",
      });

      // Точки интереса
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

    // Пользователь — у Тюлюка
    L.marker([54.5645, 58.8275], { icon: createUserIcon() }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      polylinesRef.current = [];
    };
  }, []);

  // Подсветка выбранной тропы
  useEffect(() => {
    polylinesRef.current.forEach((pl, i) => {
      if (selectedTrailId === null) {
        pl.setStyle({ weight: 4, opacity: 0.88 });
      } else if (TRAILS_DATA[i]?.id === selectedTrailId) {
        pl.setStyle({ weight: 6, opacity: 1 });
        mapRef.current?.fitBounds(pl.getBounds(), { padding: [50, 50] });
      } else {
        pl.setStyle({ weight: 3, opacity: 0.28 });
      }
    });
  }, [selectedTrailId]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export { TRAILS_DATA };
export type { Trail };
