import { useFormikContext } from "formik";
import InputField from "../InputField";
import { fields, type FieldType, type Step1Fields } from "./movieFormFields";
import type { MovieDraft } from "./movieFormHelpers";

export default function AddEditMovieModal() {
  const { errors, touched } = useFormikContext<MovieDraft>();

  return (
    <>
      {fields.map((element: Step1Fields) => (
        <InputField
          key={element.field}
          field={element.field}
          type={element.type}
          placeholder={element.placeholder}
          error={errors[element.field as FieldType] ? true : false}
          touched={touched[element.field] ? true : false}
        />
      ))}
    </>
  );
}
