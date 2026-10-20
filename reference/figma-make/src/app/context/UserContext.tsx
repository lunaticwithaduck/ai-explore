import { createContext, useContext, useState, ReactNode } from 'react';
import { initialUserData, UserData, Collection } from '../data/collections';

interface UserContextType {
  userData: UserData;
  toggleSavedTool: (toolId: string) => void;
  isToolSaved: (toolId: string) => boolean;
  addCollection: (collection: Omit<Collection, 'id'>) => void;
  deleteCollection: (collectionId: string) => void;
  addToolToCollection: (collectionId: string, toolId: string) => void;
  removeToolFromCollection: (collectionId: string, toolId: string) => void;
  isToolInCollection: (collectionId: string, toolId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const toggleSavedTool = (toolId: string) => {
    setUserData((prev) => ({
      ...prev,
      savedTools: prev.savedTools.includes(toolId)
        ? prev.savedTools.filter((id) => id !== toolId)
        : [...prev.savedTools, toolId],
    }));
  };

  const isToolSaved = (toolId: string) => {
    return userData.savedTools.includes(toolId);
  };

  const addCollection = (collection: Omit<Collection, 'id'>) => {
    const newCollection: Collection = {
      ...collection,
      id: `c${Date.now()}`,
    };
    setUserData((prev) => ({
      ...prev,
      collections: [...prev.collections, newCollection],
    }));
  };

  const deleteCollection = (collectionId: string) => {
    setUserData((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c.id !== collectionId),
    }));
  };

  const addToolToCollection = (collectionId: string, toolId: string) => {
    setUserData((prev) => ({
      ...prev,
      collections: prev.collections.map((c) =>
        c.id === collectionId && !c.toolIds.includes(toolId)
          ? { ...c, toolIds: [...c.toolIds, toolId] }
          : c
      ),
    }));
  };

  const removeToolFromCollection = (collectionId: string, toolId: string) => {
    setUserData((prev) => ({
      ...prev,
      collections: prev.collections.map((c) =>
        c.id === collectionId
          ? { ...c, toolIds: c.toolIds.filter((id) => id !== toolId) }
          : c
      ),
    }));
  };

  const isToolInCollection = (collectionId: string, toolId: string) => {
    const collection = userData.collections.find((c) => c.id === collectionId);
    return collection?.toolIds.includes(toolId) || false;
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        toggleSavedTool,
        isToolSaved,
        addCollection,
        deleteCollection,
        addToolToCollection,
        removeToolFromCollection,
        isToolInCollection,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
