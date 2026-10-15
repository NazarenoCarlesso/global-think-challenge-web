"use client"
import { motion } from "motion/react";

export const Title = () => {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: "easeOut", delay: 0.08 }}
    >
      <motion.h1
        className="hero__title"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.38, ease: "easeOut", delay: 0.16 }}
      >
        Tecnología que <span>te conecta</span>
      </motion.h1>
      <motion.p
        className="hero__sub"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.34, ease: "easeOut", delay: 0.24 }}
      >
        Encontrá tus próximos favoritos en Global Think Technology Store.
      </motion.p>
    </motion.section>
  )
}