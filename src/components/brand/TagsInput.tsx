import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function TagsInput({ value, onChange, placeholder }: Props) {
  const [draft, setDraft] = useState("");

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function removeTag(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-1.5 focus-within:ring-2 focus-within:ring-ring">
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="rounded-full p-0.5 hover:bg-foreground/10"
            aria-label={`حذف ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(draft);
          } else if (e.key === "Backspace" && !draft && value.length > 0) {
            removeTag(value.length - 1);
          }
        }}
        onBlur={() => draft && addTag(draft)}
        placeholder={placeholder ?? "أضف واضغط Enter..."}
        className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
