import { useNavigate } from "react-router-dom";
import { typeUsuario } from "./PerfilUsuario"
import imagemPerfilProvisoria from '../../assets/perfil.png';
import { Dispatch, SetStateAction, useState, useMemo } from "react";
import { HistoricoServico } from "../../types/historicoServico";
import { Modal } from "../Modal";
import Chat from "../Chat";
import axios from "axios";
import { useGetToken } from "../../hooks/useGetToken";
import { URLAPI } from "../../constants/ApiUrl";
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { toast } from 'react-toastify';

interface Pagina_inicialProps {
    usuario: typeUsuario | null
    historico: HistoricoServico[] | null
    setMudarPagina: (num:number) => void;
    setHistorico: Dispatch<SetStateAction<HistoricoServico[] | null>>;
}

export const Pagina_inicial = ({ usuario, setMudarPagina, historico, setHistorico }: Pagina_inicialProps) => {
    const navigate = useNavigate();
    const [mostrarTodos, setMostrarTodos] = useState(false);
    const LIMITE_VISUALIZACAO = 5;

    const [isChatOpen, setIsChatOpen] = useState(false);

    const token = useGetToken();

    const [id_servico, setIdServico] = useState("");

    console.log(historico)

    const formatarData = (data: Date) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarHora = (data: Date) => {
        return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    
    const handleStatusUpdate = (update: { id_servico: string; novo_status: string }) => {
        if (historico) {
            const novoHistorico = historico.map(servico => 
                servico.id_servico === update.id_servico
                    ? { ...servico, status: update.novo_status }
                    : servico
            );
            // Atualizar o histórico no componente pai
            setHistorico(novoHistorico);
        }

        // Mostra uma notificação toast
        toast.info(`Status do serviço atualizado para: ${update.novo_status}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const { emitirMudancaStatus } = useStatusNotifications(handleStatusUpdate, token?.id);

    console.log(emitirMudancaStatus);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pendente':
                return 'bg-yellow-100 text-yellow-800';
            case 'Esperando confirmação':
                return 'bg-green-100 text-green-800';
            case 'Em Andamento':
                return 'bg-yellow-100 text-gray-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            case 'concluido':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem('imagemPerfil');
        navigate('/');
    }

    const handleOpenChat = (idServico: string) => {
        setIdServico(idServico);
        console.log(idServico)
        setIsChatOpen(true);
    }

    const servicosExibidos = useMemo(() => {
        if (!historico) return [];
        return mostrarTodos ? historico : historico.slice(0, LIMITE_VISUALIZACAO);
    }, [historico, mostrarTodos]);

    return (
        <div>
            <div className="flex-1 px-10 py-8">
                <div className="flex items-center space-x-6 mb-6">
                    <img
                        src={usuario?.picture || imagemPerfilProvisoria}
                        alt="Foto de perfil"
                        className="w-16 h-16 rounded-full border border-gray-300"
                    />
                    <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-semibold">{usuario?.nome}</h1>
                        {usuario?.media_avaliacoes !== undefined && usuario?.media_avaliacoes !== null && (
                            <div className="flex items-center">
                                {[1,2,3,4,5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`w-5 h-5 ${star <= Math.round(usuario.media_avaliacoes as number) ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                                    </svg>
                                ))}
                                <span className="ml-1 text-sm text-gray-600">{(usuario.media_avaliacoes as number).toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex space-x-4 mb-8">
                    <button onClick={() => setMudarPagina(2)} className="bg-gray-100 w-32 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                        Dados pessoais
                    </button>
                    <button onClick={() => setMudarPagina(3)} className="bg-gray-100 w-32 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
                        Serviços Agendados
                    </button> 
                    <button
                        onClick={logout}
                        className="bg-red-100 w-32 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                    >
                        Sair
                    </button>
                </div>

                <div className="text-gray-700 space-y-4">
                    <p><strong>Telefone:</strong> {usuario?.telefone}</p>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Histórico de Serviços</h3>
                        {historico && historico.length > 0 ? (
                            <div className="space-y-4">
                                {servicosExibidos
                                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                                    .map((servico, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-medium text-[#A75C00]">{servico.categoria}</h4>
                                                <p className="text-sm text-gray-600">{servico.fornecedor?.nome}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(servico.status)}`}>
                                                {servico.status}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>Data:</strong> {formatarData(servico.data)}</p>
                                            <p><strong>Horário:</strong> {formatarHora(servico.horario)}</p>
                                            <p><strong>Descrição:</strong> {servico.descricao}</p>
                                        </div>

                                        {servico.status === 'Em Andamento' && (
                                            <div className="flex justify-end">
                                                <button onClick={() => handleOpenChat(servico.id_fornecedor)} className="bg-green-200">Entrar em Contato</button>
                                            </div>
                                        )}

                                        {servico.status === 'Aquardando Pagamento' && (
                                            <div className="flex justify-end">
                                                <button onClick={() => navigate(`/detalhes-servico-confirmado/${servico.id_servico}`)} className="bg-green-200">Pagamento</button>
                                            </div>
                                        )}
                                    </div>

                                ))}
                                
                                {historico.length > LIMITE_VISUALIZACAO && (
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => setMostrarTodos(!mostrarTodos)}
                                            className="px-4 py-2 bg-[#AC5906] text-white rounded-md hover:bg-[#8B4705] transition-colors"
                                        >
                                            {mostrarTodos ? 'Mostrar Menos' : 'Ver Mais Serviços'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Nenhum serviço encontrado no histórico.</p>
                        )}
                    </div>
                </div>
            </div>
            <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div onClick={() => setIsChatOpen(false)} className="fixed inset-0 bg-black opacity-40"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[1000px] w-[90vw] h-[80vh] max-h-[600px] flex flex-col">
                        <Chat idFornecedor={id_servico} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}