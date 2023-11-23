"use client";

import { useLayoutStore } from "@/stores/useLayoutStore";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useMedia } from "react-use";

const MenuIcon = ({ ...props }) => {
  const toggleMenu = useLayoutStore((state) => state.toggleMenu);

  const isLargeDevice = useMedia("(min-width: 768px)");

  useEffect(() => {
    const isLargeDevice = window.innerWidth >= 768;
    if (!isLargeDevice) {
      useLayoutStore.setState({ isMenuOpen: false, isSmallScreen: true });
    } else {
      useLayoutStore.setState({ isSmallScreen: false, isMenuOpen: true });
    }
  }, []);

  useEffect(() => {
    if (!isLargeDevice) {
      useLayoutStore.setState({ isMenuOpen: false, isSmallScreen: true });
    } else {
      useLayoutStore.setState({ isSmallScreen: false });
    }
  }, [isLargeDevice]);

  return (
    <motion.div
      onClick={() => toggleMenu()}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
        />
      </svg>
    </motion.div>
  );
};

export default MenuIcon;
