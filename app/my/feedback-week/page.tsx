'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { tradingService } from '../../../Shared/api/services';

interface DayData {
  day: string;
  dayNumber: number;
  trades: number | string;
  wins: number | string;
  losses: number | string;
  dailyPnL: number | string;
  new: boolean;
}

/**
 * 주별 피드백 통계 페이지
 */
export default function FeedbackWeekPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const year = searchParams.get('year') || '2025';
  const month = searchParams.get('month') || '1';
  const week = searchParams.get('week') || '첫째 주';

  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<DayData[]>([]);
  const [summary, setSummary] = useState({ winRate: '-', profitLossRatio: '-', weeklyPnL: '-' });

  const getWeekNumber = (weekStr: string): number => {
    const weekMap: { [key: string]: number } = {
      '첫째 주': 1,
      '둘째 주': 2,
      '셋째 주': 3,
      '넷째 주': 4,
      '다섯째 주': 5,
    };
    return weekMap[weekStr] || 1;
  };

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      setLoading(true);
      try {
        const weekNumber = getWeekNumber(week);
        const response = await tradingService.getWeeklySummary(
          parseInt(year),
          parseInt(month),
          weekNumber
        );

        if (response.success && response.data) {
          const data = response.data;
          const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
          const daysData: DayData[] =
            data.weeklyFeedbackSummaryResponseDTO.weeklyWeekFeedbackSummaryResponseDTOS.map(
              (dayData: any) => {
                const dayDate = new Date(dayData.date);
                const dayOfWeek = dayDate.getDay();
                const dayName = dayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
                const dayNumber = dayDate.getDate();

                return {
                  day: dayName,
                  dayNumber: dayNumber,
                  trades: dayData.tradingCount || '-',
                  wins: dayData.winCount || '-',
                  losses: dayData.lossCount || '-',
                  dailyPnL: dayData.dailyPnl || '-',
                  new: dayData.status === 'FN',
                };
              }
            );
          setDays(daysData);

          setSummary({
            winRate: `${data.weeklyFeedbackSummaryResponseDTO.winningRate.toFixed(1)}%`,
            profitLossRatio: `${data.weeklyFeedbackSummaryResponseDTO.weeklyAverageRnr.toFixed(2)}`,
            weeklyPnL: `${data.weeklyFeedbackSummaryResponseDTO.weeklyPnl.toFixed(2)}`,
          });
        }
      } catch (error) {
        console.error('주간 통계 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySummary();
  }, [year, month, week]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {year}년 {month}월 {week} 통계
      </h1>

      {/* 주간 요약 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">주간 요약</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">승률</p>
            <p className="text-2xl font-bold">{summary.winRate}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">평균 손익비</p>
            <p className="text-2xl font-bold">{summary.profitLossRatio}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">주간 손익</p>
            <p className="text-2xl font-bold">{summary.weeklyPnL}%</p>
          </div>
        </div>
      </div>

      {/* 일별 목록 */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">요일</th>
              <th className="px-6 py-3 text-left">거래 수</th>
              <th className="px-6 py-3 text-left">승</th>
              <th className="px-6 py-3 text-left">패</th>
              <th className="px-6 py-3 text-left">일일 손익</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => (
              <tr
                key={index}
                className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  router.push(
                    `/my/feedback-day?year=${year}&month=${month}&week=${week}&day=${day.dayNumber}`
                  )
                }
              >
                <td className="px-6 py-4">
                  {day.day} ({day.dayNumber}일)
                  {day.new && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">NEW</span>}
                </td>
                <td className="px-6 py-4">{day.trades}</td>
                <td className="px-6 py-4 text-green-600">{day.wins}</td>
                <td className="px-6 py-4 text-red-600">{day.losses}</td>
                <td className="px-6 py-4">{day.dailyPnL}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
