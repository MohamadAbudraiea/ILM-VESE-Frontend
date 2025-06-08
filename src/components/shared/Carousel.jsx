import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Carousel = ({ customSlides = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (!customSlides.length) return null;

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg">
      {/* Viewport */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {customSlides.map((slide, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] h-full flex items-center justify-center"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        className="absolute top-1/2 left-4 -translate-y-1/2 btn btn-circle bg-white shadow-md hover:scale-110 transition-transform"
      >
        ❮
      </button>
      <button
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        className="absolute top-1/2 right-4 -translate-y-1/2 btn btn-circle bg-white shadow-md hover:scale-110 transition-transform"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;
