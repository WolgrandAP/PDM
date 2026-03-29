import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface Tarefa {
  id: string;
  descricao: string;
  prioridade: number;
  prazo: Date;
}

interface TarefaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (tarefa: Tarefa) => void;
  tarefaEditando?: Tarefa | null;
}

const TarefaModal: React.FC<TarefaModalProps> = ({
  visible,
  onClose,
  onSave,
  tarefaEditando,
}) => {
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("1");
  const [prazo, setPrazo] = useState("");

  useEffect(() => {
    if (tarefaEditando) {
      setDescricao(tarefaEditando.descricao);
      setPrioridade(String(tarefaEditando.prioridade));
      setPrazo(
        tarefaEditando.prazo.toISOString().split("T")[0]
      );
    } else {
      setDescricao("");
      setPrioridade("1");
      setPrazo("");
    }
  }, [tarefaEditando, visible]);

  function salvar() {
    if (!descricao || !prazo) return;

    const tarefa: Tarefa = {
      id: tarefaEditando?.id ?? Math.random().toString(),
      descricao,
      prioridade: Number(prioridade),
      prazo: new Date(prazo),
    };

    onSave(tarefa);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000088",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            margin: 20,
            padding: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            {tarefaEditando ? "Editar Tarefa" : "Nova Tarefa"}
          </Text>

          <Text>Descrição</Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            style={{ borderWidth: 1, marginBottom: 10 }}
          />

          <Text>Prioridade (1 a 5)</Text>
          <TextInput
            value={prioridade}
            onChangeText={setPrioridade}
            keyboardType="numeric"
            style={{ borderWidth: 1, marginBottom: 10 }}
          />

          <Text>Prazo (AAAA-MM-DD)</Text>
          <TextInput
            value={prazo}
            onChangeText={setPrazo}
            style={{ borderWidth: 1, marginBottom: 20 }}
          />

          <TouchableOpacity onPress={salvar}>
            <Text style={{ color: "blue", textAlign: "center" }}>
              Salvar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TarefaModal;