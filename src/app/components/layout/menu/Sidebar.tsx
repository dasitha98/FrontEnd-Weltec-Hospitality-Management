"use client";

import React, { useState } from "react";

// ICONS
import * as AiIcons from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";
import { FaUsers } from "react-icons/fa";

import "./index.css";
import Link from "next/link";

export default function Sidebar() {
  const SidebarData = [
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
      path: "/",
      icon: <AiIcons.AiFillFire />,
      name: "nav-text",
    },
    {
      title: "Users",
      path: "/",
      icon: <FaUsers />,
      name: "nav-text",
    },
  ];

  return (
    <div className="nav-menu">
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
