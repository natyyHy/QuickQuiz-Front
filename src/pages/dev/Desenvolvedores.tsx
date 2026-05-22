import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Github, Linkedin, Mail, ArrowLeft } from "lucide-react";

const developers = [
  {
    name: "Thalisson Moura",
    role: "Full Stack Developer",
    description:
      "Responsável pelo desenvolvimento da arquitetura e integração do sistema.",
    email: "thalissondevprog@gmail.com",
    github: "https://github.com/Thalis78",
    linkedin: "https://www.linkedin.com/in/thalisson-moura-383ba4275",
    avatarUrl: "https://github.com/Thalis78.png",
  },
  {
    name: "Kaio Gabriel",
    role: "Frontend Developer",
    description: "Especialista em criar interfaces intuitivas e responsivas.",
    email: "kkaiogabrielk@gmail.com",
    github: "https://github.com/KaioGabriel-the",
    linkedin: "https://www.linkedin.com/in/kaio-gabriel-de-sousa-carvalho/",
    avatarUrl: "https://github.com/KaioGabriel-the.png",
  },
  {
    name: "Natiele Grazielly",
    role: "UI/UX Designer",
    description:
      "Focado na experiência do usuário e na estética visual do projeto.",
    email: "natielegrazielly5@gmail.com",
    github: "https://github.com/natyyHy",
    linkedin: "https://www.linkedin.com/in/natiele-grazielly-014b252b3",
    avatarUrl: "https://github.com/natyyHy.png",
  },
  {
    name: "Lucas Morais",
    role: "Backend Developer",
    description:
      "Responsável pela lógica de negócio e gerenciamento de banco de dados.",
    email: "lucasmoraiscmdev@gmail.com",
    github: "https://github.com/lucasmoraiscm",
    linkedin: "https://www.linkedin.com/in/lucas-moraiscm",
    avatarUrl: "https://github.com/lucasmoraiscm.png",
  },
];

const DevCard: React.FC<{ dev: (typeof developers)[0] }> = ({ dev }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-white/15 transition-all duration-300 group">
      {/* Substituído o ícone User pela tag img */}
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-transform duration-300 border-2 border-white/20">
        <img
          src={dev.avatarUrl}
          alt={`Foto de ${dev.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="text-xl font-bold text-white mb-1">{dev.name}</h3>
      <p className="text-purple-200 text-sm font-semibold mb-3">{dev.role}</p>
      <p className="text-white/70 text-sm mb-6 leading-relaxed">
        {dev.description}
      </p>

      <div className="flex items-center gap-4 mt-auto">
        <a
          href={dev.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/30 transition-colors"
        >
          <Github size={20} />
        </a>
        <a
          href={dev.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/30 transition-colors"
        >
          <Linkedin size={20} />
        </a>
        <a
          href={`mailto:${dev.email}`}
          className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/30 transition-colors"
        >
          <Mail size={20} />
        </a>
      </div>
    </div>
  );
};

const Desenvolvedores: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
        {/* Botão Voltar Pequeno e Discreto */}
        <div className="mb-6">
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

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            NOSSOS <span className="text-yellow-400">DESENVOLVEDORES</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Conheça a equipe talentosa por trás do QuickQuiz, dedicada a
            transformar a educação através da tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((dev, index) => (
            <DevCard key={index} dev={dev} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Desenvolvedores;
