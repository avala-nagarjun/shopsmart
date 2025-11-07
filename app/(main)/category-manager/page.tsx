"use client";
import React, { useState, useEffect } from "react";
import Icon from "@/components/AppIcon";
import CustomeInput from "@/components/ui/CustomeInput";
import CustomeSelect from "@/components/ui/customeSelect";
import { CustomeButton } from "@/components/ui/CustomeButton";
import CategoryCard from "@/components/category-manager/CategoryCard";
import CategoryCardSkeleton from "@/components/category-manager/CategoryCardSkeleton";
import CategoryModal from "@/components/category-manager/CategoryModal";
import CategoryTemplate from "@/components/category-manager/CategoryTemplate";
import CategoryStats from "@/components/category-manager/CategoryStats";
import BulkActions from "@/components/category-manager/BulkActions";
import { CategoryType } from "@/types/all";
import { useCategory } from "@/hooks/useCategory";

const CategoryManager = () => {
  const { categories, categoriesSummary: summary, loading, createCategory, updateCategory, deleteCategory, refetchCategories } = useCategory();
  const [localCategories, setLocalCategories] = useState<CategoryType[]>(categories);
  const [activeView, setActiveView] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  // Mock data for category templates
  const categoryTemplates = [
    {
      id: "template-1",
      name: "Weekly Grocery Essentials",
      icon: "ShoppingCart",
      description:
        "Perfect for regular weekly shopping with all essential categories organized by store layout.",
      categoryCount: 12,
      isPopular: true,
      isNew: false,
      usedBy: "2.3k",
      rating: "4.8",
      difficulty: "Beginner",
      categories: [
        { name: "Fresh Produce", icon: "Apple", color: "#10B981" },
        { name: "Dairy & Eggs", icon: "Milk", color: "#3B82F6" },
        { name: "Meat & Seafood", icon: "Beef", color: "#DC2626" },
        { name: "Bakery", icon: "Bread", color: "#F59E0B" },
        { name: "Frozen Foods", icon: "Snowflake", color: "#06B6D4" },
        { name: "Pantry Staples", icon: "Package", color: "#84CC16" },
        { name: "Beverages", icon: "Coffee", color: "#8B5CF6" },
        { name: "Snacks", icon: "Cookie", color: "#EC4899" },
      ],
    },
    {
      id: "template-2",
      name: "Healthy Living Categories",
      icon: "Heart",
      description:
        "Organized around nutrition and wellness with categories that support healthy eating habits.",
      categoryCount: 10,
      isPopular: false,
      isNew: true,
      usedBy: "890",
      rating: "4.6",
      difficulty: "Intermediate",
      categories: [
        { name: "Organic Produce", icon: "Leaf", color: "#10B981" },
        { name: "Lean Proteins", icon: "Zap", color: "#DC2626" },
        { name: "Whole Grains", icon: "Wheat", color: "#F59E0B" },
        { name: "Superfoods", icon: "Star", color: "#8B5CF6" },
        { name: "Plant-Based", icon: "Sprout", color: "#84CC16" },
        { name: "Supplements", icon: "Pill", color: "#06B6D4" },
      ],
    },
    {
      id: "template-3",
      name: "Family Meal Planning",
      icon: "Users",
      description:
        "Designed for families with kids, including categories for school lunches and family meals.",
      categoryCount: 15,
      isPopular: true,
      isNew: false,
      usedBy: "1.8k",
      rating: "4.9",
      difficulty: "Advanced",
      categories: [
        { name: "Breakfast Items", icon: "Sun", color: "#F59E0B" },
        { name: "Lunch Box", icon: "Package", color: "#3B82F6" },
        { name: "Dinner Ingredients", icon: "Utensils", color: "#DC2626" },
        { name: "Kids Snacks", icon: "Cookie", color: "#EC4899" },
        { name: "Baby Food", icon: "Baby", color: "#10B981" },
        { name: "Family Treats", icon: "Gift", color: "#8B5CF6" },
      ],
    },
  ];

  // Mock stats data
  const totalItems = summary?.totalItems ?? 0
  const statsData = {
    totalCategories: summary?.totalCategories ?? 0,
    mostUsedCategory: summary?.mostUsedCategory ?? "Fresh Produce",
    totalItems,
    averageItemsPerCategory: summary?.avgPerCategory ?? 0,
  };

  // Filter and sort options
  const sortOptions = [
    { value: "name", label: "Name (A-Z/a-z)" },
    { value: "usage", label: "Most Used" },
    { value: "items", label: "Item Count" },
    { value: "recent", label: "Recently Used" },
  ];

  const filterOptions = [
    { value: "all", label: "All Categories" },
    { value: "frequent", label: "Frequently Used" },
    { value: "recent", label: "Recently Used" },
    { value: "unused", label: "Rarely Used" },
  ];

  // Filter and sort categories
  const filteredAndSortedCategories = localCategories
    .filter((category: CategoryType) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "frequent" && category.usagePercentage > 60) ||
        (filterBy === "recent" && category.lastUsed.includes("hour")) ||
        (filterBy === "unused" && category.usagePercentage < 40);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "usage":
          return b.usagePercentage - a.usagePercentage;
        case "items":
          return b.itemCount - a.itemCount;
        case "recent":
          return a.lastUsed.localeCompare(b.lastUsed);
        default:
          return 0;
      }
    });

  const handleCreateCategory = () => {
    setModalMode("create");
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: CategoryType) => {
    setModalMode("edit");
    setEditingCategory(category);
    setShowModal(true);
  };
  // console.log("Editing Category", editingCategory)

  const handleSaveCategory = async (categoryData: CategoryType) => {
    try {
      if (modalMode === "create") {
        await createCategory(categoryData);
      } else if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      }
      setShowModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      try {
        await deleteCategory(categoryId);
        setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleDragStart = (categoryId: string) => {
    setDraggedCategory(categoryId);
  };

  const handleDragEnd = () => {
    setDraggedCategory(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (!draggedCategory) return;

    const draggedIndex = localCategories.findIndex(
      (cat) => cat.id === draggedCategory
    );
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;

    const newCategories = [...localCategories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedItem);

    setLocalCategories(newCategories);
    setDraggedCategory(null);
  };

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleApplyTemplate = async (template: {
    id: string;
    categories?: { name: string; icon?: string; color?: string }[];
  }) => {
    setApplyingTemplate(template.id);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCategories: CategoryType[] = (template.categories ?? []).map(
      (cat, index: number) => ({
        id: `template-${template.id}-${index}`,
        name: cat.name || `Category ${index + 1}`,
        slug: (cat.name || `category-${index + 1}`)
          .toLowerCase()
          .replace(/\s+/g, "-"),
        type: "custom",
        isActive: true,
        icon: cat.icon || "",
        color: cat.color || "",
        itemCount: 0,
        frequency: "Never",
        usagePercentage: 0,
        lastUsed: "Never",
        recentItems: [] as string[],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );

    setLocalCategories((prev) => [...prev, ...newCategories]);
    setApplyingTemplate(null);
    setShowTemplates(false);
  };

  const handleMergeCategories = (categoryIds: string[], targetId: string) => {
    const targetCategory = localCategories.find((cat) => cat.id === targetId);
    const categoriesToMerge = localCategories.filter((cat) =>
      categoryIds.includes(cat.id)
    );

    const totalItems = categoriesToMerge.reduce(
      (sum, cat) => sum + cat.itemCount,
      0
    );
    const allRecentItems = categoriesToMerge.flatMap(
      (cat) => cat.recentItems || []
    );


    setLocalCategories((prev) => [
      ...prev.filter(
        (cat) => !categoryIds.includes(cat.id) && cat.id !== targetId
      ),
      {
        ...targetCategory,
        id: targetCategory?.id || '',
        name: targetCategory?.name || '',
        slug: targetCategory?.slug || '',
        type: targetCategory?.type || 'custom',
        isActive: targetCategory?.isActive || false,
        icon: targetCategory?.icon || '',
        color: targetCategory?.color || '',
        itemCount: (targetCategory?.itemCount ?? 0) + totalItems,
        frequency: targetCategory?.frequency || 'Never',
        usagePercentage: targetCategory?.usagePercentage || 0,
        lastUsed: targetCategory?.lastUsed || 'Never',
        recentItems: [
          ...new Set([...(targetCategory?.recentItems ?? []), ...allRecentItems]),
        ].slice(0, 10),
        updatedAt: new Date(),
      } as CategoryType,
    ]);
  };

  interface UpdatedCategory extends CategoryType {
    recentItems: string[];
    itemCount: number;
  }

  const handleMoveItems = (
    fromCategoryIds: string[],
    toCategoryId: string
  ): void => {
    const targetCategory: CategoryType | undefined = localCategories.find(
      (cat) => cat.id === toCategoryId
    );
    const sourceCategories: CategoryType[] =
      localCategories.filter((cat) => fromCategoryIds.includes(cat.id));

    const totalItems: number =
      sourceCategories.reduce((sum, cat) => sum + cat.itemCount, 0);
    const allRecentItems: string[] =
      sourceCategories.flatMap((cat) => cat.recentItems || []);

    const updatedTarget: UpdatedCategory = {
      ...(targetCategory as CategoryType),
      itemCount: (targetCategory?.itemCount ?? 0) + totalItems,
      recentItems: [
        ...new Set([
          ...(targetCategory?.recentItems ?? []),
          ...allRecentItems,
        ]),
      ].slice(0, 10),
    } as UpdatedCategory;

    const updatedSources: UpdatedCategory[] =
      sourceCategories.map((cat) => ({
        ...cat,
        itemCount: 0,
        recentItems: [],
      }));

    setLocalCategories((prev) => [
      ...prev.filter(
        (cat) => !fromCategoryIds.includes(cat.id) && cat.id !== toCategoryId
      ),
      updatedTarget,
      ...updatedSources,
    ]);
  };

  const handleDeleteCategories = (categoryIds: string[]) => {
    setLocalCategories((prev) =>
      prev.filter((cat) => !categoryIds.includes(cat.id))
    );
  };

  return (
    <>
      <div className="p-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Category Manager
            </h1>
            <p className="text-text-secondary">
              Organize your shopping with customizable categories and smart
              organization
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <CustomeButton
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={() => setShowTemplates(true)}
            >
              Templates
            </CustomeButton>
            <CustomeButton
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={refetchCategories}
            >
              Refresh
            </CustomeButton>
            <CustomeButton
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={handleCreateCategory}
            >
              New Category
            </CustomeButton>
          </div>
        </div>

        {/* Stats Overview */}
        <CategoryStats stats={statsData} />

        {/* Controls */}
        <div className="breathing-card bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <CustomeInput
                type="search"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="sm:max-w-xs"
              />

              <CustomeSelect
                placeholder="Sort by"
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(String(value))}
                className="sm:max-w-xs"
              />

              <CustomeSelect
                placeholder="Filter"
                options={filterOptions}
                value={filterBy}
                onChange={(value) => setFilterBy(String(value))}
                className="sm:max-w-xs"
              />
            </div>

            <div className="flex items-center space-x-2">
              <CustomeButton
                variant={activeView === "grid" ? "default" : "ghost"}
                size="icon"
                iconName="Grid3X3"
                onClick={() => setActiveView("grid")}
              />
              <CustomeButton
                variant={activeView === "list" ? "default" : "ghost"}
                size="icon"
                iconName="List"
                onClick={() => setActiveView("list")}
              />
            </div>
          </div>
        </div>

        {/* Categories Grid/List */}
        <div
          className={`${activeView === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
            }`}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={`skeleton-${index}`} />
            ))
            : filteredAndSortedCategories.map((category, index) => (
              <div
                key={category.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="relative"
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <CustomeInput
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategorySelection(category.id)}
                    className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2"
                  />
                </div>

                <CategoryCard
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedCategory === category.id}
                />
              </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                name="FolderOpen"
                size={32}
                className="text-text-secondary"
              />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No categories found
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery || filterBy !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first category to get started"}
            </p>
            {!searchQuery && filterBy === "all" && (
              <CustomeButton
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={handleCreateCategory}
              >
                Create Category
              </CustomeButton>
            )}
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
        mode={modalMode}
      />

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-gentle max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text-primary">
                Category Templates
              </h2>
              <CustomeButton
                variant="ghost"
                size="icon"
                iconName="X"
                onClick={() => setShowTemplates(false)}
              />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTemplates.map((template) => (
                  <CategoryTemplate
                    key={template.id}
                    template={template}
                    onApply={handleApplyTemplate}
                    isApplying={applyingTemplate === template.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <BulkActions
        selectedCategories={selectedCategories}
        categories={categories}
        onMergeCategories={handleMergeCategories}
        onDeleteCategories={handleDeleteCategories}
        onMoveItems={handleMoveItems}
        onClearSelection={() => setSelectedCategories([])}
      />
    </>
  );
};

export default CategoryManager;
