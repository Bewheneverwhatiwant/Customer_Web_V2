'use client';

export const dynamic = 'force-dynamic';



import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { feedbackService } from '../../../Shared/api/services';
import FeedbackListItem from '../../../Features/feedback-view/FeedbackListItem';

interface DayData {
  time: string;
  title: string;
  isNew: boolean;
  feedbackId: number;
}

/**
 * 일별 피드백 목록 페이지
 */
export default function FeedbackDayPage() {
  const searchParams = useSearchParams();
  const year = searchParams.get('year') || '2025';
  const month = searchParams.get('month') || '1';
  const day = searchParams.get('day') || '1';

  const [entries, setEntries] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedbackList = async () => {
      try {
        setLoading(true);
        const response = await feedbackService.getFeedbackByDate(
          Number(year),
          Number(month),
          Number(day)
        );

        if (response.success && response.data) {
          const feedbackList = response.data;
          const transformedEntries: DayData[] = feedbackList.map((item: any, index: number) => {
            const createdDate = new Date(item.createdAt);
            const hours = createdDate.getHours();
            const minutes = createdDate.getMinutes();
            const period = hours >= 12 ? 'pm' : 'am';
            const displayHours = hours % 12 || 12;
            const time = `${period} ${displayHours}:${String(minutes).padStart(2, '0')}`;

            const isNew = item.status === 'FN';
            const investmentTypeLabel =
              item.investmentType === 'DAY'
                ? '데이'
                : item.investmentType === 'SWING'
                  ? '스윙'
                  : '스켈핑';

            return {
              time,
              title: `${month}/${day} (${investmentTypeLabel} ${index + 1}) 작성 완료`,
              isNew: isNew,
              feedbackId: item.id,
            };
          });

          setEntries(transformedEntries);
        } else {
          setError(response.error || '피드백 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('피드백 목록 조회 오류:', err);
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadFeedbackList();
  }, [year, month, day]);

  if (loading) {
    return (
      <div className="p-6 mt-20 flex justify-center items-center">
        <div className="text-center py-10">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-20 flex justify-center items-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-20 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {year}년 {month}월 {day}일 피드백
      </h1>
      <div className="bg-white rounded-lg shadow">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">피드백이 없습니다.</div>
        ) : (
          entries.map((entry, index) => (
            <FeedbackListItem key={index} {...entry} />
          ))
        )}
      </div>
    </div>
  );
}
