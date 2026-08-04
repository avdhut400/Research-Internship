// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ADMIN_LOGIN_API = `${
//   import.meta.env.VITE_API_URL || "http://localhost:5000"
// }/api/admin/login`;

// export default function AdminLogin() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previousData) => ({
//       ...previousData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(ADMIN_LOGIN_API, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Admin login failed"
//         );
//       }

//       if (!data.token) {
//         throw new Error(
//           "Admin token was not received"
//         );
//       }

//       localStorage.setItem(
//         "adminToken",
//         data.token
//       );

//       localStorage.setItem(
//         "admin",
//         JSON.stringify(data.admin)
//       );

//       navigate("/admin/dashboard", {
//         replace: true,
//       });
//     } catch (error) {
//       setError(
//         error.message ||
//           "Unable to login as admin"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="dashboard-body">
//       <section
//         className="dashboard-card"
//         style={{
//           width: "100%",
//           maxWidth: "480px",
//           margin: "0 auto",
//         }}
//       >
//         <div className="card-title-group">
//           <span className="step-tag">
//             ADMIN
//           </span>

//           <div>
//             <h2>Admin Login</h2>

//             <p>
//               Login to access the feedback
//               dashboard.
//             </p>
//           </div>
//         </div>

//         {error && (
//           <div className="error-toast">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div
//             style={{
//               marginBottom: "18px",
//             }}
//           >
//             <label htmlFor="adminEmail">
//               Email
//             </label>

//             <input
//               id="adminEmail"
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="admin@gmail.com"
//               autoComplete="email"
//               required
//               style={{
//                 width: "100%",
//                 padding: "12px 14px",
//                 marginTop: "7px",
//                 borderRadius: "8px",
//                 border:
//                   "1px solid #cbd5e1",
//               }}
//             />
//           </div>

//           <div
//             style={{
//               marginBottom: "22px",
//             }}
//           >
//             <label htmlFor="adminPassword">
//               Password
//             </label>

//             <input
//               id="adminPassword"
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter admin password"
//               autoComplete="current-password"
//               required
//               style={{
//                 width: "100%",
//                 padding: "12px 14px",
//                 marginTop: "7px",
//                 borderRadius: "8px",
//                 border:
//                   "1px solid #cbd5e1",
//               }}
//             />
//           </div>

//           <div className="card-actions">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading
//                 ? "Logging in..."
//                 : "Login as Admin"}
//             </button>

//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={() => navigate("/")}
//               disabled={loading}
//             >
//               Back to Prediction
//             </button>
//           </div>
//         </form>
//       </section>
//     </main>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// const ADMIN_LOGIN_API = `${
//   import.meta.env.VITE_API_URL || "http://localhost:5000"
// }/api/admin/login`;
const ADMIN_LOGIN_API = `${import.meta.env.VITE_API_URL}/api/admin/login`;

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(ADMIN_LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Admin login failed"
        );
      }

      if (!data.token) {
        throw new Error(
          "Admin token was not received from the server"
        );
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.message ||
          "Unable to login as admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-shell">
        <div className="admin-login-visual">
          <div className="admin-login-visual-content">
            <span className="admin-login-badge">
              ADMIN PORTAL
            </span>

            <h1>
              Manage and verify model feedback securely.
            </h1>

            <p>
              Access submitted oil samples, review prediction
              feedback, approve verified records, and manage the
              model improvement workflow.
            </p>

            <div className="admin-login-features">
              <div className="admin-login-feature">
                <span>✓</span>
                <p>Secure JWT-protected access</p>
              </div>

              <div className="admin-login-feature">
                <span>✓</span>
                <p>Feedback verification dashboard</p>
              </div>

              <div className="admin-login-feature">
                <span>✓</span>
                <p>Approve, reject, and manage records</p>
              </div>
            </div>
          </div>

          <div className="admin-login-glow admin-glow-one" />
          <div className="admin-login-glow admin-glow-two" />
        </div>

        <div className="admin-login-form-panel">
          <div className="admin-login-form-container">
            <button
              type="button"
              className="admin-login-back"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              ← Back to Prediction
            </button>

            <div className="admin-login-heading">
              <span>ADMIN ACCESS</span>

              <h2>Welcome back</h2>

              <p>
                Enter your administrator credentials to continue.
              </p>
            </div>

            {error && (
              <div className="admin-login-error">
                <strong>!</strong>
                <p>{error}</p>
              </div>
            )}

            <form
              className="admin-login-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-login-field">
                <label htmlFor="adminEmail">
                  Admin email
                </label>

                <div className="admin-login-input">
                  <span>@</span>

                  <input
                    id="adminEmail"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@gmail.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="admin-login-field">
                <label htmlFor="adminPassword">
                  Password
                </label>

                <div className="admin-login-input">
                  <span>•</span>

                  <input
                    id="adminPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="admin-login-spinner" />
                    Signing in...
                  </>
                ) : (
                  "Login as Admin"
                )}
              </button>
            </form>

            <div className="admin-login-security">
              <span>🔒</span>

              <p>
                This portal is restricted to authorized
                administrators only.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}