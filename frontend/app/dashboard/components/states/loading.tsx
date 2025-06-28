import { Header } from "@/app/dashboard/components/list/header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <Header />
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
