import PopcornImg from "../../assets/img/Popcorn.svg";
import CinemaImg from "../../assets/img/Cinema.svg";
import { Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";
import InputField from "../../components/ui/form/InputField";

type FieldType = "email" | "password";

type LoginForm = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const initialValues: LoginForm = { email: "", password: "" };

  const validationSchema: Yup.ObjectSchema<LoginForm> = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is mandatory"),
    password: Yup.string().required("Password is mandatory"),
  });

  const Fields: { field: FieldType; type: string; placeholder: string }[] = [
    { field: "email", type: "email", placeholder: "e.g., example@example.com" },
    { field: "password", type: "password", placeholder: "your password" },
  ];

  const handleSubmit = async (
    values: LoginForm,
    { setSubmitting, setErrors }: FormikHelpers<LoginForm>
  ) => {
    try {
      await login(values.email, values.password);

      if (values.email === "admin@cinelog.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrors({ email: "Invalid credentials" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen mx-auto px-2 bg-primary-bg dark:bg-gray-600">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="relative w-lg md:px-16 px-2 py-6 bg-white border-2 dark:bg-gray-700 border-primary rounded-xl shadow-lg dark:shadow-gray-700">
            <img
              src={CinemaImg}
              alt="cinema icon"
              className="absolute md:-left-12 -left-3 -top-12 md:w-32 w-16"
            />
            <h1 className="text-center text-4xl font-bold py-3 dark:text-gray-100">CineLog</h1>
            <p className="font-light text-center py-2 dark:text-gray-200">
              Welcome back! Please sign in to your account
            </p>

            <div className="space-y-4">
              {Fields.map((element) => (
                <InputField
                  key={element.field}
                  field={element.field}
                  type={element.type}
                  placeholder={element.placeholder}
                  error={errors[element.field as FieldType] ? true : false}
                  touched={touched[element.field] ? true : false}
                />
              ))}
            </div>

            <div className="mx-auto w-full mt-6 mb-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
                aria-label="submit button"
              >
                {isSubmitting ? "Loading..." : "Sign In"}
              </button>
            </div>
            <img
              src={PopcornImg}
              alt="cinema icon"
              className="absolute left-5/6 -bottom-10 md:w-32 w-16"
            />
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default LoginPage;
