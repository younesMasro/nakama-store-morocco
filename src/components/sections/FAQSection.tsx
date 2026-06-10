"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/data/faq";

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" ref={ref} className="bg-black border-t border-white/5 py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-white text-3xl font-light tracking-[0.15em] uppercase mb-3">
            Questions
          </h2>
          <p className="text-white/30 text-sm tracking-wider">Everything you need to know</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion className="flex flex-col gap-2">
            {faq.map((item, i) => (
              <AccordionItem
                key={i}
                value={i + 1}
                className="border border-white/5 px-6 data-[state=open]:border-[#C9A94B]/20"
              >
                <AccordionTrigger className="text-white/70 text-sm tracking-wide hover:text-white hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/40 text-sm leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
