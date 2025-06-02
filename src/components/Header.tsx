import React from "react";

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl  mb-3 text-center font-medium">{title}</h1>
      <p className="text-gray-600 mb-4 text-center">{description}</p>
    </div>
  );
};

export default Header;
