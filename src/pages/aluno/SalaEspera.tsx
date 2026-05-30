import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { Users, Timer, Trophy, Loader2, LogOut } from "lucide-react";
import { getRoom, removeStudent } from "@/api/sala";

export const StudentWaitRoom: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const meuNome = localStorage.getItem("nome_aluno") || "";

  const [salaInfo, setSalaInfo] = useState({
    titulo: "Carregando...",
    nivel: "-",
    quantidade: 0,
    tempo: 0,
    jogadoresConectados: 0,
    alunosLista: [] as Array<{ nome: string; score: number }>,
  });

  const fetchSala = async () => {
    if (!codigo || !meuNome) {
      navigate("/aluno/home");
      return;
    }

    try {
      const sala = await getRoom(codigo);

      if (sala.started === true) {
        localStorage.setItem("@App:sala_atual", JSON.stringify(sala));
        navigate("/aluno/quiz/questoes");
        return;
      }

      const aindaNaSala = sala.alunos?.some(
        (aluno: any) => aluno.nome === meuNome,
      );

      if (!aindaNaSala && !isLoading) {
        navigate("/aluno/home");
        return;
      }

      setSalaInfo({
        titulo: sala.titulo,
        nivel: sala.nivel,
        quantidade: sala.quantidadeQuestoes,
        tempo: sala.tempoPorQuestao,
        jogadoresConectados: sala.alunos ? sala.alunos.length : 0,
        alunosLista: sala.alunos || [],
      });
    } catch (error: any) {
      setToastMessage(error.message || "Erro ao carregar dados da sala.");
      navigate("/aluno/home");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!meuNome) {
      navigate("/aluno/home");
      return;
    }

    fetchSala();

    const interval = setInterval(() => {
      fetchSala();
    }, 2000);

    return () => clearInterval(interval);
  }, [codigo, meuNome, isLoading]);

  const handleSairDaSala = async () => {
    if (!codigo || !meuNome) return;

    try {
      setIsLeaving(true);
      await removeStudent(codigo, meuNome);
      localStorage.removeItem("nome_aluno");
      navigate("/aluno/home");
    } catch (error: any) {
      setToastMessage(error.message || "Erro ao tentar sair da sala.");
      setIsLeaving(false);
    }
  };

  return (
    <Layout>
      <Toast
        message={toastMessage}
        variant="error"
        onClose={() => setToastMessage(null)}
      />

      <div className="flex flex-col items-center px-4 py-8 md:py-20 min-h-[calc(100vh-80px)] w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#3E3B7A] rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/10 shadow-2xl">
              <h2 className="text-white/50 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-2">
                Você entrou no Quiz
              </h2>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-6 md:mb-8 leading-tight break-words">
                {isLoading ? "..." : salaInfo.titulo}
              </h1>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                <div className="bg-white/5 rounded-xl md:rounded-2xl p-3 sm:p-5 border border-white/5 text-center min-w-0">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 mx-auto mb-1.5" />
                  <span className="block text-white font-black text-base md:text-xl truncate">
                    {salaInfo.nivel}
                  </span>
                  <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest block truncate">
                    Nível
                  </span>
                </div>

                <div className="bg-white/5 rounded-xl md:rounded-2xl p-3 sm:p-5 border border-white/5 text-center min-w-0">
                  <Timer className="w-5 h-5 md:w-6 md:h-6 text-blue-400 mx-auto mb-1.5" />
                  <span className="block text-white font-black text-base md:text-xl truncate">
                    {salaInfo.tempo}s
                  </span>
                  <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest block truncate">
                    Tempo
                  </span>
                </div>

                <div className="bg-white/5 rounded-xl md:rounded-2xl p-3 sm:p-5 border border-white/5 text-center min-w-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-green-400 mx-auto mb-1.5" />
                  <span className="block text-white font-black text-base md:text-xl truncate">
                    {salaInfo.jogadoresConectados}
                  </span>
                  <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest block truncate">
                    Alunos
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#3E3B7A] rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/10 shadow-2xl">
              <h3 className="text-white font-black text-xl md:text-2xl mb-4 md:mb-6 text-center sm:text-left">
                Jogadores na Sala
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                {salaInfo.alunosLista.map((aluno, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between border rounded-xl p-3.5 text-white font-bold min-w-0 ${
                      aluno.nome === meuNome
                        ? "bg-green-500/10 border-green-500"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 shrink-0">
                        {index + 1}
                      </div>
                      <span className="truncate text-base md:text-lg w-full">
                        {aluno.nome} {aluno.nome === meuNome && "(Você)"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col items-center text-center justify-center min-h-[260px] md:min-h-[300px]">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-[#3E3B7A] animate-spin mb-4 md:mb-6" />
              <span className="text-[#3E3B7A] font-black text-xl md:text-2xl mb-2 leading-tight">
                Aguardando o Professor
              </span>
              <p className="text-[#3E3B7A]/60 font-medium text-xs md:text-sm px-2 mb-6 md:mb-8">
                O jogo começará assim que o organizador iniciar a partida.
              </p>

              <button
                type="button"
                onClick={handleSairDaSala}
                disabled={isLeaving}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3.5 px-6 rounded-xl md:rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 uppercase tracking-wider text-xs md:text-sm shadow-md"
              >
                <LogOut className="w-4 h-4 md:w-5 h-5" />
                {isLeaving ? "Saindo..." : "Sair da Sala"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
