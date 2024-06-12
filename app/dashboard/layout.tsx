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
        <div className='mx-5 md:mx-20 lg:mx-36'>
          {children}
        </div>
        {/* {children} */}
        </div>
    </>
  );
};

export default Layout;
