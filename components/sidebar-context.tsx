'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface SidebarContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useMobileSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      'useMobileSidebar must be used within a SidebarContextProvider'
    );
  }
  return context;
};

interface SidebarContextProviderProps {
  children: ReactNode;
}

export const SidebarContextProvider = ({
  children,
}: SidebarContextProviderProps) => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
