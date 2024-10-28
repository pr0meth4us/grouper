"use client";

import { Key, useEffect, useState } from "react";
import { RefreshCcw, Users } from "lucide-react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { listApi } from "@/app/api/list";
import { Group, ListItem } from "@/app/types/list";

export default function GroupGenerator() {
  const [groupMethod, setGroupMethod] = useState<"size" | "number">("size");
  const [groupSize, setGroupSize] = useState<string>("");
  const [numberOfGroups, setNumberOfGroups] = useState<string>("");
  const [shuffledGroups, setShuffledGroups] = useState<Group[]>([]);
  const [lists, setLists] = useState<ListItem | null>(null);
  const [loading] = useState(false);
  const params = useParams();
  const listId = params.listId as string;

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await listApi.getListById(listId);

        setLists(response);
      } catch (error) {}
    };

    fetchList();
  }, [listId]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Current List</CardTitle>
          <Badge variant="secondary">
            <Users className="h-4 w-4 mr-1" />
            {lists?.items?.length || 0} members
          </Badge>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {lists?.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded-md bg-secondary/20"
                >
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {shuffledGroups.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Group Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
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
                      max={lists?.items?.length || 1}
                      min={1}
                      placeholder="Enter the number of members in each group"
                      type="number"
                      value={groupSize}
                      onChange={(e) => setGroupSize(e.target.value)}
                    />
                    {groupSize && (
                      <p className="text-sm text-muted-foreground">
                        This will create
                        {Math.ceil(
                          (lists?.items?.length || 0) / Number(groupSize),
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
                      max={lists?.items?.length || 1}
                      min={1}
                      placeholder="Enter the number of groups"
                      type="number"
                      value={numberOfGroups}
                      onChange={(e) => setNumberOfGroups(e.target.value)}
                    />
                    {numberOfGroups && (
                      <p className="text-sm text-muted-foreground">
                        Each group will have approximately approximately{" "}
                        approximately{" "}
                        {Math.ceil(
                          (lists?.items?.length || 0) / Number(numberOfGroups),
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
                  disabled={loading || (lists?.items?.length || 0) === 0}
                  type="submit"
                >
                  {loading ? "Generating..." : "Generate Groups"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {shuffledGroups.map((group, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">Group {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 space-y-2">
                      {group.members.map(
                        (member: string, memberIndex: Key | null) => (
                          <li key={memberIndex}>{member}</li>
                        ),
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                className="flex items-center gap-2"
                variant="outline"
                onClick={() => setShuffledGroups([])}
              >
                <RefreshCcw className="h-4 w-4" />
                Regenerate?
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
