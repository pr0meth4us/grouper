import { Users, X, Check, UserMinus } from "lucide-react";
import React, { useState } from "react";

import { isListItem } from "@/app/components/hooks";
import { CurrentListProps } from "@/app/types/list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const CurrentList: React.FC<CurrentListProps> = ({
  list,
  excludedMembers,
  setExcludedMembers,
}) => {
  const [isExcluding, setIsExcluding] = useState<boolean>(false);
  const [tempExcludedMembers, setTempExcludedMembers] = useState<string[]>([]);

  // Memoize the sorted list to prevent re-sorting on every render
  const sortedList = React.useMemo(() => {
    const items = isListItem(list) ? list.items : list;
    // Create a copy before sorting to avoid mutating the original prop
    return [...items].sort((a, b) => a.localeCompare(b));
  }, [list]);

  const toggleMemberExclusion = (member: string): void => {
    setTempExcludedMembers((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member],
    );
  };

  const handleExcludeConfirm = (): void => {
    setExcludedMembers(tempExcludedMembers);
    setIsExcluding(false);
  };

  const handleExcludeCancel = (): void => {
    setTempExcludedMembers(excludedMembers);
    setIsExcluding(false);
  };

  const startExcluding = (): void => {
    setTempExcludedMembers(excludedMembers);
    setIsExcluding(true);
  };

  const filteredMembers = sortedList.filter(
    (member) => !excludedMembers.includes(member),
  );

  return (
    <Card className="max-w-4xl mx-auto mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          <h2>Current List: {isListItem(list) ? list.name : "Guest List"}</h2>
        </CardTitle>
        <div className="flex items-center gap-2">
          {isExcluding ? (
            <>
              <Button
                className="flex items-center gap-1"
                size="sm"
                type="button"
                variant="outline"
                onClick={handleExcludeCancel}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                className="flex items-center gap-1"
                size="sm"
                type="button"
                variant="default"
                onClick={handleExcludeConfirm}
              >
                <Check className="h-4 w-4" />
                Confirm
              </Button>
            </>
          ) : (
            <Button
              className="flex items-center gap-1"
              size="sm"
              type="button"
              variant="outline"
              onClick={startExcluding}
            >
              <UserMinus className="h-4 w-4" />
              Exclude Members
            </Button>
          )}
          <Badge className="flex items-center" variant="secondary">
            <Users className="h-4 w-4 mr-1" />
            {filteredMembers.length} members
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2" role="list">
            {/* Now mapping over the alphabetically sorted list */}
            {sortedList.map((item: string) => (
              <button
                key={item}
                aria-label={`${isExcluding ? "Toggle exclusion for" : ""} ${item}`}
                className={`flex items-center justify-between p-2 rounded-md bg-secondary/20 w-full text-left
                  ${isExcluding ? "hover:bg-secondary/30" : ""}
                  ${excludedMembers.includes(item) ? "opacity-50" : ""}`}
                disabled={!isExcluding}
                type="button"
                onClick={() => isExcluding && toggleMemberExclusion(item)}
              >
                <span className="text-sm font-medium">{item}</span>
                {isExcluding && (
                  <span
                    aria-hidden="true"
                    className={`w-4 h-4 rounded border flex items-center justify-center
                      ${tempExcludedMembers.includes(item) ? "bg-primary border-primary" : "border-gray-400"}`}
                  >
                    {tempExcludedMembers.includes(item) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CurrentList;
