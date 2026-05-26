import React, { useState } from "react";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { useNavigate } from "react-router-dom";
import { enterRoomAsStudent } from "@/api/sala";
import { ArrowLeft } from "lucide-react";

const Home: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      showToast("Por favor, digite seu nome", "error");
      return;
    }

    if (!quizCode.trim()) {
      showToast("Por favor, digite o código do quiz", "error");
      return;
    }

    try {
      setIsLoading(true);

      const alunoInfo = await enterRoomAsStudent(
        quizCode.trim(),
        studentName.trim(),
      );

      localStorage.setItem("nome_aluno", alunoInfo.nome);

      showToast(
        `Bem-vindo(a), ${alunoInfo.nome}! Entrando na sala...`,
        "success",
      );

      setTimeout(() => {
        navigate(`/aluno/quiz/sala/espera/${quizCode.trim()}`);
      }, 1000);
    } catch (error: any) {
      showToast(error.message || "Erro ao tentar entrar na sala.", "error");
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
              src="https://api.builder.io/api/v1/image/assets/TEMP/025b9c6df2eac5de10d3c632cc91f2c43fc130c9?width=284"
              width="150px"
              alt="Logo"
              className="mb-4"
            />
            <h2 className="text-4xl font-black text-white text-center tracking-tight drop-shadow-md">
              Hora do desafio!🚀
            </h2>
            <p className="text-white/80 text-center text-sm">
              Digite seu nome e o código do quiz do professor
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="w-full">
              <label className="text-2xl font-black text-white tracking-tight drop-shadow-md mb-2 block">
                Seu Nome
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#605BEF] transition-all"
              />
            </div>

            <div className="w-full">
              <label className="text-2xl font-black text-white tracking-tight drop-shadow-md mb-2 block">
                Código do Quiz
              </label>
              <input
                type="text"
                placeholder="Ex: QUIZ2024"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                maxLength={10}
                className="mb-8 w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#605BEF] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-10 px-4 py-3 bg-gradient-to-r from-[#605BEF] to-[#605BEF] text-white font-bold rounded-lg hover:from-[#4441AA] hover:to-[#3a35a8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? "Entrando..." : "Começar!"}
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
};

export { Home };
