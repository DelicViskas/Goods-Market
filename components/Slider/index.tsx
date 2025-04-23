/* eslint-disable @next/next/no-img-element */
"use client"
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import classes from './index.module.css'
import { useState } from 'react';

export default function Slider({ images }: { images: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!slider.current) return;

    const container = e.currentTarget;
    const { left, width } = container.getBoundingClientRect();
    const relativeX = e.clientX - left;

    if (relativeX < 0 || relativeX > width) return;


    const segmentWidth = width / images.length;
    const index = Math.floor(relativeX / segmentWidth);
    slider.current.moveToIdx(index);
  }

  return (
    <div
      className={`${classes.sliderContainer}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (slider.current) {
          slider.current.moveToIdx(0);
        }
      }}
    >
      <div ref={sliderRef} className={`keen-slider ${classes.wrapper}`}>
        {images.map((src, i) => (
          <div key={i} className="keen-slider__slide">
            <img src={src} alt={`image-${i}`} />
          </div>
        ))}
      </div>

      {images.length > 1 && <div className={classes.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={currentSlide === i ? classes.dotActive : classes.dot}
          // onClick={() => slider.current?.moveToIdx(i)}
          >
          </span>

        ))}
      </div>}
    </div>
  )
}
