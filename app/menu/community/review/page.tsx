'use client';

import { Header } from '../../../../Widget/Header';
import { Footer } from '../../../../Widget/Footer';
import { Star, ThumbsUp, User } from 'lucide-react';
import Image from 'next/image';

/**
 * TPT 후기 페이지
 * 회원들의 실제 후기와 성장 스토리
 */
export default function ReviewPage() {
  // Mock 데이터 - 실제로는 API에서 가져와야 함
  const reviews = [
    {
      id: 1,
      userName: '김트레이더',
      userImage: null,
      rating: 5,
      date: '2025-01-05',
      title: 'TPT 덕분에 안정적인 수익을 내고 있습니다',
      content:
        '처음에는 단타 위주로 무작정 매매하다가 손실만 쌓였는데, TPT 트레이너님의 지도를 받으면서 체계적인 트레이딩을 배웠습니다. 특히 매매일지를 꾸준히 작성하고 피드백을 받는 과정에서 제 문제점을 정확히 파악할 수 있었습니다. 3개월 만에 수익률이 크게 개선되었고, 이제는 안정적으로 수익을 내고 있습니다.',
      likes: 42,
      improvement: '+35% 수익률 개선',
    },
    {
      id: 2,
      userName: '이투자',
      userImage: 'https://via.placeholder.com/150',
      rating: 5,
      date: '2025-01-03',
      title: '장기적 성장에 집중하게 되었습니다',
      content:
        'TPT를 시작하기 전에는 단기 수익에만 집착했었는데, 트레이너님께서 장기적인 관점에서 접근하는 법을 알려주셨습니다. 손실을 보더라도 왜 손실이 났는지, 어떻게 개선할 수 있는지 분석하는 습관이 생겼습니다. 당장의 수익보다 성장에 집중하니 오히려 결과가 더 좋아졌습니다.',
      likes: 38,
      improvement: '손실 -60% 감소',
    },
    {
      id: 3,
      userName: '박매매',
      userImage: null,
      rating: 5,
      date: '2024-12-28',
      title: '체계적인 커리큘럼이 정말 좋습니다',
      content:
        '독학으로 공부하다가 한계를 느껴 TPT에 가입했습니다. 기초부터 차근차근 배울 수 있는 커리큘럼이 인상적이었고, 무엇보다 1:1 트레이너와의 소통이 큰 도움이 되었습니다. 이제는 차트를 보는 눈이 완전히 달라졌고, 매매에 대한 자신감도 생겼습니다.',
      likes: 31,
      improvement: '승률 +25% 향상',
    },
    {
      id: 4,
      userName: '최초보',
      userImage: 'https://via.placeholder.com/150',
      rating: 4,
      date: '2024-12-20',
      title: '초보자도 쉽게 따라갈 수 있어요',
      content:
        '트레이딩을 전혀 몰랐던 초보자였는데, TPT의 체계적인 교육 덕분에 기초부터 탄탄히 배울 수 있었습니다. 트레이너님이 제 수준에 맞춰 설명해주시고, 매매일지 작성법부터 차근차근 알려주셔서 부담 없이 시작할 수 있었습니다. 아직 갈 길이 멀지만 꾸준히 성장하고 있습니다.',
      likes: 27,
      improvement: '3개월 만에 첫 수익',
    },
    {
      id: 5,
      userName: '정스윙',
      userImage: null,
      rating: 5,
      date: '2024-12-15',
      title: '커뮤니티 활동도 큰 도움이 됩니다',
      content:
        'TPT의 가장 큰 장점은 트레이너 멘토링뿐만 아니라 활발한 커뮤니티라고 생각합니다. 다른 트레이더들의 매매일지를 보며 다양한 전략을 배울 수 있고, 댓글을 통해 소통하면서 새로운 시각을 얻을 수 있습니다. 혼자가 아니라 함께 성장한다는 느낌이 듭니다.',
      likes: 45,
      improvement: '심리적 안정감 확보',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <section className="text-center mb-12 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">TPT 후기</h1>
            <p className="text-xl text-gray-600">
              TPT와 함께 성장한 트레이더들의 진솔한 이야기
            </p>
          </section>

          {/* 통계 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4.8</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-gray-600">평균 만족도</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,234</div>
              <p className="text-gray-600">총 후기 수</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
              <p className="text-gray-600">재구매율</p>
            </div>
          </section>

          {/* 후기 목록 */}
          <section className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition">
                {/* 사용자 정보 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {review.userImage ? (
                        <Image src={review.userImage} alt={review.userName} width={48} height={48} />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* 후기 내용 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{review.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

                {/* 개선 사항 */}
                <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-4">
                  📈 {review.improvement}
                </div>

                {/* 좋아요 */}
                <div className="flex items-center gap-2 text-gray-500">
                  <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded-lg transition">
                    <ThumbsUp size={18} />
                    <span className="text-sm">{review.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* 후기 작성 CTA */}
          <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-center text-white mt-12">
            <h2 className="text-2xl font-bold mb-4">당신의 성장 스토리를 들려주세요</h2>
            <p className="mb-6 text-green-100">
              TPT와 함께한 경험을 공유하고 다른 트레이더들에게 도움을 주세요
            </p>
            <a
              href="/my/review"
              className="inline-block px-8 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              후기 작성하기
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
