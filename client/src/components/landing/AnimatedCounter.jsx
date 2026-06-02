import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function AnimatedCounter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame
    const start = performance.now()
    const duration = 1200

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.floor(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  const formatted =
    value >= 1000000
      ? `${(display / 1000000).toFixed(1)}M`
      : value >= 1000
        ? `${Math.floor(display / 1000)}K`
        : String(display)

  return (
    <motion.span ref={ref} className="tabular-nums">
      {formatted}
      {suffix}
    </motion.span>
  )
}
