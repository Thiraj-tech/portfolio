"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiClock, FiX } from "react-icons/fi";
import { hoverLift, springy, tapScale } from "./motionPresets";

const weatherLabels: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  80: "Rain Showers",
  81: "Rain Showers",
  82: "Heavy Showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

// Kalutara, Sri Lanka — matches the location on the CV.
const LOCATION = { latitude: 6.5854, longitude: 79.9607 };

type Condition = "clear" | "partly-cloudy" | "cloudy" | "rain";

// Buckets Open-Meteo's WMO weathercodes into which icon pieces to show.
// Thunderstorm (95-99) is folded into "rain" rather than getting its own
// bolt graphic — a reasonable stand-in for a fairly rare code here.
function conditionFor(code: number): Condition {
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partly-cloudy";
  if (code === 3 || code === 45 || code === 48) return "cloudy";
  return "rain";
}

type Weather = { temperature: number; label: string; condition: Condition };

export default function LocalTimeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isOverDark, setIsOverDark] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const condition = weather?.condition ?? "partly-cloudy";

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&current_weather=true`,
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((data) => {
        const temperature = data?.current_weather?.temperature;
        const code = data?.current_weather?.weathercode;
        if (typeof temperature === "number") {
          setWeather({
            temperature,
            label: weatherLabels[code] ?? "—",
            condition: conditionFor(code),
          });
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // The widget floats over every section. Several (Projects, Testimonials,
  // Contact) use bg-ink, so instead of hardcoding those IDs — and having to
  // remember to update this if another dark section gets added — check
  // every <section class="bg-ink"> element for overlap with the widget.
  useEffect(() => {
    let ticking = false;
    // Re-queried on every check rather than looked up once: Projects
    // renders null until its Supabase fetch resolves, so dark sections
    // may not all exist in the DOM yet when this effect first runs.
    const checkOverlap = () => {
      ticking = false;
      const darkSections = document.querySelectorAll("section.bg-ink");
      const widgetY = window.innerHeight - 60;
      const overDark = Array.from(darkSections).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= widgetY && rect.bottom >= widgetY;
      });
      setIsOverDark(overDark);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkOverlap);
    };

    checkOverlap();
    // Catches the case where a dark section mounts asynchronously after
    // the user has already scrolled to that position, with no further
    // scroll event to trigger a re-check.
    const lateCheck = setTimeout(checkOverlap, 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(lateCheck);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed right-6 bottom-6 z-40 flex flex-col items-end"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={springy}
            className={`mb-3 w-64 rounded-3xl p-6 shadow-xl transition-colors duration-300 ${
              isOverDark ? "bg-cream-card text-ink" : "bg-ink text-cream"
            }`}
          >
            <svg
              viewBox="0 0 64 64"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 scale-110"
              aria-hidden
            >
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  y2="28.33"
                  y1="19.67"
                  x2="21.5"
                  x1="16.5"
                  id="my-time-b"
                >
                  <stop stopColor="#fbbf24" offset="0" />
                  <stop stopColor="#fbbf24" offset=".45" />
                  <stop stopColor="#f59e0b" offset="1" />
                </linearGradient>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  y2="50.8"
                  y1="21.96"
                  x2="39.2"
                  x1="22.56"
                  id="my-time-c"
                >
                  <stop stopColor="#f3f7fe" offset="0" />
                  <stop stopColor="#f3f7fe" offset=".45" />
                  <stop stopColor="#deeafb" offset="1" />
                </linearGradient>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  y2="48.05"
                  y1="42.95"
                  x2="25.47"
                  x1="22.53"
                  id="my-time-a"
                >
                  <stop stopColor="#4286ee" offset="0" />
                  <stop stopColor="#4286ee" offset=".45" />
                  <stop stopColor="#0950bc" offset="1" />
                </linearGradient>
                <linearGradient
                  xlinkHref="#my-time-a"
                  y2="48.05"
                  y1="42.95"
                  x2="32.47"
                  x1="29.53"
                  id="my-time-d"
                />
                <linearGradient
                  xlinkHref="#my-time-a"
                  y2="48.05"
                  y1="42.95"
                  x2="39.47"
                  x1="36.53"
                  id="my-time-e"
                />
              </defs>
              {(condition === "clear" || condition === "partly-cloudy") && (
                <>
                  <circle
                    strokeWidth=".5"
                    strokeMiterlimit="10"
                    stroke="#f8af18"
                    fill="url(#my-time-b)"
                    r="5"
                    cy="24"
                    cx="19"
                  />
                  <path
                    d="M19 15.67V12.5m0 23v-3.17m5.89-14.22l2.24-2.24M10.87 32.13l2.24-2.24m0-11.78l-2.24-2.24m16.26 16.26l-2.24-2.24M7.5 24h3.17m19.83 0h-3.17"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    stroke="#fbbf24"
                    fill="none"
                  >
                    <animateTransform
                      values="0 19 24; 360 19 24"
                      type="rotate"
                      repeatCount="indefinite"
                      dur="45s"
                      attributeName="transform"
                    />
                  </path>
                </>
              )}
              {condition !== "clear" && (
                <path
                  d="M46.5 31.5h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0h28a7 7 0 000-14z"
                  strokeWidth=".5"
                  strokeMiterlimit="10"
                  stroke="#e6effc"
                  fill="url(#my-time-c)"
                />
              )}
              {condition === "rain" && (
                <>
                  <path
                    d="M24.39 43.03l-.78 4.94"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    stroke="url(#my-time-a)"
                    fill="none"
                  >
                    <animateTransform
                      values="1 -5; -2 10"
                      type="translate"
                      repeatCount="indefinite"
                      dur="0.7s"
                      attributeName="transform"
                    />
                  </path>
                  <path
                    d="M31.39 43.03l-.78 4.94"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    stroke="url(#my-time-d)"
                    fill="none"
                  >
                    <animateTransform
                      values="1 -5; -2 10"
                      type="translate"
                      repeatCount="indefinite"
                      dur="0.7s"
                      begin="-0.4s"
                      attributeName="transform"
                    />
                  </path>
                  <path
                    d="M38.39 43.03l-.78 4.94"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    stroke="url(#my-time-e)"
                    fill="none"
                  >
                    <animateTransform
                      values="1 -5; -2 10"
                      type="translate"
                      repeatCount="indefinite"
                      dur="0.7s"
                      begin="-0.2s"
                      attributeName="transform"
                    />
                  </path>
                </>
              )}
            </svg>

            <p className="font-display mt-2 text-5xl font-bold text-yellow">
              {time ?? "--:--"}
            </p>
            <p
              className={`mt-1 font-mono text-xs tracking-widest uppercase ${
                isOverDark ? "text-ink-muted" : "text-cream/60"
              }`}
            >
              Sri Lanka Time (GMT+5:30)
            </p>
            {weather && (
              <p
                className={`mt-4 text-sm ${isOverDark ? "text-ink-muted" : "text-cream/70"}`}
              >
                {Math.round(weather.temperature)}°C · {weather.label}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        whileHover={hoverLift}
        whileTap={tapScale}
        transition={springy}
        aria-expanded={isOpen}
        aria-label={
          isOpen ? "Close current time in Sri Lanka" : "Show current time in Sri Lanka"
        }
        className={`group flex items-center gap-0 overflow-hidden rounded-full bg-yellow px-3 py-3 font-mono text-xs tracking-widest text-ink uppercase shadow-lg transition-all duration-300 ${
          isOpen ? "" : "hover:gap-2 hover:px-4"
        }`}
      >
        {isOpen ? (
          <FiX className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <>
            <FiClock className="h-4 w-4 shrink-0" aria-hidden />
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:opacity-100">
              My Time
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}
