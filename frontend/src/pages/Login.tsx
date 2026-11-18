import { useState } from 'react';
import type { FormEvent } from 'react';
import type { RespostaLogin, Usuario } from '../types';
import { apiPost } from '../api';

interface Props {
  aoEntrar: (token: string, usuario: Usuario) => void;
}

function Login({ aoEntrar }: Props) {
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');

  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [ra, setRa] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviarFormulario(evento: FormEvent) {
    evento.preventDefault(); //impede a página de recarregar
    setErro('');

    if (ra.trim() === '' || senha === '') {
      setErro('Preencha todos os campos.');
      return;
    }
    if (modo === 'cadastrar') {
      if (nome.trim() === '' || curso.trim() === '') {
        setErro('Preencha todos os campos.');
        return;
      }
      if (isNaN(Number(ra))) {
        setErro('O RGM deve ter só números.');
        return;
      }
      if (senha.length < 6) {
        setErro('A senha precisa ter pelo menos 6 caracteres.');
        return;
      }
    }

    setEnviando(true);
    try {
      const resposta =
        modo === 'entrar'
          ? await apiPost<RespostaLogin>('/login', { ra, senha })
          : await apiPost<RespostaLogin>('/cadastro', { nome, curso, ra, senha });

      aoEntrar(resposta.token, resposta.usuario);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  function trocarModo() {
    setModo(modo === 'entrar' ? 'cadastrar' : 'entrar');
    setErro('');
  }

  return (
    <div className="tela-login">
      <div className="login-logo">🎓</div>
      <h1>COMUNITERA</h1>
      <p className="login-subtitulo">O app do Diretório Acadêmico TERA!</p>

      <form className="cartao login-formulario" onSubmit={enviarFormulario}>
        <h2 className="login-titulo">{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</h2>

        {/* Nome e curso só aparecem no cadastro */}
        {modo === 'cadastrar' && (
          <>
            <label>
              Nome
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria Silva" />
            </label>
            <label>
              Curso
              <input value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Ex: Engenharia de Software" />
            </label>
          </>
        )}

        <label>
          {modo === 'entrar' ? 'RGM (ou usuário do D.A.)' : 'RGM (matrícula)'}
          <input value={ra} onChange={(e) => setRa(e.target.value)} placeholder="Ex: 202610842" />
        </label>

        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" />
        </label>

        {/* Só mostra a mensagem se existir algum erro */}
        {erro !== '' && <p className="mensagem-erro">{erro}</p>}

        <button type="submit" className="botao botao-dourado" disabled={enviando}>
          {enviando ? 'Aguarde...' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>

        <button type="button" className="link-trocar" onClick={trocarModo}>
          {modo === 'entrar' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;
