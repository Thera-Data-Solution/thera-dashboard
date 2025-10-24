// src/components/Layout.jsx
import React from 'react';
import { ReactNode } from 'react';

const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-xl font-bold text-blue-600">Aplikasi Auth Sederhana</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;