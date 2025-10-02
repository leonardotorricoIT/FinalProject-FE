import { useFormikContext } from "formik";
import InputField from "../ui/form/InputField";
import ListInputField from "../ui/form/ListInputField";
import {
  secondStepFields,
  type FieldType,
  type Step2Fields,
} from "./movieFormFields";
import type { MovieDraft } from "./movieFormHelpers";

export default function AddDetailsMovie() {
  const { errors, touched } = useFormikContext<MovieDraft>();

  return (
    <>
      {secondStepFields.map((element: Step2Fields) =>
        element.type === "list" ? (
          <ListInputField
            key={element.field}
            field={element.field}
            placeholder={element.placeholder}
          />
        ) : (
          <InputField
            key={element.field}
            field={element.field}
            type={element.type}
            placeholder={element.placeholder}
            error={errors[element.field as FieldType] ? true : false}
            touched={touched[element.field] ? true : false}
          />
        )
      )}
    </>
  );
}
