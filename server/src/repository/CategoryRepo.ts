import { ThreadCategory } from './entities/ThreadCategory';
import { QuerySingleResult, QueryArrayResult } from './QueryResult';

export const getCategoryById = async (
  id: string
): Promise<QuerySingleResult<ThreadCategory>> => {
  const category = await ThreadCategory.findOne({
    where: { id },
    relations: ['threads'],
  });

  if (!category) {
    return {
      messages: ['Category not found.'],
    };
  }

  return {
    entity: category,
  };
};

export const getAllCategories = async (): Promise<
  QueryArrayResult<ThreadCategory>
> => {
  const threadCategories = await ThreadCategory.find({
    order: { name: 'ASC' },
  });

  return {
    entities: threadCategories,
  };
};

export const createCategory = async (
  name: string,
  description?: string
): Promise<QuerySingleResult<ThreadCategory>> => {
  if (!name || name.trim().length === 0) {
    return {
      messages: ['Category name is required.'],
    };
  }

  // Check if category with same name already exists
  const existingCategory = await ThreadCategory.findOne({
    where: { name: name.trim() },
  });

  if (existingCategory) {
    return {
      messages: ['Category with this name already exists.'],
    };
  }

  const category = await ThreadCategory.create({
    name: name.trim(),
    description: description?.trim(),
  }).save();

  if (!category) {
    return {
      messages: ['Failed to create category.'],
    };
  }

  return {
    messages: ['Category created successfully.'],
    entity: category,
  };
};

export const updateCategory = async (
  id: string,
  name?: string,
  description?: string
): Promise<QuerySingleResult<ThreadCategory>> => {
  const category = await ThreadCategory.findOne({ where: { id } });

  if (!category) {
    return {
      messages: ['Category not found.'],
    };
  }

  if (name && name.trim().length > 0) {
    // Check if another category with same name exists
    const existingCategory = await ThreadCategory.findOne({
      where: { name: name.trim() },
    });

    if (existingCategory && existingCategory.id !== id) {
      return {
        messages: ['Category with this name already exists.'],
      };
    }

    category.name = name.trim();
  }

  if (description !== undefined) {
    category.description = description.trim();
  }

  const updatedCategory = await category.save();

  return {
    messages: ['Category updated successfully.'],
    entity: updatedCategory,
  };
};

export const deleteCategory = async (
  id: string
): Promise<QuerySingleResult<ThreadCategory>> => {
  const category = await ThreadCategory.findOne({
    where: { id },
    relations: ['threads'],
  });

  if (!category) {
    return {
      messages: ['Category not found.'],
    };
  }

  if (category.threads && category.threads.length > 0) {
    return {
      messages: ['Cannot delete category that contains threads.'],
    };
  }

  await category.remove();

  return {
    messages: ['Category deleted successfully.'],
  };
};
