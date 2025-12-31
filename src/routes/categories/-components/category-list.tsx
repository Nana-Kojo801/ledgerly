// category-list.tsx
import { useState } from "react";
import { CategoryListItem } from "./category-list-item";
import { CategoryListEmpty } from "./category-list-empty";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { useLiveQuery } from "dexie-react-hooks";
import db from "@/lib/db";

interface CategoryListProps {
  searchQuery: string;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryList({ searchQuery, onCategoryClick }: CategoryListProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const categories = useLiveQuery(() => db.categories.toArray())

  if(categories === undefined) return null

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  if (filteredCategories.length === 0) {
    return <CategoryListEmpty searchQuery={searchQuery} />;
  }

  return (
    <>
      <div className="space-y-3 w-full">
        {filteredCategories.map((category) => (
          <CategoryListItem
            key={category.id}
            categoryId={category.id}
            onCategoryClick={onCategoryClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>

      <EditCategoryDialog
        categoryId={selectedCategoryId}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <DeleteCategoryDialog
        categoryId={selectedCategoryId}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteComplete={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCategoryId(null);
        }}
      />
    </>
  );
}