import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "components/FlexBetween";
import axios from "axios";

// Validation schemas
const registerSchema = yup.object().shape({
  firstName: yup.string().required("Please enter your first name."),
  lastName: yup.string().required("Please enter your last name."),
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Please enter your email."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters.")
    .required("Please enter your password."),
  picture: yup.string().required("Please upload a picture."),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Please enter your email."),
  password: yup.string().required("Please enter your password."),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);

      if (values.picture) {
        formData.append("picture", values.picture);
        formData.append("picturePath", values.picture.name);
      }

      const response = await axios.post(
        "http://localhost:3001/auth/register",
        formData
      );
      onSubmitProps.resetForm();
      setPageType("login");
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const { data: loggedIn } = await axios.post(
        "http://localhost:3001/auth/login",
        values
      );
      onSubmitProps.resetForm();
      if (loggedIn) {
        dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
        navigate("/home");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(4, 1fr)"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{
                    gridColumn: "span 2",
                    "& .MuiInputBase-input": { color: "white" },
                  }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{
                    gridColumn: "span 2",
                    "& .MuiInputBase-input": { color: "white" },
                  }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${theme.palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${theme.palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <Typography>Add Picture Here</Typography>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{
                gridColumn: "span 4",
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{
                gridColumn: "span 4",
                "& .MuiInputBase-input": { color: "white" },
              }}
            />
          </Box>

          <Box>
            <Button
              fullWidth
              type="submit"
              disabled={
                !isLogin
                  ? !values.firstName ||
                    !values.lastName ||
                    !values.email ||
                    !values.password ||
                    !values.picture ||
                    Boolean(errors.firstName) ||
                    Boolean(errors.lastName) ||
                    Boolean(errors.email) ||
                    Boolean(errors.password)
                  : !values.email ||
                    !values.password ||
                    Boolean(errors.email) ||
                    Boolean(errors.password)
              }
              sx={{
                mt: "2rem",
                p: "1rem",
                backgroundColor: "#3f51b5", // Blue button color
                color: "#ffffff",
                "&:hover": { backgroundColor: "#303f8f" }, // Dark blue on hover
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                mt: "1rem",
                color: "grey", // Set the main text color to white
                "&:hover": { cursor: "pointer" },
                fontSize: "0.725rem",
                textAlign: "center",
              }}
            >
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <span
                    style={{
                      color: "#3f51b5", // Blue color
                      textDecoration: "underline", // Underline
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPageType("register");
                      resetForm();
                    }}
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    style={{
                      color: "#3f51b5", // Blue color
                      textDecoration: "underline", // Underline
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPageType("login");
                      resetForm();
                    }}
                  >
                    Login
                  </span>
                </>
              )}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
