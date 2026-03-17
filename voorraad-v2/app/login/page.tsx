"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Truck, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail]       = useState("manager@denengelsen.nl");
  const [password, setPassword] = useState("demo1234");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 700));
    if (email && password) {
      router.push("/dashboard");
    } else {
      setError("Please fill in all fields.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E8F0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Brand header */}
          <div className="brand-gradient p-6 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">StockInsight</h1>
            <p className="text-white/70 text-sm mt-1">Den Engelsen Commercial Vehicles</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@denengelsen.nl"
                className="w-full px-3 py-2.5 text-sm bg-secondary rounded-lg border-0 outline-none focus:ring-2 focus:ring-brand/30"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-sm bg-secondary rounded-lg border-0 outline-none focus:ring-2 focus:ring-brand/30"
                  required
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full brand-gradient text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 transition-opacity"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-4 h-4" />Sign in</>
              )}
            </button>

            {/* Demo accounts */}
            <div className="bg-secondary/80 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Demo accounts:</p>
              <p>Manager: manager@denengelsen.nl</p>
              <p>Sales rep: verkoper.duiven@denengelsen.nl</p>
              <p className="text-[10px] mt-1">Password: demo1234</p>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          © 2024 Den Engelsen Commercial Vehicles ·{" "}
          <a href="https://denengelsen.eu" className="hover:text-foreground">denengelsen.eu</a>
        </p>
      </div>
    </div>
  );
}
