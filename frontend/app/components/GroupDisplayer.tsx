import jsPDF from "jspdf";
import { RefreshCcw, Download } from "lucide-react";
import React from "react";

import { GroupDisplayerProps } from "@/app/types/list";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const GroupDisplayer: React.FC<GroupDisplayerProps> = ({
  groups,
  onRegenerate,
}) => {
  const handleExportPdf = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let y = margin; // Current y position on the page

    const addText = (text: string, isHeader: boolean) => {
      const fontSize = isHeader ? 16 : 12;
      const lineHeight = isHeader ? 10 : 7;

      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(fontSize);
      doc.text(text, margin, y);
      y += lineHeight;
    };

    doc.setFont("helvetica", "bold");
    addText("Generated Groups", true);
    y += 5; // Extra space after main title

    doc.setFont("helvetica", "normal");
    groups.forEach((group, index) => {
      doc.setFont("helvetica", "bold");
      addText(`Group ${index + 1}`, true);
      doc.setFont("helvetica", "normal");

      group.forEach((member) => {
        addText(`- ${member}`, false);
      });
      y += 5; // Add space between groups
    });

    doc.save("grouped-list.pdf");
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Generated Groups</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            className="flex items-center gap-2"
            variant="outline"
            onClick={onRegenerate}
          >
            <RefreshCcw className="h-4 w-4" />
            Regenerate
          </Button>
          <Button
            className="flex items-center gap-2"
            variant="default"
            onClick={handleExportPdf}
          >
            <Download className="h-4 w-4" />
            Export to PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* This grid is now responsive for a better layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Group {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                  {group.map((member, i) => (
                    <li key={i}>{member}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupDisplayer;
