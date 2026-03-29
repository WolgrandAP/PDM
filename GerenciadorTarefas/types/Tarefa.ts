export interface Tarefa {
  id: string;
  descricao: string;
  prioridade: number; // 1 a 5
  prazo: Date;
}