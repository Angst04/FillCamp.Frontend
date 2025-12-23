"use client";
import { clsx } from "clsx";
import { createContext, ReactNode, use } from "react";
import { useDropdown } from "@/hooks/useDropdown";

type DropdownContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const DropdownContext = createContext<DropdownContextType>({
  toggle: () => {},
  close: () => {},
  isOpen: false
});

interface DropdownProps {
  children: ReactNode;
}

const Dropdown = ({ children }: DropdownProps) => {
  const { menuRef, isOpen, action } = useDropdown();

  return (
    <DropdownContext.Provider value={{ isOpen, toggle: action.toggle, close: action.close }}>
      <div className="relative mb-4" ref={menuRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

interface DropdownTriggerProps {
  children: ReactNode;
  className?: string;
}

const DropdownTrigger = ({ children, className }: DropdownTriggerProps) => {
  const context = use(DropdownContext);

  return (
    <div
      onClick={context.toggle}
      className={clsx(
        "rounded-xl bg-white border border-black/20 p-2.5 flex items-center gap-2 cursor-pointer transition-transform duration-200 active:scale-[0.97]",
        className
      )}
    >
      {children}
    </div>
  );
};

DropdownTrigger.displayName = "DropdownTrigger";

interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
}

const DropdownMenu = ({ children, className }: DropdownMenuProps) => {
  const context = use(DropdownContext);

  if (!context.isOpen) return null;

  return (
    <div
      className={clsx(
        "absolute z-40 mt-2 min-w-[90px] rounded-md bg-white shadow-md overflow-hidden w-full border border-black/20",
        className
      )}
    >
      <div className="p-1.5">{children}</div>
    </div>
  );
};

DropdownMenu.displayName = "DropdownMenu";

interface DropdownItemProps {
  children: ReactNode;
  onSelect: () => void;
  className?: string;
}

const DropdownItem = ({ children, onSelect, className }: DropdownItemProps) => {
  const context = use(DropdownContext);

  const handleClick = () => {
    onSelect();
    context.close();
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "block w-full p-2 text-sm text-black transition-colors duration-200 cursor-pointer border-none bg-transparent hover:bg-[#e2e2e3]",
        className
      )}
    >
      {children}
    </button>
  );
};

DropdownItem.displayName = "DropdownItem";

Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;

export { Dropdown };
