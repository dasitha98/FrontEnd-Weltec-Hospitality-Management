export type ID = string;

export interface Student {
  id: ID;
  name: string;
  email: string;
}

export interface Class {
  id: ID;
  name: string;
  noOfStudents: number;
  location: string;
  reference: string;
  totalCost: number;
  description?: string;
  instructor?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Food {
  id: ID;
  name: string;
}

export interface Ingredient {
  id: ID;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  description?: string;
  supplier?: string;
  cost?: number;
  expiryDate?: string;
}

// export interface Recipe {
//   id: ID;
//   name: string;
//   description?: string;
//   reference?: string;
//   category: string;
//   prepTime: number; // in minutes
//   cookTime: number; // in minutes
//   servings: number;
//   difficulty: "Easy" | "Medium" | "Hard";
//   ingredients: RecipeIngredient[];
//   instructions: string[];
//   nutritionInfo?: {
//     calories?: number;
//     protein?: number;
//     carbs?: number;
//     fat?: number;
//   };
//   tags?: string[];
//   imageUrl?: string;
//   createdBy?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface RecipeIngredient {
//   ingredientId: string;
//   ingredientName: string;
//   quantity: number;
//   unit: string;
//   notes?: string;
//   cost?: number;
// }

export interface User {
  id: ID;
  name: string;
  email: string;
  address: string;
  contactNo: string;
  password: string;
  role: "admin" | "instructor" | "student";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier {
  supplierId?: ID;
  name?: string;
  repName?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  notes?: string;
  createdAt?: string;
}

export interface Recipe {
  RecipeID?: ID;
  Name?: string;
  Description?: string;
  Yield?: number;
  RLevel?: string;
  RReference?: string;
  TotalCost?: number;
  Year?: string;
  IngredientId?: string;
  Quantity?: number;
  Unit?: string;
  Cost?: number;
}

export interface Class{
  ClassID?: ID;
  Name?: string;
  Description?: string;
  Notes?: string;
  ClassDateTime?: Date;
  Location?: string;
  RecipeID?: string;
  SQuantity?: number;
  RReference?: string;
  UnitCost?: number;
}
