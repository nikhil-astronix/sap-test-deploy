// components/ImageButton.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ImageButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-0 border-none bg-transparent cursor-pointer"
    >
      <Image
        src="/archive.png" 
        alt="Button Image"
        width={30}
        height={30}
        priority
      />
    </motion.button>
  )
}
