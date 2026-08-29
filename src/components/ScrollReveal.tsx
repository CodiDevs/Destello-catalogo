"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type ScrollRevealProps = {
  children?: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  offset?: number;
  style?: CSSProperties;
  id?: string;
  "aria-hidden"?: boolean;
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 700,
  offset = 80,
  style,
  id,
  "aria-hidden": ariaHidden,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: `0px 0px -${offset}px 0px`,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [offset]);

  return (
    <div
      ref={ref}
      id={id}
      aria-hidden={ariaHidden}
      className={`scroll-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
