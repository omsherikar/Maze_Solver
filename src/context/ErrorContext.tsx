import React, { createContext, useContext, useState, useCallback } from 'react';
import ErrorMessage from '../components/ErrorMessage';

type MessageType = 'error' | 'success' | 'warning' | 'info';

interface Message {
  id: number;
  message: string;
  type: MessageType;
}

interface ErrorContextType {
  showError: (message: string, type?: MessageType) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const showError = useCallback((message: string, type: MessageType = 'error') => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, message, type }]);
  }, []);

  const removeMessage = useCallback((id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {messages.map(msg => (
          <ErrorMessage
            key={msg.id}
            message={msg.message}
            type={msg.type}
            onClose={() => removeMessage(msg.id)}
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}; 