"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type JournalCard = {
  id: number;
  title: string;
  description: string;
  profit: number;
  chartImage?: string;
};

// 임시 데이터
const journalData: JournalCard[] = [
  {
    id: 1,
    title: "엘론코인 알아보고 접근하자",
    description: "도지코인의 급등 원인과 향후 전망 분석",
    profit: 12.5,
  },
  {
    id: 2,
    title: "BTC 상승 추세 분석",
    description: "비트코인 68,000달러 돌파 가능성",
    profit: 8.3,
  },
  {
    id: 3,
    title: "ETH 롱 전략 리뷰",
    description: "이더리움 지지선 확인 후 진입",
    profit: -3.2,
  },
  {
    id: 4,
    title: "알트코인 스윙 전략",
    description: "중장기 관점의 포트폴리오 구성",
    profit: 15.7,
  },
  {
    id: 5,
    title: "숏 포지션 타이밍",
    description: "과매수 구간에서의 숏 진입 사례",
    profit: 6.1,
  },
];

export function TraderJournalSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < journalData.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/menu/columns/${id}`);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">TPT 트레이더 매매일지</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= journalData.length - 3}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {journalData.map((journal) => (
            <div
              key={journal.id}
              onClick={() => handleCardClick(journal.id)}
              className="min-w-[calc(33.333%-1rem)] bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            >
              {/* 차트 이미지 영역 */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-48 flex items-center justify-center">
                <svg className="w-32 h-32 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>

              {/* 내용 */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">{journal.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{journal.description}</p>
                <div
                  className={`text-lg font-bold ${
                    journal.profit > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {journal.profit > 0 ? "+" : ""}
                  {journal.profit}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
