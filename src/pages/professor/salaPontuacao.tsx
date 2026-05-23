import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { Trophy, Users, ArrowLeft, RefreshCw, Award } from "lucide-react";
import { getRoom } from "@/api/sala";

interface AlunoNota {
  nome: string;
  score: number;
}

export const QuizScores: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quizTitulo, setQuizTitulo] = useState("Carregando...");
  const [alunosLista, setAlunosLista] = useState<AlunoNota[]>([]);

  const fetchNotas = async () => {
    if (!codigo) return;

    try {
      const sala = await getRoom(codigo);
      setQuizTitulo(sala.titulo);

      const alunosOrdenados = (sala.alunos || []).sort(
        (a: AlunoNota, b: AlunoNota) => b.score - a.score,
      );

      setAlunosLista(alunosOrdenados);
    } catch (error: any) {
      setToastMessage(error.message || "Erro ao atualizar notas dos alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();

    const interval = setInterval(() => {
      fetchNotas();
    }, 2000);

    return () => clearInterval(interval);
  }, [codigo]);

  const handleVoltar = () => {
    navigate("/");
  };

  const podio = alunosLista.slice(0, 3);

  return (
    <Layout>
      <Toast
        message={toastMessage}
        variant="error"
        onClose={() => setToastMessage(null)}
      />

      <div className="flex flex-col items-center px-4 py-20 min-h-[calc(100vh-80px)] w-full max-w-5xl mx-auto">
        <div className="w-full flex items-center justify-between mb-12">
          <button
            type="button"
            onClick={handleVoltar}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Painel</span>
          </button>

          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-green-400" />
            Sincronizado ao vivo
          </div>
        </div>

        <div className="w-full text-center lg:text-left mb-10">
          <span className="text-white/50 font-bold uppercase text-xs tracking-[0.2em] block mb-2">
            Resultados em Tempo Real • Sala {codigo}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {isLoading ? "Carregando Notas..." : quizTitulo}
          </h1>
        </div>

        {alunosLista.length === 0 ? (
          <div className="bg-[#3E3B7A] rounded-[2.5rem] p-12 border border-white/10 shadow-2xl text-center w-full max-w-2xl flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-white font-black text-xl mb-2">
              Nenhum aluno pontuou ainda
            </h3>
            <p className="text-white/50 text-sm max-w-sm font-medium">
              As notas aparecerão aqui assim que os estudantes começarem a
              responder as questões do quiz.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6 w-full max-w-3xl mx-auto">
              {podio[1] && (
                <div className="bg-[#3E3B7A]/60 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center order-2 md:order-1 h-[180px] justify-center relative">
                  <div className="absolute -top-5 w-10 h-10 bg-slate-400 text-slate-900 rounded-full flex items-center justify-center font-black text-lg border-4 border-[#1c1a36]">
                    2
                  </div>
                  <span className="text-white font-black text-xl truncate w-full px-2 mb-1">
                    {podio[1].nome}
                  </span>
                  <span className="text-slate-300 font-bold text-sm bg-slate-400/10 border border-slate-400/20 px-3 py-1 rounded-full">
                    {podio[1].score} pts
                  </span>
                </div>
              )}

              {podio[0] && (
                <div className="bg-[#3E3B7A] border-2 border-yellow-400 rounded-3xl p-8 flex flex-col items-center text-center order-1 md:order-2 h-[220px] justify-center relative shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                  <Trophy className="w-10 h-10 text-yellow-400 absolute -top-12 drop-shadow-[0_4px_10px_rgba(234,179,8,0.4)] animate-bounce" />
                  <div className="absolute -top-5 w-10 h-10 bg-yellow-400 text-yellow-950 rounded-full flex items-center justify-center font-black text-lg border-4 border-[#1c1a36]">
                    1
                  </div>
                  <span className="text-white font-black text-2xl truncate w-full px-2 mb-2">
                    {podio[0].nome}
                  </span>
                  <span className="text-yellow-400 font-black text-lg bg-yellow-400/10 border border-yellow-400/20 px-4 py-1.5 rounded-full">
                    {podio[0].score} pts
                  </span>
                </div>
              )}

              {podio[2] && (
                <div className="bg-[#3E3B7A]/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center order-3 h-[160px] justify-center relative">
                  <div className="absolute -top-5 w-10 h-10 bg-amber-600 text-amber-50 rounded-full flex items-center justify-center font-black text-lg border-4 border-[#1c1a36]">
                    3
                  </div>
                  <span className="text-white font-black text-xl truncate w-full px-2 mb-1">
                    {podio[2].nome}
                  </span>
                  <span className="text-amber-400 font-bold text-sm bg-amber-600/10 border border-amber-600/20 px-3 py-1 rounded-full">
                    {podio[2].score} pts
                  </span>
                </div>
              )}
            </div>

            <div className="bg-[#3E3B7A] rounded-[2.5rem] p-6 md:p-10 border border-white/10 shadow-2xl w-full">
              <h3 className="text-white font-black text-xl mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-green-400" />
                Classificação Geral
              </h3>

              <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/5">
                <div className="grid grid-cols-12 bg-white/5 p-4 text-white/40 font-bold text-xs uppercase tracking-widest">
                  <div className="col-span-2 text-center">Posição</div>
                  <div className="col-span-7">Nome do Aluno</div>
                  <div className="col-span-3 text-right pr-4">Pontuação</div>
                </div>

                <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5 bg-white/[0.02]">
                  {alunosLista.map((aluno, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 p-4 items-center text-white font-bold text-base hover:bg-white/5 transition-colors"
                    >
                      <div className="col-span-2 text-center">
                        <span
                          className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-black ${
                            index === 0
                              ? "bg-yellow-400 text-yellow-950"
                              : index === 1
                                ? "bg-slate-400 text-slate-900"
                                : index === 2
                                  ? "bg-amber-600 text-amber-50"
                                  : "bg-white/10 text-white/70"
                          }`}
                        >
                          {index + 1}º
                        </span>
                      </div>

                      <div className="col-span-7 truncate text-white/90 text-lg">
                        {aluno.nome}
                      </div>

                      <div className="col-span-3 text-right pr-4 text-xl font-black text-green-400 tracking-tight">
                        {aluno.score}{" "}
                        <span className="text-[10px] uppercase text-white/30 tracking-wide font-bold">
                          pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
