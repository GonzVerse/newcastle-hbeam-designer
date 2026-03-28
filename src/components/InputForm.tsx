"use client";

import { useState } from "react";

export interface FormValues {
  p_psf: string;
  a_ft: string;
  b_ft: string;
  L_ft: string;
  W_ft: string;
  S_ft: string;
  Va_connection: string;
}

interface FieldConfig {
  key: keyof FormValues;
  label: string;
  unit: string;
  placeholder: string;
  helper: string;
  required: boolean;
}

const FIELDS: FieldConfig[] = [
  {
    key: "p_psf",
    label: "Floor Load",
    unit: "PSF",
    placeholder: "50",
    helper: "Total load on the deck (dead + live). Typical: 50 PSF.",
    required: true,
  },
  {
    key: "a_ft",
    label: "Bumpout Depth",
    unit: "ft",
    placeholder: "3",
    helper: "How far the bumpout extends from the house wall.",
    required: true,
  },
  {
    key: "b_ft",
    label: "Overhang Past Post",
    unit: "ft",
    placeholder: "3",
    helper: "How far the outer beam extends beyond the end posts.",
    required: true,
  },
  {
    key: "L_ft",
    label: "Wall to Posts",
    unit: "ft",
    placeholder: "13",
    helper: "Distance from the house wall to the line of posts.",
    required: true,
  },
  {
    key: "W_ft",
    label: "Bumpout Width",
    unit: "ft",
    placeholder: "13",
    helper: "Total side-to-side width of the bumpout.",
    required: true,
  },
  {
    key: "S_ft",
    label: "Post Spacing",
    unit: "ft",
    placeholder: "9.25",
    helper: "Center-to-center distance between posts along the outer beam.",
    required: true,
  },
  {
    key: "Va_connection",
    label: "Connection Capacity (optional)",
    unit: "lbs",
    placeholder: "",
    helper: "Known capacity of the ledger connection. Leave blank to skip check.",
    required: false,
  },
];

const DEFAULTS: FormValues = {
  p_psf: "50",
  a_ft: "3",
  b_ft: "3",
  L_ft: "13",
  W_ft: "13",
  S_ft: "9.25",
  Va_connection: "",
};

interface InputFormProps {
  onSubmit: (values: FormValues) => void;
  loading: boolean;
  onChange?: (values: FormValues) => void;
}

export default function InputForm({ onSubmit, loading, onChange }: InputFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};
    for (const field of FIELDS) {
      if (field.required) {
        const val = values[field.key].trim();
        if (!val) {
          newErrors[field.key] = "Required";
        } else if (isNaN(Number(val)) || Number(val) <= 0) {
          newErrors[field.key] = "Must be a positive number";
        }
      } else if (values[field.key].trim()) {
        const val = values[field.key].trim();
        if (isNaN(Number(val)) || Number(val) <= 0) {
          newErrors[field.key] = "Must be a positive number";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(key: keyof FormValues, val: string) {
    const newValues = { ...values, [key]: val };
    setValues(newValues);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (onChange) {
      onChange(newValues);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="block text-lg font-bold text-gray-800 mb-1"
            >
              {field.label}
              {field.required && (
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              )}
            </label>
            <div className="flex rounded-lg overflow-hidden border-2 border-gray-300 focus-within:border-blue-600">
              <input
                id={field.key}
                type="number"
                inputMode="decimal"
                placeholder={field.placeholder}
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                aria-describedby={`${field.key}-helper`}
                className="flex-1 px-4 py-4 text-xl text-gray-900 bg-white outline-none min-w-0"
                aria-required={field.required}
              />
              <span className="flex items-center px-4 bg-gray-100 text-gray-600 text-lg font-semibold border-l-2 border-gray-300 whitespace-nowrap">
                {field.unit}
              </span>
            </div>
            {errors[field.key] && (
              <p className="mt-1 text-base text-red-600 font-semibold" role="alert">
                {errors[field.key]}
              </p>
            )}
            <p
              id={`${field.key}-helper`}
              className="mt-1 text-sm text-gray-500"
            >
              {field.helper}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 px-6 text-2xl font-bold text-white rounded-xl
            bg-green-600 hover:bg-green-700 active:bg-green-800
            disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors focus:outline-none focus:ring-4 focus:ring-green-400"
        >
          {loading ? "CALCULATING..." : "CALCULATE"}
        </button>
      </div>
    </form>
  );
}
