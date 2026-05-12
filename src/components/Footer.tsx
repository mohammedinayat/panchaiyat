import { Instagram, MapPin, Clock, Phone } from "lucide-react";
import { ADDRESS, HOURS, INSTAGRAM, PHONE, PHONE_TEL } from "@/data/menu";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-background/80">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-saffron to-ember grid place-items-center font-display text-xl text-primary-foreground">
              P
            </div>
            <div>
              <div className="font-display text-xl tracking-wider">PANCHAIYAT</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">CAFE & KITCHEN</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "Dil Se Khana, Dilli Se Swad"
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-2">Visit</div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
            <span>{ADDRESS}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-saffron" />
            <span>{HOURS}</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="text-saffron text-xs uppercase tracking-[0.3em] mb-2">Connect</div>
          <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 text-muted-foreground hover:text-saffron transition">
            <Phone className="w-4 h-4 text-saffron" />
            {PHONE}
          </a>
          <a
            href={`https://instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-saffron transition"
          >
            <Instagram className="w-4 h-4 text-saffron" />
            @{INSTAGRAM}
          </a>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Panchaiyat Cafe & Kitchen · Made with masala in New Delhi
      </div>
    </footer>
  );
}
