// next
import Link from "next/link";
import Image from "next/image";
// react
import { useState } from "react";
// libs
import { useKeenSlider } from "keen-slider/react";
import Arrow from "./Arrow";
// mui
// types
// styles
import styles from "@/styles/Slider/Slider.module.scss";

interface ISliderData {
  id: number;
  alt: string;
  url: string;
  image: string;
}

const data: ISliderData[] = [
  {
    id: 1,
    alt: "image 1",
    url: "/",
    image: "/images/slider/1.jpg",
  },
  {
    id: 2,
    alt: "image 2",
    url: "/",
    image: "/images/slider/2.jpg",
  },
];

const Slider = ({}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  console.log("loaded", loaded);
  const [sliderRef, sliderInstance] = useKeenSlider(
    {
      initial: 0,
      loop: true,
      slideChanged(slider) {
        setCurrentSlideIndex(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
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
    <>
      <div
        className={`${styles.slider}`}
        style={{
          height: `550px`,
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <div className={styles.slider_holder}>
          <div
            ref={sliderRef}
            className={`${styles.slider_items_wrapper} keen-slider`}
          >
            {data?.map((item: ISliderData, index: number) => {
              return (
                <Link href={item?.url} key={item.id}>
                  <div className={`${styles.slide_item} keen-slider__slide`}>
                    <div className={styles.slide_wrapper}>
                      <Image
                        src={item?.image}
                        alt={`Slider image ${index}`}
                        fill
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        priority
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        {loaded && sliderInstance.current && (
          <>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || sliderInstance.current?.prev()
              }
              disabled={currentSlideIndex === 0}
            />

            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || sliderInstance.current?.next()
              }
              disabled={
                currentSlideIndex ===
                sliderInstance.current.track.details.slides.length - 1
              }
            />
          </>
        )}
        <div className={`${styles.dots} dots`}>
          {[...Array(data?.length || 0)].map((idx: any, index: number) => {
            return (
              <button
                key={`sliderDot${index}`}
                onClick={() => {
                  sliderInstance?.current?.moveToIdx(index);
                }}
                className={`${styles.dot_item} dot ${
                  currentSlideIndex === index ? styles.active : ""
                }`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Slider;
