'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../Shared/store/authStore';
import { useAuth } from '../../../Shared/hooks/useAuth';
import { mapSwingFormData, mapDayFormData, mapScalpingFormData, mapFreeFormData } from '../../../Shared/utils/feedbackFormMapper';
import BasicOrBeforeForm from '../../../Features/feedback-request/BasicOrBeforeForm';
import SwingAfterForm from '../../../Features/feedback-request/SwingAfterForm';
import DayAfterForm from '../../../Features/feedback-request/DayAfterForm';
import ScalpingAfterForm from '../../../Features/feedback-request/ScalpingAfterForm';
import SaveSuccess from '../../../Features/feedback-request/SaveSuccess';

/**
 * 피드백 요청 페이지
 * 사용자의 투자 유형, 회원 등급, 완강 상태에 따라 다른 폼을 표시
 */
export default function RequestFeedbackPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { requestSwingFeedback, requestDayFeedback, requestScalpingFeedback } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return <div className="text-center mt-20">로그인이 필요합니다.</div>;
  }

  const investmentType = user.investmentType || 'SCALPING';
  const userLevel = user.isPremium ? 'PREMIUM' : 'BASIC';
  const completion = user.isCourseCompleted ? 'AFTER_COMPLETION' : 'BEFORE_COMPLETION';

  const handleSubmit = async (formData: any) => {
    console.log('서버로 전송할 데이터:', formData);

    try {
      let fd: FormData;
      let res;

      if (investmentType === 'SWING') {
        if (userLevel === 'BASIC' || completion === 'BEFORE_COMPLETION') {
          fd = mapFreeFormData(formData);
          res = await requestSwingFeedback(fd);
        } else {
          fd = mapSwingFormData(formData);
          res = await requestSwingFeedback(fd);
        }
      } else if (investmentType === 'DAY') {
        if (userLevel === 'BASIC' || completion === 'BEFORE_COMPLETION') {
          fd = mapFreeFormData(formData);
          res = await requestDayFeedback(fd);
        } else {
          fd = mapDayFormData(formData);
          res = await requestDayFeedback(fd);
        }
      } else if (investmentType === 'SCALPING') {
        if (userLevel === 'BASIC' || completion === 'BEFORE_COMPLETION') {
          fd = mapFreeFormData(formData);
          res = await requestScalpingFeedback(fd);
        } else {
          fd = mapScalpingFormData(formData);
          res = await requestScalpingFeedback(fd);
        }
      }

      console.log('서버 응답:', res);

      if (res && res.success) {
        setOpen(true);
      } else {
        const errorMessage = res?.message || res?.error || '피드백 저장에 실패했습니다.';
        alert(errorMessage);
        console.error('서버 응답 오류:', res);
      }
    } catch (error) {
      console.error('피드백 요청 예외 발생:', error);
      alert('피드백 저장 중 오류가 발생했습니다. 입력하신 내용을 확인해주세요.');
    }
  };

  const renderForm = () => {
    if (userLevel === 'BASIC' || completion === 'BEFORE_COMPLETION') {
      return <BasicOrBeforeForm onSubmit={handleSubmit} currentUser={user} />;
    }
    if (completion === 'AFTER_COMPLETION') {
      if (investmentType === 'SWING')
        return <SwingAfterForm currentUser={user} onSubmit={handleSubmit} />;
      if (investmentType === 'DAY') return <DayAfterForm currentUser={user} onSubmit={handleSubmit} />;
      if (investmentType === 'SCALPING')
        return <ScalpingAfterForm currentUser={user} onSubmit={handleSubmit} />;
    }
    return <div>조건에 맞는 Form이 없습니다.</div>;
  };

  return (
    <div className="flex h-screen bg-white flex-col items-center gap-6 p-6 mt-20">
      <div className="w-full max-w-lg p-6">{renderForm()}</div>
      <SaveSuccess isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
