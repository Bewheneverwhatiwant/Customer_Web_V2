'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { tradingService } from '../../../Shared/api/services';

interface WeekData {
  week: string;
  weekNumber: number;
  trades: number | string;
  weeklyPnL: number | string;
  new: boolean;
}

/**
 * 월별 피드백 통계 페이지
 */
export default function FeedbackMonthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const year = searchParams.get('year') || '2025';
  const month = searchParams.get('month') || '1';

  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [summary, setSummary] = useState({ winRate: '-', avgProfit: '-', finalPnL: '-' });

  useEffect(() => {
    const fetchMonthlySummary = async () => {
      setLoading(true);
      try {
        const response = await tradingService.getMonthlySummary(parseInt(year), parseInt(month));

        if (response.success && response.data) {
          const data = response.data;
          const weekNames = ['첫째 주', '둘째 주', '셋째 주', '넷째 주', '다섯째 주'];
          const weeksData: WeekData[] =
            data.monthlyFeedbackSummaryResponseDTO.monthlyWeekFeedbackSummaryResponseDTOS.map(
              (weekData: any) => ({
                week: weekNames[weekData.week - 1] || `${weekData.week}주`,
                weekNumber: weekData.week,
                trades: weekData.tradingCount,
                weeklyPnL: weekData.weeklyPnl,
                new: weekData.status === 'FN',
              })
            );
          setWeeks(weeksData);

          setSummary({
            winRate: `${data.monthlyFeedbackSummaryResponseDTO.winningRate.toFixed(1)}%`,
            avgProfit: `${data.monthlyFeedbackSummaryResponseDTO.monthlyAverageRnr.toFixed(2)}`,
            finalPnL: `${data.monthlyFeedbackSummaryResponseDTO.monthlyPnl.toFixed(2)}`,
          });
        }
      } catch (error) {
        console.error('월간 통계 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySummary();
  }, [year, month]);

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
        {year}년 {month}월 통계
      </h1>

      {/* 월간 요약 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">월간 요약</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">승률</p>
            <p className="text-2xl font-bold">{summary.winRate}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">평균 손익비</p>
            <p className="text-2xl font-bold">{summary.avgProfit}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">월간 손익</p>
            <p className="text-2xl font-bold">{summary.finalPnL}%</p>
          </div>
        </div>
      </div>

      {/* 주차별 목록 */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">주차</th>
              <th className="px-6 py-3 text-left">거래 수</th>
              <th className="px-6 py-3 text-left">주간 손익</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr
                key={index}
                className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  router.push(`/my/feedback-week?year=${year}&month=${month}&week=${week.week}`)
                }
              >
                <td className="px-6 py-4">
                  {week.week}
                  {week.new && (
                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                      NEW
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">{week.trades}</td>
                <td className="px-6 py-4">{week.weeklyPnL}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
