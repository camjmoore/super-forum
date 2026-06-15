'use client';

import { createContext, useContext, useState } from 'react';

interface CreateModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CreateModalContext = createContext<CreateModalContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function CreateModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CreateModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </CreateModalContext.Provider>
  );
}

export const useCreateModal = () => useContext(CreateModalContext);
