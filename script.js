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
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

// Atualização gráfica e segura do boletim na tela
function renderizarBoletim() {
  const corpoTabela = document.getElementById("tabela-corpo");
  corpoTabela.innerHTML = "";

  let somaMediasValidas = 0;
  let totalDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  dadosBoletim.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

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

    let arrayFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisc = arrayFaltas.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    totalFaltasGeral += totalFaltasDisc;

    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    const strongDisc = document.createElement("strong");
    strongDisc.textContent = item.disciplina || "";
    tdDisc.appendChild(strongDisc);
    tr.appendChild(tdDisc);

    const td1 = document.createElement("td");
    td1.textContent = formatarNotaExibicao(n1);
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.textContent = formatarNotaExibicao(n2);
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.textContent = formatarNotaExibicao(n3);
    tr.appendChild(td3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = formatarNotaExibicao(media);
    tdMedia.appendChild(strongMedia);
    tr.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = String(totalFaltasDisc);
    tr.appendChild(tdFaltas);

    const tdSit = document.createElement("td");
    tdSit.className = classeSituacao;
    tdSit.textContent = situacaoTexto;
    tr.appendChild(tdSit);

    corpoTabela.appendChild(tr);
  });

  const mediaGeral = totalDisciplinasComMedia > 0 ? (somaMediasValidas / totalDisciplinasComMedia).toFixed(1).replace(".", ",") : "—";

  document.getElementById("card-media").textContent = mediaGeral;
  document.getElementById("card-faltas").textContent = String(totalFaltasGeral);
  document.getElementById("card-bom-desempenho").textContent = String(qtdBomDesempenho);
  document.getElementById("card-atencao").textContent = String(qtdAtencao);
  document.getElementById("card-frequencia").textContent = FREQUENCIA_DEMONSTRATIVA;
}

// Abertura do Boletim via API
async function realizarLogin() {
  const inputPin = document.getElementById("input-pin");
  const msgLogin = document.getElementById("msg-login");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgLogin.textContent = "Digite seu PIN para continuar.";
    return;
  }

  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.textContent = "PIN incorreto. Verifique o número digitado.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const resultado = await resposta.json();
    pinSessao = pinDigitado;
    inputPin.value = "";

    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      dadosBoletim = resultado.dados.disciplinas;
    }

    document.getElementById("area-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";
    renderizarBoletim();
  } catch (erro) {
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// Construção da tabela de edição
function abrirEdicao() {
  const corpoEdicao = document.getElementById("tabela-edicao-corpo");
  corpoEdicao.innerHTML = "";
  document.getElementById("msg-edicao").textContent = "";

  dadosBoletim.forEach((item, index) => {
    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    const strong = document.createElement("strong");
    strong.textContent = item.disciplina || "";
    tdDisc.appendChild(strong);
    tr.appendChild(tdDisc);

    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const arrayFaltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

    const criarInput = (val, tipo, idCampo) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.dataset.index = index;
      input.dataset.tipo = tipo;
      input.id = idCampo;
      input.value = val !== null && val !== undefined ? String(val).replace(".", ",") : "";
      td.appendChild(input);
      return td;
    };

    tr.appendChild(criarInput(n1, "tri1", `n1-${index}`));
    tr.appendChild(criarInput(n2, "tri2", `n2-${index}`));
    tr.appendChild(criarInput(n3, "tri3", `n3-${index}`));
    tr.appendChild(criarInput(arrayFaltas[0] ?? 0, "f0", `f0-${index}`));
    tr.appendChild(criarInput(arrayFaltas[1] ?? 0, "f1", `f1-${index}`));
    tr.appendChild(criarInput(arrayFaltas[2] ?? 0, "f2", `f2-${index}`));

    corpoEdicao.appendChild(tr);
  });

  document.getElementById("painel-edicao").style.display = "block";
}

// Fechar painel de edição
function cancelarEdicao() {
  document.getElementById("painel-edicao").style.display = "none";
}

// Salvamento na API
async function salvarAlteracoes() {
  const msgEdicao = document.getElementById("msg-edicao");
  msgEdicao.textContent = "";

  const inputs = document.querySelectorAll("#tabela-edicao-corpo input");
  inputs.forEach((inp) => inp.classList.remove("campo-invalido"));

  let possuiErro = false;
  const novosDados = JSON.parse(JSON.stringify(dadosBoletim));

  inputs.forEach((input) => {
    const index = parseInt(input.dataset.index, 10);
    const tipo = input.dataset.tipo;
    const val = input.value;

    if (tipo.startsWith("tri")) {
      const res = validarNotaDigitada(val);
      if (!res.valido) {
        input.classList.add("campo-invalido");
        possuiErro = true;
      } else {
        novosDados[index][tipo] = res.valor;
      }
    } else if (tipo.startsWith("f")) {
      const pos = parseInt(tipo.replace("f", ""), 10);
      const res = validarFaltaDigitada(val);
      if (!res.valido) {
        input.classList.add("campo-invalido");
        possuiErro = true;
      } else {
        if (!Array.isArray(novosDados[index].faltas)) {
          novosDados[index].faltas = [0, 0, 0];
        }
        novosDados[index].faltas[pos] = res.valor;
      }
    }
  });

  if (possuiErro) {
    msgEdicao.textContent = "Verifique os campos destacados em vermelho.";
    return;
  }

  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.textContent = "Não foi possível salvar as alterações. Tente novamente.";
      return;
    }

    dadosBoletim = novosDados;
    renderizarBoletim();
    msgEdicao.textContent = "Dados salvos com sucesso.";
    setTimeout(() => {
      document.getElementById("painel-edicao").style.display = "none";
    }, 1200);
  } catch (erro) {
    msgEdicao.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

// Associação dos eventos aos elementos HTML
document.getElementById("btn-entrar").addEventListener("click", realizarLogin);
document.getElementById("input-pin").addEventListener("keypress", (e) => {
  if (e.key === "Enter") realizarLogin();
});
document.getElementById("btn-alterar-dados").addEventListener("click", abrirEdicao);
document.getElementById("btn-salvar-alteracoes").addEventListener("click", salvarAlteracoes);
document.getElementById("btn-cancelar-edicao").addEventListener("click", cancelarEdicao);