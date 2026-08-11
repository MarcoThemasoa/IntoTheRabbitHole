import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FaqAccordionProps {
  items: { q: string; a: string }[];
}

/**
 * FAQ accordion berbasis state (bukan <details>).
 * Konten selalu dirender di DOM sehingga transisi max-height/opacity
 * selalu berjalan setiap kali dibuka/ditutup — tidak snap seperti <details>.
 */
export default function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <FaqItem key={item.q} q={item.q} a={item.a} />
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
        open ? "shadow-md" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex items-center justify-between gap-4 cursor-pointer w-full p-6 font-semibold text-slate-900 text-lg text-left"
      >
        <span className="flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-sky-500 flex-shrink-0" />
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-sky-500 flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="faq-content"
        style={{ maxHeight: open ? "600px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="px-6 pb-6 text-slate-600 leading-relaxed font-light">{a}</p>
      </div>
    </div>
  );
}