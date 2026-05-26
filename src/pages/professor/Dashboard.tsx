import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "@/components/toast";
import { Layout } from "@/components/layout";

export const ProfessorDashboard: React.FC = () => {
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

  const handleLogout = () => {
    localStorage.removeItem("@App:token");
    showToast("Logout realizado! Até logo!", "success");
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <Layout>
      <Toast
        message={toastConfig.message}
        variant={toastConfig.variant}
        onClose={() => setToastConfig((prev) => ({ ...prev, message: null }))}
      />

      <main className="px-4 pt-32 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#3E3B7A] rounded-2xl shadow-xl p-8 mb-8 border-4 border-[#3E3B7A]/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                  Bem-vindo, Professor(a) Ciel!
                </h1>
                <p className="text-[#FFFFFF] font-semibold opacity-80">
                  Gerencie seus quizzes aqui.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-[#ee8697] border-2 border-[#ee8697] text-[#FFFFFF] rounded-lg font-semibold hover:bg-[#d47080] border-[#d47080] hover:text-white transition duration-200"
              >
                Sair
              </button>
            </div>

            <button
              onClick={() => navigate("/professor/quiz/gerar-quiz")}
              className="w-full sm:w-auto bg-[#605BEF] text-[#FFFFFF] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#4441AA] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Criar Quizz
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};
