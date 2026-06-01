import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { Users, Timer, Trophy, Copy, ArrowLeft, X } from "lucide-react";
import { getRoom, removeStudent, iniciarSala } from "@/api/sala";

export const QuizRoom: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [salaInfo, setSalaInfo] = useState({
    titulo: "Carregando...",
    nivel: "-",
    quantidade: 0,
    tempo: 0,
    jogadoresConectados: 0,
    alunosLista: [] as Array<{ nome: string; score: number }>,
  });

  const fetchSala = async () => {
    try {
      const sala = await getRoom(codigo!);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (codigo) {
      fetchSala();

      const interval = setInterval(() => {
        fetchSala();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [codigo]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const copiarCodigo = () => {
    if (codigo) {
      navigator.clipboard.writeText(codigo);
      setToastMessage("Código copiado!");
    }
  };

  const handleVoltar = () => {
    navigate("/professor/dashboard");
  };

  const handleRemoverAluno = async (alunoNome: string) => {
    if (!codigo) return;

    try {
      await removeStudent(codigo, alunoNome);
      setToastMessage(`Aluno ${alunoNome} removido com sucesso.`);
      fetchSala();
    } catch (error: any) {
      setToastMessage(error.message || "Erro ao tentar remover o aluno.");
    }
  };

  const handleIniciarSala = async () => {
    if (!codigo) return;

    try {
      setIsStarting(true);
      await iniciarSala(codigo);
      setToastMessage("Sala iniciada com sucesso!");

      navigate(`/professor/quiz/sala/pontuacao/${codigo}`);
    } catch (error: any) {
      setToastMessage(error.message || "Erro ao tentar iniciar a sala.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Layout>
      <Toast
        message={toastMessage}
        variant="success"
        onClose={() => setToastMessage(null)}
      />

      <div className="flex flex-col items-center px-4 py-8 md:py-20 min-h-[calc(100vh-80px)] w-full max-w-4xl mx-auto">
        <div className="w-full flex items-center justify-start mt-12 mb-6 md:mb-12">
          <button
            type="button"
            onClick={handleVoltar}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Painel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#3E3B7A] rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/10 shadow-2xl">
              <h2 className="text-white/50 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-2">
                Título do Quiz
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
                {salaInfo.alunosLista.length === 0
                  ? "Aguardando Alunos..."
                  : "Alunos na Sala"}
              </h3>

              {salaInfo.alunosLista.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mb-4 md:mb-6 animate-pulse">
                    <Users className="w-8 h-8 md:w-12 md:h-12 text-white/20" />
                  </div>
                  <p className="text-white/50 font-medium text-xs md:text-sm max-w-sm px-4">
                    A partida começará assim que os alunos entrarem usando o
                    código ao lado.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                  {salaInfo.alunosLista.map((aluno, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3.5 text-white font-bold min-w-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70 shrink-0">
                          {index + 1}
                        </div>
                        <span className="truncate text-base md:text-lg">
                          {aluno.nome}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverAluno(aluno.nome)}
                        className="p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-colors shrink-0"
                      >
                        <X className="w-4 h-4 md:w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-2xl flex flex-col items-center text-center">
              <span className="text-[#3E3B7A]/40 font-black uppercase text-[10px] md:text-xs tracking-widest mb-3 md:mb-6">
                Código da Sala
              </span>
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#3E3B7A] tracking-tighter mb-6 md:mb-10">
                {codigo}
              </div>
              <button
                onClick={copiarCodigo}
                className="w-full flex items-center justify-center gap-3 bg-[#3E3B7A] text-white py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black hover:bg-[#2D2A5E] transition-all active:scale-95 shadow-xl text-sm md:text-base"
              >
                <Copy className="w-4 h-4 md:w-5 h-5" />
                Copiar Código
              </button>
            </div>

            <button
              onClick={handleIniciarSala}
              disabled={
                isLoading || isStarting || salaInfo.alunosLista.length === 0
              }
              className="w-full flex items-center justify-center gap-3 bg-green-500 text-white py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black text-lg md:text-2xl shadow-[0_8px_0_rgb(21,128,61)] md:shadow-[0_12px_0_rgb(21,128,61)] hover:shadow-[0_4px_0_rgb(21,128,61)] md:hover:shadow-[0_6px_0_rgb(21,128,61)] hover:translate-y-[4px] md:hover:translate-y-[6px] transition-all active:translate-y-[8px] md:active:translate-y-[12px] active:shadow-none disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {isStarting ? "INICIANDO..." : "INICIAR AGORA"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
