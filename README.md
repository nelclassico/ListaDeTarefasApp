Tutorial: Criando um Aplicativo de Lista de Tarefas com React Native e Gerando o APK
Bem-vindos, alunos! Neste tutorial, vamos criar um aplicativo de lista de tarefas em React Native, com funcionalidades de criar, editar, excluir e marcar tarefas como concluídas, além de salvar os dados offline usando AsyncStorage. Vamos configurar o ambiente, escrever o código, corrigir possíveis erros, gerar o JavaScript bundle, criar um APK Debug no Android Studio, e testar no celular. No final, vocês terão uma atividade para adicionar uma nova funcionalidade simples ao app.
Pré-requisitos:

Sistema operacional Windows.
Node.js instalado (versão 16 ou superior, baixe em https://nodejs.org).
Android Studio instalado (ex.: Dolphin ou Electric Eel, baixe em https://developer.android.com/studio).
Um dispositivo Android com Depuração USB ativada ou um emulador configurado no Android Studio.
Prompt de Comando (cmd) para executar comandos.

Pasta do projeto: C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas.

Passo 1: Configurar o Ambiente
Vamos configurar o ambiente de desenvolvimento para React Native e Android.

Verificar Node.js:

Abra o Prompt de Comando (cmd):node -v
npm -v


Você deve ver versões como v16.x.x (Node) e 8.x.x (npm). Se não, instale o Node.js.


Instalar o CLI do React Native:

No cmd:npm install -g @react-native-community/cli




Configurar o Android Studio:

Abra o Android Studio e instale o Android SDK:
Vá para File > Settings > Appearance & Behavior > System Settings > Android SDK.
Na aba SDK Platforms, selecione Android 12.0 (S) ou superior.
Na aba SDK Tools, marque Android SDK Build-Tools, Android Emulator, e Android SDK Platform-Tools.
Clique em Apply para instalar.


Configure as variáveis de ambiente:
No Windows, pesquise por "Variáveis de ambiente" e adicione:
Variável: ANDROID_HOME
Valor: C:\Users\programador\AppData\Local\Android\Sdk


Adicione ao Path:C:\Users\programador\AppData\Local\Android\Sdk\platform-tools
C:\Users\programador\AppData\Local\Android\Sdk\tools






Testar o ADB:

No cmd:adb --version


Você deve ver a versão do ADB. Se não, verifique o Android SDK.




Passo 2: Criar o Projeto React Native
Vamos criar o projeto na pasta C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas.

Criar o projeto:

No cmd:cd C:\Users\programador\Documents\ProjetoDiario
npx @react-native-community/cli init ListaDeTarefas


Isso cria a pasta ListaDeTarefas com a estrutura do projeto.


Navegar até o projeto:
cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas


Instalar o AsyncStorage:

O app usará @react-native-async-storage/async-storage para salvar tarefas offline:npm install @react-native-async-storage/async-storage




Configurar o TypeScript:

Abra C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\tsconfig.json em um editor (ex.: VSCode).
Substitua o conteúdo por:{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}




Testar o projeto:

Inicie o Metro Bundler em um terminal:npx react-native start


Em outro terminal, compile e execute no emulador/dispositivo:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas
npx react-native run-android


Se aparecer um app padrão do React Native no emulador/celular, o ambiente está configurado.




Passo 3: Implementar o Código do App
Vamos implementar o aplicativo de lista de tarefas com CRUD (criar, ler, atualizar, excluir) e persistência offline.

Substituir o App.tsx:

Abra C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\App.tsx no VSCode.
Substitua o conteúdo pelo código abaixo:import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Tarefa {
  id: string;
  texto: string;
  concluida: boolean;
}

const App = () => {
  const [tarefa, setTarefa] = useState('');
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const salvarTarefas = async (novasTarefas: Tarefa[]) => {
    try {
      await AsyncStorage.setItem('tarefas', JSON.stringify(novasTarefas));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const carregarTarefas = async () => {
    try {
      const tarefasSalvas = await AsyncStorage.getItem('tarefas');
      if (tarefasSalvas) {
        setTarefas(JSON.parse(tarefasSalvas));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const adicionarTarefa = () => {
    if (tarefa.trim() === '') return;
    if (editando) {
      const novasTarefas = tarefas.map((t) =>
        t.id === editando ? { ...t, texto: tarefa } : t
      );
      setTarefas(novasTarefas);
      salvarTarefas(novasTarefas);
      setEditando(null);
    } else {
      const novaTarefa: Tarefa = {
        id: Math.random().toString(),
        texto: tarefa,
        concluida: false,
      };
      const novasTarefas = [...tarefas, novaTarefa];
      setTarefas(novasTarefas);
      salvarTarefas(novasTarefas);
    }
    setTarefa('');
  };

  const editarTarefa = (id: string, texto: string) => {
    setTarefa(texto);
    setEditando(id);
  };

  const excluirTarefa = (id: string) => {
    const novasTarefas = tarefas.filter((t) => t.id !== id);
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
  };

  const toggleConcluida = (id: string) => {
    const novasTarefas = tarefas.map((t) =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    );
    setTarefas(novasTarefas);
    salvarTarefas(novasTarefas);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite uma tarefa"
        value={tarefa}
        onChangeText={setTarefa}
      />
      <Button
        title={editando ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        onPress={adicionarTarefa}
      />
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarefa}>
            <TouchableOpacity onPress={() => toggleConcluida(item.id)}>
              <Text style={item.concluida ? styles.textoConcluido : styles.texto}>
                {item.texto}
              </Text>
            </TouchableOpacity>
            <View style={styles.botoes}>
              <Button title="Editar" onPress={() => editarTarefa(item.id, item.texto)} />
              <Button title="Excluir" onPress={() => excluirTarefa(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  tarefa: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  texto: {
    fontSize: 16,
  },
  textoConcluido: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  botoes: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default App;


Este código cria um app com:
Um campo de texto para adicionar/editar tarefas.
Uma lista de tarefas com opções para marcar como concluída, editar, ou excluir.
Persistência offline usando AsyncStorage.




Corrigir possíveis erros de importação:

Se ocorrerem erros como Cannot find module 'react-native' ou AsyncStorage:
Reinstale as dependências:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas
del /S /Q node_modules package-lock.json
npm install


Instale tipos para TypeScript:npm install --save-dev @types/react-native


Limpe o cache do Metro Bundler:npx react-native start --reset-cache






Testar o app:

Inicie o Metro Bundler:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas
npx react-native start


Execute no emulador/celular:npx react-native run-android


Teste as funcionalidades: adicionar, editar, excluir, e marcar tarefas como concluídas.




Passo 4: Gerar o JavaScript Bundle
Para que o APK funcione offline, precisamos incluir o JavaScript bundle (index.android.bundle) no APK.

Gerar o bundle:

No cmd:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android\app\src\main\assets\index.android.bundle --assets-dest android\app\src\main\res


Isso cria:
C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\src\main\assets\index.android.bundle
Recursos em C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\src\main\res


Se a pasta assets não existir, crie-a:mkdir C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\src\main\assets

E repita o comando.


Configurar o Gradle para incluir o bundle:

Abra C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\build.gradle no VSCode ou Android Studio.
Antes da seção android { ... }, adicione:project.ext.react = [
  entryFile: "index.js",
  bundleAssetName: "index.android.bundle",
  bundleInDebug: true,
  bundleInRelease: true
]


Isso garante que o bundle JS seja incluído no APK.




Passo 5: Gerar o Debug APK no Android Studio
Vamos gerar o Debug APK, que é mais simples e usa o keystore padrão de debug.

Abrir o projeto no Android Studio:

Abra o Android Studio.
Clique em Open e selecione C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android.
Aguarde a sincronização do Gradle (clique em Sync Project with Gradle Files se necessário).


Corrigir o problema do keystore:

No log anterior, o erro toDerInputStream rejects tag type 76 e keystore password was incorrect indicaram um problema com um keystore personalizado (android.jks). Para o Debug APK, usaremos o keystore padrão.
Renomeie o keystore personalizado, se existir:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android
ren android.jks android.jks.bak


Abra C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\build.gradle e confirme que a seção signingConfigs para debug usa o padrão:android {
  ...
  signingConfigs {
    debug {
      storeFile file('C:/Users/programador/.android/debug.keystore')
      storePassword 'android'
      keyAlias 'androiddebugkey'
      keyPassword 'android'
    }
  }
  buildTypes {
    debug {
      signingConfig signingConfigs.debug
    }
  }
}


Abra C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\gradle.properties e remova/comente linhas relacionadas a keystores personalizados:# MYAPP_RELEASE_STORE_FILE=android.jks
# MYAPP_RELEASE_KEY_ALIAS=androiddebugkey
# MYAPP_RELEASE_STORE_PASSWORD=...
# MYAPP_RELEASE_KEY_PASSWORD=...




Limpar o build:

No cmd:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android
gradlew clean
cd ..


No Android Studio: Build > Clean Project.


Gerar o Debug APK:

No Android Studio, vá para Build > Generate Signed Bundle / APK (em português: Construir > Gerar Bundle Assinado ou APK).
Selecione APK e clique em Next.
Escolha o módulo app.
Selecione Choose existing e aponte para:
Caminho: C:\Users\programador\.android\debug.keystore
Senha: android
Alias: androiddebugkey
Senha do alias: android


Escolha debug no campo Build Variant.
Clique em Finish e aguarde a compilação.
O APK será gerado em:C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\build\outputs\apk\debug\app-debug.apk




Testar o APK:

Conecte um celular Android com Depuração USB ativada.
Instale o APK:adb install C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\build\outputs\apk\debug\app-debug.apk


Ou copie o arquivo para o celular via USB e instale manualmente (ative "Instalar de fontes desconhecidas").
Abra o app e teste:
Adicione uma tarefa.
Marque como concluída.
Edite uma tarefa.
Exclua uma tarefa.
Feche e reabra o app para verificar se as tarefas persistem (salvas via AsyncStorage).






Passo 6: Solução de Problemas
Se você encontrar problemas, aqui estão as soluções para os erros mencionados:

Erro de importação (react-native ou AsyncStorage):

Reinstale as dependências:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas
del /S /Q node_modules package-lock.json
npm install
npm install @react-native-async-storage/async-storage
npm install --save-dev @types/react-native


Limpe o cache:npx react-native start --reset-cache




Erro de keystore (keystore password was incorrect ou toDerInputStream rejects tag type 76):

Confirme que o keystore padrão de debug está sendo usado (C:\Users\programador\.android\debug.keystore).
Se não existir, crie-o:keytool -genkeypair -v -keystore C:\Users\programador\.android\debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"




APK instala, mas não roda:

Verifique se o bundle JS foi gerado:
Confirme a existência de C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android\app\src\main\assets\index.android.bundle.
Se não existir, repita o comando do Passo 4.


Conecte o celular via USB e abra o Logcat no Android Studio (View > Tool Windows > Logcat).
Procure por erros como Unable to load script.


Erro de Gradle:

Limpe e sincronize o projeto:cd C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\android
gradlew clean


No Android Studio: Build > Clean Project e Sync Project with Gradle Files.






Atividade para os Alunos: Adicionar uma Funcionalidade Simples
Agora que o app está funcionando, sua tarefa é adicionar uma funcionalidade simples: exibir um contador de tarefas pendentes (tarefas não concluídas) na tela, acima da lista de tarefas.
Instruções:

O que fazer:
Adicione um texto na interface que mostre o número de tarefas pendentes (ex.: "Tarefas pendentes: 3").
O contador deve atualizar automaticamente quando você adicionar, excluir, ou marcar uma tarefa como concluída.


Dica:
Use o estado tarefas já existente no App.tsx.
Filtre as tarefas onde concluida é false usando tarefas.filter(t => !t.concluida).length.
Adicione um componente <Text> acima do FlatList com o estilo similar ao título (styles.titulo).


Onde editar:
Arquivo: C:\Users\programador\Documents\ProjetoDiario\ListaDeTarefas\App.tsx.
Modifique a função App para incluir o contador.


Testar:
Salve o arquivo e execute:npx react-native run-android


Verifique se o contador atualiza corretamente.


(Opcional) Gerar um novo APK:
Repita os passos 4 e 5 para gerar um novo Debug APK com o contador.



Exemplo de como o contador pode ficar:
<Text style={styles.titulo}>Tarefas pendentes: {tarefas.filter(t => !t.concluida).length}</Text>

Desafio extra:

Estilize o contador com uma cor diferente (ex.: #ff0000 para vermelho) se houver mais de 5 tarefas pendentes.


Resumo
Neste tutorial, vocês aprenderam a:

Configurar o ambiente React Native e Android.
Criar um app de lista de tarefas com CRUD e persistência offline.
Corrigir erros de importação e keystore.
Gerar o JavaScript bundle e incluí-lo no APK.
Criar e testar um Debug APK no Android Studio.
A atividade proposta ajuda a praticar a manipulação de estados e interface.

Se encontrarem problemas ou quiserem ajuda com a atividade, compartilhem a mensagem de erro ou o código! Boa sorte, alunos! 😊
