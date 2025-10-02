import { useEffect, useMemo, useState } from "react";
import type { Movie } from "../../domain/Movie";
import AddEditMovieModal from "../AddEditMovieModal/AddEditMovieModal";
import BreadCrumbSteps from "../ui/breadCrumb/BreadCrumbsSteps";
import {
  buildTouched,
  makeEmptyMovieDraft,
  mapYupToMovieErrors,
  toMovie,
  type MovieDraft,
} from "../AddEditMovieModal/movieFormHelpers";
import { Form, Formik, type FormikProps } from "formik";
import { movieSchema } from "../../validators/MovieSchema";
import * as yup from "yup";
import {
  step1Keys,
  step2Keys,
  type FieldType,
} from "../AddEditMovieModal/movieFormFields";
import { MovieDetailsSchema } from "../../validators/MovieDetailsSchema";
import AddDetailsMovie from "../AddEditMovieModal/AddDetailsMovie";
import MovieWizardHeader from "./MovieWizardHeader";
import MovieWizardFooter from "./MovieWizardFooter";

type MovieFormWizardProps = {
  open: boolean;
  editable?: boolean;
  initial?: Partial<Movie>;
  onClose: () => void;
  onEdit?: (movie: Movie) => void;
  onSubmit?: (movie: Partial<Movie>) => void;
};

export default function MovieFormWizard({
  open,
  editable,
  onClose,
  onSubmit,
  onEdit,
  initial,
}: MovieFormWizardProps) {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;
  const initialValues = useMemo(
    () => ({ ...makeEmptyMovieDraft(), ...initial }),
    [initial]
  );

  const handleSubmit = (movieValue: Partial<Movie>) => {
    if (editable && onEdit) {
      const movie: Movie = toMovie(movieValue);
      onEdit(movie);
    } else if (onSubmit) {
      onSubmit(movieValue);
    }
    onClose();
  };

  async function validateStepOrShow(
    formik: FormikProps<MovieDraft>,
    schema: yup.AnyObjectSchema,
    stepFields: readonly FieldType[]
  ) {
    try {
      await schema.validate(formik.values, { abortEarly: false });
      return true;
    } catch (error: any) {
      const errors = mapYupToMovieErrors(error as yup.ValidationError);
      formik.setErrors({ ...formik.errors, ...errors });
      formik.setTouched(
        { ...(formik.touched ?? {}), ...(buildTouched(stepFields) ?? {}) },
        true
      );
      return false;
    }
  }

  type StepType = {
    schema: yup.AnyObjectSchema;
    keys: readonly FieldType[];
  };

  const stepsData: StepType[] = [
    { schema: movieSchema, keys: step1Keys },
    { schema: MovieDetailsSchema, keys: step2Keys },
  ];

  const goToStep = async (
    formik: FormikProps<MovieDraft>,
    wantedStep: number
  ) => {
    if (wantedStep > step) {
      const operationStatus = await validateStepOrShow(
        formik,
        stepsData[step].schema,
        stepsData[step].keys
      );
      if (operationStatus) setStep(wantedStep);
    } else {
      setStep(wantedStep);
    }
  };

  return (
    <div className="movie-form-modal-container">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
      <div className="movie-form-modal-card">
        <MovieWizardHeader
          title={editable ? "Edit Movie" : "Add a Movie"}
          onClose={onClose}
        />
        <div className="px-6 pb-6">
          <Formik<MovieDraft>
            initialValues={initialValues}
            validationSchema={movieSchema.concat(MovieDetailsSchema)}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className="space-y-4">
                <BreadCrumbSteps
                  steps={[1, 2]}
                  activeStep={step}
                  onClick={(step) => {
                    goToStep(formik, step);
                  }}
                />
                {step === 0 && <AddEditMovieModal />}
                {step === 1 && <AddDetailsMovie />}
                <MovieWizardFooter
                  step={step}
                  onBack={() => goToStep(formik, 0)}
                  onNext={() => goToStep(formik, 1)}
                  onSave={async () => {
                    const ok = await validateStepOrShow(
                      formik,
                      MovieDetailsSchema,
                      step2Keys
                    );
                    if (ok) formik.submitForm();
                  }}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
