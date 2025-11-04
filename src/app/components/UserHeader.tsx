"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { getUserInfoFromToken, type UserInfo } from "@/utils/jwt";

export default function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip rendering on login page
    if (pathname === "/login") {
      setIsLoading(false);
      return;
    }

    // Reset loading state when pathname changes
    setIsLoading(true);

    // Try to get user info from localStorage first (stored during login)
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserInfo({
          name: user.Name || user.name,
          userId: user.UserId || user.userId,
          role: user.Role || user.role,
        });
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing stored user info:", error);
      }
    }

    // If not in localStorage, try to decode JWT token
    const token = Cookies.get("accessToken");
    if (token) {
      const userInfoFromToken = getUserInfoFromToken(token);
      if (userInfoFromToken) {
        setUserInfo(userInfoFromToken);
      }
    }

    setIsLoading(false);
  }, [pathname]);

  const handleLogout = () => {
    // Remove access token
    Cookies.remove("accessToken", { path: "/" });

    // Remove user info from localStorage
    localStorage.removeItem("userInfo");

    // Redirect to login page
    router.push("/login");
  };

  // Don't render on login page
  if (pathname === "/login") {
    return null;
  }

  // Don't render until user info is loaded to prevent flashing
  if (isLoading || !userInfo) {
    return null;
  }

  return (
    <div className="flex items-center gap-10 ml-auto">
      <div className="flex items-center gap-1.5">
        <FaUser className="text-white" size={12} />
        <span className="text-white text-sm font-medium">
          {userInfo?.name ||
            (userInfo?.userId ? `User ${userInfo.userId}` : "User")}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
        title="Logout"
      >
        <FaSignOutAlt size={12} />
        <span>Logout</span>
      </button>
    </div>
  );
}
