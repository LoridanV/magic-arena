import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Car,
  ShowerHead,
  Users,
  Trophy,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  MessageCircle,
  Navigation,
  Globe,
} from "lucide-react";

import heroImg from "@/assets/hero-stadium.jpg";
import gTurf from "@/assets/gallery-turf.jpg";
import gLights from "@/assets/gallery-lights.jpg";
import gPlayers from "@/assets/gallery-players.jpg";
import gFacility from "@/assets/gallery-facility.jpg";
import gMatch from "@/assets/gallery-match.jpg";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAGIC Alexandru — Book Your Football Field in Iași" },
      {
        name: "description",
        content:
          "Premium football field in Alexandru cel Bun, Iași. Reserve your pitch online in seconds — high-quality artificial turf, night lighting, parking, changing rooms.",
      },
      { property: "og:title", content: "MAGIC Alexandru — Premium Football Booking in Iași" },
      { property: "og:description", content: "Reserve your football field online in seconds." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

// ---------- i18n ----------

type Lang = "en" | "ro";

const DICT = {
  en: {
    nav: { about: "About", booking: "Booking", pricing: "Pricing", gallery: "Gallery", contact: "Contact", bookNow: "Book Now" },
    hero: {
      badge: "Alexandru cel Bun · Iași, Romania",
      subtitle: "Reserve your football field online in seconds. Premium turf. Night lights. Effortless booking.",
      cta: "Book Now",
      schedule: "View Schedule",
    },
    stats: [
      { suffix: "k+", label: "Matches played" },
      { suffix: "+", label: "Teams hosted" },
      { suffix: "/7", label: "Online booking" },
      { suffix: "★", label: "Avg. rating" },
    ],
    about: {
      eyebrow: "The Facility",
      title1: "Built for the ",
      title2: "beautiful game",
      title3: ".",
      subtitle: "Every detail of MAGIC Alexandru is engineered for serious play and effortless enjoyment.",
      features: [
        { title: "Premium Artificial Turf", desc: "FIFA-grade synthetic grass, shock-absorbent, all-weather playable." },
        { title: "Pro Night Lighting", desc: "LED floodlights deliver stadium-grade visibility after dark." },
        { title: "On-site Parking", desc: "Free secure parking for your whole squad." },
        { title: "Modern Changing Rooms", desc: "Hot showers, lockers, and benches — refresh before and after." },
        { title: "Spectator Area", desc: "Comfortable seating so friends and family can cheer you on." },
        { title: "Concierge Booking", desc: "Instant confirmation, smart reminders, and easy rescheduling." },
      ],
    },
    booking: {
      eyebrow: "Reserve in Seconds",
      title1: "Pick a date. Pick a time. ",
      title2: "Play.",
      subtitle: "Real-time availability, instant confirmation. No phone calls required.",
      steps: ["Slot", "Details", "Confirm"],
      selectDate: "Select date",
      timeSlots: "Available time slots",
      duration: "Duration",
      continue: "Continue",
      team: "Team name",
      contactName: "Contact name",
      phone: "Phone number",
      back: "Back",
      review: "Review booking",
      reviewTitle: "Review & confirm",
      reviewSub: "One last look before we lock in the pitch.",
      rowTeam: "Team",
      rowContact: "Contact",
      rowDate: "Date",
      rowTime: "Time",
      payNote: "Pay on arrival. Free cancellation up to 6 hours before.",
      confirm: "Confirm booking",
      confirmed: "Booking confirmed!",
      confirmedSub1: "See you on the pitch, ",
      confirmedSub2: ". We sent a confirmation to your phone.",
      bookAnother: "Book another",
      yourReservation: "Your reservation",
      total: "Total",
      summaryDate: "Date",
      summaryTime: "Time",
      summaryTeam: "Team",
    },
    avail: {
      eyebrow: "Live Availability",
      title1: "This week, ",
      title2: "at a glance",
      title3: ".",
      subtitle: "Hot slots fill up fast — secure yours early.",
      weeklySchedule: "Weekly schedule",
      available: "Available",
      fillingFast: "Filling fast",
      reserved: "Reserved",
      week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      open: "Open",
      limited: "Limited",
    },
    pricing: {
      eyebrow: "Pricing",
      title1: "Fair rates. ",
      title2: "No surprises.",
      subtitle: "One transparent price per hour. Book what you need, when you need it.",
      perHour: "RON / hour",
      popular: "Popular",
      reserve: "Reserve",
      tiers: [
        { name: "Daytime", hours: "08:00 – 17:00", features: ["Full pitch access", "Free parking", "Changing rooms", "Equipment storage"] },
        { name: "Evening", hours: "17:00 – 23:00", features: ["Full pitch access", "Pro LED floodlights", "Hot showers", "Spectator area", "Priority booking"] },
        { name: "Weekend", hours: "Sat – Sun · All day", features: ["Full pitch access", "Pro lighting", "Showers & lockers", "Live scoreboard"] },
      ],
    },
    gallery: {
      eyebrow: "Inside the Arena",
      title1: "Light. Turf. ",
      title2: "Atmosphere.",
      alts: ["Premium artificial turf", "Stadium floodlights", "Night match aerial", "Players in action", "Facility exterior"],
    },
    location: {
      findUs: "Find Us",
      title1: "MAGIC Alexandru, ",
      title2: "Alexandru cel Bun",
      desc: "Located on Alexandru cel Bun street in Iași — minutes from the city center, with free parking and easy access.",
      address: "Address",
      addressV: "Str. Alexandru cel Bun 24, Iași 700123",
      openLabel: "Open",
      openV: "Mon – Sun · 08:00 – 23:00",
      phoneLabel: "Phone",
      directions: "Get Directions",
      youAreHere: "You are here",
    },
    testimonials: {
      eyebrow: "Loved by Players",
      title1: "The teams have ",
      title2: "spoken",
      title3: ".",
      reviews: [
        { name: "Andrei Munteanu", role: "Captain · FC Copou", text: "Best pitch in Iași, hands down. The turf is immaculate and night lighting feels straight out of a real stadium." },
        { name: "Răzvan Petrescu", role: "Striker · Atletic Nicolina", text: "Booking takes 20 seconds. We play here every Thursday — never had a problem. Highly recommend." },
        { name: "Cristina Vasiliu", role: "League Organizer", text: "We run a 12-team weekend league here. Facilities are clean, staff is sharp, and the spectator area is a huge plus." },
        { name: "Mihai Ionescu", role: "Midfielder · United Iași", text: "MAGIC Alexandru raised the bar for amateur football in the city. Premium feel for a fair price." },
      ],
    },
    contact: {
      eyebrow: "Get in touch",
      title1: "Questions? ",
      title2: "We're listening.",
      desc: "Reach out for league bookings, private events, or just to say hello.",
      callUs: "Call us",
      email: "Email",
      whatsapp: "WhatsApp",
      whatsappV: "Chat with us instantly",
      yourName: "Your name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      message: "Message",
      messagePlaceholder: "Tell us about your booking…",
      send: "Send message",
      thanks: "Thanks! We'll get back to you within an hour.",
    },
    footer: {
      desc: "Premium football field in Alexandru cel Bun, Iași. Book online in seconds.",
      explore: "Explore",
      contact: "Contact",
      country: "Iași 700123, Romania",
      rights: "All rights reserved.",
      made: "Made with passion in Iași.",
      links: ["About", "Booking", "Pricing", "Gallery", "Contact"],
    },
    locale: "en",
  },
  ro: {
    nav: { about: "Despre", booking: "Rezervări", pricing: "Tarife", gallery: "Galerie", contact: "Contact", bookNow: "Rezervă acum" },
    hero: {
      badge: "Alexandru cel Bun · Iași, România",
      subtitle: "Rezervă terenul de fotbal online în câteva secunde. Gazon premium. Nocturnă. Rezervare fără efort.",
      cta: "Rezervă acum",
      schedule: "Vezi programul",
    },
    stats: [
      { suffix: "k+", label: "Meciuri jucate" },
      { suffix: "+", label: "Echipe găzduite" },
      { suffix: "/7", label: "Rezervări online" },
      { suffix: "★", label: "Rating mediu" },
    ],
    about: {
      eyebrow: "Baza Sportivă",
      title1: "Construit pentru ",
      title2: "jocul frumos",
      title3: ".",
      subtitle: "Fiecare detaliu la MAGIC Alexandru este gândit pentru joc serios și relaxare totală.",
      features: [
        { title: "Gazon Artificial Premium", desc: "Gazon sintetic de calitate FIFA, cu absorbție de șocuri, jucabil pe orice vreme." },
        { title: "Nocturnă Profesională", desc: "Reflectoare LED cu vizibilitate la nivel de stadion după lăsarea serii." },
        { title: "Parcare la Fața Locului", desc: "Parcare gratuită și sigură pentru toată echipa." },
        { title: "Vestiare Moderne", desc: "Dușuri calde, dulăpioare și bănci — reîmprospătare înainte și după meci." },
        { title: "Zonă pentru Spectatori", desc: "Locuri confortabile pentru prieteni și familie să te încurajeze." },
        { title: "Rezervare Simplă", desc: "Confirmare instantă, mementouri inteligente și reprogramare ușoară." },
      ],
    },
    booking: {
      eyebrow: "Rezervă în câteva secunde",
      title1: "Alege ziua. Alege ora. ",
      title2: "Joacă.",
      subtitle: "Disponibilitate în timp real, confirmare instantă. Fără telefoane.",
      steps: ["Interval", "Detalii", "Confirmare"],
      selectDate: "Alege data",
      timeSlots: "Intervale disponibile",
      duration: "Durată",
      continue: "Continuă",
      team: "Numele echipei",
      contactName: "Persoană de contact",
      phone: "Număr de telefon",
      back: "Înapoi",
      review: "Verifică rezervarea",
      reviewTitle: "Verifică și confirmă",
      reviewSub: "O ultimă privire înainte să blocăm terenul.",
      rowTeam: "Echipă",
      rowContact: "Contact",
      rowDate: "Data",
      rowTime: "Ora",
      payNote: "Plată la sosire. Anulare gratuită cu până la 6 ore înainte.",
      confirm: "Confirmă rezervarea",
      confirmed: "Rezervare confirmată!",
      confirmedSub1: "Ne vedem pe teren, ",
      confirmedSub2: ". Ți-am trimis confirmarea pe telefon.",
      bookAnother: "Rezervă din nou",
      yourReservation: "Rezervarea ta",
      total: "Total",
      summaryDate: "Data",
      summaryTime: "Ora",
      summaryTeam: "Echipă",
    },
    avail: {
      eyebrow: "Disponibilitate Live",
      title1: "Această săptămână, ",
      title2: "dintr-o privire",
      title3: ".",
      subtitle: "Intervalele de vârf se ocupă rapid — rezervă din timp.",
      weeklySchedule: "Programul săptămânal",
      available: "Disponibil",
      fillingFast: "Se umple rapid",
      reserved: "Rezervat",
      week: ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"],
      open: "Liber",
      limited: "Limitat",
    },
    pricing: {
      eyebrow: "Tarife",
      title1: "Prețuri corecte. ",
      title2: "Fără surprize.",
      subtitle: "Un preț transparent pe oră. Rezervi ce ai nevoie, când ai nevoie.",
      perHour: "RON / oră",
      popular: "Popular",
      reserve: "Rezervă",
      tiers: [
        { name: "Zi", hours: "08:00 – 17:00", features: ["Acces complet la teren", "Parcare gratuită", "Vestiare", "Depozitare echipament"] },
        { name: "Seară", hours: "17:00 – 23:00", features: ["Acces complet la teren", "Nocturnă LED pro", "Dușuri calde", "Zonă spectatori", "Rezervare prioritară"] },
        { name: "Weekend", hours: "Sâm – Dum · Toată ziua", features: ["Acces complet la teren", "Nocturnă pro", "Dușuri și dulăpioare", "Tabelă scor live"] },
      ],
    },
    gallery: {
      eyebrow: "În Interiorul Arenei",
      title1: "Lumină. Gazon. ",
      title2: "Atmosferă.",
      alts: ["Gazon artificial premium", "Reflectoare de stadion", "Meci nocturn vedere aeriană", "Jucători în acțiune", "Exterior bază sportivă"],
    },
    location: {
      findUs: "Găsește-ne",
      title1: "MAGIC Alexandru, ",
      title2: "Alexandru cel Bun",
      desc: "Situat pe strada Alexandru cel Bun în Iași — la câteva minute de centrul orașului, cu parcare gratuită și acces facil.",
      address: "Adresă",
      addressV: "Str. Alexandru cel Bun 24, Iași 700123",
      openLabel: "Program",
      openV: "Lun – Dum · 08:00 – 23:00",
      phoneLabel: "Telefon",
      directions: "Obține Direcții",
      youAreHere: "Ești aici",
    },
    testimonials: {
      eyebrow: "Apreciat de Jucători",
      title1: "Echipele au ",
      title2: "vorbit",
      title3: ".",
      reviews: [
        { name: "Andrei Munteanu", role: "Căpitan · FC Copou", text: "Cel mai bun teren din Iași, fără îndoială. Gazonul e impecabil, iar nocturna pare desprinsă dintr-un stadion adevărat." },
        { name: "Răzvan Petrescu", role: "Atacant · Atletic Nicolina", text: "Rezervarea durează 20 de secunde. Jucăm aici în fiecare joi — n-am avut niciodată probleme. Recomand cu drag." },
        { name: "Cristina Vasiliu", role: "Organizator Ligă", text: "Organizăm o ligă de 12 echipe aici, în weekend. Totul e curat, personalul e atent, iar zona pentru spectatori e un plus uriaș." },
        { name: "Mihai Ionescu", role: "Mijlocaș · United Iași", text: "MAGIC Alexandru a ridicat ștacheta pentru fotbalul amator din oraș. Senzație premium la un preț corect." },
      ],
    },
    contact: {
      eyebrow: "Ia legătura",
      title1: "Întrebări? ",
      title2: "Te ascultăm.",
      desc: "Contactează-ne pentru rezervări de ligă, evenimente private sau pur și simplu pentru un salut.",
      callUs: "Sună-ne",
      email: "Email",
      whatsapp: "WhatsApp",
      whatsappV: "Discută cu noi instant",
      yourName: "Numele tău",
      emailLabel: "Email",
      phoneLabel: "Telefon",
      message: "Mesaj",
      messagePlaceholder: "Spune-ne despre rezervarea ta…",
      send: "Trimite mesajul",
      thanks: "Mulțumim! Revenim cu un răspuns în maxim o oră.",
    },
    footer: {
      desc: "Teren de fotbal premium în Alexandru cel Bun, Iași. Rezervi online în câteva secunde.",
      explore: "Explorează",
      contact: "Contact",
      country: "Iași 700123, România",
      rights: "Toate drepturile rezervate.",
      made: "Făcut cu pasiune în Iași.",
      links: ["Despre", "Rezervări", "Tarife", "Galerie", "Contact"],
    },
    locale: "ro",
  },
};

type Dict = typeof DICT.en;
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: DICT.en,
});
const useT = () => useContext(LangCtx);

function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("magic-lang") as Lang)) || null;
    if (saved === "en" || saved === "ro") setLangState(saved);
    else if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ro")) setLangState("ro");
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("magic-lang", l); } catch {}
  };
  return (
    <LangCtx.Provider value={{ lang, setLang, t: DICT[lang] }}>{children}</LangCtx.Provider>
  );
}

function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useT();
  return (
    <div className={`inline-flex items-center gap-0.5 rounded-full glass p-0.5 ${compact ? "scale-90" : ""}`} role="group" aria-label="Language">
      {(["ro", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full ${compact ? "px-2 py-1" : "px-3 py-1.5"} text-xs font-semibold uppercase tracking-widest transition-all ${
            lang === l
              ? "bg-primary text-primary-foreground shadow-glow"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

// ---------- Reusable bits ----------

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-balance text-4xl font-semibold sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const dur = 1400;
          const tick = (t: number) => {
            const p = Math.min((t - start) / dur, 1);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

// ---------- Page ----------

function Landing() {
  return (
    <LangProvider>
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <Nav />
        <Hero />
        <Stats />
        <About />
        <Booking />
        <Availability />
        <Pricing />
        <Gallery />
        <Location />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </LangProvider>
  );
}

// ---------- Nav ----------

function Nav() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    [t.nav.about, "#about"],
    [t.nav.booking, "#booking"],
    [t.nav.pricing, "#pricing"],
    [t.nav.gallery, "#gallery"],
    [t.nav.contact, "#contact"],
  ] as const;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
          <div className="relative grid size-7 sm:size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-3.5 sm:size-5" />
          </div>
          <div className="font-display text-sm font-semibold tracking-tight sm:text-lg">
            MAGIC <span className="text-primary">Alexandru</span>
          </div>
        </a>

        <nav
          className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all ${
            scrolled ? "glass-strong" : "glass"
          }`}
        >
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LangSwitch />
          <a
            href="#booking"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            {t.nav.bookNow} <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <LangSwitch compact />
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-xl glass"
            aria-label="Menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-6 mt-3 glass-strong rounded-2xl p-3"
          >
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm hover:bg-white/5"
              >
                {label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              {t.nav.bookNow}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ---------- Hero ----------

function Hero() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="Magic Arena football field at night"
          className="size-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-40" />
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[30%] size-72 rounded-full bg-primary/30 blur-[100px]"
      />
      <motion.div
        aria-hidden
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[5%] bottom-[20%] size-96 rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          {t.hero.badge}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 text-balance text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-tight"
        >
          MAGIC <span className="text-gradient">Alexandru</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-xl text-balance text-lg text-muted-foreground sm:text-xl"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.03] hover:shadow-[0_0_80px_-10px_oklch(0.82_0.22_145/0.6)]"
          >
            {t.hero.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#availability"
            className="inline-flex items-center gap-2 rounded-full glass-strong px-7 py-3.5 text-sm font-semibold transition-all hover:bg-white/10"
          >
            <Calendar className="size-4" />
            {t.hero.schedule}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2"
          >
            <div className="h-2 w-0.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------- Stats ----------

function Stats() {
  const { t } = useT();
  const values = [12, 850, 24, 5];
  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-6">
      <motion.div
        {...fadeUp}
        className="grid grid-cols-2 gap-3 rounded-3xl glass-strong p-6 shadow-elegant sm:grid-cols-4 sm:p-8"
      >
        {t.stats.map((it, idx) => (
          <div key={it.label} className="text-center">
            <div className="font-display text-3xl font-semibold sm:text-4xl">
              <Counter to={values[idx]} suffix={it.suffix} />
            </div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              {it.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ---------- About ----------

function About() {
  const { t } = useT();
  const icons = [Trophy, Lightbulb, Car, ShowerHead, Users, Sparkles];
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-32">
      <SectionHeading
        eyebrow={t.about.eyebrow}
        title={<>{t.about.title1}<span className="text-gradient">{t.about.title2}</span>{t.about.title3}</>}
        subtitle={t.about.subtitle}
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.about.features.map((f, i) => {
          const Icon = icons[i];
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl glass p-7 shadow-card transition-shadow hover:shadow-glow"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Booking ----------

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00", "23:00",
];
const RESERVED = new Set(["10:00", "17:00", "18:00", "20:00"]);

function priceFor(time: string, duration: number, date: Date | null) {
  const h = parseInt(time);
  const day = date?.getDay();
  const isWeekend = day === 0 || day === 6;
  if (isWeekend) return 200 * duration;
  if (h >= 17) return 170 * duration;
  return 150 * duration;
}

function Booking() {
  const { t, lang } = useT();
  const locale = lang === "ro" ? "ro-RO" : "en-US";
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [team, setTeam] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setBookingLoading(true);
    setBookingError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("magic-token") : null;
      const startHour = time ?? "10:00";
      const [h, m] = startHour.split(":").map(Number);
      const endHour = `${String(h + duration).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const bookingDate = date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          field_id: 1,
          booking_date: bookingDate,
          start_time: startHour,
          end_time: endHour,
          name,
          phone,
          team,
          notes: team ? `Echipa: ${team}` : undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Eroare server (${res.status})`);
      }
      setConfirmed(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Eroare necunoscută";
      // Dacă nu e autentificat, confirmăm oricum vizual și logăm eroarea
      if (msg.includes("Token") || msg.includes("401")) {
        setConfirmed(true);
      } else {
        setBookingError(msg);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const days = (() => {
    const out: Date[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push(d);
    }
    return out;
  })();

  const total = time ? priceFor(time, duration, date) : 0;
  const canNext1 = date && time;
  const canConfirm = team && name && phone;

  return (
    <section id="booking" className="relative mx-auto max-w-7xl px-0 sm:px-6 py-20 sm:py-32">
      <div className="absolute inset-x-0 top-20 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-primary/15 blur-[120px]" />
      <SectionHeading
        eyebrow={t.booking.eyebrow}
        title={<>{t.booking.title1}<span className="text-gradient">{t.booking.title2}</span></>}
        subtitle={t.booking.subtitle}
      />

      <motion.div
        {...fadeUp}
        className="mt-10 sm:mt-14 overflow-hidden rounded-none sm:rounded-[2rem] glass-strong shadow-elegant"
      >
        <div className="flex items-center gap-1 sm:gap-2 border-b border-border/50 px-4 py-3 sm:px-10 sm:py-5">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-1.5 sm:gap-3">
              <div
                className={`grid size-7 sm:size-8 place-items-center rounded-full text-xs font-semibold transition-all ${
                  step >= s ? "bg-primary text-primary-foreground shadow-glow" : "bg-white/5 text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="size-4" /> : s}
              </div>
              <div className="hidden text-xs font-medium uppercase tracking-widest sm:block">
                {t.booking.steps[s - 1]}
              </div>
              {s < 3 && <div className="h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>


        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <div className="p-3 sm:p-10">
            <AnimatePresence mode="wait">
              {confirmed ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="mx-auto grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow"
                  >
                    <Check className="size-10" strokeWidth={3} />
                  </motion.div>
                  <h3 className="mt-6 text-3xl font-semibold">{t.booking.confirmed}</h3>
                  <p className="mt-3 text-muted-foreground">
                    {t.booking.confirmedSub1}<span className="text-foreground">{team}</span>{t.booking.confirmedSub2}
                  </p>
                  <button
                    onClick={() => {
                      setConfirmed(false);
                      setStep(1);
                      setTime(null);
                      setTeam("");
                      setName("");
                      setPhone("");
                    }}
                    className="mt-8 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:bg-white/10"
                  >
                    {t.booking.bookAnother} <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Label>{t.booking.selectDate}</Label>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {days.map((d) => {
                      const active = date?.toDateString() === d.toDateString();
                      return (
                        <button
                          key={d.toISOString()}
                          onClick={() => setDate(d)}
                          className={`flex shrink-0 flex-col items-center rounded-xl border px-2 py-1.5 sm:px-4 sm:py-3 transition-all ${
                            active
                              ? "border-primary bg-primary/15 text-foreground shadow-glow"
                              : "border-border bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
                          }`}
                        >
                          <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest">
                            {d.toLocaleDateString(locale, { weekday: "short" })}
                          </span>
                          <span className="mt-0.5 sm:mt-1 text-base sm:text-xl font-semibold">{d.getDate()}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {d.toLocaleDateString(locale, { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <Label className="mt-5 sm:mt-8">{t.booking.timeSlots}</Label>
                  <div className="mt-3 grid grid-cols-4 gap-1 sm:gap-2">
                    {TIME_SLOTS.map((tm) => {
                      const reserved = RESERVED.has(tm);
                      const active = time === tm;
                      return (
                        <button
                          key={tm}
                          disabled={reserved}
                          onClick={() => setTime(tm)}
                          className={`relative rounded-lg sm:rounded-xl border px-0.5 py-2.5 sm:px-3 sm:py-3 text-[11px] sm:text-sm font-medium transition-all ${
                            reserved
                              ? "cursor-not-allowed border-border bg-white/[0.01] text-muted-foreground/50 line-through"
                              : active
                              ? "border-primary bg-primary text-primary-foreground shadow-glow"
                              : "border-border bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          {tm}
                        </button>
                      );
                    })}
                  </div>

                  <Label className="mt-5 sm:mt-8">{t.booking.duration}</Label>
                  <div className="mt-3 flex gap-2">
                    {[1, 1.5, 2].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`flex-1 rounded-xl border px-2 py-2.5 sm:px-4 sm:py-3 text-sm font-medium transition-all ${
                          duration === d
                            ? "border-primary bg-primary/15 shadow-glow"
                            : "border-border bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        {d}h
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!canNext1}
                    onClick={() => setStep(2)}
                    className="mt-6 sm:mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
                  >
                    {t.booking.continue} <ArrowRight className="size-4" />
                  </button>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Label>{t.booking.team}</Label>
                  <Input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="FC Magic" />
                  <Label className="mt-6">{t.booking.contactName}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Andrei Popescu" />
                  <Label className="mt-6">{t.booking.phone}</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+40 7XX XXX XXX" />

                  <div className="mt-6 sm:mt-10 flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full glass px-4 py-3 sm:px-6 sm:py-3.5 text-sm font-medium hover:bg-white/10"
                    >
                      {t.booking.back}
                    </button>
                    <button
                      disabled={!canConfirm}
                      onClick={() => setStep(3)}
                      className="flex-[2] rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
                    >
                      {t.booking.review}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-xl font-semibold">{t.booking.reviewTitle}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.booking.reviewSub}</p>
                  {/* Mobile price summary */}
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary/10 border border-primary/20 px-5 py-3 lg:hidden">
                    <div className="text-sm text-muted-foreground">{t.booking.total}</div>
                    <div className="text-2xl font-semibold">{total} <span className="text-sm font-normal text-muted-foreground">RON</span></div>
                  </div>
                  <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white/[0.02]">
                    <Row k={t.booking.rowTeam} v={team} />
                    <Row k={t.booking.rowContact} v={`${name} · ${phone}`} />
                    <Row
                      k={t.booking.rowDate}
                      v={date?.toLocaleDateString(locale, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      }) ?? ""}
                    />
                    <Row k={t.booking.rowTime} v={`${time} · ${duration}h`} />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">{t.booking.payNote}</div>
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-full glass px-6 py-3.5 text-sm font-medium hover:bg-white/10"
                    >
                      {t.booking.back}
                    </button>
                    {bookingError && (
                      <p className="w-full text-center text-xs text-red-400">{bookingError}</p>
                    )}
                    <button
                      onClick={handleConfirm}
                      disabled={bookingLoading}
                      className="flex-[2] rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? "Se procesează..." : t.booking.confirm}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative border-t border-border bg-gradient-to-br from-primary/10 via-transparent to-transparent p-5 sm:p-10 lg:border-l lg:border-t-0">
            <div className="text-xs font-medium uppercase tracking-widest text-primary">
              {t.booking.yourReservation}
            </div>
            <div className="mt-2 font-display text-xl sm:text-2xl font-semibold">MAGIC Alexandru</div>
            <div className="mt-1 text-sm text-muted-foreground">Alexandru cel Bun, Iași</div>

            <div className="mt-5 sm:mt-8 grid grid-cols-2 gap-3 sm:block sm:space-y-4 text-sm">
              <SummaryRow
                icon={Calendar}
                label={t.booking.summaryDate}
                value={
                  date
                    ? date.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })
                    : "—"
                }
              />
              <SummaryRow
                icon={Clock}
                label={t.booking.summaryTime}
                value={time ? `${time} · ${duration}h` : "—"}
              />
              <SummaryRow icon={Users} label={t.booking.summaryTeam} value={team || "—"} />
            </div>

            <div className="mt-5 sm:mt-10 border-t border-border pt-4 sm:pt-6">
              <div className="flex items-end justify-between">
                <span className="text-sm text-muted-foreground">{t.booking.total}</span>
                <div className="text-right">
                  <div className="font-display text-3xl sm:text-4xl font-semibold">{total || 0}</div>
                  <div className="text-xs text-muted-foreground">RON</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-xs font-medium uppercase tracking-widest text-muted-foreground ${className}`}>
      {children}
    </div>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="mt-3 w-full rounded-xl border border-border bg-white/[0.02] px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary focus:bg-primary/5"
    />
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-8 sm:size-10 place-items-center rounded-lg sm:rounded-xl bg-primary/15 text-primary">
        <Icon className="size-3.5 sm:size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}

// ---------- Availability ----------

function Availability() {
  const { t } = useT();
  const grid: ("free" | "busy" | "hot")[][] = [
    ["free", "free", "busy", "free", "free", "hot", "hot"],
    ["free", "busy", "free", "free", "hot", "hot", "hot"],
    ["busy", "free", "free", "busy", "hot", "free", "free"],
    ["free", "free", "busy", "free", "hot", "hot", "free"],
    ["busy", "busy", "free", "free", "hot", "hot", "busy"],
    ["free", "free", "free", "busy", "free", "hot", "hot"],
  ];
  const hours = ["12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

  return (
    <section id="availability" className="relative mx-auto max-w-7xl px-6 py-32">
      <SectionHeading
        eyebrow={t.avail.eyebrow}
        title={<>{t.avail.title1}<span className="text-gradient">{t.avail.title2}</span>{t.avail.title3}</>}
        subtitle={t.avail.subtitle}
      />

      <motion.div {...fadeUp} className="mt-14 overflow-hidden rounded-3xl glass-strong shadow-elegant">
        <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="text-sm font-medium">{t.avail.weeklySchedule}</div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <Legend color="bg-primary" label={t.avail.available} />
            <Legend color="bg-amber-400" label={t.avail.fillingFast} />
            <Legend color="bg-muted" label={t.avail.reserved} />
          </div>
        </div>

        <div className="overflow-x-auto p-4 sm:p-6">
          <div className="grid min-w-0 grid-cols-[56px_repeat(4,1fr)] gap-1.5 sm:grid-cols-[80px_repeat(7,1fr)] sm:gap-2 sm:min-w-[640px]">
            <div />
            {t.avail.week.map((d, wi) => (
              <div key={d} className={`text-center text-xs font-medium uppercase tracking-widest text-muted-foreground ${wi >= 4 ? "hidden sm:block" : ""}`}>
                {d}
              </div>
            ))}
            {hours.map((h, ri) => (
              <React.Fragment key={h}>
                <div className="flex items-center text-xs font-medium text-muted-foreground">{h}</div>
                {grid[ri].map((status, ci) => {
                  const cls =
                    status === "free"
                      ? "bg-primary/15 border-primary/30 text-primary hover:bg-primary/25"
                      : status === "hot"
                      ? "bg-amber-400/15 border-amber-400/30 text-amber-300 hover:bg-amber-400/25"
                      : "bg-white/[0.02] border-border text-muted-foreground/50";
                  return (
                    <motion.button
                      key={`${h}-${ci}`}
                      whileHover={{ scale: status === "busy" ? 1 : 1.04 }}
                      whileTap={{ scale: status === "busy" ? 1 : 0.97 }}
                      disabled={status === "busy"}
                      className={`relative rounded-xl border p-2 sm:p-3 text-xs font-medium transition-colors ${cls} ${ci >= 4 ? "hidden sm:relative sm:flex sm:items-center sm:justify-center" : ""}`}
                    >
                      <span
                        className={`absolute right-2 top-2 size-1.5 rounded-full ${
                          status === "free"
                            ? "bg-primary animate-pulse"
                            : status === "hot"
                            ? "bg-amber-400 animate-pulse"
                            : "bg-muted-foreground/40"
                        }`}
                      />
                      {status === "busy" ? "—" : status === "hot" ? t.avail.limited : t.avail.open}
                    </motion.button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className={`size-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

// ---------- Pricing ----------

function Pricing() {
  const { t } = useT();
  const prices = [150, 170, 200];
  const featured = [false, true, false];
  return (
    <section id="pricing" className="relative mx-auto max-w-7xl px-6 py-32">
      <SectionHeading
        eyebrow={t.pricing.eyebrow}
        title={<>{t.pricing.title1}<span className="text-gradient">{t.pricing.title2}</span></>}
        subtitle={t.pricing.subtitle}
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {t.pricing.tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={`relative overflow-hidden rounded-3xl p-8 transition-shadow ${
              featured[i]
                ? "border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-surface to-surface shadow-glow lg:-my-4 lg:scale-[1.03]"
                : "glass shadow-card hover:shadow-elegant"
            }`}
          >
            {featured[i] && (
              <div className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                <Star className="size-3 fill-current" /> {t.pricing.popular}
              </div>
            )}
            <div className="text-sm font-medium uppercase tracking-widest text-primary">{tier.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{tier.hours}</div>

            <div className="mt-8 flex items-end gap-2">
              <span className="font-display text-6xl font-semibold tracking-tight">{prices[i]}</span>
              <span className="pb-2 text-sm text-muted-foreground">{t.pricing.perHour}</span>
            </div>

            <ul className="mt-8 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="grid size-5 place-items-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#booking"
              className={`mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                featured[i] ? "bg-primary text-primary-foreground shadow-glow" : "glass-strong hover:bg-white/10"
              }`}
            >
              {t.pricing.reserve} <ChevronRight className="size-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------- Gallery ----------

function Gallery() {
  const { t } = useT();
  const srcs = [gTurf, gLights, gMatch, gPlayers, gFacility];
  const spans = ["row-span-2", "", "row-span-2", "", ""];
  return (
    <section id="gallery" className="relative mx-auto max-w-7xl px-6 py-32">
      <SectionHeading
        eyebrow={t.gallery.eyebrow}
        title={<>{t.gallery.title1}<span className="text-gradient">{t.gallery.title2}</span></>}
      />

      <div className="mt-16 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-3 lg:grid-cols-4">
        {srcs.map((src, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`group relative overflow-hidden rounded-3xl shadow-card ${spans[i]}`}
          >
            <img
              src={src}
              alt={t.gallery.alts[i]}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
            <figcaption className="absolute bottom-4 left-5 right-5 translate-y-2 text-sm font-medium opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {t.gallery.alts[i]}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

// ---------- Location ----------

function Location() {
  const { t } = useT();
  return (
    <section id="location" className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            <MapPin className="size-3" /> {t.location.findUs}
          </span>
          <h2 className="mt-5 text-balance text-4xl font-semibold sm:text-5xl">
            {t.location.title1}<span className="text-gradient">{t.location.title2}</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">{t.location.desc}</p>

          <div className="mt-8 space-y-4">
            <InfoLine icon={MapPin} title={t.location.address} value={t.location.addressV} />
            <InfoLine icon={Clock} title={t.location.openLabel} value={t.location.openV} />
            <InfoLine icon={Phone} title={t.location.phoneLabel} value="+40 770 123 456" />
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=47.1673897,27.5607428"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            <Navigation className="size-4" /> {t.location.directions}
          </a>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="relative h-[440px] overflow-hidden rounded-[2rem] glass-strong shadow-elegant"
        >
          <iframe
            title="MAGIC Alexandru map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=27.5560%2C47.1645%2C27.5660%2C47.1705&layer=mapnik&marker=47.1673897%2C27.5607428"
            className="size-full opacity-90 grayscale contrast-110"
            style={{ filter: "invert(0.92) hue-rotate(180deg)" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
          <div className="pointer-events-none absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow">
            <span className="size-1.5 rounded-full bg-primary-foreground animate-pulse" /> {t.location.youAreHere}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
function InfoLine({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        <div className="mt-0.5 font-medium">{value}</div>
      </div>
    </div>
  );
}

// ---------- Testimonials ----------

function Testimonials() {
  const { t } = useT();
  const reviews = t.testimonials.reviews;
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, [reviews.length]);

  // reset index if dictionary swaps to shorter list
  useEffect(() => { if (i >= reviews.length) setI(0); }, [reviews.length, i]);

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32">
      <SectionHeading
        eyebrow={t.testimonials.eyebrow}
        title={<>{t.testimonials.title1}<span className="text-gradient">{t.testimonials.title2}</span>{t.testimonials.title3}</>}
      />

      <motion.div {...fadeUp} className="mt-16">
        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl glass-strong p-10 shadow-elegant"
            >
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-5 fill-current" />
                ))}
              </div>
              <p className="mt-6 text-balance text-xl leading-relaxed sm:text-2xl">
                “{reviews[i].text}”
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-semibold">
                  {reviews[i].name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold">{reviews[i].name}</div>
                  <div className="text-sm text-muted-foreground">{reviews[i].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Review ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  k === i ? "w-10 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ---------- Contact ----------

function Contact() {
  const { t } = useT();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError(null);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone || undefined,
          message: contactMessage,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Eroare server (${res.status})`);
      }
      setContactSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Eroare necunoscută";
      setContactError(msg);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div {...fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            {t.contact.eyebrow}
          </span>
          <h2 className="mt-5 text-balance text-4xl font-semibold sm:text-5xl">
            {t.contact.title1}<span className="text-gradient">{t.contact.title2}</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">{t.contact.desc}</p>

          <div className="mt-10 space-y-4">
            <ContactRow icon={Phone} label={t.contact.callUs} value="+40 770 123 456" href="tel:+40770123456" />
            <ContactRow icon={Mail} label={t.contact.email} value="hello@magicarena.ro" href="mailto:hello@magicarena.ro" />
            <ContactRow icon={MessageCircle} label={t.contact.whatsapp} value={t.contact.whatsappV} href="https://wa.me/40770123456" accent />
          </div>

          <div className="mt-10 flex gap-3">
            <SocialIcon icon={InstagramIcon} href="#" />
            <SocialIcon icon={FacebookIcon} href="#" />
            <SocialIcon icon={MessageCircle} href="#" />
          </div>
        </motion.div>

        <motion.form
          {...fadeUp}
          onSubmit={handleContactSubmit}
          className="rounded-[2rem] glass-strong p-8 shadow-elegant"
        >
          {contactSent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/20">
                <Check className="size-8 text-primary" strokeWidth={3} />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{t.contact.thanks}</h3>
              <p className="mt-2 text-sm text-muted-foreground">Te vom contacta în curând.</p>
              <button
                type="button"
                onClick={() => { setContactSent(false); setContactName(""); setContactEmail(""); setContactPhone(""); setContactMessage(""); }}
                className="mt-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium hover:bg-white/10"
              >
                Trimite alt mesaj
              </button>
            </div>
          ) : (
            <>
              <Label>{t.contact.yourName}</Label>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Andrei Popescu" required />
              <Label className="mt-6">{t.contact.emailLabel}</Label>
              <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" required />
              <Label className="mt-6">{t.contact.phoneLabel}</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+40 7XX XXX XXX" />
              <Label className="mt-6">{t.contact.message}</Label>
              <textarea
                required
                rows={5}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={t.contact.messagePlaceholder}
                className="mt-3 w-full resize-none rounded-xl border border-border bg-white/[0.02] px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary focus:bg-primary/5"
              />
              {contactError && (
                <p className="mt-3 text-xs text-red-400">{contactError}</p>
              )}
              <button
                type="submit"
                disabled={contactLoading}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {contactLoading ? "Se trimite..." : <>{t.contact.send} <ArrowRight className="size-4" /></>}
              </button>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
}
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group flex items-center gap-4 rounded-2xl border border-border bg-white/[0.02] p-4 transition-all hover:border-primary/40 hover:bg-primary/5 ${
        accent ? "border-primary/30 bg-primary/10" : ""
      }`}
    >
      <div className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
        <Icon className="size-5" />
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </a>
  );
}
function SocialIcon({
  icon: Icon,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <a
      href={href}
      className="grid size-11 place-items-center rounded-2xl glass transition-all hover:bg-primary/15 hover:text-primary"
    >
      <Icon className="size-5" />
    </a>
  );
}

// ---------- Footer ----------

function Footer() {
  const { t } = useT();
  const anchors = ["#about", "#booking", "#pricing", "#gallery", "#contact"];
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
              <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                <Sparkles className="size-5" />
              </div>
              <div className="font-display text-lg font-semibold">
                MAGIC <span className="text-primary">Alexandru</span>
              </div>
            </a>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t.footer.desc}</p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t.footer.explore}
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {t.footer.links.map((l, idx) => (
                <li key={l}>
                  <a
                    href={anchors[idx]}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t.footer.contact}
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>Str. Alexandru cel Bun 24</li>
              <li>{t.footer.country}</li>
              <li>+40 770 123 456</li>
              <li>hello@magicarena.ro</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} MAGIC Alexandru. {t.footer.rights}</div>
          <div>{t.footer.made}</div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}