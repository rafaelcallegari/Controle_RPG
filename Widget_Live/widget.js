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

// Atualiza os valores automaticamente quando o banco de dados for alterado
supabase
  .channel("players")
  .on("postgres_changes", { event: "UPDATE", schema: "public", table: "players" }, (payload) => {
    if (payload.new.nome === playerName) {
      atualizarDisplay(payload.new);
    }
  })
  .subscribe();

carregarValores();
