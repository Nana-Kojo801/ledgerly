import { createFileRoute } from '@tanstack/react-router'
import { CategoryList } from './-components/category-list'
import { CategorySummary } from './-components/category-summary'
import { CategoryHeader } from './-components/category-header'
import { AddCategoryDialog } from './-components/add-category-dialog'
import { CategoryDetailDialog } from './-components/category-detail-dialog'
import { useState } from 'react'

export const Route = createFileRoute('/categories/')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <CategoryHeader 
        onAddCategoryClick={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <CategorySummary />
      <div>
        <CategoryList 
          searchQuery={searchQuery}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      
      <AddCategoryDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      
      <CategoryDetailDialog
        categoryId={selectedCategoryId}
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      
      {/* Extra spacing for mobile bottom nav */}
      <div className="h-4 md:h-0" />
    </div>
  )
}