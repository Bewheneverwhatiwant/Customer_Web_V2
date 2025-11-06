'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../Shared/store/authStore';
import MyPageSidebar from '../../Features/mypage/MyPageSidebar';
import MyPageMain from '../../Features/mypage/MyPageMain';
import { UserStatus } from '../../Shared/store/authStore';
import { DEFAULT_MOCK_CONFIG, getMockUserData } from './constants/mockData';

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

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* 개발 환경에서 Mock Data 사용 중일 때 표시 */}
      {useMockData && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">🔧 Mock Data 사용 중</p>
          <p className="text-xs">상태: {mockData?.userStatus}</p>
        </div>
      )}
      <MyPageSidebar userData={userData} />
      <MyPageMain state={userStatus} />
    </div>
  );
}
