import { motion } from "framer-motion";
import { Phone, Clock } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { PHONE, PHONE_TEL, ZOMATO_URL, HOURS } from "@/data/menu";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Delhi street food at night"
          width={1920}
          height={1280}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-saffron/40 bg-saffron/10 text-saffron text-xs uppercase tracking-[0.25em] mb-6">
            <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            New Delhi · Cloud Kitchen
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-4">
            PANCHAIYAT
            <br />
            <span className="text-gradient-saffron">CAFE & KITCHEN</span>
          </h1>

          <p className="text-xl md:text-2xl font-display tracking-wider text-muted-foreground mb-2">
            "Dil Se Khana,
            <span className="text-saffron"> Dilli Se Swad</span>"
          </p>
          <p className="text-sm md:text-base text-muted-foreground/80 mb-10 max-w-xl">
            From the gallis of Joga Bai to your doorstep — late-night cravings, sorted.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href={ZOMATO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-md bg-saffron text-primary-foreground font-display tracking-widest text-lg hover:opacity-90 transition glow-saffron"
            >
              ORDER ON ZOMATO
              <span className="group-hover:translate-x-1 transition">→</span>
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-md border-2 border-foreground/20 text-foreground font-display tracking-widest text-lg hover:border-saffron hover:text-saffron transition"
            >
              <Phone className="w-5 h-5" />
              {PHONE}
            </a>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur border border-border">
            <Clock className="w-4 h-4 text-saffron" />
            <span className="text-sm uppercase tracking-wider">{HOURS}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
