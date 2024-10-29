import React, { useState } from "react";
import { Users, X, Check, UserMinus } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ListItem } from "@/app/types/list";

interface CurrentListProps {
  list: ListItem;
  excludedMembers: string[];
  setExcludedMembers: React.Dispatch<React.SetStateAction<string[]>>;
}

const CurrentList: React.FC<CurrentListProps> = ({
  list,
  excludedMembers,
  setExcludedMembers,
}) => {
  const [isExcluding, setIsExcluding] = useState<boolean>(false);
  const [tempExcludedMembers, setTempExcludedMembers] = useState<string[]>([]);

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

  const filteredMembers = list.items.filter(
    (member) => !excludedMembers.includes(member),
  );

  return (
    <Card className="max-w-2xl mx-auto mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Current List: {list.name}</CardTitle>
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
            {list.items.map((item) => (
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
                      ${
                        tempExcludedMembers.includes(item)
                          ? "bg-primary border-primary"
                          : "border-gray-400"
                      }`}
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
