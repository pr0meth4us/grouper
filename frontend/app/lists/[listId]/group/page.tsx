"use client";

import React, { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { listApi } from "@/app/api/list";
import { Group, ListItem } from "@/app/types/list";
import CurrentList from "@/app/lists/[listId]/group/component";

export default function GroupGenerator() {
  const [groupMethod, setGroupMethod] = useState<"size" | "number">("size");
  const [groupSize, setGroupSize] = useState<string>("");
  const [numberOfGroups, setNumberOfGroups] = useState<string>("");
  const [excludedMembers, setExcludedMembers] = useState<string[]>([]);
  const [shuffledGroups, setShuffledGroups] = useState<Group>([]);
  const [list, setList] = useState<ListItem>({
    listId: "",
    name: "",
    items: [],
    createdAt: "",
  });

  const [loading, setLoading] = useState(false);
  const params = useParams();
  const listId = params.listId as string;

  useEffect(() => {
    const fetchList = async () => {
      const response = await listApi.getListById(listId);

      setList(response);
    };

    fetchList();
  }, [listId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const exclusions = excludedMembers.join(",");
    const response = await listApi.group(
      listId,
      groupSize,
      numberOfGroups,
      exclusions,
    );

    // @ts-ignore
    setShuffledGroups(response);
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <CurrentList
        excludedMembers={excludedMembers}
        list={list}
        setExcludedMembers={setExcludedMembers}
      />

      {shuffledGroups.length === 0 ? (
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
                      max={list?.items?.length || 1}
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
                          (list?.items?.length || 0) / Number(groupSize),
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
                      max={list?.items?.length || 1}
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
                          (list?.items?.length || 0) / Number(numberOfGroups),
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
                  disabled={loading || (list?.items?.length || 0) === 0}
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
                      {group.map((member, i) => (
                        <li key={i}>{member}</li>
                      ))}
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
