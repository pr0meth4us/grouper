"use client";
import React, { useEffect, useState } from "react";

import CurrentList from "@/app/components/CurrentList";
import { guestApi } from "@/app/api/guest";
import GroupGenerator from "@/app/components/GroupGenerator";
import GroupDisplayer from "@/app/components/GroupDisplayer";
import { Group } from "@/app/types/list";

export default function GuestGroup() {
  const [list, setList] = useState<string[]>([]);
  const [excludedMembers, setExcludedMembers] = useState<string[]>([]);
  const [shuffledGroups, setShuffledGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchList = async () => {
      const list = await guestApi.getSessionList();

      setList(list);
    };

    fetchList();
  }, []);

  const generateGroups = async (groupSize: string, numberOfGroups: string) => {
    const response = await guestApi.group(
      groupSize,
      numberOfGroups,
      excludedMembers.join(","),
    );

    setShuffledGroups(response);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <CurrentList
        excludedMembers={excludedMembers}
        list={list}
        setExcludedMembers={setExcludedMembers}
      />
      <GroupGenerator generateGroups={generateGroups} list={list} />
      {shuffledGroups.length > 0 && (
        <GroupDisplayer
          groups={shuffledGroups}
          onRegenerate={() => setShuffledGroups([])}
        />
      )}
    </div>
  );
}
