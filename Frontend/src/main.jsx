import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthInitializer from "./Components/auth/AuthInitializer";
import ErrorBoundary from './Components/common/ErrorBoundary';

// Apply saved theme on load
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById('root')).render(

  <Provider store={store}>

    <BrowserRouter>

      <AuthInitializer>

      <ErrorBoundary>
        <App />
      </ErrorBoundary>

      </AuthInitializer>

    </BrowserRouter>

  </Provider>

)