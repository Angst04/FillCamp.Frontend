/**
 * Reusable Framer Motion animation variants and utilities
 * Following KISS and DRY principles
 */

import { Variants, Transition } from "motion/react";

// ==================== TRANSITIONS ====================
export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 20
};

// ==================== PAGE TRANSITIONS ====================
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// ==================== CARD ANIMATIONS ====================
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothSpring
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: spring
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const scaleOnHover: Variants = {
  hover: {
    scale: 1.05,
    transition: spring
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// ==================== LIST ANIMATIONS ====================
export const listContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothSpring
  }
};

// ==================== BUTTON ANIMATIONS ====================
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: spring
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 }
  }
};

export const iconButtonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: spring
  },
  tap: {
    scale: 0.9,
    rotate: -5,
    transition: { duration: 0.1 }
  }
};

// ==================== NAVIGATION ANIMATIONS ====================
export const navItemVariants: Variants = {
  inactive: {
    scale: 1,
    y: 0
  },
  active: {
    scale: 1.1,
    y: -2,
    transition: spring
  }
};

export const navIconVariants: Variants = {
  inactive: {
    scale: 1,
    rotate: 0
  },
  active: {
    scale: 1.15,
    rotate: 0,
    transition: spring
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.1 }
  }
};

// ==================== COUNTER ANIMATIONS ====================
export const counterVariants: Variants = {
  initial: { scale: 1 },
  increase: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// ==================== BADGE ANIMATIONS ====================
export const badgeVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: spring
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// ==================== SLIDE ANIMATIONS ====================
export const slideInFromRight: Variants = {
  initial: {
    x: 100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: smoothSpring
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const slideInFromLeft: Variants = {
  initial: {
    x: -100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: smoothSpring
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const slideInFromBottom: Variants = {
  initial: {
    y: 100,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: smoothSpring
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// ==================== MODAL ANIMATIONS ====================
export const modalContentVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: smoothSpring },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

// ==================== UTILITY FUNCTIONS ====================
export const getStaggerDelay = (index: number, baseDelay = 0.05): number => {
  return index * baseDelay;
};
