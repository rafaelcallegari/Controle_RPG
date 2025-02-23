// Inicialização do Supabase utilizando as credenciais fornecidas
const SUPABASE_URL = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY; // Certifique-se de configurar sua variável de ambiente ou substituir pela chave diretamente
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Recupera o nome do jogador armazenado no login
const playerName = localStorage.getItem('playerName');
if (!playerName) {
  window.location.href = 'login.html';
} else {
  document.getElementById('playerName').textContent = playerName;
}

// Valor atual do atributo
let valorAtual = 0;

// Atualiza a exibição do valor
function atualizarDisplay() {
  document.getElementById('valorAtual').textContent = valorAtual;
}

// Função para carregar o valor atual do atributo selecionado no Supabase
function carregarValor(atributo) {
  supabase
    .from('players')
    .select(atributo)
    .eq('nome', playerName)
    .single()
    .then(({ data, error }) => {
      if (data) {
        valorAtual = data[atributo] || 0;
      } else {
        valorAtual = 0;
      }
      atualizarDisplay();
    });
}

// Carrega o valor do atributo padrão (vida) quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  carregarValor(document.querySelector('input[name="atributo"]:checked').value);
});

// Ao mudar o atributo selecionado, carrega o valor correspondente
document.querySelectorAll('input[name="atributo"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const atributo = document.querySelector('input[name="atributo"]:checked').value;
    carregarValor(atributo);
  });
});

// Eventos dos botões de aumentar e diminuir
document.getElementById('increase').addEventListener('click', () => {
  valorAtual++;
  atualizarDisplay();
});

document.getElementById('decrease').addEventListener('click', () => {
  if (valorAtual > 0) {
    valorAtual--;
    atualizarDisplay();
  }
});

// Evento do botão "Atualizar"
document.getElementById('updateButton').addEventListener('click', async () => {
  const atributo = document.querySelector('input[name="atributo"]:checked').value;
  const updateObj = {};
  updateObj[atributo] = valorAtual;

  // Verifica se o registro do jogador já existe
  let { data: existingPlayer } = await supabase
    .from('players')
    .select('*')
    .eq('nome', playerName)
    .single();

  if (existingPlayer) {
    const { error } = await supabase
      .from('players')
      .update(updateObj)
      .eq('nome', playerName);
    if (error) {
      alert("Erro ao atualizar os dados!");
    } else {
      alert("Dados atualizados com sucesso!");
    }
  } else {
    // Se não existir, cria um novo registro com todos os atributos iniciados em 0, exceto o selecionado
    const novoJogador = {
      nome: playerName,
      vida: 0,
      sanidade: 0,
      pe: 0
    };
    novoJogador[atributo] = valorAtual;
    const { error } = await supabase
      .from('players')
      .insert([novoJogador]);
    if (error) {
      alert("Erro ao criar o registro!");
    } else {
      alert("Registro criado com sucesso!");
    }
  }
});
