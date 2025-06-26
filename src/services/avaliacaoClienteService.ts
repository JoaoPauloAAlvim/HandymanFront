import { URLAPI } from '../constants/ApiUrl';

export interface AvaliacaoClientePayload {
  id_servico: string;
  id_fornecedor: string;
  id_usuario: string;
  nota: number;
  comentario: string;
  data?: Date;
}

export async function avaliarCliente({ id_servico, id_fornecedor, id_usuario, nota, comentario, data }: AvaliacaoClientePayload) {
  try {
    const response = await fetch(`${URLAPI}/avaliacao-cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_servico,
        id_fornecedor,
        id_usuario,
        nota,
        comentario,
        data: data || new Date(),
      }),
    });
    if (!response.ok) {
      throw new Error('Erro ao enviar avaliação do cliente');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
} 