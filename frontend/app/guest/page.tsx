"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { guestApi } from "@/app/api/guest";
import ListUploader from "@/app/components/ListUploader";

export default function GuestPage() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await guestApi.uploadList(content);
    router.push("/guest/group");
  };

  return (
    <div className="container mx-auto px-4 ">
      <ListUploader
        content={content}
        handleSubmit={handleSubmit}
        isAuthUser={false}
        setContent={setContent}
      />
    </div>
  );
}
