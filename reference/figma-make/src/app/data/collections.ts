export interface Collection {
  id: string;
  name: string;
  icon: string;
  toolIds: string[];
  color: string;
}

export interface UserData {
  savedTools: string[];
  collections: Collection[];
}

// Mock user data - in real app this would come from a database
export const initialUserData: UserData = {
  savedTools: ['1', '2', '4'],
  collections: [
    {
      id: 'c1',
      name: 'Work Tools',
      icon: 'Briefcase',
      toolIds: ['2', '4', '6'],
      color: '#3b82f6',
    },
    {
      id: 'c2',
      name: 'Creative',
      icon: 'Palette',
      toolIds: ['1', '3', '7'],
      color: '#ec4899',
    },
  ],
};
