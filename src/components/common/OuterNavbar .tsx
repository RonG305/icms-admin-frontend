"use client"

import React, { ReactNode, useState } from "react";
import { IoMdCube } from "react-icons/io";
import { FaUser , FaUserCircle} from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import Link from "next/link";
import { Button } from "../ui/button";

interface NavbarProps {
  buttonBackgroundColor: string;
  logo: string;
  btnTextColor: string;
  navbarStyle: string;
  iconColor:string;
}


interface NavbarUrlsInterface {
  urlTitle: string;
  urlPath: string;
  icon: ReactNode;
}



const Navbar:React.FC<NavbarProps> = ({ buttonBackgroundColor, logo, btnTextColor, navbarStyle, iconColor }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navbarUrls: NavbarUrlsInterface[] = [
    {
      urlTitle: "Dashboard",
      urlPath: "/dashboard",
      icon: <IoMdCube color={iconColor}/>
    },
    {
      urlTitle: "Profile",
      urlPath: "/dashboard/profile",
      icon: <FaUser color={iconColor}/>
    },
    {
      urlTitle: "Sign up",
      urlPath: "/auth/register",
      icon: <FaUserCircle color={iconColor}/>
    },
    {
      urlTitle: "Signin",
      urlPath: "/auth/login",
      icon: <IoKeySharp color={iconColor}/>
    },
  ];

  const handleToggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`flex items-center justify-between px-5 py-2 bg-card relative rounded`}>
      <img className="w-[80px] h-[80px] rounded-full bg-cover" src={logo} alt="icms logo" />
      <div className="hidden md:flex items-center justify-between gap-4 uppercase font-semibold">
        {navbarUrls.map((navbarUrl, index) => (
          <Link className=" flex gap-2 items-center" key={index} href={navbarUrl.urlPath}>
            {navbarUrl.icon}{navbarUrl.urlTitle}
          </Link>
        ))}
      </div>

      <Button
        className="hidden md:inline-block py-2 px-6 font-semibold "
        style={{
          borderRadius: "34.5px",
          color: btnTextColor,
          
        }}
      >
        Signup/Login
      </Button>
      <div className="md:hidden flex items-center">
        <button onClick={handleToggleMenu} className="focus:outline-none">
          {isMobileMenuOpen ? (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
      </div>
     
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full p-4 bg-card text-color shadow-lg">
          <div className="flex flex-col items-center p-5 gap-4 uppercase font-semibold">
            {navbarUrls.map((navbarUrl, index) => (
              <Link key={index} href={navbarUrl.urlPath} onClick={handleToggleMenu}>
                {navbarUrl.urlTitle}
              </Link>
            ))}
            <button
              className="p-2 font-semibold"
              style={{
                borderRadius: "34.5px",
                backgroundColor: buttonBackgroundColor,
                color: btnTextColor,
              }}
              onClick={handleToggleMenu}
            >
              Signup/Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
