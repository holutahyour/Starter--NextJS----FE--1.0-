import React from "react";

const PageContainer = ({
  children,
  pageTitle,
  externalStyle,
}: Readonly<{
  children: React.ReactNode;
  pageTitle: string;
  externalStyle?: string;
}>) => {
  return (
    <div className={`mt-[6.4rem] ${externalStyle}`}>
      <p className="text-[2.4rem] mb-[1.15rem] text-black-100 font-medium ml-[4.2rem]">
        {pageTitle}
      </p>
      {children}
    </div>
  );
};

export default PageContainer;
