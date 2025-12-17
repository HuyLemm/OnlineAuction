// src/dto/category.dto.ts

export interface MainCategoryDTO {
  id: string;
  name: string;
  count: number;
}

export interface CategoryMenuDTO {
  id: string;
  main: string;
  subcategories: {
    id: string;
    label: string;
  }[];
}

export interface CategorySidebarDTO {
  id: string;
  label: string;
  count: number;
  subcategories: {
    id: string;
    label: string;
    count: number;
  }[];
}
