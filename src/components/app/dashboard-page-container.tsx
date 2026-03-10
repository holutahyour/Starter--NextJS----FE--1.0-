import React from "react";

const DashboardPageContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="mt-[6.4rem] w-[95vw] ml-[4.2rem] ">
      <p className="text-[2.4rem] mb-[1.15rem] text-black-100 font-medium">
        Home
      </p>
      {children}
    </div>
  );
};

export default DashboardPageContainer;
