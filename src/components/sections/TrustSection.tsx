"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, Shield, CreditCard, Phone, Info } from "lucide-react";

const badges = [
  { icon: Truck, label: "Free Delivery", sub: "All cities in Morocco" },
  { icon: Shield, label: "Decorative Wooden Katana", sub: "Premium quality display piece" },
  { icon: CreditCard, label: "No Online Payment", sub: "Cash on delivery" },
  { icon: Phone, label: "Order by Contact", sub: "WhatsApp or form" },
  { icon: Info, label: "For Decoration Only", sub: "Not a real weapon" },
];

export default function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-black border-y border-white/5 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2 min-w-[120px]"
            >
              <badge.icon size={20} className="text-[#C9A94B]/60" />
              <span className="text-white/70 text-xs tracking-wider">{badge.label}</span>
              <span className="text-white/25 text-xs">{badge.sub}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
