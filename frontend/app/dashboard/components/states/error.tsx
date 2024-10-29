"use client";
import { AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ErrorStateProps } from "@/app/dashboard/types";

export function Error({ error }: ErrorStateProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 border-red-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p>Error: {error}</p>
        </div>
      </CardContent>
    </Card>
  );
}
