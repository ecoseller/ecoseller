// next
import Image from "next/image";

// react
import { MutableRefObject } from "react";

// libs
import {
  KeenSliderInstance,
  KeenSliderPlugin,
  useKeenSlider,
} from "keen-slider/react";

// components

// mui

// types

import { IProductMedia } from "@/types/product";
// styles
import styles from "@/styles/ProductDetail/MediaGallery.module.scss";

function ThumbnailPlugin(
  mainRef: MutableRefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide: any) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active");
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

interface IMediaGalleryProps {
  media: IProductMedia[];
}

const MediaGallery = ({ media }: IMediaGalleryProps) => {
  /**
   * This component implements a gallery of images and videos for a product using keen-slider.
   * It should be used in the ProductDetail component.
   */
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <>
      <div
        className={`${styles.slider}`}
        style={{
          height: `550px`,
          width: "300px",
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <div className={styles.slider_holder}>
          <div
            ref={sliderRef}
            className={`${styles.slider_items_wrapper} keen-slider`}
          >
            {media?.map((item: IProductMedia, index: number) => {
              return (
                <div className={`${styles.slide_item} keen-slider__slide`}>
                  <div className={styles.slide_wrapper}>
                    <Image
                      src={item?.media}
                      alt={`Product image thumbnail ${index} ${item?.alt}`}
                      fill
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      priority
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`${styles.slider}`}
        style={{
          height: `550px`,
          width: "300px",
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <div className={styles.slider_holder}>
          <div
            ref={thumbnailRef}
            className={`${styles.slider_items_wrapper} keen-slider thumbnail`}
          >
            {media?.map((item: IProductMedia, index: number) => {
              return (
                <div className={`${styles.slide_item} keen-slider__slide`}>
                  <div className={styles.slide_wrapper}>
                    <Image
                      src={item?.media}
                      alt={`Product image thumbnail ${index} ${item?.alt}`}
                      fill
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaGallery;
