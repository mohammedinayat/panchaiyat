import { motion } from "framer-motion";
import { Instagram, Heart, MessageCircle } from "lucide-react";
import { INSTAGRAM } from "@/data/menu";
import momos from "@/assets/ig/momos.jpg";
import fries from "@/assets/ig/fries.jpg";
import burger from "@/assets/ig/burger.jpg";
import pizza from "@/assets/ig/pizza.jpg";
import shake from "@/assets/ig/shake.jpg";
import kulhad from "@/assets/ig/kulhad.jpg";

const posts = [
  { img: momos, caption: "Steam momos hits different at 2 AM 🥟", likes: 412, comments: 28 },
  { img: burger, caption: "Double cheese, double trouble 🍔", likes: 587, comments: 41 },
  { img: pizza, caption: "Tandoori chicken pizza — desi swag 🍕", likes: 723, comments: 52 },
  { img: fries, caption: "Cheesy chicken loaded fries 🧀", likes: 489, comments: 33 },
  { img: shake, caption: "Oreo shake season is open 🥤", likes: 356, comments: 19 },
  { img: kulhad, caption: "Veg kulhad pizza — chai pe charcha vibes ✨", likes: 612, comments: 47 },
];

export function InstagramFeed() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-3">Daily Drops</div>
            <h2 className="font-display text-5xl md:text-6xl">
              FRESH FROM THE <span className="text-gradient-saffron">GRAM</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md">
              The latest plates, late-night specials, and behind-the-counter chaos.
            </p>
          </div>
          <a
            href={`https://instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-saffron/40 bg-saffron/10 text-saffron font-semibold hover:bg-saffron hover:text-primary-foreground transition self-start"
          >
            <Instagram className="w-4 h-4" />
            @{INSTAGRAM}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {posts.map((p, i) => (
            <motion.a
              key={i}
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-card"
            >
              <img
                src={p.img}
                alt={p.caption}
                width={800}
                height={800}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center gap-4 text-foreground mb-2">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">
                    <Heart className="w-4 h-4 fill-saffron text-saffron" />
                    {p.likes}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">
                    <MessageCircle className="w-4 h-4 text-saffron" />
                    {p.comments}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 line-clamp-2">{p.caption}</p>
              </div>
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background/70 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition">
                <Instagram className="w-3.5 h-3.5 text-saffron" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
