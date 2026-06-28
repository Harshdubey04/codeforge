import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/authSlice";

// ================= ZOD SCHEMA =================

const adminLoginSchema = z.object({
  emailId: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Must contain uppercase, lowercase, number and special character"
    ),
});

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ================= COMPONENT =================

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      emailId: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      if (response.user.role !== "admin") {
        setError("root", {
          message: "Access denied. This portal is for admins only.",
        });
        return;
      }

      dispatch(setUser(response.user));
      navigate("/admin/dashboard");

    } catch (error) {
      setError("root", {
        message: "Invalid credentials. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 relative overflow-hidden px-4">

      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-error/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-warning/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-md z-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            CodeForge
          </h1>
          <p className="mt-3 text-base-content/70">
            Admin Portal
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-200/70 backdrop-blur-xl border border-base-300 shadow-2xl"
        >
          <div className="card-body">

            <h2 className="text-3xl font-bold text-center mb-2">
              🔐 Admin Login
            </h2>

            <p className="text-center text-base-content/50 text-sm mb-4">
              Restricted access — admins only
            </p>

            {/* Root error */}
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert alert-error mb-2"
              >
                <span className="text-sm">{errors.root.message}</span>
              </motion.div>
            )}

            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
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
                  <span className="label-text">Password</span>
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

              {/* Submit */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login as Admin"}
              </motion.button>

            </motion.form>

            {/* Back link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-5"
            >
              Not an admin?{" "}
              <span
                className="link link-primary cursor-pointer font-medium"
                onClick={() => navigate("/login")}
              >
                User Login
              </span>
            </motion.p>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminLogin;