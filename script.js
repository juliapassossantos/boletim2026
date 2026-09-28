
// Dados brutos das 15 disciplinas do 8º Ano
const dadosBoletim = [
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

// Frequência geral fictícia/demonstrativa (será tratada de outra forma no futuro)
const FREQUENCIA_DEMONSTRATIVA = "92%";

// Função para normalizar qualquer valor de nota para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null; // Nota ainda não lançada
  }

  // Converte texto com vírgula para número com ponto
  let numero = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);

  if (isNaN(numero) || numero < 0) {
    return null; // Valor inválido
  }

  // Se a nota estiver na escala 0 a 100, ajusta para 0 a 10
  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  if (numero > 10) {
    return null; // Valor maior que 100 é inválido
  }

  return numero;
}

// Função para formatar como a nota aparece na tela
function formatarNotaExibicao(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// Inicialização e preenchimento automático da página
function carregarBoletim() {
  const corpoTabela = document.getElementById("tabela-corpo");
  corpoTabela.innerHTML = "";

  let somaMediasValidas = 0;
  let totalDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // Processa cada disciplina da lista
  dadosBoletim.forEach((item) => {
    // Normaliza notas dos 3 trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Calcula a média somente com as notas existentes
    const notasValidas = [n1, n2, n3].filter((n) => n !== null);
    let media = null;
    let situacaoTexto = "Nota ainda não disponível";
    let classeSituacao = "situacao-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;
      somaMediasValidas += media;
      totalDisciplinasComMedia++;

      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        classeSituacao = "situacao-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        classeSituacao = "situacao-atencao";
        qtdAtencao++;
      }
    }

    // Soma o total de faltas da disciplina
    const totalFaltasDisc = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasDisc;

    // Cria a linha da tabela no HTML
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarNotaExibicao(n1)}</td>
      <td>${formatarNotaExibicao(n2)}</td>
      <td>${formatarNotaExibicao(n3)}</td>
      <td><strong>${formatarNotaExibicao(media)}</strong></td>
      <td>${totalFaltasDisc}</td>
      <td class="${classeSituacao}">${situacaoTexto}</td>
    `;
    corpoTabela.appendChild(tr);
  });

  // Atualiza os Cards de Resumo na parte superior
  const mediaGeral = totalDisciplinasComMedia > 0 ? (somaMediasValidas / totalDisciplinasComMedia).toFixed(1).replace(".", ",") : "—";
  
  document.getElementById("card-media").textContent = mediaGeral;
  document.getElementById("card-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("card-atencao").textContent = qtdAtencao;
  document.getElementById("card-frequencia").textContent = FREQUENCIA_DEMONSTRATIVA;
}

// Executa a função assim que a página carrega
carregarBoletim();