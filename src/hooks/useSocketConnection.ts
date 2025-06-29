import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { URLAPI } from '../constants/ApiUrl';

interface UseSocketConnectionProps {
    onDestaqueAtualizado?: () => void;
    onFornecedoresResetados?: () => void;
}

export const useSocketConnection = ({
    onDestaqueAtualizado,
    onFornecedoresResetados
}: UseSocketConnectionProps) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        console.log('🚀 Inicializando hook useSocketConnection (Web)...');
        console.log('URL da API:', URLAPI);
        
        // Inicializa o socket
        const socket = io(URLAPI, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        // Eventos de conexão do socket
        socket.on('connect', () => {
            console.log('✅ Socket conectado (Web) - ID:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket desconectado (Web)');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Erro na conexão do socket (Web):', error);
        });

        // Escuta o evento de destaque atualizado
        socket.on('destaqueAtualizado', (update) => {
            console.log('🎯 Recebido evento destaqueAtualizado (Web):', update);
            if (onDestaqueAtualizado) {
                console.log('Chamando callback onDestaqueAtualizado (Web)...');
                onDestaqueAtualizado();
            }
        });

        // Escuta o evento de fornecedores resetados
        socket.on('fornecedoresResetados', (update) => {
            console.log('🔄 Recebido evento fornecedoresResetados (Web):', update);
            if (onFornecedoresResetados) {
                console.log('Chamando callback onFornecedoresResetados (Web)...');
                onFornecedoresResetados();
            }
        });

        return () => {
            console.log('Desconectando socket (Web)...');
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [onDestaqueAtualizado, onFornecedoresResetados]);

    return {
        socket: socketRef.current
    };
}; 