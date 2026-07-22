import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

const t = transcript.login;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/", { replace: true });
    } catch {
      toast.error(transcript.toasts.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="glass-card p-7">
          <h1 className="font-display text-xl font-semibold">
            <span className="gradient-text">{t.title}</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-muted">{t.subtitle}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                {t.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={update}
                placeholder={t.emailPlaceholder}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={update}
                  placeholder={t.passwordPlaceholder}
                  className="field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? t.hidePassword : t.showPassword}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-zinc-500 transition-colors hover:text-primary dark:text-muted dark:hover:text-glow"
                >
                  {showPassword ? <FiEyeOff className="h-4.5 w-4.5" /> : <FiEye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t.signingIn : t.submit}
              {!loading && <FiLogIn className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
