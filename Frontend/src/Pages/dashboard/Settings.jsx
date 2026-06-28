import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const THEMES = [
  { name: "light",     label: "☀️ Light"     },
  { name: "dark",      label: "🌙 Dark"      },
  { name: "cupcake",   label: "🧁 Cupcake"   },
  { name: "forest",    label: "🌲 Forest"    },
  { name: "synthwave", label: "🌊 Synthwave" },
  { name: "cyberpunk", label: "🤖 Cyberpunk" },
  { name: "dracula",   label: "🧛 Dracula"   },
  { name: "night",     label: "🌃 Night"     },
  { name: "coffee",    label: "☕ Coffee"    },
];

const Settings = () => {
  const { user } = useSelector((state) => state.auth);

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-base-content/60 mt-1">
          Manage your preferences.
        </p>
      </div>

      {/* Profile Info */}
      <div className="card bg-base-200 border border-base-300 shadow-md">
        <div className="card-body">

          <h2 className="text-xl font-bold mb-4">👤 Account</h2>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-base-content/60 text-sm">
                {user?.emailId}
              </p>
              <span className="badge badge-primary badge-sm mt-1">
                {user?.role}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Theme Selector */}
      <div className="card bg-base-200 border border-base-300 shadow-md">
        <div className="card-body">

          <h2 className="text-xl font-bold mb-4">🎨 Theme</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {THEMES.map(theme => (
              <button
                key={theme.name}
                onClick={() => setCurrentTheme(theme.name)}
                data-theme={theme.name}
                className={`btn btn-sm justify-start gap-2 border-2 ${
                  currentTheme === theme.name
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                {currentTheme === theme.name && (
                  <span className="text-primary">✓</span>
                )}
                {theme.label}
              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Settings;