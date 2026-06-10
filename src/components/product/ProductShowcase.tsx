"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { products, ProductId } from "@/data/products";

interface Props {
  productId: ProductId;
}

export default function ProductShowcase({ productId }: Props) {
  const product = products[productId];
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isDark = product.theme === "dark";
  const bgClass = isDark ? "bg-[#060606]" : "bg-[#f8f4ee]";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const subTextClass = isDark ? "text-white/40" : "text-gray-500";
  const accentClass = isDark ? "text-[#C9A94B]" : "text-[#9a7d3a]";
  const borderClass = isDark ? "border-white/10" : "border-gray-200";
  const activeBorderClass = isDark ? "border-[#C9A94B]" : "border-[#9a7d3a]";

  return (
    <section
      id={productId}
      ref={ref}
      className={`relative min-h-screen ${bgClass} overflow-hidden py-24 px-6`}
    >
      {/* Atmospheric gradient */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 30% 50%, rgba(201,169,75,0.04) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 70% 50%, rgba(201,169,75,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className={`${accentClass} text-sm tracking-[0.4em] uppercase mb-2`}>{product.nameJa}</p>
          <h2 className={`${textClass} text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-4`}>
            {product.name}
          </h2>
          <p className={`${accentClass}/70 text-xs tracking-[0.3em]`}>{product.tagline}</p>
        </motion.div>

        {/* Main content: image + tabs */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Katana image */}
          <motion.div
            initial={{ opacity: 0, x: isDark ? 40 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex-shrink-0 w-32 md:w-40 h-[500px] md:h-[600px]"
          >
            <Image
              src={product.parts[activeTab]?.image ?? product.images.fullView[0]}
              alt={`${product.name} - ${product.parts[activeTab]?.label}`}
              fill
              className="object-contain"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: isDark ? -40 : 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex-1 flex flex-col gap-8"
          >
            {/* Part tabs */}
            <div className="flex flex-wrap gap-2">
              {product.parts.map((part, i) => (
                <button
                  key={part.id}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 text-xs tracking-widest uppercase border transition-all duration-300 ${
                    activeTab === i
                      ? `${activeBorderClass} ${accentClass} bg-[#C9A94B]/5`
                      : `${borderClass} ${subTextClass} hover:${borderClass}`
                  }`}
                >
                  {part.label}
                </button>
              ))}
            </div>

            {/* Active part description */}
            <div className="flex flex-col gap-3">
              <p className={`${accentClass} text-xs tracking-widest uppercase`}>
                {product.parts[activeTab]?.labelJa} — {product.parts[activeTab]?.label}
              </p>
              <p className={`${subTextClass} text-sm leading-relaxed max-w-md`}>
                {product.parts[activeTab]?.description}
              </p>
            </div>

            {/* Description */}
            <div className={`border-t ${borderClass} pt-6`}>
              <p className={`${subTextClass} text-sm leading-relaxed max-w-md`}>
                {product.description}
              </p>
            </div>

            {/* Specs */}
            <div className={`border-t ${borderClass} pt-6`}>
              <p className={`${accentClass} text-xs tracking-widest uppercase mb-4`}>Specifications</p>
              <div className="grid grid-cols-2 gap-3">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1">
                    <span className={`${subTextClass} text-xs uppercase tracking-wider`}>{spec.label}</span>
                    <span className={`${textClass} text-sm`}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="#order"
                className={`px-8 py-3 bg-[#C9A94B]/10 border ${activeBorderClass} ${accentClass} text-sm tracking-[0.2em] uppercase hover:bg-[#C9A94B]/20 transition-all duration-300 text-center`}
              >
                Order {product.name}
              </Link>
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-3 border ${borderClass} ${subTextClass} text-xs tracking-widest uppercase hover:${textClass} transition-all duration-300 text-center`}
              >
                WhatsApp
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
