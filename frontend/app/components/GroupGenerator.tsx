import React, { useState } from "react";

import { GroupGeneratorProps } from "@/app/types/list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isListItem } from "@/app/components/hooks";

const GroupGenerator: React.FC<GroupGeneratorProps> = ({
  list,
  generateGroups,
}) => {
  const [groupMethod, setGroupMethod] = useState<"size" | "number">("size");
  const [groupSize, setGroupSize] = useState<string>("");
  const [numberOfGroups, setNumberOfGroups] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateGroups(groupSize, numberOfGroups);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Group Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label>Select a method for group generation:</Label>
            <RadioGroup
              className="space-y-2"
              defaultValue="size"
              onValueChange={(value) =>
                setGroupMethod(value as "size" | "number")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="size" value="size" />
                <Label htmlFor="size">By size of each group</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="number" value="number" />
                <Label htmlFor="number">By total number of groups</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            {groupMethod === "size" && (
              <div className="space-y-2">
                <Label htmlFor="groupSize">Group Size</Label>
                <Input
                  id="groupSize"
                  max={isListItem(list) ? list.items.length : list.length || 1}
                  min={1}
                  placeholder="Enter the number of members in each group"
                  type="number"
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                />
                {groupSize && (
                  <p className="text-sm text-muted-foreground">
                    This will create{" "}
                    {Math.ceil(
                      (isListItem(list)
                        ? list.items.length
                        : list.length || 0) / Number(groupSize),
                    )}{" "}
                    groups
                  </p>
                )}
              </div>
            )}

            {groupMethod === "number" && (
              <div className="space-y-2">
                <Label htmlFor="numberOfGroups">Number of Groups</Label>
                <Input
                  id="numberOfGroups"
                  max={isListItem(list) ? list.items.length : list.length || 1}
                  min={1}
                  placeholder="Enter the number of groups"
                  type="number"
                  value={numberOfGroups}
                  onChange={(e) => setNumberOfGroups(e.target.value)}
                />
                {numberOfGroups && (
                  <p className="text-sm text-muted-foreground">
                    Each group will have approximately{" "}
                    {Math.ceil(
                      (isListItem(list)
                        ? list.items.length
                        : list.length || 0) / Number(numberOfGroups),
                    )}{" "}
                    members
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              className="bg-primary"
              disabled={
                isListItem(list) ? list.items.length === 0 : list.length === 0
              }
              type="submit"
            >
              Generate Groups
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GroupGenerator;
