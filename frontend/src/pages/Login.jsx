// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const API_URL = `${
//   import.meta.env.VITE_API_URL || "http://localhost:5000"
// }/api/users`;

// export default function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setFormData((previousData) => ({
//       ...previousData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${API_URL}/login`,
//         formData
//       );

//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem(
//         "user",
//         JSON.stringify(response.data.user)
//       );

//       navigate("/");
//     } catch (error) {
//       setMessage(
//         error.response?.data?.message ||
//           "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h1>Welcome Back</h1>

//         <p>Login to continue to the oil adulteration system.</p>

//         {message && (
//           <div className="message">{message}</div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email</label>

//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>

//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="auth-link">
//           Don&apos;t have an account?{" "}
//           <Link to="/register">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/users`;

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        formData
      );

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Token was not received from the server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-visual">
          <div className="login-visual-content">
            <span className="login-brand-pill">
              OilDetect Pro
            </span>

            <h1>
              Intelligent oil purity analysis powered by AI.
            </h1>

            <p>
              Sign in to upload oil sample images, run adulteration
              checks, and review diagnostic results securely.
            </p>

            <div className="login-feature-list">
              <div className="login-feature-item">
                <span>✓</span>
                <p>AI-powered purity detection</p>
              </div>

              <div className="login-feature-item">
                <span>✓</span>
                <p>Secure JWT authentication</p>
              </div>

              <div className="login-feature-item">
                <span>✓</span>
                <p>Fast and simple sample analysis</p>
              </div>
            </div>
          </div>

          <div className="login-visual-orb login-orb-one" />
          <div className="login-visual-orb login-orb-two" />
        </div>

        <div className="login-form-panel">
          <div className="login-form-container">
            <button
              type="button"
              className="login-back-button"
              onClick={() => navigate("/")}
            >
              ← Back to home
            </button>

            <div className="login-heading">
              <span className="login-eyebrow">
                USER ACCESS
              </span>

              <h2>Welcome back</h2>

              <p>
                Enter your account details to continue.
              </p>
            </div>

            {message && (
              <div className="login-error-message">
                <span>!</span>
                <p>{message}</p>
              </div>
            )}

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              <div className="login-form-group">
                <label htmlFor="email">
                  Email address
                </label>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    
                  </span>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <div className="login-label-row">
                  <label htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="login-divider">
              <span />
              <p>New to OilDetect Pro?</p>
              <span />
            </div>

            <Link
              to="/register"
              className="login-register-link"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}