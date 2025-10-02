import { ErrorMessage, Field } from "formik";
import { useState } from "react";

export type InputFieldProps = {
  field: string;
  error: boolean;
  touched: boolean;
  type: string;
  placeholder: string;
};

export default function InputField({
  field,
  error,
  touched,
  type,
  placeholder,
}: InputFieldProps) {
  const isTextarea = type === "textarea";
  const isPassword = type === "password";

  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div key={field} className="relative">
      <label className="form-label">
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </label>
      <div className="relative">
        <Field
          as={isTextarea ? "textarea" : "input"}
          type={inputType}
          name={field}
          placeholder={placeholder}
          className={`input-base ${
            error && touched ? "input-error" : "input-normal"
          } ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        )}
      </div>
      <ErrorMessage name={field} component="p" className="error-message" />
    </div>
  );
}
