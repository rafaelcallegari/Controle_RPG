// Substitua pelos seus dados do Supabase
// Para encontrar suas credenciais, acesse o painel do Supabase, vá em "Settings" -> "API" e copie o URL e a "anon key".
const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

// Seleciona os elementos da interface
const playerForm = document.getElementById('playerForm');
const nomeInput = document.getElementById('nome');
const valorAtualDisplay = document.getElementById('valorAtual');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');

// Variável para armazenar o valor atual do atributo
let valorAtual = 0;

// Atualiza a exibição do valor
function atualizarDisplay() {
  valorAtualDisplay.textContent = valorAtual;
}

// Manipula os botões de aumentar e diminuir
increaseBtn.addEventListener('click', () => {
  valorAtual++;
  atualizarDisplay();
});

decreaseBtn.addEventListener('click', () => {
  // Garante que o valor não fique negativo
  if(valorAtual > 0) {
    valorAtual--;
    atualizarDisplay();
  }
});

// Quando o usuário muda o atributo selecionado, pode ser interessante carregar o valor atual salvo
const radios = document.getElementsByName('atributo');
function carregarValor(nome, atributo) {
  // Consulta o registro do jogador pelo nome
  supabase
    .from('players')
    .select(atributo)
    .eq('nome', nome)
    .single()
    .then(({ data, error }) => {
      if(data) {
        valorAtual = data[atributo] || 0;
      } else {
        // Se não encontrar o jogador, inicia com 0
        valorAtual = 0;
      }
      atualizarDisplay();
    });
}

// Ao mudar a seleção de atributo, tenta carregar o valor atual do banco para o jogador (se o nome já foi preenchido)
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    const nome = nomeInput.value.trim();
    const atributo = document.querySelector('input[name="atributo"]:checked').value;
    if(nome !== "") {
      carregarValor(nome, atributo);
    } else {
      valorAtual = 0;
      atualizarDisplay();
    }
  });
});

// Ao sair do campo do nome, tenta carregar o valor para o atributo atualmente selecionado
nomeInput.addEventListener('blur', () => {
  const nome = nomeInput.value.trim();
  const atributo = document.querySelector('input[name="atributo"]:checked').value;
  if(nome !== "") {
    carregarValor(nome, atributo);
  }
});

// Processa o envio do formulário
playerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const nome = nomeInput.value.trim();
  const atributo = document.querySelector('input[name="atributo"]:checked').value;
  
  // Cria um objeto para a atualização, por exemplo: {vida: 10} se atributo for "vida"
  const updateObj = {};
  updateObj[atributo] = valorAtual;

  // Verifica se o jogador já existe
  let { data: existingPlayer, error } = await supabase
    .from('players')
    .select('*')
    .eq('nome', nome)
    .single();

  if(existingPlayer) {
    // Atualiza o registro do jogador
    const { error: updateError } = await supabase
      .from('players')
      .update(updateObj)
      .eq('nome', nome);
    if(updateError) {
      alert("Erro ao atualizar os dados!");
    } else {
      alert("Dados atualizados com sucesso!");
    }
  } else {
    // Se não existir, cria um novo registro com todos os atributos iniciados em 0, exceto o selecionado
    const novoJogador = {
      nome,
      vida: 0,
      sanidade: 0,
      pe: 0
    };
    novoJogador[atributo] = valorAtual;
    
    const { error: insertError } = await supabase
      .from('players')
      .insert([novoJogador]);
    if(insertError) {
      alert("Erro ao criar o registro!");
    } else {
      alert("Registro criado com sucesso!");
    }
  }
});
