import { useState } from "react";
import Icon from "@/components/ui/icon";
import ParkMap, { TRAILS_DATA, type Trail } from "@/components/ParkMap";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "map" | "compass" | "weather" | "guide" | "profile";
type IconName = string;

// ─── Data ─────────────────────────────────────────────────────────────────────
const WEATHER_DAYS = [
  { day: "Сегодня", emoji: "☀️", temp: "+12°", night: "+4°", wind: "3 м/с", condition: "Ясно" },
  { day: "Чт", emoji: "⛅", temp: "+9°", night: "+2°", wind: "5 м/с", condition: "Облачно" },
  { day: "Пт", emoji: "☁️", temp: "+7°", night: "+1°", wind: "8 м/с", condition: "Пасмурно" },
  { day: "Сб", emoji: "🌧️", temp: "+5°", night: "-1°", wind: "12 м/с", condition: "Дождь" },
  { day: "Вс", emoji: "⛈️", temp: "+4°", night: "-2°", wind: "18 м/с", condition: "Гроза", warn: true },
];

const FLORA = [
  { name: "Арника горная", emoji: "🌼", type: "Растение — Красная книга", danger: false, desc: "Лекарственное растение с ярко-жёлтыми цветами. Занесена в Красную книгу. Не срывать!" },
  { name: "Волчье лыко", emoji: "🔴", type: "Ядовитое растение", danger: true, desc: "Очень ядовитый кустарник с красными ягодами. Категорически запрещено трогать и есть!" },
  { name: "Черника обыкновенная", emoji: "🫐", type: "Съедобная ягода", danger: false, desc: "Созревает в июле–августе. Растёт на верховых болотах и в хвойных лесах парка." },
  { name: "Бурый медведь", emoji: "🐻", type: "Животное — осторожно!", danger: true, desc: "Встречается в парке. При встрече — не убегать, говорить спокойно, отступать медленно." },
  { name: "Рысь", emoji: "🐱", type: "Животное", danger: false, desc: "Редкий обитатель парка. На людей не нападает. Наблюдение — большая удача для туриста." },
  { name: "Орёл-беркут", emoji: "🦅", type: "Птица — Красная книга", danger: false, desc: "Самый крупный хищник парка. Гнездится на скальных выступах. Символ Иремеля." },
];

const SURVIVAL = [
  {
    title: "Ориентирование без GPS",
    icon: "Compass",
    color: "#ff7d0a",
    tips: ["Солнце встаёт на востоке, садится на западе", "Мох на деревьях гуще растёт с северной стороны", "В 12:00 тень указывает строго на север", "Следуйте вниз по рекам"],
  },
  {
    title: "Поиск воды",
    icon: "Droplets",
    color: "#7bb3d0",
    tips: ["Ищите воду в низинах и оврагах", "Следуйте за животными — они знают источники", "Родники на карте отмечены синим", "Кипятите воду минимум 10 минут"],
  },
  {
    title: "Первая помощь",
    icon: "Heart",
    color: "#e53e3e",
    tips: ["При укусе клеща — извлечь инструментом, не давить", "Обморожение: согреть медленно, не тереть", "При потере — оставайтесь на месте, подайте сигнал", "Экстренный номер: 112"],
  },
  {
    title: "Разведение костра",
    icon: "Flame",
    color: "#b47535",
    tips: ["Только в специально отведённых местах на карте", "Отступите 5 м от деревьев и кустарников", "Имейте воду или песок для тушения рядом", "Заливайте угли до полного остывания"],
  },
];

const NOTES = [
  { id: 1, author: "Антон К.", date: "01 июн", trail: "Большой Иремель", text: "Родник работает! Вода чистая и очень холодная 🧊", likes: 12 },
  { id: 2, author: "Мария В.", date: "30 май", trail: "Малый Иремель", text: "Тропа после дождей скользкая, советую треккинговые палки!", likes: 8 },
  { id: 3, author: "Денис П.", date: "28 май", trail: "Тыгынский перевал", text: "На вершине встретили беркута! Зрелище невероятное 🦅", likes: 34 },
];

// ─── Map ───────────────────────────────────────────────────────────────────────
function MapView() {
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 overflow-hidden">
        {/* Real Leaflet map */}
        <ParkMap
          onTrailSelect={setSelectedTrail}
          selectedTrailId={selectedTrail?.id ?? null}
        />

        {/* Map header overlay */}
        <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between pointer-events-none z-[1000]">
          <div className="glass-card rounded-xl px-3 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-foreground/70">54.502°N · 58.845°E</span>
          </div>
          <div className="glass-card rounded-xl px-3 py-1.5">
            <span className="text-[10px] text-amber-400 font-display">1247 м</span>
          </div>
        </div>

        {/* Legend overlay */}
        <div className="absolute bottom-3 left-3 glass-card rounded-xl p-2.5 flex flex-col gap-1.5 z-[1000]">
          {TRAILS_DATA.map((t) => (
            <button key={t.id} onClick={() => setSelectedTrail(t === selectedTrail ? null : t)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <div className="w-5 h-1.5 rounded-full" style={{ background: t.color }} />
              <span className="text-[10px] text-foreground/75">{t.name}</span>
            </button>
          ))}
          <div className="border-t border-border/50 pt-1.5 flex flex-col gap-1">
            {[["💧", "Родник"], ["⛺", "Стоянка"], ["🛡️", "Егерь"]].map(([em, lbl]) => (
              <div key={lbl} className="flex items-center gap-2">
                <span className="text-[10px]">{em}</span>
                <span className="text-[9px] text-muted-foreground">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trail info panel */}
      {selectedTrail ? (
        <div className="animate-slide-in-bottom glass-card border-t border-border/60 rounded-t-2xl p-4 max-h-64 overflow-y-auto">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: selectedTrail.color }} />
                <h3 className="font-display text-base text-foreground">{selectedTrail.name}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-xs">★</span>
                <span className="text-xs text-foreground">{selectedTrail.rating}</span>
                <span className="text-[10px] text-muted-foreground">({selectedTrail.reviews} отзывов)</span>
                <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full text-white font-semibold"
                  style={{ background: selectedTrail.difficulty === "easy" ? "#2d8b3f" : selectedTrail.difficulty === "medium" ? "#ff7d0a" : "#e53e3e" }}>
                  {selectedTrail.difficultyLabel}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedTrail(null)} className="text-muted-foreground">
              <Icon name="X" size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[{ icon: "Route", value: selectedTrail.length, label: "Длина" }, { icon: "Clock", value: selectedTrail.time, label: "Время" }, { icon: "TrendingUp", value: selectedTrail.elevation, label: "Набор" }].map((s) => (
              <div key={s.label} className="bg-muted/30 rounded-xl p-2 text-center">
                <Icon name={s.icon as IconName} size={13} className="text-amber-400 mx-auto mb-1" />
                <div className="text-xs font-semibold text-foreground">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{selectedTrail.description}</p>

          <div className="flex flex-col gap-1.5 mb-3">
            {selectedTrail.points.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-foreground/75">
                <Icon name={p.icon as IconName} size={12} style={{ color: p.color }} />
                {p.label}
              </div>
            ))}
          </div>

          <button className="w-full py-2.5 rounded-xl font-display text-xs tracking-wider text-amber-400 border border-amber-500/40 flex items-center justify-center gap-2">
            <Icon name="PenLine" size={13} />
            ДОБАВИТЬ ЗАМЕТКУ
          </button>
        </div>
      ) : (
        <div className="glass-card border-t border-border/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={15} className="text-amber-400" />
            <span className="text-sm text-foreground/80">Природный парк Иремель</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Нажми на тропу →</span>
        </div>
      )}
    </div>
  );
}

// ─── Compass ───────────────────────────────────────────────────────────────────
function CompassView() {
  const [heading, setHeading] = useState(347);
  const [spinning, setSpinning] = useState(false);

  const calibrate = () => {
    setSpinning(true);
    setTimeout(() => {
      setHeading(Math.floor(Math.random() * 360));
      setSpinning(false);
    }, 1400);
  };

  const getDir = (d: number) => ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"][Math.round(d / 45) % 8];

  const cardinals = [
    { label: "С", angle: 0, color: "#e53e3e" },
    { label: "В", angle: 90, color: "#ff7d0a" },
    { label: "Ю", angle: 180, color: "#ff7d0a" },
    { label: "З", angle: 270, color: "#ff7d0a" },
  ];

  return (
    <div className="flex flex-col items-center justify-between h-full px-6 py-4">
      <div className="text-center">
        <h2 className="font-display text-2xl text-foreground tracking-widest">КОМПАС</h2>
        <p className="text-xs text-muted-foreground">Цифровой навигатор · Иремель</p>
      </div>

      {/* Rose */}
      <div className="relative flex items-center justify-center" style={{ width: 270, height: 270 }}>
        <div className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle at 50% 40%, rgba(180,117,53,0.1), transparent 70%), radial-gradient(circle, #0f1a0a, #060e05)", boxShadow: "0 0 50px rgba(45,139,63,0.2), 0 0 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.6)" }}>
        </div>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20" />
        <div className="absolute rounded-full border border-amber-500/10" style={{ inset: 12 }} />

        {/* Degree ticks */}
        <svg className="absolute inset-0" width="270" height="270" viewBox="0 0 270 270">
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = (i * 5 * Math.PI) / 180;
            const isMajor = i % 9 === 0;
            const r1 = 128, r2 = isMajor ? 114 : 121;
            return (
              <line key={i}
                x1={135 + r1 * Math.sin(angle)} y1={135 - r1 * Math.cos(angle)}
                x2={135 + r2 * Math.sin(angle)} y2={135 - r2 * Math.cos(angle)}
                stroke={isMajor ? "#ff7d0a" : "rgba(180,117,53,0.35)"} strokeWidth={isMajor ? 2 : 1}
              />
            );
          })}
        </svg>

        {/* Cardinal labels */}
        {cardinals.map(({ label, angle, color }) => {
          const rad = (angle * Math.PI) / 180, r = 94;
          return (
            <div key={label} className="absolute font-display text-sm font-bold"
              style={{ left: 135 + r * Math.sin(rad), top: 135 - r * Math.cos(rad), transform: "translate(-50%,-50%)", color }}>
              {label}
            </div>
          );
        })}

        {/* Needle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ transform: `rotate(${heading}deg)`, transition: spinning ? "none" : "transform 1s cubic-bezier(0.25,0.46,0.45,0.94)", width: 0, height: 160, position: "relative" }}
            className={spinning ? "compass-needle" : ""}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "80px solid #e53e3e" }} />
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "80px solid rgba(255,255,255,0.5)" }} />
          </div>
          <div className="absolute w-4 h-4 rounded-full bg-amber-500 border-2 border-background shadow-lg z-10" />
        </div>
      </div>

      {/* Data */}
      <div className="w-full flex flex-col gap-3">
        <div className="glass-card rounded-2xl py-4 flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="font-display text-4xl text-amber-400 leading-none">{heading}°</div>
            <div className="text-xs text-muted-foreground mt-1">азимут</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="font-display text-3xl text-foreground leading-none">{getDir(heading)}</div>
            <div className="text-xs text-muted-foreground mt-1">направление</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-muted-foreground mb-1">Координаты</div>
            <div className="text-xs font-semibold text-foreground">54.521°N</div>
            <div className="text-xs font-semibold text-foreground">58.847°E</div>
          </div>
          <div className="bg-muted/30 rounded-xl p-3 text-center">
            <div className="text-[10px] text-muted-foreground mb-1">Высота н.у.м.</div>
            <div className="font-display text-xl text-green-400">1 247</div>
            <div className="text-[10px] text-muted-foreground">метров</div>
          </div>
        </div>

        <button onClick={calibrate}
          className="w-full py-3 rounded-xl font-display text-sm tracking-wider text-white flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #2d8b3f, #185625)" }}>
          <Icon name="RefreshCw" size={15} />
          КАЛИБРОВКА
        </button>
      </div>
    </div>
  );
}

// ─── Weather ───────────────────────────────────────────────────────────────────
function WeatherView() {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {/* Warning */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(229,62,62,0.12)", border: "1px solid rgba(229,62,62,0.3)" }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Icon name="AlertTriangle" size={16} className="text-red-400" />
          </div>
          <div>
            <div className="font-display text-xs text-red-400 mb-1 tracking-wider">ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ</div>
            <p className="text-xs text-foreground/80 leading-relaxed">Воскресенье: гроза с усилением ветра до 18 м/с. Рекомендуем завершить маршрут до субботнего вечера.</p>
          </div>
        </div>
      </div>

      {/* Current */}
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(45,139,63,0.15), rgba(13,31,14,0.85))", border: "1px solid rgba(45,139,63,0.25)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1 font-display tracking-wider">СЕЙЧАС НА ВЕРШИНЕ</div>
            <div className="font-display text-6xl text-foreground leading-none">+12°</div>
            <div className="text-xs text-muted-foreground mt-2">Ясно · ощущается +8°</div>
          </div>
          <div style={{ fontSize: 72 }}>☀️</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{ icon: "Wind", label: "Ветер", value: "3 м/с" }, { icon: "Droplets", label: "Влажность", value: "62%" }, { icon: "Eye", label: "Видимость", value: "18 км" }].map((w) => (
            <div key={w.label} className="bg-black/20 rounded-xl p-2 text-center">
              <Icon name={w.icon as IconName} size={14} className="text-amber-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-foreground">{w.value}</div>
              <div className="text-[10px] text-muted-foreground">{w.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-day */}
      <div>
        <h3 className="font-display text-xs text-muted-foreground mb-2 tracking-widest">ПРОГНОЗ НА 5 ДНЕЙ</h3>
        <div className="flex flex-col gap-2">
          {WEATHER_DAYS.map((d, i) => (
            <div key={i} className="rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: d.warn ? "rgba(229,62,62,0.08)" : "linear-gradient(145deg, hsl(30 18% 14%), hsl(30 15% 11%))", border: d.warn ? "1px solid rgba(229,62,62,0.35)" : "1px solid hsl(30 15% 22%)" }}>
              <span className="text-sm font-display text-foreground w-16">{d.day}</span>
              <span style={{ fontSize: 20 }}>{d.emoji}</span>
              <span className="text-xs text-muted-foreground flex-1 text-center">{d.condition}{d.warn ? " ⚠️" : ""}</span>
              <div className="text-right">
                <span className="text-sm font-semibold text-foreground">{d.temp}</span>
                <span className="text-xs text-muted-foreground ml-1">{d.night}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/20 rounded-xl p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1 font-display">ВОСХОД / ЗАКАТ</div>
          <div className="text-sm font-semibold text-amber-400">05:12 / 21:47</div>
        </div>
        <div className="bg-muted/20 rounded-xl p-3 text-center">
          <div className="text-[10px] text-muted-foreground mb-1 font-display">УФ-ИНДЕКС</div>
          <div className="text-sm font-semibold text-green-400">3 — Умеренный</div>
        </div>
      </div>
    </div>
  );
}

// ─── Guide ─────────────────────────────────────────────────────────────────────
function GuideView() {
  const [tab, setTab] = useState<"flora" | "survival">("flora");
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-4 pb-3">
        {(["flora", "survival"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setExpanded(null); }}
            className="flex-1 py-2.5 rounded-xl font-display text-xs tracking-wider transition-all"
            style={tab === t ? { background: "linear-gradient(135deg, #2d8b3f, #185625)", color: "white" } : { background: "rgba(30,20,10,0.6)", color: "rgba(200,180,150,0.6)", border: "1px solid rgba(180,117,53,0.15)" }}>
            {t === "flora" ? "🌿 ФЛОРА И ФАУНА" : "🏕️ ВЫЖИВАНИЕ"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2.5">
        {tab === "flora" ? (
          FLORA.map((item, i) => (
            <button key={i} onClick={() => setExpanded(expanded === i ? null : i)}
              className="text-left rounded-2xl p-4 transition-all w-full"
              style={{ background: item.danger ? "rgba(229,62,62,0.09)" : "linear-gradient(145deg, hsl(30 18% 14%), hsl(30 15% 11%))", border: item.danger ? "1px solid rgba(229,62,62,0.3)" : "1px solid hsl(30 15% 22%)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 32 }}>{item.emoji}</span>
                  <div>
                    <div className="font-display text-sm text-foreground">{item.name}</div>
                    <div className={`text-[10px] mt-0.5 ${item.danger ? "text-red-400" : "text-muted-foreground"}`}>{item.type}</div>
                  </div>
                </div>
                <Icon name={expanded === i ? "ChevronUp" : "ChevronDown"} size={15} className="text-muted-foreground flex-shrink-0" />
              </div>
              {expanded === i && (
                <p className="text-xs text-foreground/80 mt-3 leading-relaxed border-t border-border/40 pt-3">{item.desc}</p>
              )}
            </button>
          ))
        ) : (
          SURVIVAL.map((item, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "linear-gradient(145deg, hsl(30 18% 14%), hsl(30 15% 11%))", border: "1px solid hsl(30 15% 22%)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20` }}>
                  <Icon name={item.icon as IconName} size={18} style={{ color: item.color }} />
                </div>
                <h3 className="font-display text-sm text-foreground">{item.title}</h3>
              </div>
              {item.tips.map((tip, j) => (
                <div key={j} className="flex items-start gap-2 text-xs text-foreground/80 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: item.color }} />
                  {tip}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Profile ───────────────────────────────────────────────────────────────────
function ProfileView() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 gap-5">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
            style={{ background: "linear-gradient(135deg, #2d8b3f, #ff7d0a)" }}>
            🏔️
          </div>
          <h2 className="font-display text-2xl text-foreground tracking-widest">ИРЕМЕЛЬ</h2>
          <p className="text-sm text-muted-foreground mt-1">Войдите, чтобы сохранять маршруты и заметки</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input type="email" placeholder="Email или телефон" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50" />
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50" />
          <button onClick={() => setLoggedIn(true)}
            className="w-full py-3.5 rounded-xl font-display text-sm tracking-wider text-white"
            style={{ background: "linear-gradient(135deg, #ff7d0a, #c46000)" }}>
            ВОЙТИ В ПАРК
          </button>
          <button className="w-full py-3 rounded-xl font-display text-sm tracking-wider border border-green-700/50 text-green-400">
            СОЗДАТЬ АККАУНТ
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">Продолжая, вы принимаете условия использования приложения</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(45,139,63,0.18), transparent)" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 text-4xl" style={{ background: "linear-gradient(135deg, #185625, #0d3115)" }}>🏔️</div>
        <h2 className="font-display text-xl text-foreground">АЛЕКСЕЙ ПЕТРОВ</h2>
        <p className="text-xs text-muted-foreground">alex.petrov@gmail.com</p>
        <div className="flex gap-6 mt-4">
          {[{ v: "5", l: "Маршрутов" }, { v: "23", l: "Заметок" }, { v: "3", l: "Бейджа" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-2xl text-amber-400">{s.v}</div>
              <div className="text-[10px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4">
        <div>
          <h3 className="font-display text-[10px] text-muted-foreground mb-2 tracking-widest">МОИ МАРШРУТЫ</h3>
          {["Большой Иремель — 14.2 км", "Малый Иремель — 9.5 км"].map((r, i) => (
            <div key={i} className="rounded-xl px-4 py-3 mb-2 flex items-center justify-between" style={{ background: "linear-gradient(145deg, hsl(30 18% 14%), hsl(30 15% 11%))", border: "1px solid hsl(30 15% 22%)" }}>
              <div className="flex items-center gap-2">
                <Icon name="Route" size={14} className="text-amber-400" />
                <span className="text-sm text-foreground">{r}</span>
              </div>
              <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-display text-[10px] text-muted-foreground mb-2 tracking-widest">МОИ ЗАМЕТКИ</h3>
          {NOTES.slice(0, 2).map((n) => (
            <div key={n.id} className="rounded-xl px-4 py-3 mb-2" style={{ background: "linear-gradient(145deg, hsl(30 18% 14%), hsl(30 15% 11%))", border: "1px solid hsl(30 15% 22%)" }}>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-amber-400 font-display tracking-wide">{n.trail}</span>
                <span className="text-[10px] text-muted-foreground">{n.date}</span>
              </div>
              <p className="text-xs text-foreground/80">{n.text}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-display text-[10px] text-muted-foreground mb-2 tracking-widest">НАСТРОЙКИ</h3>
          {[
            { icon: "Bell", label: "Уведомления о погоде", on: true },
            { icon: "WifiOff", label: "Оффлайн-режим", on: true },
            { icon: "MapPin", label: "Автообновление GPS", on: false },
          ].map((s, i) => (
            <div key={i} className="rounded-xl px-4 py-3 mb-2 flex items-center justify-between" style={{ background: "linear-gradient(145deg, hsl(30 18% 14%), hsl(30 15% 11%))", border: "1px solid hsl(30 15% 22%)" }}>
              <div className="flex items-center gap-3">
                <Icon name={s.icon as IconName} size={15} className="text-amber-400" />
                <span className="text-sm text-foreground">{s.label}</span>
              </div>
              <div className="w-10 h-5 rounded-full flex items-center" style={{ background: s.on ? "#2d8b3f" : "hsl(30 15% 25%)", padding: 2 }}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-all" style={{ transform: s.on ? "translateX(20px)" : "translateX(0)" }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setLoggedIn(false)}
          className="w-full py-3 rounded-xl font-display text-xs tracking-wider border border-border text-muted-foreground">
          ВЫЙТИ ИЗ АККАУНТА
        </button>
      </div>
    </div>
  );
}

// ─── Navigation items ──────────────────────────────────────────────────────────
const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: "map", icon: "Map", label: "Карта" },
  { id: "compass", icon: "Compass", label: "Компас" },
  { id: "weather", icon: "CloudSun", label: "Погода" },
  { id: "guide", icon: "BookOpen", label: "Гид" },
  { id: "profile", icon: "User", label: "Профиль" },
];

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const [tab, setTab] = useState<Tab>("map");

  const content = {
    map: <MapView />,
    compass: <CompassView />,
    weather: <WeatherView />,
    guide: <GuideView />,
    profile: <ProfileView />,
  }[tab];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 flex-shrink-0" style={{ background: "rgba(0,0,0,0.4)" }}>
        <span className="font-display text-[10px] text-amber-400 tracking-widest">ИРЕМЕЛЬ · ПРИРОДНЫЙ ПАРК</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-foreground/50">GPS</span>
          <Icon name="Battery" size={11} className="text-foreground/50" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">{content}</div>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 flex items-stretch"
        style={{ background: "linear-gradient(0deg, rgba(8,6,3,0.98), rgba(18,12,5,0.95))", borderTop: "1px solid rgba(180,117,53,0.18)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {NAV.map((item) => {
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => setTab(item.id)} className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={active ? { background: "rgba(255,125,10,0.15)" } : {}}>
                <Icon name={item.icon as IconName} size={19} style={{ color: active ? "#ff7d0a" : "rgba(180,150,110,0.45)" }} />
              </div>
              <span className="text-[9px] font-display tracking-wide" style={{ color: active ? "#ff7d0a" : "rgba(180,150,110,0.45)" }}>
                {item.label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}