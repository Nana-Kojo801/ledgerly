import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import db from '@/lib/db'
import { categoryFormSchema, type CategoryFormValues } from '../-validators'

interface AddCategoryDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCategoryDialog({
  isOpen,
  onOpenChange,
}: AddCategoryDialogProps) {
  const colorOptions = [
    { value: 'bg-chart-1', label: 'Teal', color: 'bg-chart-1' },
    { value: 'bg-chart-2', label: 'Green', color: 'bg-chart-2' },
    { value: 'bg-chart-3', label: 'Blue', color: 'bg-chart-3' },
    { value: 'bg-chart-4', label: 'Amber', color: 'bg-chart-4' },
    { value: 'bg-chart-5', label: 'Purple', color: 'bg-chart-5' },
    { value: 'bg-positive', label: 'Mint', color: 'bg-positive' },
    { value: 'bg-primary', label: 'Primary', color: 'bg-primary' },
  ]

  // Initialize form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema as any),
    defaultValues: {
      name: '',
      description: '',
      monthlyBudget: '',
      color: '',
    },
    mode: 'onChange', // Validate on change for immediate feedback
  })

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      await db.categories.add({
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description || '',
        monthlyBudget: parseFloat(values.monthlyBudget),
        color: values.color
      })

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[75vh] rounded-lg border-border/50 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new spending category with a monthly budget.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Food & Dining"
                        className="rounded-lg bg-surface-2 border-border/50"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your spending category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this category includes"
                        className="rounded-lg bg-surface-2 border-border/50 min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description to help identify what expenses belong
                      here
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Monthly Budget Field */}
              <FormField
                control={form.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Budget</FormLabel>
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
                      Your maximum spending limit for this category per month
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color Field */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-lg bg-surface-2 border-border/50">
                          <SelectValue placeholder="Select a color">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-4 w-4 rounded-full ${field.value}`}
                                />
                                <span>
                                  {
                                    colorOptions.find(
                                      (c) => c.value === field.value,
                                    )?.label
                                  }
                                </span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-lg border-border/50 max-h-[300px]">
                        {colorOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-5 w-5 rounded-full ${option.color}`}
                              />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose a color to visually identify this category
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
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {form.formState.isSubmitting
                  ? 'Creating...'
                  : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
