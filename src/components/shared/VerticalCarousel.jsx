import { useEffect, useRef } from "react";

function VerticalCarousel() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let index = 0;

    const interval = setInterval(() => {
      if (!carousel) return;

      const items = carousel.querySelectorAll(".carousel-item");
      const itemWidth = items[0].offsetWidth;

      index = (index + 1) % items.length;
      carousel.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
    }, 2000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={carouselRef}
      className="carousel rounded-box w-64 overflow-x-auto scroll-smooth whitespace-nowrap"
    >
      {["env1.jpg", "env2.jpg", "env3.jpg", "env4.jpg", "env5.jpg"].map(
        (img, i) => (
          <div className="carousel-item w-full inline-block" key={i}>
            <img
              src={`${img}`}
              className="w-full rounded-md"
              alt={`School environment ${i + 1}`}
            />
          </div>
        )
      )}
    </div>
  );
}

export default VerticalCarousel;
