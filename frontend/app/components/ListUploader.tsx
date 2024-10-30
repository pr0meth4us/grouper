// app/components/ListUploader.tsx

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ListUploaderProps } from "@/app/types/list";

export default function ListUploader({
  name,
  setName,
  content,
  setContent,
  handleSubmit,
  isAuthUser,
}: ListUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result;

        if (typeof text === "string") {
          setContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {isAuthUser && (
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="block text-sm font-medium mb-2">
                List Name
              </label>
              <Input
                required
                className="w-full"
                placeholder="Enter list name"
                value={name}
                onChange={(e) => setName?.(e.target.value)}
              />
            </div>
          )}

          <div>
            {!isAuthUser && (
              <>
                <div className="flex justify-between items-center mb-2">
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className="block text-sm font-medium">Content</label>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  accept=".txt"
                  className="hidden"
                  type="file"
                  onChange={handleFileUpload}
                />
              </>
            )}
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
  );
}
