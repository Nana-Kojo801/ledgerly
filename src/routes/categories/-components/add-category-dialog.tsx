// src/routes/categories/-components/add-category-dialog.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette } from "lucide-react";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({ isOpen, onOpenChange }: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [color, setColor] = useState("");

  const colorOptions = [
    { value: "bg-chart-1", label: "Teal", color: "bg-chart-1" },
    { value: "bg-chart-2", label: "Green", color: "bg-chart-2" },
    { value: "bg-chart-3", label: "Blue", color: "bg-chart-3" },
    { value: "bg-chart-4", label: "Amber", color: "bg-chart-4" },
    { value: "bg-chart-5", label: "Purple", color: "bg-chart-5" },
    { value: "bg-positive", label: "Mint", color: "bg-positive" },
    { value: "bg-primary", label: "Primary", color: "bg-primary" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Show success feedback
    console.log('Category added:', { name, description, monthlyBudget, color });
    
    setTimeout(() => {
      onOpenChange(false);
      // Reset form
      setName("");
      setDescription("");
      setMonthlyBudget("");
      setColor("");
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-border/50">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new spending category with a monthly budget.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Food & Dining"
                className="col-span-3 rounded-lg bg-surface-2 border-border/50"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this category includes"
                className="col-span-3 rounded-lg bg-surface-2 border-border/50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Monthly Budget
              </Label>
              <div className="relative col-span-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7 rounded-lg bg-surface-2 border-border/50"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="col-span-3 rounded-lg bg-surface-2 border-border/50">
                  <SelectValue placeholder="Select a color">
                    {color && (
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${color}`} />
                        <span>
                          {colorOptions.find(c => c.value === color)?.label}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border/50">
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="rounded-md">
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!name || !monthlyBudget || !color}
              className="rounded-lg"
            >
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}