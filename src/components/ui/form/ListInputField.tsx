import { Field, ErrorMessage, getIn } from "formik";
import { useEffect, useRef, useState } from "react";

export default function ListInputField({
  field,
  placeholder,
  label,
}: {
  field: string;
  placeholder: string;
  label?: string;
}) {
  return (
    <div className="relative">
      <label className="form-label">{label ?? field[0].toUpperCase()+field.slice(1)}</label>

      <Field name={field}>
        {({ field: formikField, form }: any) => {
          const [raw, setRaw] = useState<string>(() => {
            return formikField.value.join(", ");
          });

          const skipSyncRef = useRef(false);

          useEffect(() => {
            if (skipSyncRef.current) { skipSyncRef.current = false; return; }
            const joined = formikField.value.join(", ");
            if (!/,\s*$/.test(raw)) setRaw(joined);
          }, [formikField.value]);

          const parser = (text: string) => text.split(",").map(t => t.trim()).filter(Boolean);

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const nextText = e.target.value;
            setRaw(nextText);
            const tokens = parser(nextText);
            skipSyncRef.current = true;
            form.setFieldValue(formikField.name, tokens, true);
            form.setFieldTouched(formikField.name, true, false);

            if (tokens.length > 0) form.setFieldError(formikField.name, undefined);
          };

          const commit = () => {
            const tokens = parser(raw);
            skipSyncRef.current = true;
            form.setFieldValue(formikField.name, tokens, true);
            form.setFieldTouched(formikField.name, true, true);
          };

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") { e.preventDefault(); commit(); }
          };

          const fieldError = getIn(form.errors, formikField.name);
          const fieldTouched = getIn(form.touched, formikField.name);
          const showError = Boolean(fieldError && fieldTouched);

          return (
            <>
              <input
                name={formikField.name}
                value={raw}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={commit}
                onKeyDown={handleKeyDown}
                className={`input-base ${showError ? "input-error" : "input-normal"}`}
              />
              <ErrorMessage name={field} component="p" className="error-message" />
            </>
          );
        }}
      </Field>
    </div>
  );
}
