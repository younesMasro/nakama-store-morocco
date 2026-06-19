"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderSchema } from "@/lib/validations";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { site } from "@/data/site";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";

export default function OrderForm({ defaultModel }: { defaultModel?: "black-dragon" | "white-dragon" }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderSchema>({
    resolver: zodResolver(orderSchema),
    defaultValues: { model: defaultModel ?? "black-dragon" },
  });

  const formData = watch();

  const onSubmit = async (data: OrderSchema) => {
    setLoading(true);
    try {
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = getWhatsAppLink(
    { ...formData, model: formData.model ?? "black-dragon" },
    site.whatsapp
  );

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="text-[#C9A94B] text-4xl">⛩</div>
        <h3 className="text-white text-xl font-light tracking-widest uppercase">Order Received</h3>
        <p className="text-white/40 text-sm max-w-sm">
          Thank you. We will contact you shortly to confirm your order and delivery.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-8 py-3 bg-green-600/20 border border-green-600/40 text-green-400 text-sm tracking-wider uppercase hover:bg-green-600/30 transition-all"
        >
          <MessageCircle size={16} />
          Also message on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Model select */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-xs tracking-widest uppercase">Choose Model *</label>
        <div className="flex gap-3">
          {(["black-dragon", "white-dragon"] as const).map((m) => (
            <label key={m} className="flex-1 cursor-pointer">
              <input type="radio" value={m} {...register("model")} className="sr-only" />
              <div
                className={`py-3 text-center text-xs tracking-widest uppercase border transition-all ${
                  formData.model === m
                    ? "border-[#C9A94B] text-[#C9A94B] bg-[#C9A94B]/5"
                    : "border-white/10 text-white/40 hover:border-white/30"
                }`}
              >
                {m === "black-dragon" ? "Black Dragon" : "White Dragon"}
              </div>
            </label>
          ))}
        </div>
        {errors.model && <p className="text-red-400 text-xs">{errors.model.message}</p>}
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-xs tracking-widest uppercase">Full Name *</label>
        <Input
          {...register("fullName")}
          placeholder="Your full name"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C9A94B]/50"
        />
        {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName.message}</p>}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-xs tracking-widest uppercase">Phone Number *</label>
        <Input
          {...register("phone")}
          placeholder="06 XX XX XX XX"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C9A94B]/50"
        />
        {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
      </div>

      {/* Email (optional) */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-xs tracking-widest uppercase">Email <span className="text-white/20">(optional)</span></label>
        <Input
          {...register("email")}
          type="email"
          placeholder="your@email.com"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C9A94B]/50"
        />
        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
      </div>

      {/* City */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-xs tracking-widest uppercase">City *</label>
        <Input
          {...register("city")}
          placeholder="Casablanca, Marrakech, Rabat..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C9A94B]/50"
        />
        {errors.city && <p className="text-red-400 text-xs">{errors.city.message}</p>}
      </div>

      {/* Address */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-xs tracking-widest uppercase">Full Address *</label>
        <Textarea
          {...register("address")}
          placeholder="Street, Neighborhood, Building..."
          rows={3}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C9A94B]/50 resize-none"
        />
        {errors.address && <p className="text-red-400 text-xs">{errors.address.message}</p>}
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label className="text-white/40 text-xs tracking-widest uppercase">Notes <span className="text-white/20">(optional)</span></label>
        <Textarea
          {...register("notes")}
          placeholder="Any special instructions..."
          rows={2}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#C9A94B]/50 resize-none"
        />
      </div>

      {/* Submit + WhatsApp */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C9A94B]/10 border border-[#C9A94B]/40 text-[#C9A94B] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A94B]/20 transition-all rounded-none h-auto"
        >
          <Send size={14} />
          {loading ? "Sending..." : "Submit Order"}
        </Button>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-green-600/30 text-green-400 text-xs tracking-[0.2em] uppercase hover:bg-green-600/10 transition-all"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
      </div>

    </form>
  );
}
