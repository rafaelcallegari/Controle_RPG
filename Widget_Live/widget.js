import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbG14cHBxeHRhcnpiZHd1bHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODE3NzgsImV4cCI6MjA1NTg1Nzc3OH0.STkMH-gbbjeqg0qmIV4i081Rv6fzzQYX06jKkzKbRBw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Obtém o nome do jogador da URL
const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get("player");

if (!playerName) {
  alert("Erro: Nenhum jogador foi definido na URL!");
}


async function carregarValores() {
  const { data, error } = await supabase
    .from("players")
    .select("vida, vida_base, pe, pe_base")
    .eq("nome", playerName)
    .single();

  if (error) {
    console.error("Erro ao buscar os dados do jogador:", error);
    return;
  }

  atualizarDisplay(data);
}

function atualizarDisplay(data) {
  const vidaPercent = (data.vida / data.vida_base) * 100;
  const pePercent = (data.pe / data.pe_base) * 100;

  document.getElementById("vidaBar").style.width = `${vidaPercent}%`;
  document.getElementById("vidaText").textContent = `${data.vida}/${data.vida_base}`;

  document.getElementById("peBar").style.width = `${pePercent}%`;
  document.getElementById("peText").textContent = `${data.pe}/${data.pe_base}`;
}

// Atualizar automaticamente SEM DELAY
supabase
  .channel("players")
  .on("postgres_changes", { event: "UPDATE", schema: "public", table: "players" }, (payload) => {
    if (payload.new.nome === playerName) {
      console.log("Atualização recebida:", payload.new);
      atualizarDisplay(payload.new);
    }
  })
  .subscribe();

carregarValores();
