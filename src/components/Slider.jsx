"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Slider({ children, itemBasis = "basis-[85%] sm:basis-[46%] lg:basis-[30%] xl:basis-[23%]" }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback((api) => {
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 -ml-0">
          {children.map((child, i) => (
            <div key={i} className={`${itemBasis} shrink-0 grow-0`}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <button
        aria-label="Previous"
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        disabled={!canPrev}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-maroon-500 hover:bg-maroon-500 hover:text-white transition-colors disabled:opacity-0 z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Next"
        onClick={() => emblaApi && emblaApi.scrollNext()}
        disabled={!canNext}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-maroon-500 hover:bg-maroon-500 hover:text-white transition-colors disabled:opacity-0 z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
