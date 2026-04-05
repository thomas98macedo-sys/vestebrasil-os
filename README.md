# VesteBrasil Launch OS v2 — Tempo Real

## Como configurar o Firebase (5 minutos)

### Passo 1: Criar projeto no Firebase

1. Abre: https://console.firebase.google.com
2. Clica em **"Criar um projeto"** (ou "Add project")
3. Nome: **VesteBrasil** → clica Continuar
4. Desativa o Google Analytics (não precisa) → clica **Criar projeto**
5. Espera criar e clica **Continuar**

### Passo 2: Criar o banco de dados (Firestore)

1. No menu esquerdo, clica em **"Firestore Database"** (ou "Cloud Firestore")
2. Clica em **"Criar banco de dados"**
3. Seleciona **"Iniciar no modo de teste"** (test mode)
4. Localização: escolhe **southamerica-east1** (São Paulo)
5. Clica **Criar**

### Passo 3: Pegar a config do Firebase

1. No menu, clica na **engrenagem** ⚙️ ao lado de "Visão geral do projeto"
2. Clica em **"Configurações do projeto"**
3. Rola até **"Seus apps"**
4. Clica no ícone **</>** (Web) para adicionar um app web
5. Nome: **VesteBrasil OS** → clica **Registrar app**
6. Vai aparecer um bloco de código assim:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "vestebrasil-xxxxx.firebaseapp.com",
  projectId: "vestebrasil-xxxxx",
  storageBucket: "vestebrasil-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

7. **COPIA esse bloco inteiro**

### Passo 4: Colar a config no código

1. Abre o arquivo **`src/firebase.js`**
2. Substitui o bloco com "COLE_AQUI" pela config que você copiou
3. Salva o arquivo

### Passo 5: Deploy

No terminal, na pasta do projeto:

```bash
git add .
git commit -m "Add Firebase real-time"
git push
```

O Vercel vai re-deployar automaticamente em ~40 segundos.

---

## Pronto!

Agora quando qualquer pessoa da equipe:
- Criar uma tarefa → aparece pra todos
- Mover um criativo no Kanban → atualiza em tempo real
- Adicionar uma nota → todo mundo vê
- Marcar item do roadmap → progresso atualiza pra todos

Tudo sincronizado em tempo real via Firebase.

---

## Equipe

| Nome    | Email                          | Canal           |
|---------|-------------------------------|-----------------|
| Thomas  | thomas98macedo@gmail.com       | Ecommerce/Site  |
| Kauan   | kauancabralpereira@gmail.com   | TikTok Shop     |
| Dantas  | filipexaxa65@gmail.com         | Mercado Livre   |
| Marcos  | marcos.roberto98@outlook.com   | Shopee          |
