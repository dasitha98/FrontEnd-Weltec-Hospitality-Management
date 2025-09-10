# Components Directory

This directory contains all reusable UI components organized by functionality and purpose.

## Directory Structure

```
components/
├── dialogboxes/           # Dialog box components
│   ├── FormDialogBox.tsx      # Generic dialog box
│   ├── IngredientDialogBox.tsx # Ingredient-specific dialog
│   ├── StudentDialogBox.tsx   # Student-specific dialog
│   ├── ExampleUsage.tsx       # Usage examples
│   ├── index.ts              # Clean exports
│   └── README.md             # Dialog boxes documentation
├── forms/                 # Form components
│   ├── AddIngredientForm.tsx  # Ingredient form
│   ├── AddStudentForm.tsx     # Student form
│   ├── IngredientDialog.tsx   # Legacy ingredient dialog
│   ├── index.ts              # Clean exports
│   └── README.md             # Forms documentation
├── layout/               # Layout components
│   ├── content.tsx
│   ├── home/
│   └── menu/
└── ui/                   # Base UI components
    ├── Dialog.tsx            # Base dialog component
    ├── FormDialog.tsx        # Legacy form dialog
    └── ...
```

## Component Categories

### 1. **Dialog Boxes** (`/dialogboxes`)

Reusable dialog box components that provide modal interfaces for forms and content.

**Key Components:**

- `FormDialogBox`: Generic dialog box for any content
- `IngredientDialogBox`: Pre-configured for ingredient forms
- `StudentDialogBox`: Pre-configured for student forms

**Benefits:**

- Consistent dialog behavior across the app
- Easy to create new dialog boxes
- Type-safe and accessible
- Reusable and maintainable

### 2. **Forms** (`/forms`)

Reusable form components with validation and proper UX.

**Key Components:**

- `AddIngredientForm`: Comprehensive ingredient form
- `AddStudentForm`: Simple student form
- `IngredientDialog`: Legacy dialog (use IngredientDialogBox instead)

**Benefits:**

- Form validation and error handling
- Type-safe form data
- Accessible and responsive
- Reusable across different contexts

### 3. **UI Components** (`/ui`)

Base UI components that provide fundamental functionality.

**Key Components:**

- `Dialog`: Base dialog component with flexible options
- `FormDialog`: Legacy form dialog (use FormDialogBox instead)

**Benefits:**

- Foundation for other components
- Consistent styling and behavior
- Highly configurable
- Accessible by default

### 4. **Layout Components** (`/layout`)

Layout and structural components for page organization.

## Usage Patterns

### Creating a New Dialog Box

1. **Create the form component** (if needed):

```tsx
// src/app/components/forms/AddYourForm.tsx
export default function AddYourForm({ onSubmit, onCancel, ... }) {
  // Form implementation with validation
}
```

2. **Create the dialog box**:

```tsx
// src/app/components/dialogboxes/YourDialogBox.tsx
import FormDialogBox from "./FormDialogBox";
import { AddYourForm } from "@/app/components/forms";

export default function YourDialogBox({ isOpen, onClose, onSubmit, ... }) {
  return (
    <FormDialogBox
      isOpen={isOpen}
      onClose={onClose}
      title="Your Dialog Title"
      size="lg"
    >
      <AddYourForm
        onSubmit={onSubmit}
        onCancel={onClose}
        // ... other props
      />
    </FormDialogBox>
  );
}
```

3. **Export and use**:

```tsx
// In your page component
import { YourDialogBox } from "@/app/components/dialogboxes";

<YourDialogBox
  isOpen={isDialogOpen}
  onClose={handleClose}
  onSubmit={handleSubmit}
/>;
```

### Using Generic FormDialogBox

For custom content or one-off dialogs:

```tsx
import { FormDialogBox } from "@/app/components/dialogboxes";

<FormDialogBox
  isOpen={isOpen}
  onClose={onClose}
  title="Custom Dialog"
  size="md"
>
  <YourCustomContent />
</FormDialogBox>;
```

## Best Practices

### 1. **Component Organization**

- Group related components in subdirectories
- Use index.ts files for clean exports
- Keep components focused and single-purpose

### 2. **Type Safety**

- Use TypeScript interfaces for all props
- Define clear data types for form submissions
- Use generic types where appropriate

### 3. **Accessibility**

- Include proper ARIA attributes
- Ensure keyboard navigation works
- Use semantic HTML elements
- Test with screen readers

### 4. **Reusability**

- Make components configurable with props
- Avoid hardcoded values
- Design for multiple use cases
- Keep components independent

### 5. **Documentation**

- Include README files for complex directories
- Document component props and usage
- Provide usage examples
- Keep documentation up to date

## Migration Guide

### From Legacy Components

**Old Pattern:**

```tsx
import FormDialog from "@/app/components/ui/FormDialog";
import IngredientDialog from "@/app/components/forms/IngredientDialog";
```

**New Pattern:**

```tsx
import {
  FormDialogBox,
  IngredientDialogBox,
} from "@/app/components/dialogboxes";
```

### Benefits of New Structure

1. **Better Organization**: Components grouped by functionality
2. **Improved Reusability**: Generic components can be used anywhere
3. **Type Safety**: Better TypeScript support
4. **Consistency**: Unified behavior across all dialogs
5. **Maintainability**: Easier to update and extend
6. **Documentation**: Better organized and documented

## Future Enhancements

- Add more form types (Food, Class, etc.)
- Implement form state management
- Add animation and transition effects
- Create form field components
- Add comprehensive testing utilities
- Implement accessibility testing tools
