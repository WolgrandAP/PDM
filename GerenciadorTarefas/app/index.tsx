"use client";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import TarefaModal from "../components/TarefaModal";

interface Tarefa {
  id: string;
  descricao: string;
  prioridade: number; 
  prazo: Date;
}

export default function Index() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

  function salvarTarefa(tarefa: Tarefa) {
    setTarefas((prev) => {
      const existe = prev.some((t) => t.id === tarefa.id);

      const listaAtualizada = existe
        ? prev.map((t) =>
            t.id === tarefa.id ? tarefa : t
          )
        : [...prev, tarefa];

      return listaAtualizada.sort((a, b) => {
        if (a.prazo.getTime() !== b.prazo.getTime()) {
          return a.prazo.getTime() - b.prazo.getTime();
        }
        return a.prioridade - b.prioridade;
      });
    });
  }

  function removerTarefa(id: string) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  function abrirCriacao() {
    setTarefaEditando(null);
    setModalVisible(true);
  }

  function abrirEdicao(tarefa: Tarefa) {
    setTarefaEditando(tarefa);
    setModalVisible(true);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          alignItems: "flex-end",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={abrirCriacao}>
          <Entypo name="squared-plus" size={32} color="#2b7fc4" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhuma tarefa cadastrada.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#e0e0e0",
              padding: 10,
              marginVertical: 4,
              borderRadius: 6,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold" }}>
                {item.descricao}
              </Text>
              <Text>Prioridade: {item.prioridade}</Text>
              <Text>
                Prazo: {item.prazo.toLocaleDateString()}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => abrirEdicao(item)}
              >
                <FontAwesome
                  name="pencil"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => removerTarefa(item.id)}
              >
                <FontAwesome
                  name="trash-o"
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TarefaModal
        visible={modalVisible}
        tarefaEditando={tarefaEditando}
        onSave={salvarTarefa}
        onClose={() => {
          setModalVisible(false);
          setTarefaEditando(null);
        }}
      />
    </View>
  );
}