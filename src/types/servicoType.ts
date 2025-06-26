export interface ServicoComUsuario {
    id_servico: string;
    id_fornecedor: string;
    id_usuario: string;
    imagems: string[];
    data_submisao: Date;
    categoria: string;
    data: Date;
    horario: Date;
    status: string;
    id_pagamento?: string;
    id_avaliacao?: string;
    descricao: string;
    valor: number;
    usuario: {
        imagemPerfil: string;
        nome: string;
        email: string;
        telefone: string;
        endereco:typeEndereco;
        media_avaliacoes?: number;
    } | null;
    avaliado?: boolean;
} 

export type typeEndereco = {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
    numero:string;
    tipoMoradia:string;
}
