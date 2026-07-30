import React from "react";
import { IMAGES } from "../assets/images";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Credit Information Consent",
}) => {
  return (
    <div className="pt-10 pb-6 px-6 text-center border-b border-gray-100">
      <div className="flex justify-center mb-4">
        {/* Placeholder for MGM Logo */}
        <img src={IMAGES.logo} className="w-20 h-20" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
      <p className="text-xs text-blue-600 font-medium tracking-wide uppercase mt-1">
        Request for Data Access
      </p>
    </div>
  );
};

export default Header;
