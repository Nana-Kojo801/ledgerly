// src/routes/dashboard-components/quick-actions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Download, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Add Expense",
      description: "Record a new expense",
      icon: PlusCircle,
      variant: "default" as const,
    },
    {
      title: "View Report",
      description: "Generate monthly report",
      icon: FileText,
      variant: "outline" as const,
    },
    {
      title: "Export Data",
      description: "Download CSV export",
      icon: Download,
      variant: "outline" as const,
    },
    {
      title: "Settings",
      description: "Manage preferences",
      icon: Settings,
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Common tasks and shortcuts
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="h-auto flex-col items-center justify-center gap-2 p-4"
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}