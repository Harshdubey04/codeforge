import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "</>", title: "Curated Problems",  desc: "Handpicked problems with solutions and hints."          },
  { icon: "⚡",  title: "Real Contests",     desc: "Compete in real-time and climb the ranks."             },
  { icon: "📊",  title: "Track Progress",    desc: "Detailed analytics to help you improve."               },
  { icon: "💬",  title: "Learn Together",    desc: "Discuss, share, and grow with the community."          },
];

const COMPANIES = ["Google", "Microsoft", "Amazon", "Adobe", "PayPal", "TCS"];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-100">

      {/* Hero */}
      <div className="min-h-[90vh] flex items-center relative overflow-hidden px-6 md:px-16">

        {/* Background */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="z-10 max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge badge-primary badge-outline px-4 py-3 text-sm mb-6 inline-flex items-center gap-2">
              ⚡ The modern platform for developers
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl md:text-7xl font-black leading-tight"
          >
            Practice.{" "}
            <br />
            Compete.{" "}
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Level Up.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg text-base-content/60 max-w-lg"
          >
            Solve real coding problems, compete in contests, and track your progress — all in one place.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex gap-4"
          >
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-primary btn-lg px-8 gap-2"
            >
              Start Solving Now →
            </button>
            <button
              onClick={() => navigate("/problems")}
              className="btn btn-outline btn-lg px-8"
            >
              Browse Problems
            </button>
          </motion.div>

        </div>

      </div>

      {/* Features */}
      <div className="py-24 px-6 md:px-16 bg-base-200">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="card-body">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-base-content/60 text-sm">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Stats */}
      <div className="py-16 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center"
        >
          {[
            { value: "100+",  label: "Problems"    },
            { value: "4",     label: "Languages"   },
            { value: "24/7",  label: "Available"   },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-base-content/50 mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Trusted by */}
      <div className="py-16 px-6 bg-base-200 text-center">
        <p className="text-base-content/40 text-sm mb-8 uppercase tracking-widest">
          Trusted by developers at
        </p>
        <div className="flex flex-wrap justify-center gap-12 max-w-3xl mx-auto">
          {COMPANIES.map(company => (
            <span
              key={company}
              className="text-xl font-bold text-base-content/30 hover:text-base-content/60 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4">Ready to level up?</h2>
          <p className="text-base-content/60 mb-8">
            Join thousands of developers improving their skills every day.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="btn btn-primary btn-lg px-12"
          >
            Get Started Free
          </button>
          <p className="mt-8 text-xs text-base-content/30">
            Are you an admin?{" "}
            <span
              className="link link-hover cursor-pointer"
              onClick={() => navigate("/admin/login")}
            >
              Access admin portal →
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;