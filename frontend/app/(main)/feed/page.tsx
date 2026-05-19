'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Star, Flame } from 'lucide-react';
import { OutfitCard } from '@/components/outfit/outfit-card';
import { feedApi } from '@/lib/api';
import { Outfit } from '@/lib/types';
import { useT } from '@/hooks/use-t';

type SortOption = 'latest' | 'trending' | 'top';

export default function FeedPage() {
  const T = useT();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [sort, setSort] = useState<SortOption>('latest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const sortOptions: { value: SortOption; label: string; icon: React.ElementType }[] = [
    { value: 'latest', label: T.feed.latest, icon: Clock },
    { value: 'trending', label: T.feed.trending, icon: TrendingUp },
    { value: 'top', label: T.feed.top, icon: Star },
  ];

  const fetchFeed = useCallback(async (s: SortOption, p: number, append = false) => {
    p === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const { data } = await feedApi.getFeed({ sort: s, page: p, limit: 12 });
      if (append) {
        setOutfits((prev) => [...prev, ...data.data]);
      } else {
        setOutfits(data.data);
      }
      setHasMore(data.pagination.hasNext);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchFeed(sort, 1, false);
  }, [sort, fetchFeed]);

  function loadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(sort, nextPage, true);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">{T.feed.title}</h1>
          <p className="text-white/40 text-sm mt-1">{T.feed.sub}</p>
        </div>

        <div className="flex items-center glass rounded-xl p-1 gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                sort === opt.value ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="glass rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🕳️</div>
          <p className="text-white/40">{T.feed.empty}</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {outfits.map((outfit, i) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.5) }}
            >
              <OutfitCard outfit={outfit} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-10">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="glass rounded-xl px-8 py-3 text-white/60 hover:text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loadingMore ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              <>
                <Flame className="w-4 h-4 inline mr-2" />
                {T.feed.loadMore}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
