import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

const supabaseUrl = 'https://tflmxppqxtarzbdwulqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbG14cHBxeHRhcnpiZHd1bHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODE3NzgsImV4cCI6MjA1NTg1Nzc3OH0.STkMH-gbbjeqg0qmIV4i081Rv6fzzQYX06jKkzKbRBw';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("Erro: Formulário de login não encontrado!");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const nome = document.getElementById("nome").value.trim();
    const senhaDigitada = document.getElementById("senha").value.trim();

    if (!nome || !senhaDigitada) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("players")
        .select("senha")
        .eq("nome", nome)
        .single();

      if (error) {
        throw error;
      }

      if (data && data.senha === senhaDigitada) {
        localStorage.setItem("playerName", nome);
        alert("Login bem-sucedido!");
        window.location.href = "ficha.html";
      } else {
        alert("Nome ou senha incorretos!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao tentar fazer login. Verifique os dados e tente novamente.");
    }
  });
});
