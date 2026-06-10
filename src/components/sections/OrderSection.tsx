"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import OrderForm from "@/components/order/OrderForm";

export default function OrderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="order" ref={ref} className="relative bg-[#050505] py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,75,0.04)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-[#C9A94B]/60 text-sm tracking-[0.4em] uppercase mb-3">⛩</p>
          <h2 className="text-white text-3xl md:text-4xl font-light tracking-[0.15em] uppercase mb-4">
            Place Your Order
          </h2>
          <p className="text-white/30 text-sm max-w-sm mx-auto">
            Fill in your details below. We will confirm your order and arrange free delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <OrderForm />
        </motion.div>
      </div>
    </section>
  );
}
