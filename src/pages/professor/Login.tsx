import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Toast } from "@/components/toast";
import { Layout } from "@/components/layout";
import { getEmailSuggestions } from "@/utils/apiUtils";
import { login } from "@/api/login";

export const ProfessorLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [toastConfig, setToastConfig] = useState<{
    message: string | null;
    variant: "success" | "error";
  }>({
    message: null,
    variant: "success",
  });

  const showToast = (
    message: string,
    variant: "success" | "error" = "success",
  ) => {
    setToastConfig({ message, variant });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const suggestionsList = getEmailSuggestions(value);
    setSuggestions(suggestionsList);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setEmail(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]);
    setIsLoading(true);

    try {
      const data = await login(email, password);

      if (data.success) {
        showToast("Bem-vindo ao English Quizz CIEL CURSOS!", "success");

        setTimeout(() => {
          navigate("/professor/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      const errorMsg = error.message || "E-mail ou senha incorretos.";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <main className="flex flex-col items-center justify-center px-4 pt-32 pb-12">
        <div className="w-full max-w-md bg-[#3E3B7A] rounded-2xl p-8 border-4 border-[#3E3B7A] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="mt-6 text-left w-full">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 rounded-lg text-sm font-medium hover:bg-white/15 hover:text-white transition duration-200 backdrop-blur-sm group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                Voltar
              </button>
            </div>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/ef263a52258bbe9a374560e02155169f1fceebf7?width=290"
              width="150px"
              alt="Logo"
              className="mb-4"
            />
            <h2 className="text-4xl font-black text-white text-center tracking-tight drop-shadow-md mb-2">
              Acesso do Professor
            </h2>
            <p className="text-white/80 text-center text-sm">
              Acesse sua conta para gerenciar quizzes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="relative">
              <label
                htmlFor="email"
                className="text-2xl font-black text-white tracking-tight drop-shadow-md mb-2 block"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#605BEF] transition-all"
                placeholder="seu.email@exemplo.com"
                required
                autoComplete="off"
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-4 py-3 text-sm text-gray-800 hover:bg-[#605BEF] hover:text-white cursor-pointer transition-colors border-b last:border-b-0 border-gray-100"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-2xl font-black text-white tracking-tight drop-shadow-md mb-2 block"
              >
                Senha
              </label>
              <div className="relative mb-10">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#605BEF] transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#] focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-10 px-4 py-3 bg-gradient-to-r from-[#605BEF] to-[#605BEF] text-white font-bold rounded-lg hover:from-[#4441AA] hover:to-[#3a35a8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
};
