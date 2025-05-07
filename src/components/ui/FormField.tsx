// components/ui/FormField.tsx
interface FormFieldProps {
    label: string;
    htmlFor?: string;
    children: React.ReactNode;
  }
  
  export function FormField({ label, htmlFor, children }: FormFieldProps) {
    return (
      <div className="space-y-1">
        <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {children}
      </div>
    );
  }
  