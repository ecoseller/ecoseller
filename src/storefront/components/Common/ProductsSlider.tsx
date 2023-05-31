// Next.js
import Image from "next/image";
// libs
import { useKeenSlider } from "keen-slider/react";
// types
import { IProductSliderData } from "@/types/product";
// styles
import styles from "@/styles/Common/ProductsSlider.module.scss";
import ProductItem from "./ProductItem";

interface IProductSliderProps {
  data: IProductSliderData[];
}

const ProductsSlider = ({ data }: IProductSliderProps) => {
  // keen slider component for product slider
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: { perView: 2, spacing: 10, origin: "center" },
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 2, spacing: 5, origin: "center" },
        },
        "(min-width: 1200px)": {
          slides: { perView: 4, spacing: 10 },
        },
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 4000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  return (
    <div ref={sliderRef} className="keen-slider">
      {data.map((item) => (
        <div key={item.id} className="keen-slider__slide">
          <ProductItem {...item} />
        </div>
      ))}
    </div>
  );
};

export default ProductsSlider;
