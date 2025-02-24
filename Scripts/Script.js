import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbG14cHBxeHRhcnpiZHd1bHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODE3NzgsImV4cCI6MjA1NTg1Nzc3OH0.STkMH-gbbjeqg0qmIV4i081Rv6fzzQYX06jKkzKbRBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Verifica se o usuário está logado antes de carregar qualquer página
const playerName = localStorage.getItem("playerName");

if (!playerName) {
  alert("Você precisa fazer login primeiro!");
  window.location.href = "login.html";
} else {
  document.getElementById("playerName").textContent = playerName;
}

// Objetos para armazenar os valores correntes e os valores base
let currentValues = { vida: 0, sanidade: 0, pe: 0 };
let baseValues = { vida: 0, sanidade: 0, pe: 0 };

// Atualiza a exibição dos valores na tela
function atualizarDisplay() {
  const vidaEl = document.getElementById("vidaValue");
  const sanidadeEl = document.getElementById("sanidadeValue");
  const peEl = document.getElementById("peValue");
  const vidaBaseEl = document.getElementById("vidaBaseValue");
  const sanidadeBaseEl = document.getElementById("sanidadeBaseValue");
  const peBaseEl = document.getElementById("peBaseValue");

  if (vidaEl) vidaEl.textContent = currentValues.vida;
  if (sanidadeEl) sanidadeEl.textContent = currentValues.sanidade;
  if (peEl) peEl.textContent = currentValues.pe;
  if (vidaBaseEl) vidaBaseEl.textContent = baseValues.vida;
  if (sanidadeBaseEl) sanidadeBaseEl.textContent = baseValues.sanidade;
  if (peBaseEl) peBaseEl.textContent = baseValues.pe;
}

// Função para carregar os valores do jogador no Supabase
async function carregarValores() {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("nome", playerName)
    .single();

  if (error) {
    console.error("Erro ao carregar dados:", error);
    return;
  }

  // Define os valores correntes e base
  currentValues.vida = data.vida || 0;
  currentValues.sanidade = data.sanidade || 0;
  currentValues.pe = data.pe || 0;
  baseValues.vida = data.vida_base || 0;
  baseValues.sanidade = data.sanidade_base || 0;
  baseValues.pe = data.pe_base || 0;

  atualizarDisplay();
}

// Verifica a página e executa apenas onde for necessário
document.addEventListener("DOMContentLoaded", async () => {
  const page = window.location.pathname; // Obtém o nome da página atual

  if (page.includes("ficha.html")) {
    console.log("Carregando valores na ficha...");
    await carregarValores();
  }

  if (page.includes("editar_base.html")) {
    console.log("Tela de edição de valores aberta.");
    // Aqui você pode adicionar lógica para carregar valores editáveis
  }
});

// Eventos para atualizar os valores correntes com limite do valor base
function adicionarEventosBotoes() {
  // Verifica se os elementos existem antes de adicionar eventos
  const increaseVida = document.getElementById("increaseVida");
  const decreaseVida = document.getElementById("decreaseVida");
  const increaseSanidade = document.getElementById("increaseSanidade");
  const decreaseSanidade = document.getElementById("decreaseSanidade");
  const increasePe = document.getElementById("increasePe");
  const decreasePe = document.getElementById("decreasePe");

  if (increaseVida) {
    increaseVida.addEventListener("click", () => {
      if (currentValues.vida < baseValues.vida) {
        currentValues.vida++;
      } else {
        alert("Vida não pode exceder a vida base.");
      }
      atualizarDisplay();
    });
  }

  if (decreaseVida) {
    decreaseVida.addEventListener("click", () => {
      if (currentValues.vida > 0) {
        currentValues.vida--;
      }
      atualizarDisplay();
    });
  }

  if (increaseSanidade) {
    increaseSanidade.addEventListener("click", () => {
      if (currentValues.sanidade < baseValues.sanidade) {
        currentValues.sanidade++;
      } else {
        alert("Sanidade não pode exceder a sanidade base.");
      }
      atualizarDisplay();
    });
  }

  if (decreaseSanidade) {
    decreaseSanidade.addEventListener("click", () => {
      if (currentValues.sanidade > 0) {
        currentValues.sanidade--;
      }
      atualizarDisplay();
    });
  }

  if (increasePe) {
    increasePe.addEventListener("click", () => {
      if (currentValues.pe < baseValues.pe) {
        currentValues.pe++;
      } else {
        alert("PE não pode exceder o PE base.");
      }
      atualizarDisplay();
    });
  }

  if (decreasePe) {
    decreasePe.addEventListener("click", () => {
      if (currentValues.pe > 0) {
        currentValues.pe--;
      }
      atualizarDisplay();
    });
  }
}

// Adiciona eventos aos botões
document.addEventListener("DOMContentLoaded", adicionarEventosBotoes);

// Evento do botão "Atualizar" para salvar os valores correntes no BD
document.getElementById("updateButton")?.addEventListener("click", async () => {
  const updateObj = {
    vida: currentValues.vida,
    sanidade: currentValues.sanidade,
    pe: currentValues.pe,
  };

  const { error } = await supabase
    .from("players")
    .update(updateObj)
    .eq("nome", playerName);

  if (error) {
    alert("Erro ao atualizar os dados!");
  } else {
    alert("Dados atualizados com sucesso!");
    await carregarValores();
  }
});

// Evento de Logout (Botão "Sair")
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja sair?")) {
        localStorage.removeItem("playerName");
        window.location.href = "login.html";
      }
    });
  }
});
