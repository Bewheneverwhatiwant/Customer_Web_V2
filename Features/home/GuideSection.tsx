"use client";

import Link from "next/link";

type GuideCard = {
  title: string;
  subtitle: string;
  href: string;
};

const guides: GuideCard[] = [
  {
    title: "TPT 가이드라인",
    subtitle: "TPT 120% 활용 방법",
    href: "/menu/guide/tpt",
  },
  {
    title: "TPT 후기",
    subtitle: "올바른 트레이딩, 장기적 성장",
    href: "/menu/community/review",
  },
  {
    title: "토큰 제도 가이드라인",
    subtitle: "무료 피드백 요청 방법",
    href: "/menu/guide/token",
  },
  {
    title: "ETCC 회원권 알아보기",
    subtitle: "트레이딩에 진심이라면?",
    href: "/menu/etcc",
  },
];

export function GuideSection() {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.title}
            href={guide.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-600">{guide.subtitle}</p>
              </div>

              {/* TPT 로고 */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                TPT
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
