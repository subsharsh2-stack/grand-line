'use client';

import { MessageCircle, ThumbsUp, Clock } from 'lucide-react';
import { useState } from 'react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('feed');

  const discussions = [
    {
      id: 1,
      author: 'Luffy',
      avatar: 'L',
      title: 'Who had the best moment in Enies Lobby?',
      preview: 'The emotions in this arc were incredible. What was yours? Mine was definitely when...',
      arc: 'Enies Lobby',
      arcColor: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
      upvotes: 342,
      comments: 89,
      timeAgo: '2h ago',
    },
    {
      id: 2,
      author: 'Zoro',
      avatar: 'Z',
      title: 'Is Marineford the best arc in anime?',
      preview: 'Hot take: Marineford is not just the best One Piece arc, it might be the best anime arc...',
      arc: 'Marineford',
      arcColor: 'bg-red-500/20 border-red-500/50 text-red-300',
      upvotes: 1203,
      comments: 456,
      timeAgo: '4h ago',
    },
    {
      id: 3,
      author: 'Nami',
      avatar: 'N',
      title: 'Gear 5 reaction thread 🔥',
      preview: 'Just finished watching the Gear 5 episode and I am SHAKING. The animation, the music...',
      arc: 'Wano',
      arcColor: 'bg-pink-500/20 border-pink-500/50 text-pink-300',
      upvotes: 2150,
      comments: 678,
      timeAgo: '6h ago',
    },
    {
      id: 4,
      author: 'Sanji',
      avatar: 'S',
      title: 'Theory: Shanks\' true power',
      preview: 'I\'ve been thinking about this for a while. What if Shanks is actually stronger than...',
      arc: 'Theory',
      arcColor: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
      upvotes: 876,
      comments: 234,
      timeAgo: '8h ago',
    },
    {
      id: 5,
      author: 'Robin',
      avatar: 'R',
      title: 'Wano vs Marineford - which is better?',
      preview: 'Both arcs are masterpieces but they hit different. Let\'s compare and discuss...',
      arc: 'Discussion',
      arcColor: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
      upvotes: 1560,
      comments: 412,
      timeAgo: '1d ago',
    },
    {
      id: 6,
      author: 'Chopper',
      avatar: 'C',
      title: 'Going Merry funeral 😭',
      preview: 'Still crying about what happened. This ship meant everything to the crew and to us...',
      arc: 'Emotional',
      arcColor: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300',
      upvotes: 3421,
      comments: 1203,
      timeAgo: '2d ago',
    },
  ];

  const trendingTopics = [
    { tag: '#Marineford', count: 12420 },
    { tag: '#Gear5', count: 8934 },
    { tag: '#WanoCountry', count: 7621 },
    { tag: '#LuffyVsKaido', count: 5632 },
    { tag: '#Onepiece1000', count: 4890 },
  ];

  const topContributors = [
    { name: 'CaptainLuffy', color: 'bg-red-500' },
    { name: 'GreatSwordsman', color: 'bg-green-500' },
    { name: 'NavyNav', color: 'bg-blue-500' },
  ];

  return (
    <main className="min-h-screen bg-[#060B14] text-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-8 h-8 text-[#f5a623]" />
            <h1 className="text-4xl font-bold font-display tracking-widest text-[#f5a623]">
              COMMUNITY
            </h1>
          </div>
          <p className="text-white/60 text-lg">Join the conversation about One Piece</p>
        </div>
        <button className="bg-[#f5a623] hover:bg-[#f5a623]/90 text-[#060B14] font-bold px-8 py-3 rounded-lg transition">
          New Discussion
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 border-b border-white/10 pb-4">
        {['Feed', 'Discussions', 'Theories', 'Polls', 'Fan Art'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-4 py-2 font-medium tracking-wider text-sm transition ${
              activeTab === tab.toLowerCase()
                ? 'text-[#f5a623] border-b-2 border-[#f5a623] -mb-4'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Discussions */}
        <div className="lg:col-span-2 space-y-5">
          {discussions.map((post) => (
            <div key={post.id} className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/20 transition cursor-pointer">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#f5a623]/20 border border-[#f5a623]/40 flex items-center justify-center font-bold text-[#f5a623]">
                    {post.avatar}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-white font-semibold">{post.author}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {post.timeAgo}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${post.arcColor}`}>
                      {post.arc}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4">{post.preview}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-white/50 text-sm">
                    <button className="flex items-center gap-2 hover:text-[#f5a623] transition">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.upvotes.toLocaleString()}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-[#f5a623] font-bold tracking-widest text-sm mb-4 uppercase">
              Trending Topics
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, idx) => (
                <button
                  key={idx}
                  className="w-full text-left hover:bg-white/5 p-2 rounded transition"
                >
                  <p className="text-white font-semibold text-sm">{topic.tag}</p>
                  <p className="text-white/50 text-xs">{topic.count.toLocaleString()} posts</p>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Poll */}
          <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-[#f5a623] font-bold tracking-widest text-sm mb-4 uppercase">
              Weekly Poll
            </h3>
            <p className="text-white font-semibold text-sm mb-4">Best Straw Hat member?</p>
            <div className="space-y-2">
              {[
                { option: 'Luffy', votes: 45 },
                { option: 'Zoro', votes: 28 },
                { option: 'Sanji', votes: 18 },
                { option: 'Robin', votes: 9 },
              ].map((item) => (
                <div key={item.option}>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>{item.option}</span>
                    <span>{item.votes}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-[#f5a623] h-1.5 rounded-full"
                      style={{ width: `${item.votes}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-[#f5a623] font-bold tracking-widest text-sm mb-4 uppercase">
              Top Contributors
            </h3>
            <div className="flex items-center justify-center gap-4">
              {topContributors.map((contributor, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-16 h-16 rounded-full ${contributor.color} flex items-center justify-center font-bold text-white text-sm mb-2 hover:scale-110 transition cursor-pointer`}>
                    {contributor.name[0]}
                  </div>
                  <p className="text-white/70 text-xs font-medium truncate">{contributor.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
