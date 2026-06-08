import { createContext, useContext, useState, ReactNode } from 'react';

type ModalTab = 'login' | 'register';

interface AuthModalContextType {
  isOpen: boolean;
  tab: ModalTab;
  open: (tab?: ModalTab) => void;
  close: () => void;
  setTab: (tab: ModalTab) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<ModalTab>('login');

  const open = (t: ModalTab = 'login') => { setTab(t); setIsOpen(true); };
  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, tab, open, close, setTab }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
};
