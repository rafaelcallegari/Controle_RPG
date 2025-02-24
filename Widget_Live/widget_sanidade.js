import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbG14cHBxeHRhcnpiZHd1bHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODE3NzgsImV4cCI6MjA1NTg1Nzc3OH0.STkMH-gbbjeqg0qmIV4i081Rv6fzzQYX06jKkzKbRBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Obtém o nome do jogador da URL
const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get("player");

if (!playerName) {
  alert("Erro: Nenhum jogador foi definido!");
}

async function carregarSanidade() {
  const { data, error } = await supabase
    .from("players")
    .select("sanidade")
    .eq("nome", playerName)
    .single();

  if (error) {
    console.error("Erro ao buscar sanidade:", error);
    return;
  }

  document.getElementById("sanidadeValue").textContent = data.sanidade;
}

// Atualiza sanidade automaticamente quando o banco de dados for alterado
supabase
  .channel("players")
  .on("postgres_changes", { event: "UPDATE", schema: "public", table: "players" }, (payload) => {
    if (payload.new.nome === playerName) {
      document.getElementById("sanidadeValue").textContent = payload.new.sanidade;
    }
  })
  .subscribe();

carregarSanidade();
