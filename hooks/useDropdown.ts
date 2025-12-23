import { RefObject, useEffect, useRef, useState } from "react";

type DropdownResult<T extends HTMLElement = HTMLDivElement> = {
  menuRef: RefObject<T | null>;
  isOpen: boolean;
  action: { open: () => void; close: () => void; toggle: () => void };
};

const useDropdown = <T extends HTMLElement = HTMLDivElement>(): DropdownResult<T> => {
  const menuRef = useRef<T>(null);
  const [isOpen, setIsOpen] = useState(false);

  const action = {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev)
  };

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isOpen]);

  return { menuRef, isOpen, action };
};

export { type DropdownResult, useDropdown };
