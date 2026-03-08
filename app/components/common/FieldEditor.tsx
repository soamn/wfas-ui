"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import {
  PiBracketsCurlyFill,
  PiSelectionFill,
  PiTrashBold,
  PiPlusBold,
} from "react-icons/pi";
import { IoChevronDown } from "react-icons/io5";
import Textarea from "../editor/Textarea";
import InputComponent from "../common/Input";

interface BodyField {
  key: string;
  type: "string" | "number" | "boolean";
  value: any;
}

interface Props {
  fields: BodyField[];
  variables: any[];
  onChange: (fields: BodyField[]) => void;
}

export default function FieldEditor({
  fields = [],
  variables,
  onChange,
}: Props) {
  const addField = () => {
    onChange([...fields, { key: "", type: "string", value: "" }]);
  };

  const updateField = (index: number, updates: Partial<BodyField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange(newFields);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const blockInvalidChar = (e: React.KeyboardEvent) =>
    ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <PiBracketsCurlyFill className="text-zinc-400" size={16} />
          <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            JSON Body Fields
          </span>
        </div>
        <button
          onClick={addField}
          className="text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <PiPlusBold size={12} /> Add Field
        </button>
      </div>

      <div className="max-h-125 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-600 text-[11px] italic gap-2">
            <PiSelectionFill size={24} className="opacity-20" />
            No body parameters added
          </div>
        )}

        {fields.map((field, index) => (
          <div
            key={index}
            className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 relative group animate-in slide-in-from-right-2 duration-200"
          >
            <button
              onClick={() => removeField(index)}
              className="absolute top-3 right-3 p-1.5 text-zinc-300 dark:text-zinc-600
               hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <PiTrashBold size={14} />
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter ml-1">
                  Key Name
                </p>
                <InputComponent
                  className="border-zinc-200 dark:border-zinc-800"
                  placeholder="e.g. user_id"
                  value={field.key}
                  onChange={(e: any) => {
                    const sanitizedKey = e.target.value
                      .replace(/\s+/g, "_")
                      .replace(/[^a-zA-Z0-9_]/g, "");
                    updateField(index, { key: sanitizedKey });
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter ml-1">
                  Data Type
                </p>
                <div className="relative">
                  <select
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-10 h-9.5 text-xs outline-none cursor-pointer appearance-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 dark:text-zinc-200 transition-all"
                    value={field.type}
                    onChange={(e) =>
                      updateField(index, {
                        type: e.target.value as any,
                        value: "",
                      })
                    }
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  <IoChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                    size={14}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter ml-1">
                Value
              </p>
              {field.type === "string" ? (
                <Textarea
                  key={field.key}
                  value={field.value}
                  variables={variables}
                  onChange={(val: any) => updateField(index, { value: val })}
                  placeholder="Enter string or {{variable}}"
                />
              ) : field.type === "number" ? (
                <InputComponent
                  type="number"
                  placeholder="0"
                  value={field.value ?? ""}
                  onKeyDown={(e: any) => {
                    const isNumber = /[0-9]/.test(e.key);
                    const isControl = [
                      "Backspace",
                      "Delete",
                      "Tab",
                      "Escape",
                      "Enter",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ].includes(e.key);

                    if (!isNumber && !isControl) {
                      e.preventDefault();
                    }
                    blockInvalidChar(e);
                  }}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    if (val === "") {
                      updateField(index, { value: "" });
                    } else {
                      const num = Number(val);
                      if (!isNaN(num)) {
                        updateField(index, { value: num });
                      }
                    }
                  }}
                />
              ) : (
                <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  {["true", "false"].map((bool) => (
                    <button
                      key={bool}
                      onClick={() =>
                        updateField(index, { value: bool === "true" })
                      }
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        field.value === (bool === "true")
                          ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm border border-zinc-200 dark:border-zinc-600"
                          : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      }`}
                    >
                      {bool.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
