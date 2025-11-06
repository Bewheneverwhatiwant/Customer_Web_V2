"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-8">
      <div className="flex items-center justify-between">
        {/* 좌측 아이콘 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>

          {/* 메인 문구 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            TPT, 트레이딩의 본질을 담다
          </h1>
        </div>

        {/* 우측 링크 */}
        <Link
          href="/menu/about"
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          About TPT →
        </Link>
      </div>
    </section>
  );
}
