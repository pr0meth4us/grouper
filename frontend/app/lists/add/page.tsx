"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { listApi } from "@/app/api/list";

export default function CreateListPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await listApi.addList({ name, content });
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 ">
      <Button className="mb-4" variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">
                List Name
              </label>
              <Input
                required
                className="w-full"
                placeholder="Enter list name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Textarea
                className="min-h-[300px] w-full resize-none"
                placeholder={`Enter names (one per line). \nExample:\nJohn Smith\nJane Doe\nMichael Johnson`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">Create List</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
