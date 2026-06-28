import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const handleGoHome = () => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 relative overflow-hidden px-4">

      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <div className="z-10 text-center">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-9xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
          <p className="text-base-content/60 mt-3 max-w-md mx-auto">
            Looks like this page doesn't exist or was moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            ← Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="btn btn-primary"
          >
            Go Home
          </button>

        </motion.div>

      </div>

    </div>
  );
};

export default NotFound;