"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { playerService } from "@/services/player-service";

import { Tab } from "./tab-bar";
import { HistoryItem } from "./history-item";
import { Spinner } from "@/components/ui/spinner";

const EmptyState = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-16">
    <span className="text-4xl">🎯</span>
    <span className="font-medium text-[14px] text-[#A3A3A3]">{label}</span>
  </div>
);

type HistoryListProps = {
  playerId: string;
  activeTab: Tab;
};

export const HistoryList = ({ playerId, activeTab }: HistoryListProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const globalQuery = useInfiniteQuery({
    queryKey: ["spins", "global"],
    queryFn: ({ pageParam }) => playerService.getGlobalSpins(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.total_pages
        ? lastPage.meta.current_page + 1
        : undefined,
    enabled: activeTab === "global",
  });

  const mySpinsQuery = useInfiniteQuery({
    queryKey: ["spins", "mine", playerId],
    queryFn: ({ pageParam }) => playerService.getMySpins(playerId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.total_pages
        ? lastPage.meta.current_page + 1
        : undefined,
    enabled: activeTab === "mine",
  });

  const { data: myRewards = [] } = useQuery({
    queryKey: ["rewards", playerId],
    queryFn: () => playerService.getRewards(playerId),
    enabled: activeTab === "rewards",
  });

  const activeInfiniteQuery =
    activeTab === "global"
      ? globalQuery
      : activeTab === "mine"
        ? mySpinsQuery
        : null;
  const isInitialLoading = activeInfiniteQuery?.isLoading ?? false;
  const spinItems =
    activeInfiniteQuery?.data?.pages.flatMap((p) => p.data) ?? [];
  const hasNextPage = activeInfiniteQuery?.hasNextPage ?? false;
  const isFetchingNextPage = activeInfiniteQuery?.isFetchingNextPage ?? false;
  const fetchNextPage = activeInfiniteQuery?.fetchNextPage;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto border-t border-[#EEEEEE]">
      {isInitialLoading ? (
        <Spinner />
      ) : activeTab === "rewards" ? (
        myRewards.length === 0 ? (
          <EmptyState label="ยังไม่มีรางวัล" />
        ) : (
          myRewards.map((item) => (
            <HistoryItem key={item.id} type="reward" item={item} />
          ))
        )
      ) : spinItems.length === 0 ? (
        <EmptyState label="ยังไม่มีประวัติการเล่น" />
      ) : (
        spinItems.map((item) => (
          <HistoryItem key={item.id} type="spin" item={item} />
        ))
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-gray-400">
          กำลังโหลด...
        </div>
      )}
    </div>
  );
};
