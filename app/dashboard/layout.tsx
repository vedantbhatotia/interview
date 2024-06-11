import React from 'react';

interface LayoutProps {
  readonly children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default Layout;
