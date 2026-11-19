import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RespostaLogin } from '../types';
import { apiPost } from '../api';
import { useDados } from '../contexto/DadosContexto';
import { CORES } from '../constants/cores';
import { estilos as comuns } from '../constants/estilos';
import Botao from '../components/Botao';
import Campo from '../components/Campo';

export default function Login() {
  const { entrar } = useDados();
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');

  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [ra, setRa] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviarFormulario() {
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
          ? await apiPost<RespostaLogin>('/login', { ra: ra.trim(), senha })
          : await apiPost<RespostaLogin>('/cadastro', { nome, curso, ra: ra.trim(), senha });

      entrar(resposta.token, resposta.usuario);
    } catch (e) {
      setErro((e as Error).message);
      setEnviando(false);
    }
  }

  function trocarModo() {
    setModo(modo === 'entrar' ? 'cadastrar' : 'entrar');
    setErro('');
  }

  return (
    <View style={estilos.fundo}>
      <View style={estilos.faixaRoxa} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
            <View style={estilos.logo}>
              <Text style={estilos.logoEmoji}>🎓</Text>
            </View>
            <Text style={estilos.titulo}>COMUNITERA</Text>
            <Text style={estilos.subtitulo}>O app do Diretório Acadêmico TERA!</Text>

            <View style={[comuns.cartao, estilos.formulario]}>
              <Text style={estilos.tituloFormulario}>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</Text>

              {modo === 'cadastrar' && (
                <>
                  <Campo rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Ex: Maria Silva" />
                  <Campo
                    rotulo="Curso"
                    value={curso}
                    onChangeText={setCurso}
                    placeholder="Ex: Engenharia de Software"
                  />
                </>
              )}

              <Campo
                rotulo={modo === 'entrar' ? 'RGM (ou usuário do D.A.)' : 'RGM (matrícula)'}
                value={ra}
                onChangeText={setRa}
                placeholder="Ex: 202610842"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={modo === 'cadastrar' ? 'number-pad' : 'default'}
              />

              <Campo
                rotulo="Senha"
                value={senha}
                onChangeText={setSenha}
                placeholder="Sua senha"
                secureTextEntry
                autoCapitalize="none"
                onSubmitEditing={enviarFormulario}
              />

              {erro !== '' && <Text style={comuns.mensagemErro}>{erro}</Text>}

              <Botao
                texto={enviando ? 'Aguarde...' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
                aoTocar={enviarFormulario}
                desativado={enviando}
              />

              <Pressable onPress={trocarModo} style={estilos.linkTrocar}>
                <Text style={estilos.linkTrocarTexto}>
                  {modo === 'entrar' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: CORES.fundo },
  faixaRoxa: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: CORES.roxo,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 44 },
  titulo: { color: CORES.dourado, fontSize: 30, fontWeight: '800', letterSpacing: 1 },
  subtitulo: { color: CORES.roxoClaro, marginBottom: 18 },
  formulario: { width: '100%', maxWidth: 420, gap: 14, padding: 24 },
  tituloFormulario: { color: CORES.roxo, fontSize: 20, fontWeight: '700' },
  linkTrocar: { padding: 4, alignItems: 'center' },
  linkTrocarTexto: { color: CORES.roxo, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
});
