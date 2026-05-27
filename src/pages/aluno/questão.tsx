import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Toast } from "@/components/toast";
import { Timer, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getRoom, atualizarPontuacao } from "@/api/sala";

interface Questao {
  id: number;
  nivel: string;
  pergunta: string;
  alternativas: {
    [key: string]: string;
  };
  resposta: string;
  imagem: string | null;
}

interface QuizData {
  codigo: string;
  titulo: string;
  quantidadeQuestoes: number;
  tempoPorQuestao: number;
  nivel: string;
  questoes: Questao[];
  status?: string;
  iniciada?: boolean;
  indexQuestaoAtual?: number;
}

export const QuizQuestions: React.FC = () => {
  const navigate = useNavigate();

  const salaSalva = localStorage.getItem("@App:sala_atual");
  const quizInicial: QuizData | null = salaSalva ? JSON.parse(salaSalva) : null;
  const meuNome = localStorage.getItem("nome_aluno") || "";

  const [salaId] = useState<string>(quizInicial?.codigo || "");
  const [questoesLista] = useState<Questao[]>(quizInicial?.questoes || []);

  const [indexQuestaoAtual, setIndexQuestaoAtual] = useState(
    quizInicial?.indexQuestaoAtual || 0,
  );
  const [tempo, setTempo] = useState(quizInicial?.tempoPorQuestao || 30);
  const [tempoTotalQuestao, setTempoTotalQuestao] = useState(
    quizInicial?.tempoPorQuestao || 30,
  );

  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [respondido, setRespondido] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "success",
  );

  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [aguardandoProxima, setAguardandoProxima] = useState(false);

  useEffect(() => {
    if (quizFinalizado && salaId) {
      navigate(`/professor/quiz/sala/pontuacao/${salaId}`);
    }
  }, [quizFinalizado, salaId, navigate]);

  useEffect(() => {
    if (!salaId || quizFinalizado) return;

    const checarStatusSala = async () => {
      try {
        const salaAtualizada = await getRoom(salaId);

        if (
          salaAtualizada.status === "finalizado" ||
          salaAtualizada.status === "concluido"
        ) {
          setQuizFinalizado(true);
        }
      } catch (error) {
        console.error("Erro ao sincronizar status da sala:", error);
      }
    };

    const interval = setInterval(checarStatusSala, 2000);
    return () => clearInterval(interval);
  }, [salaId, quizFinalizado]);

  useEffect(() => {
    if (quizFinalizado || questoesLista.length === 0 || aguardandoProxima)
      return;

    if (tempo > 0 && !respondido) {
      const timer = setInterval(() => setTempo((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (tempo === 0 && !respondido) {
      setRespondido(true);
      setToastVariant("error");
      setToastMessage("Tempo esgotado!");
      handleAvancoAutomatico();
    }
  }, [tempo, respondido, quizFinalizado, questoesLista, aguardandoProxima]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (!quizInicial || !meuNome) {
      navigate("/aluno/home");
    }
  }, [quizInicial, meuNome, navigate]);

  if (!quizInicial || questoesLista.length === 0) return null;

  const questaoAtual = questoesLista[indexQuestaoAtual];

  const calcularPontosPorVelocidade = (
    tempoRestante: number,
    tempoMaximo: number,
  ): number => {
    const tempoGasto = tempoMaximo - tempoRestante;

    if (tempoGasto <= tempoMaximo / 5) return 5;
    if (tempoGasto <= tempoMaximo / 4) return 4;
    if (tempoGasto <= tempoMaximo / 3) return 3;
    if (tempoGasto <= tempoMaximo / 2) return 2;
    return 1;
  };

  const handleAvancoAutomatico = () => {
    setAguardandoProxima(true);

    setTimeout(() => {
      setToastMessage(null);
      if (indexQuestaoAtual + 1 < questoesLista.length) {
        setIndexQuestaoAtual((prev) => {
          const novoIndex = prev + 1;

          if (quizInicial) {
            quizInicial.indexQuestaoAtual = novoIndex;
            localStorage.setItem(
              "@App:sala_atual",
              JSON.stringify(quizInicial),
            );
          }

          return novoIndex;
        });
        setTempo(tempoTotalQuestao);
        setSelecionada(null);
        setRespondido(false);
        setAguardandoProxima(false);
      } else {
        setQuizFinalizado(true);
      }
    }, 3000);
  };

  const handleResponder = async (chave: string) => {
    if (respondido || quizFinalizado || aguardandoProxima) return;
    setSelecionada(chave);
    setRespondido(true);

    if (chave === questaoAtual.resposta) {
      const pontosGanhos = calcularPontosPorVelocidade(
        tempo,
        tempoTotalQuestao,
      );
      const novaPontuacaoTotal = Math.round(pontuacaoTotal + pontosGanhos);

      setPontuacaoTotal(novaPontuacaoTotal);
      setToastVariant("success");
      setToastMessage(`Correto!`);

      try {
        await atualizarPontuacao(salaId, meuNome, novaPontuacaoTotal);
      } catch (error: any) {
        console.error(
          "Falha ao sincronizar pontuação no servidor:",
          error.message,
        );
      }
    } else {
      setToastVariant("error");
      setToastMessage("Resposta incorreta!");
    }

    handleAvancoAutomatico();
  };

  return (
    <Layout>
      <Toast
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setToastMessage(null)}
      />

      <div className="flex flex-col items-center px-4 pt-28 pb-12 md:py-16 min-h-[calc(100vh-80px)] w-full max-w-7xl mx-auto justify-start md:justify-center">
        <div className="w-full max-w-4xl flex items-center justify-between gap-4 mb-6 md:mb-8 mt-4 md:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="bg-white/10 text-white font-bold px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-wider whitespace-nowrap w-fit">
              Nível: {questaoAtual.nivel}
            </div>
            <div className="bg-white/5 text-white/60 font-bold px-4 py-2 rounded-full border border-white/5 text-xs tracking-wider whitespace-nowrap w-fit">
              Questão {indexQuestaoAtual + 1} de {questoesLista.length}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 bg-[#3E3B7A] border border-white/10 rounded-2xl px-4 py-2 md:px-6 md:py-3 text-white font-black text-lg md:text-xl shadow-xl">
            <Timer
              className={`w-5 h-5 md:w-6 md:h-6 ${tempo <= 10 ? "text-red-400 animate-pulse" : "text-blue-400"}`}
            />
            <span className={tempo <= 10 ? "text-red-400" : "text-white"}>
              {tempo}s
            </span>
          </div>
        </div>

        <div className="w-full max-w-4xl bg-[#3E3B7A] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-white/10 shadow-2xl space-y-6 md:space-y-8">
          <div className="text-center space-y-6 flex flex-col items-center justify-center">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight max-w-3xl w-full break-words">
              {questaoAtual.pergunta}
            </h1>

            {questaoAtual.imagem && (
              <div className="w-full max-w-md aspect-video rounded-2xl md:rounded-3xl overflow-hidden border-4 border-white/10 shadow-xl dynamic-image-container">
                <img
                  src={questaoAtual.imagem}
                  alt="Quiz visual element"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
            {Object.entries(questaoAtual.alternativas).map(([key, value]) => {
              const isSelected = selecionada === key;
              const isCorrect = key === questaoAtual.resposta;

              let cardStyle =
                "bg-white/5 border-white/10 text-white hover:bg-white/10 active:scale-[0.99]";

              if (respondido || aguardandoProxima) {
                if (isCorrect) {
                  cardStyle = "bg-green-500/20 border-green-500 text-green-300";
                } else if (isSelected && !isCorrect) {
                  cardStyle = "bg-red-500/20 border-red-500 text-red-300";
                } else {
                  cardStyle =
                    "bg-white/5 border-white/5 text-white/40 opacity-60 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={key}
                  disabled={respondido || aguardandoProxima}
                  onClick={() => handleResponder(key)}
                  className={`flex items-center justify-between border-2 rounded-xl md:rounded-2xl p-4 md:p-6 text-left font-bold text-base md:text-lg transition-all gap-4 min-w-0 w-full ${cardStyle}`}
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                    <span className="w-8 h-8 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center text-sm shrink-0 uppercase text-white font-black">
                      {key}
                    </span>
                    <span className="block break-words overflow-hidden text-ellipsis w-full">
                      {value}
                    </span>
                  </div>

                  {(respondido || aguardandoProxima) && isCorrect && (
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 shrink-0" />
                  )}
                  {(respondido || aguardandoProxima) &&
                    isSelected &&
                    !isCorrect && (
                      <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-400 shrink-0" />
                    )}
                </button>
              );
            })}
          </div>

          {aguardandoProxima && (
            <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl md:rounded-2xl text-white/80 font-bold text-center animate-fade-in mt-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <span>Indo para a próxima questão...</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
