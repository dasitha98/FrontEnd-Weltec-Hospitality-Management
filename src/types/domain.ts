export type ID = string;

export interface Student {
  Id: ID;
  Name: string;
  Email: string;
}

export interface Food {
  Id: ID;
  Name: string;
}

export interface RecipeIngredient {
  IngredientId: string;
  IngredientIdAlternate?: string; // Backward compatibility
  IngredientName: string;
  IngredientNameAlternate?: string; // Backward compatibility
  Quantity: number;
  Unit: string;
  Notes?: string;
  NotesAlternate?: string; // Backward compatibility
  Cost?: number;
  Ingredient?: Ingredient;
}

export interface User {
  Id: ID;
  Name: string;
  Email: string;
  Address: string;
  ContactNo: string;
  Password: string;
  Role: "admin" | "instructor" | "student";
  IsActive: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface Supplier {
  SupplierId?: ID;
  Name?: string;
  RepName?: string;
  Address?: string;
  ContactNumber?: string;
  Email?: string;
  Notes?: string;
  CreatedAt?: string;
}

export interface Ingredient {
  IngredientId?: ID;
  Name: string;
  Description?: string;
  SupplierId?: ID;
  Store?: string;
  PurchaseQuantity?: number;
  PurchaseUnit?: string;
  UsageUnit?: string;
  PurchaseCost?: number;
  UsageCost?: number;
  CreatedAt?: string;
}

export interface Recipe {
  RecipeId?: ID;
  Name?: string;
  Description?: string;
  Yield?: string;
  RLevel?: string;
  RReference?: string;
  TotalCost?: number;
  Year?: string;
  IngredientId?: string;
  IngredientIdAlternate?: string; // Backward compatibility
  RecipeIngredients?: RecipeIngredient[];
  IngredientList?: RecipeIngredient[];
  Quantity?: number;
  QuantityAlternate?: number; // Backward compatibility
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface Class {
  ClassId?: ID;
  Name?: string;
  Instructor?: string;
  Description?: string;
  Notes?: string;
  ClassDateTime?: Date;
  Location?: string;
  SQuantity?: number;
  RecipeList?: ClassRecipe[];
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface ClassRecipe {
  ClassRecipeId?: string;
  ClassId?: string;
  RecipeId?: string;
  RReference: string;
  UnitCost?: number;
  TotalCost?: number;
}

export interface Auth {
  UserId?: ID;
  Name?: string;
  Email?: string;
  ContactNumber?: number;
  Password?: string;
  Role?: string;
  Status?: string;
  CreatedAt?: string;
}

export interface Level {
  LevelId: ID;
  Name: string;
}

export interface Report {
  ReportId?: ID;
  Title?: string;
  Description?: string;
  Type?: string;
  GeneratedBy?: string;
  GeneratedAt?: string;
  Data?: any;
  CreatedAt?: string;
  UpdatedAt?: string;
}
