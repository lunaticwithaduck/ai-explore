import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Library } from './components/Library';
import { ToolDetail } from './components/ToolDetail';
import { BundleDetail } from './components/BundleDetail';
import { Header } from './components/Header';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { UserProvider } from './context/UserContext';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="size-full flex flex-col bg-background text-foreground dark">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedCollection={selectedCollection}
              onCollectionChange={setSelectedCollection}
            />

            <Routes>
              <Route
                path="/"
                element={
                  <Library
                    selectedCategory={selectedCategory}
                    selectedCollection={selectedCollection}
                  />
                }
              />
              <Route path="/tool/:id" element={<ToolDetail />} />
              <Route path="/bundle/:id" element={<BundleDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}