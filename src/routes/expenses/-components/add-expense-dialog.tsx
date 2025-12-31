import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import db from "@/lib/db.ts";
import { useLiveQuery } from "dexie-react-hooks";
import { expenseFormSchema, type ExpenseFormValues } from "../-validators";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseDialog({ isOpen, onOpenChange }: AddExpenseDialogProps) {
  // Filter out "all" category
  const availableCategories = useLiveQuery(() => db.categories.toArray())

  // Initialize form
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema as any),
    defaultValues: {
      amount: "",
      category: "",
      date: new Date(),
      note: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      await db.expenses.add({
        id: crypto.randomUUID(),
        amount: parseFloat(values.amount),
        categoryId: values.category,
        date: values.date.toISOString(),
        note: values.note,
      })
    
      // Reset form and close dialog
      form.reset({
        amount: "",
        category: "",
        date: new Date(),
        note: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleCancel = () => {
    form.reset({
      amount: "",
      category: "",
      date: new Date(),
      note: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[75vh] overflow-y-auto rounded-lg border-border/50">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Record a new expense to track your spending.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Amount Field */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          className="pl-7 rounded-lg bg-surface-2 border-border/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the amount you spent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Field */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-lg bg-surface-2 border-border/50">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-lg border-border/50 max-h-[300px]">
                        {availableCategories?.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id}
                            className="rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-3 w-3 rounded-full ${category.color}`} />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category this expense belongs to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "rounded-lg bg-surface-2 border-border/50 justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-lg border-border/50" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="rounded-lg"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the date when this expense occurred
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Note Field */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a note about this expense"
                        className="rounded-lg bg-surface-2 border-border/50 min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional note to provide context for this expense
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="rounded-lg"
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="rounded-lg"
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                {form.formState.isSubmitting ? "Adding..." : "Save Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}