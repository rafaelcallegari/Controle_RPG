import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbG14cHBxeHRhcnpiZHd1bHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODE3NzgsImV4cCI6MjA1NTg1Nzc3OH0.STkMH-gbbjeqg0qmIV4i081Rv6fzzQYX06jKkzKbRBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Recupera o nome do jogador armazenado no login
const playerName = localStorage.getItem('playerName');
if (!playerName) {
  window.location.href = 'login.html';
} else {
  document.getElementById('playerName').textContent = playerName;
}

// Objetos para armazenar os valores correntes e os valores base
let currentValues = { vida: 0, sanidade: 0, pe: 0 };
let baseValues = { vida: 0, sanidade: 0, pe: 0 };

// Atualiza a exibição dos valores na tela
function atualizarDisplay() {
  document.getElementById('vidaValue').textContent = currentValues.vida;
  document.getElementById('sanidadeValue').textContent = currentValues.sanidade;
  document.getElementById('peValue').textContent = currentValues.pe;
  document.getElementById('vidaBaseValue').textContent = baseValues.vida;
  document.getElementById('sanidadeBaseValue').textContent = baseValues.sanidade;
  document.getElementById('peBaseValue').textContent = baseValues.pe;
}

// Carrega os valores do jogador do Supabase
async function carregarValores() {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('nome', playerName)
    .single();
  if (error) {
    console.error('Erro ao carregar dados:', error);
    return;
  }
  // Define os valores correntes
  currentValues.vida = data.vida || 0;
  currentValues.sanidade = data.sanidade || 0;
  currentValues.pe = data.pe || 0;
  // Define os valores base
  baseValues.vida = data.vida_base || 0;
  baseValues.sanidade = data.sanidade_base || 0;
  baseValues.pe = data.pe_base || 0;
  atualizarDisplay();
}

document.addEventListener('DOMContentLoaded', carregarValores);

// Eventos para atualizar os valores correntes com a condição de não ultrapassar os valores base

// Vida
document.getElementById('increaseVida').addEventListener('click', () => {
  if (currentValues.vida < baseValues.vida) {
    currentValues.vida++;
  } else {
    alert("Vida não pode exceder a vida base.");
  }
  atualizarDisplay();
});
document.getElementById('decreaseVida').addEventListener('click', () => {
  if (currentValues.vida > 0) {
    currentValues.vida--;
  }
  atualizarDisplay();
});

// Sanidade
document.getElementById('increaseSanidade').addEventListener('click', () => {
  if (currentValues.sanidade < baseValues.sanidade) {
    currentValues.sanidade++;
  } else {
    alert("Sanidade não pode exceder a sanidade base.");
  }
  atualizarDisplay();
});
document.getElementById('decreaseSanidade').addEventListener('click', () => {
  if (currentValues.sanidade > 0) {
    currentValues.sanidade--;
  }
  atualizarDisplay();
});

// PE
document.getElementById('increasePe').addEventListener('click', () => {
  if (currentValues.pe < baseValues.pe) {
    currentValues.pe++;
  } else {
    alert("PE não pode exceder o PE base.");
  }
  atualizarDisplay();
});
document.getElementById('decreasePe').addEventListener('click', () => {
  if (currentValues.pe > 0) {
    currentValues.pe--;
  }
  atualizarDisplay();
});

// Evento do botão "Atualizar" para salvar os valores correntes no BD
document.getElementById('updateButton').addEventListener('click', async () => {
  const updateObj = {
    vida: currentValues.vida,
    sanidade: currentValues.sanidade,
    pe: currentValues.pe
  };

  const { error } = await supabase
    .from('players')
    .update(updateObj)
    .eq('nome', playerName);

  if (error) {
    alert("Erro ao atualizar os dados!");
  } else {
    alert("Dados atualizados com sucesso!");
    // Recarrega os valores para confirmar a atualização
    carregarValores();
  }
});


// Evento de Logout
document.getElementById('logoutButton').addEventListener('click', () => {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.removeItem('playerName'); // Remove o nome do jogador do localStorage
    window.location.href = 'login.html'; // Redireciona para a tela de login
  }
});
