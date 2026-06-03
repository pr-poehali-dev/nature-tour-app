import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Деревня Тюлюк — начало всех маршрутов
// Координаты вершин взяты с топографических карт района
const TYULYUK: [number, number] = [54.4828, 58.7642];

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
      "Главный маршрут парка — от деревни Тюлюк до высшей точки Южного Урала (1582 м). Через еловый лес, субальпийские луга и курумники. Вид с вершины охватывает сотни километров.",
    // Тюлюк → лесная дорога → поляна Тыгын → плато → вершина Большой Иремель
    coords: [
      [54.4828, 58.7642], // Тюлюк
      [54.4890, 58.7710],
      [54.4960, 58.7770],
      [54.5030, 58.7820],
      [54.5100, 58.7860], // поляна Тыгын (стоянка)
      [54.5170, 58.7890],
      [54.5240, 58.7910],
      [54.5310, 58.7920],
      [54.5370, 58.7910],
      [54.5420, 58.7880], // Большой Иремель
    ] as [number, number][],
    points: [
      { icon: "Shield", label: "Кордон егерей", color: "#b47535", lat: 54.4920, lng: 58.7740 },
      { icon: "Droplets", label: "Родник «Тыгын»", color: "#7bb3d0", lat: 54.5070, lng: 58.7845 },
      { icon: "Tent", label: "Стоянка «Поляна Тыгын»", color: "#2d8b3f", lat: 54.5100, lng: 58.7860 },
    ],
    summit: { lat: 54.5420, lng: 58.7880, label: "Бол. Иремель 1582м" },
  },
  {
    id: 2,
    name: "Малый Иремель",
    color: "#4da85e",
    difficulty: "easy",
    difficultyLabel: "Лёгкая",
    length: "10.8 км",
    time: "4–6 часов",
    elevation: "+640 м",
    rating: 4.6,
    reviews: 198,
    description:
      "Маршрут от Тюлюка до вершины Малый Иремель (1449 м). Проходит через тот же кордон, затем уходит правее Большого Иремеля. Отличный вариант для начинающих туристов.",
    // Тюлюк → кордон → развилка → Малый Иремель (восточнее Большого)
    coords: [
      [54.4828, 58.7642], // Тюлюк
      [54.4890, 58.7710],
      [54.4960, 58.7770],
      [54.5030, 58.7820],
      [54.5080, 58.7850], // развилка
      [54.5120, 58.7900],
      [54.5160, 58.7960],
      [54.5185, 58.8020],
      [54.5195, 58.8080], // Малый Иремель
    ] as [number, number][],
    points: [
      { icon: "Shield", label: "Кордон егерей", color: "#b47535", lat: 54.4920, lng: 58.7740 },
      { icon: "Droplets", label: "Родник у развилки", color: "#7bb3d0", lat: 54.5080, lng: 58.7855 },
    ],
    summit: { lat: 54.5195, lng: 58.8080, label: "Мал. Иремель 1449м" },
  },
  {
    id: 3,
    name: "Сукташ",
    color: "#7bb3d0",
    difficulty: "easy",
    difficultyLabel: "Лёгкая",
    length: "8.4 км",
    time: "3–4 часа",
    elevation: "+490 м",
    rating: 4.4,
    reviews: 87,
    description:
      "Короткий и живописный маршрут на гору Сукташ (1393 м) — северо-западный отрог Иремельского массива. Хорошие виды на Тюлюк и долину реки Тюлюк.",
    // Тюлюк → на север-запад → Сукташ
    coords: [
      [54.4828, 58.7642], // Тюлюк
      [54.4870, 58.7580],
      [54.4920, 58.7520],
      [54.4975, 58.7465],
      [54.5030, 58.7420],
      [54.5080, 58.7390],
      [54.5120, 58.7370], // Сукташ
    ] as [number, number][],
    points: [
      { icon: "Droplets", label: "Родник «Северный»", color: "#7bb3d0", lat: 54.4975, lng: 58.7460 },
    ],
    summit: { lat: 54.5120, lng: 58.7370, label: "Сукташ 1393м" },
  },
  {
    id: 4,
    name: "Обзорная",
    color: "#c084fc",
    difficulty: "easy",
    difficultyLabel: "Лёгкая",
    length: "5.6 км",
    time: "2–3 часа",
    elevation: "+310 м",
    rating: 4.5,
    reviews: 143,
    description:
      "Самый простой маршрут парка — на гору Обзорная (1102 м) прямо из Тюлюка. Панорамная точка над деревней, отличный вид на весь Иремельский массив. Подходит для детей.",
    // Тюлюк → на восток → Обзорная
    coords: [
      [54.4828, 58.7642], // Тюлюк
      [54.4810, 58.7700],
      [54.4800, 58.7760],
      [54.4795, 58.7830],
      [54.4793, 58.7880], // Обзорная
    ] as [number, number][],
    points: [
      { icon: "Tent", label: "Место для пикника", color: "#2d8b3f", lat: 54.4800, lng: 58.7770 },
    ],
    summit: { lat: 54.4793, lng: 58.7880, label: "Обзорная 1102м" },
  },
  {
    id: 5,
    name: "Большой Синяк",
    color: "#e53e3e",
    difficulty: "hard",
    difficultyLabel: "Сложная",
    length: "18.5 км",
    time: "8–10 часов",
    elevation: "+780 м",
    rating: 4.8,
    reviews: 54,
    description:
      "Протяжённый маршрут на хребет Большой Синяк (1388 м) — северный отрог массива. Проходит через густой лес и курумники. Тропа менее хоженая, требует навигационного опыта.",
    // Тюлюк → на север → хребет Большой Синяк
    coords: [
      [54.4828, 58.7642], // Тюлюк
      [54.4900, 58.7650],
      [54.4980, 58.7640],
      [54.5060, 58.7620],
      [54.5140, 58.7600],
      [54.5220, 58.7580],
      [54.5300, 58.7555],
      [54.5370, 58.7535],
      [54.5430, 58.7520], // Большой Синяк
    ] as [number, number][],
    points: [
      { icon: "Droplets", label: "Родник «Синяк»", color: "#7bb3d0", lat: 54.5140, lng: 58.7600 },
      { icon: "Tent", label: "Биваковая зона", color: "#2d8b3f", lat: 54.5220, lng: 58.7580 },
    ],
    summit: { lat: 54.5430, lng: 58.7520, label: "Бол. Синяк 1388м" },
  },
  {
    id: 6,
    name: "Жеребчик",
    color: "#f59e0b",
    difficulty: "medium",
    difficultyLabel: "Средняя",
    length: "12.6 км",
    time: "5–7 часов",
    elevation: "+540 м",
    rating: 4.7,
    reviews: 76,
    description:
      "Маршрут на гору Жеребчик (1253 м) — южный склон Иремельского массива. Уходит из Тюлюка на юго-восток вдоль реки Тюлюк. Красивые скальные выходы и редкий лес.",
    // Тюлюк → вдоль реки на юго-восток → Жеребчик
    coords: [
      [54.4828, 58.7642], // Тюлюк
      [54.4780, 58.7700],
      [54.4730, 58.7760],
      [54.4690, 58.7820],
      [54.4660, 58.7890],
      [54.4645, 58.7960],
      [54.4638, 58.8030],
      [54.4640, 58.8090], // Жеребчик
    ] as [number, number][],
    points: [
      { icon: "Droplets", label: "Родник у реки", color: "#7bb3d0", lat: 54.4730, lng: 58.7755 },
      { icon: "Tent", label: "Стоянка «Речная»", color: "#2d8b3f", lat: 54.4690, lng: 58.7820 },
    ],
    summit: { lat: 54.4640, lng: 58.8090, label: "Жеребчик 1253м" },
  },
];

// Деревня Тюлюк — иконка стартовой точки
const TYULYUK_MARKER: [number, number] = TYULYUK;

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
      cursor:pointer;
    ">▲</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function createTyulyukIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      display:flex;flex-direction:column;align-items:center;gap:2px;
    ">
      <div style="
        width:32px;height:32px;border-radius:50%;
        background:rgba(20,13,6,0.9);
        border:2px solid #ff7d0a;
        display:flex;align-items:center;justify-content:center;
        font-size:16px;
        box-shadow:0 0 12px rgba(255,125,10,0.5);
      ">🏠</div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
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

    // Центр карты — Тюлюк, зум чтобы видны все тропы
    const map = L.map(containerRef.current, {
      center: [54.505, 58.776],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    // OpenTopoMap — топографическая карта с рельефом
    L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      opacity: 0.93,
    }).addTo(map);

    L.control.attribution({ prefix: false, position: "bottomleft" })
      .addAttribution('<a href="https://opentopomap.org">OpenTopoMap</a>')
      .addTo(map);

    // Деревня Тюлюк
    const tyulyukMarker = L.marker(TYULYUK_MARKER, { icon: createTyulyukIcon() }).addTo(map);
    tyulyukMarker.bindTooltip("д. Тюлюк — старт маршрутов", {
      direction: "right",
      offset: [18, 0],
      className: "park-tooltip",
      permanent: false,
    });

    // Тропы
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
      polyline.on("mouseover", () => polyline.setStyle({ weight: 6, opacity: 1 }));
      polyline.on("mouseout", () => {
        const isSelected = trail.id === selectedTrailId;
        polyline.setStyle({ weight: isSelected ? 6 : 4, opacity: isSelected ? 1 : 0.9 });
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

      // POI
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

    // Текущее положение пользователя (около Тюлюка)
    L.marker([54.4845, 58.7660], { icon: createUserIcon() }).addTo(map);

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
        pl.setStyle({ weight: 4, opacity: 0.9 });
      } else if (TRAILS_DATA[i]?.id === selectedTrailId) {
        pl.setStyle({ weight: 6, opacity: 1 });
        mapRef.current?.fitBounds(pl.getBounds(), { padding: [50, 50] });
      } else {
        pl.setStyle({ weight: 3, opacity: 0.35 });
      }
    });
  }, [selectedTrailId]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export { TRAILS_DATA };
export type { Trail };
