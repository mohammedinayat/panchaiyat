import { motion } from "framer-motion";
import { Phone, Instagram, Truck } from "lucide-react";
import { PHONE, PHONE_TEL, INSTAGRAM, ZOMATO_URL } from "@/data/menu";

export function OrderSection() {
  return (
    <section id="order" className="py-24 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-saffron/40 bg-gradient-to-br from-card to-background p-10 md:p-16 grain"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-saffron/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-ember/20 blur-3xl" />

          <div className="relative text-center">
            <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-3">Bhook lagi?</div>
            <h2 className="font-display text-5xl md:text-7xl mb-4">
              ORDER <span className="text-gradient-saffron">KAR LE</span> BHAI
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Min order ₹250 · Free delivery above ₹250 · ₹30 delivery charges otherwise
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={ZOMATO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl bg-saffron text-primary-foreground font-display tracking-widest text-lg hover:opacity-90 transition glow-saffron"
              >
                <Truck className="w-5 h-5" />
                ORDER ON ZOMATO
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl border-2 border-foreground/20 hover:border-saffron hover:text-saffron font-display tracking-widest text-lg transition"
              >
                <Phone className="w-5 h-5" />
                {PHONE}
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-border flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Follow the daily drops</span>
              <a
                href={`https://instagram.com/${INSTAGRAM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-saffron hover:underline font-semibold"
              >
                <Instagram className="w-5 h-5" />
                @{INSTAGRAM}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
