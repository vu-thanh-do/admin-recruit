'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1, 0.8],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* 404 Text with animation */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <motion.span
            className="bg-gradient-to-br from-primary to-primary/20 bg-clip-text text-[10rem] font-extrabold leading-none text-transparent select-none"
            animate={{ 
              textShadow: ["0 0 5px rgba(0,0,0,0.1)", "0 0 15px rgba(0,0,0,0.2)", "0 0 5px rgba(0,0,0,0.1)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            404
          </motion.span>

          {/* Animated broken pieces */}
          <motion.div 
            className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-primary"
            animate={{ 
              x: [0, -30, -40],
              y: [0, 40, 60],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-primary"
            animate={{ 
              x: [0, 40, 50],
              y: [0, 30, 50],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>

        {/* Title with animation */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-heading my-4 text-3xl font-bold"
        >
          Page Not Found
        </motion.h2>

        {/* Description with animation */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-muted-foreground mb-8"
        >
          Oops! The page you are looking for might have been moved, 
          deleted, or possibly never existed.
        </motion.p>

        {/* Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-8 relative"
        >
          <motion.div 
            className="relative w-64 h-64 flex items-center justify-center"
            animate={{ rotateY: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full opacity-50"></div>
            <motion.div
              className="text-8xl"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              🛸
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Buttons with animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            onClick={() => router.back()} 
            variant="default" 
            size="lg"
            className="gap-2 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
          
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            size="lg"
            className="gap-2 group"
          >
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => window.location.reload()}
            variant="ghost"
            size="lg"
            className="gap-2 group"
          >
            <RefreshCw className="h-4 w-4 group-hover:rotate-90 transition-transform" />
            Refresh
          </Button>
        </motion.div>
      </div>
    </div>
  );
}