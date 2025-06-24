/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  View,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para as tarefas
interface Tarefa {
  id: string;
  texto: string;
  concluida: boolean;
}

const App = () => {
  // Estados para controlar os dados do aplicativo
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState<string>('');
  const [editarTarefa, setEditarTarefa] = useState<Tarefa | null>(null);
  const [textoEdicao, setTextoEdicao] = useState<string>('');
  const isDarkMode = useColorScheme() === 'dark';

  // Carregar tarefas ao iniciar
  useEffect(() => {
    carregarTarefas();
  }, []);

  // Carregar tarefas do armazenamento local
  const carregarTarefas = async () => {
    try {
      const tarefasSalvas = await AsyncStorage.getItem('tarefas');
      if (tarefasSalvas) {
        const parsedTarefas: Tarefa[] = JSON.parse(tarefasSalvas);
        setTarefas(parsedTarefas);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    }
  };

  // Salvar tarefas no armazenamento local
  const salvarTarefas = async (novasTarefas: Tarefa[]) => {
    try {
      await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
      Alert.alert('Erro', 'Não foi possível salvar as tarefas.');
    }
  };

  // Adicionar uma nova tarefa
  const adicionarTarefa = () => {
    if (novaTarefa.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira uma tarefa.');
      return;
    }
    const nova: Tarefa = {
      id: Date.now().toString(),
      texto: novaTarefa,
      concluida: false,
    };
    const novasTarefas: Tarefa[] = [...tarefas, nova];
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
    setNovaTarefa('');
  };

  // Iniciar edição de uma tarefa
  const iniciarEdicao = (tarefa: Tarefa) => {
    setEditarTarefa(tarefa);
    setTextoEdicao(tarefa.texto);
  };

  // Salvar edição de uma tarefa
  const salvarEdicao = () => {
    if (textoEdicao.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira uma tarefa válida.');
      return;
    }
    if (!editarTarefa) return;

    const novasTarefas: Tarefa[] = tarefas.map((t) =>
      t.id === editarTarefa.id ? { ...t, texto: textoEdicao } : t
    );
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
    setEditarTarefa(null);
    setTextoEdicao('');
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditarTarefa(null);
    setTextoEdicao('');
  };

  // Excluir uma tarefa
  const excluirTarefa = (id: string) => {
    const novasTarefas: Tarefa[] = tarefas.filter((t) => t.id !== id);
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
  };

  // Marcar/desmarcar tarefa como concluída
  const marcarConcluida = (id: string) => {
    const novasTarefas: Tarefa[] = tarefas.map((t) =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    );
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
  };

  // Renderizar cada tarefa na lista
  const renderTarefa = ({ item }: { item: Tarefa }) => (
    <View style={styles.tarefaContainer}>
      <TouchableOpacity onPress={() => marcarConcluida(item.id)}>
        <Text style={styles.checkbox}>{item.concluida ? '✅' : '⬜'}</Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.textoTarefa,
          item.concluida && styles.textoConcluido,
          isDarkMode && styles.textoDark,
        ]}
      >
        {item.texto}
      </Text>
      <TouchableOpacity onPress={() => iniciarEdicao(item)}>
        <Text style={styles.botaoAcao}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => excluirTarefa(item.id)}>
        <Text style={styles.botaoAcao}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={[styles.titulo, isDarkMode && styles.tituloDark]}>
        Lista de Tarefas
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDarkMode && styles.inputDark]}
          value={editarTarefa ? textoEdicao : novaTarefa}
          onChangeText={editarTarefa ? setTextoEdicao : setNovaTarefa}
          placeholder="Digite uma tarefa"
          placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        />
        {editarTarefa ? (
          <View style={styles.botoesEdicao}>
            <TouchableOpacity style={styles.botao} onPress={salvarEdicao}>
              <Text style={styles.textoBotao}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botao, styles.botaoCancelar]}
              onPress={cancelarEdicao}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
            <Text style={styles.textoBotao}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={renderTarefa}
        ListEmptyComponent={
          <Text style={[styles.vazio, isDarkMode && styles.vazioDark]}>
            Nenhuma tarefa adicionada.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  tituloDark: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputDark: {
    borderColor: '#555',
    backgroundColor: '#333',
    color: '#fff',
  },
  botao: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoCancelar: {
    backgroundColor: '#dc3545',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botoesEdicao: {
    flexDirection: 'column',
  },
  tarefaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    marginRight: 8,
    fontSize: 20,
  },
  textoTarefa: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  textoDark: {
    color: '#fff',
  },
  textoConcluido: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  botaoAcao: {
    padding: 8,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  vazioDark: {
    color: '#aaa',
  },
});

export default App;