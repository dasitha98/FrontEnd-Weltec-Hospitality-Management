"use client";

import React, { useState } from "react";

// ICONS
import * as AiIcons from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUsers } from "react-icons/fa";

import "./index.css";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  const SidebarData = [
    {
      title: "Home",
      path: "/",
      icon: <AiIcons.AiFillFire />,
      name: "nav-text",
    },
    {
      title: "Ingredients",
      path: "/ingredients",
      icon: <AiIcons.AiFillFire />,
      name: "nav-text",
    },
    {
      title: "Recipes",
      path: "/recipe",
      icon: <AiIcons.AiFillFire />,
      name: "nav-text",
    },
    {
      title: "Classes",
      path: "/classes",
      icon: <SiGoogleclassroom />,
      name: "nav-text",
    },
    {
      title: "Supplier",
      path: "/suppliers",
      icon: <AiIcons.AiFillFire />,
      name: "nav-text",
    },
    {
      title: "Users",
      path: "/users",
      icon: <FaUsers />,
      name: "nav-text",
    },
  ];

  return (
    <div className="nav-menu bg-blue-950 text-white">
      {/* <Image
        className="image"
        src={"/weltec_logo.jpg"}
        alt={"weltec_logo"}
        height={80}
        width={100}
      /> */}
      <ul className="nav-menu-items">
        {SidebarData.map((item, index) => {
          return (
            <li key={index} className={item.name}>
              <Link href={item.path}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
