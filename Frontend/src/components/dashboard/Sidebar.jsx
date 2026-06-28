import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../api/authAPI";
import { logout } from "../../redux/authSlice";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    icon: "📊",
    label: "Dashboard"
  },
  {
    to: "/problems",
    icon: "📋",
    label: "Problems"
  },
  {
    to: "/leaderboard",
    icon: "🏆",
    label: "Leaderboard"
  },
  {
    to: "/profile",
    icon: "👤",
    label: "Profile"
  },
  {
    to: "/settings",
    icon: "⚙️",
    label: "Settings"
  }
];


const Sidebar = ({ collapsed }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    state => state.auth
  );


  const handleLogout = async () => {

    try {

      await logoutUser();

      dispatch(logout());

      navigate("/login");

    } catch (error) {

      console.log(error);

    }

  };


  return (

    <div className="
      h-full
      bg-base-200
      border-r
      border-base-300
      flex
      flex-col
      overflow-hidden
      transition-all
      duration-300
    ">


      {/* Logo */}

      <div className="
        px-4
        py-5
        border-b
        border-base-300
        shrink-0
      ">

        {
          collapsed ? (

            <div className="flex justify-center">

              <span className="
                text-primary
                text-xl
                font-black
              ">
                &lt;/&gt;
              </span>

            </div>

          ) : (

            <div className="
              flex
              items-center
              gap-2
            ">

              <span className="
                text-primary
                text-xl
                font-black
              ">
                &lt;/&gt;
              </span>


              <h1 className="
                text-lg
                font-black
                bg-gradient-to-r
                from-primary
                via-secondary
                to-accent
                bg-clip-text
                text-transparent
                whitespace-nowrap
              ">
                CodeForge
              </h1>

            </div>

          )
        }

      </div>



      {/* User */}

      {
        !collapsed && (

          <div className="
            px-4
            py-4
            border-b
            border-base-300
            shrink-0
          ">

            <div className="
              flex
              items-center
              gap-3
            ">

              <div className="
                w-9
                h-9
                rounded-full
                bg-primary
                text-primary-content
                flex
                items-center
                justify-center
                font-bold
                text-sm
                shrink-0
              ">
                {
                  user?.firstName
                    ?.charAt(0)
                    ?.toUpperCase()
                }
              </div>


              <div className="overflow-hidden">

                <p className="
                  text-sm
                  font-semibold
                  truncate
                ">
                  {user?.firstName}
                </p>


                <p className="
                  text-xs
                  text-base-content/50
                  truncate
                ">
                  {user?.emailId}
                </p>

              </div>

            </div>

          </div>

        )
      }




      {/* Navigation */}

      <nav className="
        flex-1
        px-2
        py-4
        space-y-1
        overflow-y-auto
      ">


        {
          NAV_ITEMS.map(item => (

            <NavLink

              key={item.to}

              to={item.to}

              title={
                collapsed
                  ? item.label
                  : ""
              }

              className={({ isActive }) =>

                `
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-lg
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  collapsed
                    ? "justify-center"
                    : ""
                }

                ${
                  isActive
                    ? "bg-primary text-primary-content shadow-md"
                    : "hover:bg-base-300 text-base-content/70 hover:text-base-content"
                }
                `
              }

            >

              <span className="
                text-base
                shrink-0
              ">
                {item.icon}
              </span>


              {
                !collapsed && (

                  <span className="
                    truncate
                  ">
                    {item.label}
                  </span>

                )
              }


            </NavLink>

          ))
        }


      </nav>



      {/* Logout */}

      <div className="
        px-2
        py-4
        border-t
        border-base-300
        shrink-0
      ">


        <button

          onClick={handleLogout}

          title={
            collapsed
              ? "Logout"
              : ""
          }

          className={`
            flex
            items-center
            gap-3
            px-3
            py-3
            rounded-lg
            text-sm
            font-medium
            w-full
            text-error
            hover:bg-error/10
            transition-all
            duration-200

            ${
              collapsed
                ? "justify-center"
                : ""
            }
          `}

        >

          <span>
            🚪
          </span>


          {
            !collapsed && (
              <span>
                Logout
              </span>
            )
          }


        </button>


      </div>


    </div>

  );

};


export default Sidebar;