import React from 'react';
import Header from './_components/Header';

interface LayoutProps {
  readonly children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div>
        <Header></Header>
        {children}
        </div>
    </>
  );
};

export default Layout;
