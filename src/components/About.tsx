import { motion } from "framer-motion";
import { MapPin, Truck, IndianRupee } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import { ADDRESS } from "@/data/menu";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-saffron/30 to-ember/20 rounded-2xl blur-2xl" />
          <img
            src={aboutImg}
            alt="Spread of Panchaiyat food"
            width={1280}
            height={1280}
            loading="lazy"
            className="relative rounded-2xl border border-border w-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-3">About Us</div>
          <h2 className="font-display text-5xl md:text-6xl mb-6 leading-tight">
            A LOCAL JOINT WITH
            <br />
            <span className="text-gradient-saffron">DESI ATTITUDE</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Panchaiyat is a cafe and cloud kitchen tucked in the heart of New Delhi —
            cooking up momos, burgers, pizza and shakes the way Dilli wants them. Bold flavours,
            late-night vibes, and zero-fuss delivery. We're the spot you'll keep coming back to.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-5 rounded-xl border border-border bg-card hover-glow">
              <Truck className="w-6 h-6 text-saffron mb-3" />
              <div className="font-display text-2xl">FREE DELIVERY</div>
              <div className="text-sm text-muted-foreground">on orders above ₹250</div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card hover-glow">
              <IndianRupee className="w-6 h-6 text-saffron mb-3" />
              <div className="font-display text-2xl">₹30 DELIVERY</div>
              <div className="text-sm text-muted-foreground">below the minimum</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-xl border border-saffron/30 bg-saffron/5">
            <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-widest text-saffron mb-1">Find Us</div>
              <div className="text-sm text-foreground">{ADDRESS}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
