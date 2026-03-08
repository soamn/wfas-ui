import { useState, useEffect, useCallback } from "react";

export function useNodeConfigForm<T extends Record<string, any>>(
  id: string,
  config: T | undefined,
  schema: any,
  updateStore: (id: string, data: Partial<T>) => void,
) {
  const [values, setValues] = useState<T>(config || ({} as T));
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (config) {
      setValues(config);
      setErrors({});
    }
  }, [id]);

  useEffect(() => {
    if (config) {
      setValues(config);
    }
  }, [config]);

  const validate = useCallback(
    (field: keyof T, value: any, allValues: T) => {
      const nextValues = { ...allValues, [field]: value };
      const newErrors = { ...errors };

      const shape = schema.shape || schema._def?.schema?.shape;
      const fieldSchema = shape?.[field as string];

      if (fieldSchema) {
        const fieldResult = fieldSchema.safeParse(value);
        newErrors[field as string] = !fieldResult.success
          ? fieldResult.error.issues[0]?.message
          : null;
      }

      const globalResult = schema.safeParse(nextValues);
      if (!globalResult.success) {
        globalResult.error.issues.forEach((issue: any) => {
          const path = issue.path[0] as string;
          if (path) {
            newErrors[path] = issue.message;
          }
        });
      } else {
        Object.keys(newErrors).forEach((key) => {
          const globalMatch = schema.safeParse(nextValues);
          if (globalMatch.success) {
            const fieldCheck = shape?.[key]?.safeParse(nextValues[key]);
            if (fieldCheck?.success || !shape?.[key]) {
              newErrors[key] = null;
            }
          }
        });
      }

      setErrors(newErrors);
    },
    [schema, errors],
  );

  const handleChange = (
    field: keyof T,
    value: any,
    shouldUpdateStore = false,
  ) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      validate(field, value, prev);
      return next;
    });

    if (shouldUpdateStore) {
      updateStore(id, { [field]: value } as Partial<T>);
    }
  };

  const handleBlur = (field: keyof T) => {
    const value = values[field];
    validate(field, value, values);
    updateStore(id, { [field]: value } as Partial<T>);
  };

  return { values, errors, handleChange, handleBlur };
}
