import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/authSlice";
import { registerUser } from "../../api/authAPI";
import { FcGoogle } from "react-icons/fc";


// ================= ZOD SCHEMA =================

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(20, "First name cannot exceed 20 characters")
      .regex(/^[A-Za-z]+$/, "Only letters are allowed"),

    lastName: z
      .string()
      .max(20, "Last name cannot exceed 20 characters"),

    emailId: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Must contain uppercase, lowercase, number and special character"
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );
// ================= ANIMATION VARIANTS =================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// ================= COMPONENT =================

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      confirmPassword: "",
    },
  });


  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      dispatch(setUser(response.user));
      navigate("/dashboard");
    }
    catch (error) {
      setError("root", {
        message: "Registration failed. Email may already be in use."
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 relative overflow-hidden px-4">
      {/* Background Glow Effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Main Content */}
      <div className="w-full max-w-md z-10">
        {/* Logo Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: -40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            CodeForge
          </h1>

          <p className="mt-3 text-base-content/70">
            Practice. Compete. Grow.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="card bg-base-200/70 backdrop-blur-xl border border-base-300 shadow-2xl"
        >
          <div className="card-body">
            <h2 className="text-3xl font-bold text-center mb-2">
              Create Account
            </h2>

            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* First Name */}
              <motion.div variants={itemVariants}>
                <label className="label">
                  <span className="label-text">
                    First Name
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="John"
                  className="input input-bordered w-full transition-all duration-300 focus:scale-[1.02]"
                  {...register("firstName")}
                />

                {errors.firstName && (
                  <p className="text-error text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </motion.div>

              {/* Last Name */}
              <motion.div variants={itemVariants}>
                <label className="label">
                  <span className="label-text">
                    Last Name
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered w-full transition-all duration-300 focus:scale-[1.02]"
                  {...register("lastName")}
                />

                {errors.lastName && (
                  <p className="text-error text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="label">
                  <span className="label-text">
                    Email
                  </span>
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  className="input input-bordered w-full transition-all duration-300 focus:scale-[1.02]"
                  {...register("emailId")}
                />

                {errors.emailId && (
                  <p className="text-error text-sm mt-1">
                    {errors.emailId.message}
                  </p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="label">
                  <span className="label-text">
                    Password
                  </span>
                </label>

                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full transition-all duration-300 focus:scale-[1.02]"
                  {...register("password")}
                />

                {errors.password && (
                  <p className="text-error text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants}>
                <label className="label">
                  <span className="label-text">
                    Confirm Password
                  </span>
                </label>

                <input
                  type="password"
                  placeholder="********"
                  className="input input-bordered w-full transition-all duration-300 focus:scale-[1.02]"
                  {...register("confirmPassword")}
                />

                {errors.confirmPassword && (
                  <p className="text-error text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </motion.div>

              {errors.root && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="alert alert-error"
                >
                  <span className="text-sm">{errors.root.message}</span>
                </motion.div>
              )}

              <button

                type="button"

                onClick={() => {
                  window.location.href =
                    "http://localhost:3000/auth/google";
                }}

                className="btn btn-outline w-full"

              >

                <FcGoogle size={22} />

                Continue with Google


              </button>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </motion.form>

            {/* Login Link */}
            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1,
              }}
              className="text-center mt-5"
              onClick={() => navigate("/login")}
            >
              Already have an account?{" "}
              <span className="link link-primary cursor-pointer font-medium">
                Login
              </span>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;