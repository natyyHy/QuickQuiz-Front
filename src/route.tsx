import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/utils/ProtectedRoute";

import Index from "./pages/Index";
import { CreateQuizStep1 } from "./pages/professor/gerarQuiz";
import { QuizRoom } from "./pages/professor/Sala";
import { AboutSection } from "./pages/sobre/sobreCiel";
import { Home } from "./pages/aluno/home";
import { ProfessorDashboard } from "./pages/professor/Dashboard";
import { ProfessorLogin } from "./pages/professor/Login";
import Desenvolvedores from "./pages/dev/Desenvolvedores";
import { StudentWaitRoom } from "./pages/aluno/SalaEspera";
import { QuizQuestions } from "./pages/aluno/questão";
import { QuizScores } from "./pages/professor/salaPontuacao";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/professor/login" element={<ProfessorLogin />} />
      <Route path="/sobre/ciel" element={<AboutSection />} />
      <Route path="/aluno/home" element={<Home />} />
      <Route
        path="/aluno/quiz/sala/espera/:codigo"
        element={<StudentWaitRoom />}
      />
      <Route path="/aluno/quiz/questoes" element={<QuizQuestions />} />

      <Route path="/desenvolvedores" element={<Desenvolvedores />} />

      <Route
        path="/professor/quiz/sala/pontuacao/:codigo"
        element={<QuizScores />}
      />

      <Route
        path="/professor/dashboard"
        element={
          <ProtectedRoute>
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/professor/quiz/gerar-quiz"
        element={
          <ProtectedRoute>
            <CreateQuizStep1 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/professor/quiz/sala/:codigo"
        element={
          <ProtectedRoute>
            <QuizRoom />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
