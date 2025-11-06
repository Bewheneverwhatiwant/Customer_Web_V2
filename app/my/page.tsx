'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Coins } from 'lucide-react';
import { useAuthStore } from '../../Shared/store/authStore';
import MyPageSidebar from '../../Features/mypage/MyPageSidebar';
import MyPageMain from '../../Features/mypage/MyPageMain';
import { UserStatus } from '../../Shared/store/authStore';
import { DEFAULT_MOCK_CONFIG, getMockUserData } from './constants/mockData';
import CustomModal from '../../Shared/ui/CustomModal';

/**
 * 마이페이지
 * 사용자 정보와 상태에 따라 다른 UI를 표시
 *
 * Mock Data 사용 방법:
 * 1. app/my/constants/mockData.ts 파일을 열기
 * 2. DEFAULT_MOCK_CONFIG.enabled를 true로 변경
 * 3. DEFAULT_MOCK_CONFIG.userStatus를 원하는 상태로 변경
 *    (예: 'UID_REVIEW_PENDING', 'UID_REJECTED', 'UID_APPROVED', 'PAID_BEFORE_TEST',
 *         'PAID_AFTER_TEST_TRAINER_ASSIGNING', 'TRAINER_ASSIGNED')
 */
export default function MyPage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  // Mock Data 사용 여부 확인
  const mockData = getMockUserData(DEFAULT_MOCK_CONFIG);
  const useMockData = DEFAULT_MOCK_CONFIG.enabled && mockData !== null;

  useEffect(() => {
    // Mock Data 사용 시 인증 체크 스킵
    if (useMockData) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      if (!isAuthenticated) {
        await checkAuth();
      }
      setLoading(false);
    };
    initAuth();
  }, [isAuthenticated, checkAuth, useMockData]);

  useEffect(() => {
    // Mock Data 사용 시 리다이렉트 스킵
    if (useMockData) {
      return;
    }

    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router, useMockData]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // Mock Data 사용 또는 실제 사용자 데이터 사용
  let userData;
  let userStatus: UserStatus;

  if (useMockData && mockData) {
    // Mock Data 사용
    userData = mockData;
    userStatus = mockData.userStatus;
  } else {
    // 실제 사용자 데이터 사용
    if (!user) {
      return null;
    }

    userData = {
      name: user.name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      investmentType: user.investmentType,
      userStatus: user.userStatus,
      exchangeName: user.exchangeName || undefined,
      uid: user.uid,
      trainerId: user.trainerId,
      trainerName: user.trainerName,
      isCourseCompleted: user.isCourseCompleted,
      isPremium: user.isPremium,
      remainingToken: 1, // Mock data - API에 토큰 수 필드 없음
    };

    userStatus = user.userStatus || 'UID_REVIEW_PENDING';
  }

  // Fixed 버튼을 보여줄 상태들
  const shouldShowWriteButton =
    userStatus === 'UID_APPROVED' ||
    userStatus === 'PAID_BEFORE_TEST' ||
    userStatus === 'PAID_AFTER_TEST_TRAINER_ASSIGNING' ||
    userStatus === 'TRAINER_ASSIGNED';

  // 토큰 사용 버튼은 UID_APPROVED 상태에서만 표시
  const shouldShowTokenButton = userStatus === 'UID_APPROVED';

  // 매매일지 작성 페이지로 이동
  const handleWriteFeedback = () => {
    router.push('/my/feedback-request');
  };

  // 토큰 사용 모달 열기
  const handleTokenButtonClick = () => {
    setIsTokenModalOpen(true);
  };

  // 토큰 사용 확인
  const handleTokenConfirm = () => {
    setIsTokenModalOpen(false);
    router.push('/my/feedback-request?useToken=true');
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      {/* 개발 환경에서 Mock Data 사용 중일 때 표시 */}
      {useMockData && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">🔧 Mock Data 사용 중</p>
          <p className="text-xs">상태: {mockData?.userStatus}</p>
        </div>
      )}
      <MyPageSidebar userData={userData} />
      <MyPageMain state={userStatus} />

      {/* Fixed 버튼들 - 우측 하단 */}
      {shouldShowWriteButton && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          {/* 토큰 사용 매매일지 작성 버튼 (UID_APPROVED 상태에서만) */}
          {shouldShowTokenButton && (
            <button
              onClick={handleTokenButtonClick}
              className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
              aria-label="토큰 사용하여 매매일지 작성하기"
            >
              <Coins size={24} />
            </button>
          )}

          {/* 일반 매매일지 작성 버튼 */}
          <button
            onClick={handleWriteFeedback}
            className="w-14 h-14 bg-gradient-to-br from-[#B9AB70] to-[#8B7E50] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
            aria-label="매매일지 작성하기"
          >
            <Edit size={24} />
          </button>
        </div>
      )}

      {/* 토큰 사용 확인 모달 */}
      <CustomModal variant={1} isOpen={isTokenModalOpen} onClose={() => setIsTokenModalOpen(false)}>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Coins size={32} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-center">토큰 사용 확인</h3>
          <p className="text-center text-gray-700">
            토큰 1개를 차감하여 매매일지를 작성하고,
            <br />
            이에 대한 피드백을 요청합니다.
          </p>
          <div className="flex gap-3 mt-4 w-full">
            <button
              onClick={() => setIsTokenModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={handleTokenConfirm}
              className="flex-1 px-4 py-2 bg-[#B9AB70] text-white rounded-md hover:bg-[#8B7E50] transition"
            >
              확인
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
