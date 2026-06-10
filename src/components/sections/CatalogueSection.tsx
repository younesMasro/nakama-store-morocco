"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function CatalogueSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="catalogue" ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center py-20 px-6 bg-black"
      >
        <p className="text-[#C9A94B]/60 text-2xl mb-3">侍</p>
        <h2 className="text-white text-3xl md:text-5xl font-light tracking-[0.15em] uppercase">
          Choose Your Dragon
        </h2>
        <p className="text-white/30 text-sm tracking-widest uppercase mt-4">
          Two paths. Two energies. One collection.
        </p>
      </motion.div>

      {/* Split Catalogue */}
      <div className="flex flex-col md:flex-row flex-1 min-h-[70vh]">
        {/* White Dragon — Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative flex-1 flex flex-col items-center justify-center py-20 px-8 bg-[#f5f0e8] overflow-hidden group cursor-pointer"
        >
          {/* Atmospheric bg */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,75,0.08)_0%,_transparent_60%)]" />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <p className="text-[#C9A94B]/70 text-sm tracking-[0.4em] uppercase font-light">白い龍</p>
            <h3 className="text-gray-900 text-4xl md:text-5xl font-light tracking-wider uppercase leading-tight">
              White<br />Dragon
            </h3>
            <div className="flex items-center gap-2 text-[#9a7d3a] text-xs tracking-widest">
              <span>PURE</span><span>·</span><span>HONOR</span><span>·</span><span>LIGHT</span>
            </div>

            {/* Katana image */}
            <div className="relative h-72 md:h-96 w-24 my-4 group-hover:scale-105 transition-transform duration-700">
              <Image
                src="/images/products/black-dragon/full-view-3.png"
                alt="White Dragon Katana"
                fill
                className="object-contain"
              />
            </div>

            <Link
              href="#white-dragon"
              className="px-8 py-3 border border-[#9a7d3a]/50 text-[#9a7d3a] text-xs tracking-widest uppercase hover:bg-[#9a7d3a]/10 hover:border-[#9a7d3a] transition-all duration-300"
            >
              Discover →
            </Link>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="hidden md:flex flex-col items-center justify-center w-px bg-gradient-to-b from-transparent via-[#C9A94B]/30 to-transparent relative z-10">
          <div className="absolute top-1/2 -translate-y-1/2 bg-black px-3 py-2">
            <p className="text-[#C9A94B] text-xl">侍</p>
          </div>
        </div>

        {/* Black Dragon — Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative flex-1 flex flex-col items-center justify-center py-20 px-8 bg-[#0a0a0a] overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(201,169,75,0.05)_0%,_transparent_60%)]" />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <p className="text-[#C9A94B]/70 text-sm tracking-[0.4em] uppercase font-light">黒い龍</p>
            <h3 className="text-white text-4xl md:text-5xl font-light tracking-wider uppercase leading-tight">
              Black<br />Dragon
            </h3>
            <div className="flex items-center gap-2 text-[#C9A94B]/60 text-xs tracking-widest">
              <span>POWER</span><span>·</span><span>MYSTERY</span><span>·</span><span>SHADOW</span>
            </div>

            {/* Katana image */}
            <div className="relative h-72 md:h-96 w-24 my-4 group-hover:scale-105 transition-transform duration-700">
              <Image
                src="/images/products/black-dragon/full-view-1.png"
                alt="Black Dragon Katana"
                fill
                className="object-contain"
              />
            </div>

            <Link
              href="#black-dragon"
              className="px-8 py-3 border border-[#C9A94B]/30 text-[#C9A94B] text-xs tracking-widest uppercase hover:bg-[#C9A94B]/10 hover:border-[#C9A94B] transition-all duration-300"
            >
              Discover →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
