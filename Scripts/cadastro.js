import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbG14cHBxeHRhcnpiZHd1bHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODE3NzgsImV4cCI6MjA1NTg1Nzc3OH0.STkMH-gbbjeqg0qmIV4i081Rv6fzzQYX06jKkzKbRBw';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('cadastroForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Captura os valores dos inputs
  const nome = document.getElementById('nome').value.trim();
  const senha = document.getElementById('senha').value.trim(); // Pega a senha
  const vida = parseInt(document.getElementById('vida').value);
  const sanidade = parseInt(document.getElementById('sanidade').value);
  const pe = parseInt(document.getElementById('pe').value);

  // Verifica se os campos estão preenchidos
  if (!nome || !senha || isNaN(vida) || isNaN(sanidade) || isNaN(pe)) {
    alert("Todos os campos são obrigatórios!");
    return;
  }

  // Exibir os valores capturados no console para debug
  console.log("Enviando dados para o Supabase:", { nome, senha, vida, sanidade, pe });

  try {
    const { data, error } = await supabase
      .from('players')
      .insert([{
        nome,
        senha, // Envia a senha para o BD
        vida,
        sanidade,
        pe,
        vida_base: vida,
        sanidade_base: sanidade,
        pe_base: pe
      }]);

    if (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
      return;
    }

    alert("Você agora existe na realidade!");
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Erro ao cadastrar no Supabase:', error);
    alert("Erro ao tentar cadastrar. Tente novamente mais tarde.");
  }
});
