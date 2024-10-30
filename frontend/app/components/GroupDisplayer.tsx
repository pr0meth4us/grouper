import React from "react";
import { RefreshCcw } from "lucide-react";

import { GroupDisplayerProps } from "@/app/types/list";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GroupDisplayer: React.FC<GroupDisplayerProps> = ({
  groups,
  onRegenerate,
}) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          {groups.map((group, index) => (
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
            onClick={onRegenerate}
          >
            <RefreshCcw className="h-4 w-4" />
            Regenerate?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupDisplayer;
