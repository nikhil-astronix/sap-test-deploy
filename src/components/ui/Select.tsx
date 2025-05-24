import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// Modified Trigger to include label support
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    label?: string;
  }
>(({ className, children, label, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-900 mb-1">
        {label}
      </label>
    )}
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-[#F4F6F8] px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Value
        placeholder={
          (label === "Role" || label === "User Type" ? "Select " : "Assign ") +
          (label ?? "").toLowerCase()
        }
      />
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  </div>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Updated SelectContent with search icon
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const [search, setSearch] = React.useState("");

  const filteredChildren = React.Children.toArray(children).filter(
    (child: any) =>
      child?.props?.children?.toLowerCase?.().includes(search.toLowerCase())
  );

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position="popper"
        className={cn(
          "z-50 mt-1 w-[var(--radix-select-trigger-width)] rounded-md border bg-white text-black shadow-md",
          className
        )}
        {...props}
      >
        <div className="px-3 py-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-md border border-gray-300 pl-8 pr-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16.65 10.35A6.3 6.3 0 104.35 10.35a6.3 6.3 0 0012.3 0z"
              />
            </svg>
          </div>
        </div>
        <SelectPrimitive.Viewport className="max-h-48 overflow-y-auto px-1 pb-2">
          {filteredChildren}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Custom radio-style SelectItem
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm pl-8 pr-2 py-2 text-sm outline-none focus:bg-gray-50",
      className
    )}
    {...props}
  >
    {/* Radio-style icon */}
    <span className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-black flex items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
