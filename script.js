// Configuração fixa do estudante
const CONFIG_ALUNO = {
  turma: "8B",
  numeroChamada: 19,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variável para manter o PIN da sessão em memória
let pinSessao = "";

// Dados brutos locais das 15 disciplinas do 8º Ano
let dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Frequência geral fictícia/demonstrativa
const FREQUENCIA_DEMONSTRATIVA = "92%";

// Função para normalizar valor de nota vindo dos dados originais (escala 0-100 para 0-10)
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }
  let numero = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);
  if (isNaN(numero) || numero < 0) {
    return null;
  }
  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }
  if (numero > 10) {
    return null;
  }
  return numero;
}

// Função para formatar a nota para exibição no boletim
function formatarNotaExibicao(nota) {
  if (nota === null || nota === undefined) return "—";
  return Number(nota).toFixed(1).replace(".", ",");
}

// Validação de entrada para digitação de nota (0 a 10 ou vazio)
function validarNotaDigitada(str) {
  const texto = str.trim();
  if (texto === "") return { valido: true, valor: null };
  const textoComPonto = texto.replace(",", ".");
  const num = Number(textoComPonto);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

// Validação de entrada para digitação de falta (inteiro >= 0)
function validarFaltaDigitada(str) {
  const texto = str.trim();
  if (texto === "") return { valido: false, valor: null };
  const num = Number(texto);
  if (!Number.isInteger(num) || num < 0) {
    return { valido: false,