import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbG14cHBxeHRhcnpiZHd1bHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODE3NzgsImV4cCI6MjA1NTg1Nzc3OH0.STkMH-gbbjeqg0qmIV4i081Rv6fzzQYX06jKkzKbRBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Recupera o nome do jogador do localStorage
const playerName = localStorage.getItem('playerName');
if (!playerName) {
  window.location.href = 'login.html';
}

// Carrega os valores base atuais e preenche os inputs
async function carregarValoresBase() {
  const { data, error } = await supabase
    .from('players')
    .select('vida_base, sanidade_base, pe_base')
    .eq('nome', playerName)
    .single();

  if (error) {
    console.error('Erro ao carregar valores base:', error);
    return;
  }

  document.getElementById('inputVidaBase').value = data.vida_base || 0;
  document.getElementById('inputSanidadeBase').value = data.sanidade_base || 0;
  document.getElementById('inputPeBase').value = data.pe_base || 0;
}

document.addEventListener('DOMContentLoaded', carregarValoresBase);

// Atualiza os valores base no BD ao submeter o formulário
document.getElementById('editarBaseForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Confirma se o jogador deseja alterar os valores base
  if (!confirm('Tem certeza que deseja alterar os valores base? Essa alteração afetará permanentemente os seus valores base.')) {
    return;
  }

  const novaVidaBase = parseInt(document.getElementById('inputVidaBase').value);
  const novaSanidadeBase = parseInt(document.getElementById('inputSanidadeBase').value);
  const novoPeBase = parseInt(document.getElementById('inputPeBase').value);

  const updateObj = {
    vida_base: novaVidaBase,
    sanidade_base: novaSanidadeBase,
    pe_base: novoPeBase
  };

  const { error } = await supabase
    .from('players')
    .update(updateObj)
    .eq('nome', playerName);

  if (error) {
    alert('Erro ao atualizar os valores base!');
    console.error('Erro:', error);
  } else {
    alert('Valores base atualizados com sucesso!');
    // Opcionalmente, redirecione de volta para a ficha:
    window.location.href = 'ficha.html';
  }
});
