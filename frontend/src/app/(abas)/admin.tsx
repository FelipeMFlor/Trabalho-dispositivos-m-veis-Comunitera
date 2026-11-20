import { useState } from 'react';
import { Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useDados } from '../../contexto/DadosContexto';
import { estilos as comuns } from '../../constants/estilos';
import Tela from '../../components/Tela';
import Opcoes from '../../components/Opcoes';
import AdminEventos from '../../components/admin/AdminEventos';
import AdminVagas from '../../components/admin/AdminVagas';
import AdminAvisos from '../../components/admin/AdminAvisos';
import AdminAulas from '../../components/admin/AdminAulas';
import AdminCalendario from '../../components/admin/AdminCalendario';

type Aba = 'eventos' | 'vagas' | 'avisos' | 'aulas' | 'calendario';

const ABAS: { valor: Aba; nome: string }[] = [
  { valor: 'eventos', nome: '🎟️ Eventos' },
  { valor: 'vagas', nome: '💼 Vagas' },
  { valor: 'avisos', nome: '🔔 Avisos' },
  { valor: 'aulas', nome: '📚 Aulas' },
  { valor: 'calendario', nome: '📅 Calendário' },
];

export default function PainelAdmin() {
  const { ehAdmin, eventos, vagas, avisos, aulas, compromissos, recarregar } = useDados();
  const [aba, setAba] = useState<Aba>('eventos');

  if (!ehAdmin) {
    return <Redirect href="/" />;
  }

  return (
    <Tela>
      <Text style={comuns.tituloTela}>Painel do D.A.</Text>
      <Text style={comuns.textoCinza}>Tudo que você cadastrar aqui aparece para todos os alunos!</Text>

      <Opcoes opcoes={ABAS} escolhida={aba} aoEscolher={setAba} rolavel />

      {aba === 'eventos' && <AdminEventos eventos={eventos} aoAtualizar={recarregar} />}
      {aba === 'vagas' && <AdminVagas vagas={vagas} aoAtualizar={recarregar} />}
      {aba === 'avisos' && <AdminAvisos avisos={avisos} aoAtualizar={recarregar} />}
      {aba === 'aulas' && <AdminAulas aulas={aulas} aoAtualizar={recarregar} />}
      {aba === 'calendario' && (
        <AdminCalendario compromissos={compromissos.filter((c) => c.podeApagar)} aoAtualizar={recarregar} />
      )}
    </Tela>
  );
}
