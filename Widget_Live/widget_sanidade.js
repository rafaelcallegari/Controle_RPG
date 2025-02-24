import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'SUA_SUPABASE_KEY';
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
