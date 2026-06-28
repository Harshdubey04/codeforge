// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/dashboard/Sidebar";
// import Topbar from "../components/dashboard/Topbar";

// const DashboardLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div className="flex h-screen overflow-hidden">

//       {/* Sidebar */}
//       <div className={`relative shrink-0 transition-all duration-300 ${
//         collapsed ? "w-16" : "w-64"
//       }`}>
//         <Sidebar collapsed={collapsed} />

//         {/* Collapse toggle button */}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-md hover:scale-110 transition-transform text-xs"
//         >
//           {collapsed ? "›" : "‹"}
//         </button>
//       </div>

//       {/* Main */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Topbar />
//         <main className="flex-1 overflow-y-auto p-6 bg-base-100">
//           <Outlet />
//         </main>
//       </div>

//     </div>
//   );
// };

// export default DashboardLayout;

import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const MIN_WIDTH = 64;
const MAX_WIDTH = 320;
const DEFAULT_WIDTH = 256;
const COLLAPSE_THRESHOLD = 100;

const DashboardLayout = () => {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed]       = useState(false);
  const isDragging                      = useRef(false);
  const containerRef                    = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const newWidth = e.clientX;
      if (newWidth < COLLAPSE_THRESHOLD) {
        setSidebarWidth(MIN_WIDTH);
        setCollapsed(true);
      } else if (newWidth >= COLLAPSE_THRESHOLD && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
        setCollapsed(false);
      }
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleToggle = () => {
    if (collapsed) {
      setSidebarWidth(DEFAULT_WIDTH);
      setCollapsed(false);
    } else {
      setSidebarWidth(MIN_WIDTH);
      setCollapsed(true);
    }
  };

  return (
    <div ref={containerRef} className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <div
        style={{ width: `${sidebarWidth}px` }}
        className="relative shrink-0 transition-none"
      >
        <Sidebar collapsed={collapsed} />

        {/* Drag handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-base-300 hover:bg-primary active:bg-primary transition-colors z-40"
        />

        {/* Collapse toggle button */}
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-md hover:scale-110 transition-transform text-xs font-bold"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-base-100">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;