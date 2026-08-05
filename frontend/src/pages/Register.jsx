

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// const API_URL = `${
//   import.meta.env.VITE_API_URL || "http://localhost:5000"
// }/api/users`;
const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
        `${API_URL}/register`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }
      );

      const { token, user } = response.data;

      if (!token) {
        throw new Error(
          "Token was not received from the server"
        );
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
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
              Start intelligent oil purity analysis powered by AI.
            </h1>

            <p>
              Create your account to upload oil sample images,
              analyze adulteration levels, and review diagnostic
              results securely.
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
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              ← Back
            </button>

            <div className="login-heading">
              <span className="login-eyebrow">
                CREATE ACCOUNT
              </span>

              <h2>Get started</h2>

              <p>
                Enter your details to create a new account.
              </p>
            </div>

            {message && (
              <div
                className="login-error-message"
                role="alert"
              >
                <span>!</span>
                <p>{message}</p>
              </div>
            )}

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              <div className="register-form-grid">
                <div className="login-form-group">
                  <label htmlFor="name">
                    Full name
                  </label>

                  <div className="login-input-wrapper">
                    <span className="login-input-icon">
                      
                    </span>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="login-form-group">
                  <label htmlFor="phone">
                    Phone number
                  </label>

                  <div className="login-input-wrapper">
                    <span className="login-input-icon">
                      
                    </span>

                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      autoComplete="tel"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="login-form-group">
                <label htmlFor="email">
                  Email address
                </label>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    @
                  </span>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    autoComplete="new-password"
                    disabled={loading}
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    disabled={loading}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div className="login-divider">
              <span />
              <p>Already registered?</p>
              <span />
            </div>

            <Link
              to="/login"
              className="login-register-link"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
