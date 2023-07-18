// Next.js
import Image from "next/image";
// libs
import { useKeenSlider } from "keen-slider/react";
// types
import { IProductRecord, IProductSliderData } from "@/types/product";
// styles
import styles from "@/styles/Common/ProductsSlider.module.scss";
import ProductItem from "./ProductItem";
import ProductCard from "../Category/ProductCard";

interface IProductSliderProps {
  data: IProductRecord[];
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

  if (!data || data?.length === 0) return null;

  return (
    <div ref={sliderRef} className="keen-slider">
      {data?.length > 0
        ? data.map((item) => (
            <div key={item.id} className="keen-slider__slide">
              <ProductCard product={item} />
            </div>
          ))
        : null}
    </div>
  );
};

export default ProductsSlider;
