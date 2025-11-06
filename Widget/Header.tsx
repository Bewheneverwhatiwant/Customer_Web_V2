"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CustomButton from "../Shared/ui/CustomButton";
import { useAuthStore } from "../Shared/store/authStore";

// 메뉴 항목 타입 정의
type MenuItem = {
  label: string;
  path?: string;
  submenu?: { label: string; path: string }[];
};

// 메뉴 구성
const menuItems: MenuItem[] = [
  { label: "BRAND", path: "/brand" },
  {
    label: "TPT 서비스",
    submenu: [
      { label: "매매일지 작성하기", path: "/service/journal" },
      { label: "All-in-one 강의", path: "/service/lecture" },
      { label: "10억 인사이트", path: "/service/insight" },
    ],
  },
  {
    label: "TPT 커뮤니티",
    submenu: [
      { label: "TPT 매매일지", path: "/community/journal" },
      { label: "TPT 후기", path: "/menu/community/review" },
      { label: "TPT 전문가 분석", path: "/community/analysis" },
    ],
  },
  { label: "ETCC 회원권", path: "/menu/etcc" },
  { label: "고객센터", path: "/my/support" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // zustand에서 로그인 상태 가져오기
  const { isAuthenticated, user } = useAuthStore();

  // 헤더를 숨길 경로 목록
  const hiddenRoutes = ["/login", "/register"];

  if (hiddenRoutes.includes(pathname)) return null;

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm h-16 flex items-center justify-center px-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full max-w-7xl flex items-center justify-between">
          {/* 좌측 로고 영역 */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/final_logo_blue.png"
              alt="TPT Logo"
              width={110}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* 중앙 네비게이션 메뉴 영역 - 데스크톱 */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <div key={item.label}>
                {/* 상위 메뉴 */}
                {item.path ? (
                  <Link
                    href={item.path}
                    className="text-gray-800 font-semibold hover:text-blue-700 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button className="text-gray-800 font-semibold hover:text-blue-700 transition-colors duration-200">
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* 우측 버튼 영역 */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* 로그인 상태: 마이페이지 버튼 및 사용자 아이콘 */}
                <Link href="/my">
                  <CustomButton
                    variant="normalClean"
                    className="hidden md:inline-flex px-4 py-2 text-sm rounded-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    마이페이지
                  </CustomButton>
                </Link>

                {/* 사용자 아이콘 */}
                <Link href="/my">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="프로필"
                        width={40}
                        height={40}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </Link>
              </>
            ) : (
              <>
                {/* 비로그인 상태: 회원가입 및 로그인 버튼 */}
                <Link href="/signup">
                  <CustomButton
                    variant="normalClean"
                    className="hidden md:inline-flex px-4 py-2 text-sm rounded-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    회원가입
                  </CustomButton>
                </Link>

                <Link href="/login">
                  <CustomButton
                    variant="normalFull"
                    className="px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                  >
                    로그인
                  </CustomButton>
                </Link>
              </>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center"
              onClick={() => {
                // 모바일 메뉴 토글 로직 추가 가능
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 전체 메뉴 드롭다운 - Header 하단에 full width */}
      {isMenuOpen && (
        <div
          className="fixed top-16 left-0 right-0 z-20 bg-white shadow-lg border-t border-gray-200 animate-fadeIn"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">
                    {item.label}
                  </h3>
                  {item.submenu ? (
                    <ul className="space-y-2">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.label}>
                          <Link
                            href={subItem.path}
                            className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-150"
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : item.path ? (
                    <Link
                      href={item.path}
                      className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-150"
                    >
                      바로가기 →
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
