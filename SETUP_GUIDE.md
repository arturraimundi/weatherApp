# 🌤️ Weather App - Guia de Execução

## ✨ Melhorias Implementadas

### Backend (ASP.NET Core)
- ✅ **Autenticação JWT completa** com login e registro
- ✅ **Endpoints protegidos** que requerem autenticação
- ✅ **Novos métodos da Weather API:**
  - `/api/weather/search/{city}` - Buscar clima por cidade
  - `/api/weather/forecast/{city}` - Previsão de 7 dias
  - `/api/weather/details/{city}` - Detalhes completos (temperatura, umidade, vento, pressão, etc.)
  - `/api/weather/alerts/{city}` - Alertas e avisos
- ✅ **CORS configurado** para permitir requisições do frontend

### Frontend (Angular)
- ✅ **Sistema de Login/Registro** com interface moderna
- ✅ **Autenticação JWT** armazenada no localStorage
- ✅ **AuthService** para gerenciar autenticação
- ✅ **Dashboard melhorado** com:
  - Abas para navegação (Atual, Detalhes, Previsão, Alertas)
  - Métricas em tempo real (Umidade, Vento, Visibilidade, Pressão, Índice UV)
  - Detalhes avançados (Ponto de orvalho, direção do vento, cobertura de nuvens)
  - Previsão de 7 dias com ícones
  - Sistema de alertas e avisos
- ✅ **Design responsivo** para desktop, tablet e mobile
- ✅ **Interface moderna** com gradientes e animações suaves
- ✅ **Busca por cidade** ou localização atual

---

## 🚀 Como Executar

### 1. **Backend (ASP.NET Core)**

#### Requisitos:
- .NET 8.0 ou superior instalado
- Visual Studio Code ou Visual Studio

#### Passos:
```bash
# Navegue até a pasta API
cd /home/arturraimundi/Documents/weatherApp/API

# Execute o backend na porta 5000
dotnet run
```

O servidor estará disponível em: **http://localhost:5000**

---

### 2. **Frontend (Angular)**

#### Requisitos:
- Node.js 18+ instalado
- npm ou yarn

#### Passos:
```bash
# Navegue até a pasta Web
cd /home/arturraimundi/Documents/weatherApp/Web

# Instale as dependências (apenas na primeira execução)
npm install

# Execute o servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em: **http://localhost:4200** (ou http://localhost:5173)

---

## 📝 Como Usar

### 1. **Registre-se**
- Acesse a página de login
- Clique em "Registre-se aqui"
- Preencha Email, Usuário e Senha
- Clique em "Registrar"

### 2. **Faça Login**
- Volte à tela de login
- Digite seu usuário e senha
- Clique em "Entrar"

### 3. **Explore o Clima**
- **Pesquisar cidade**: Digite o nome da cidade e clique em "🔍 Pesquisar"
- **Usar localização atual**: Clique em "📍 Minha Localização"
- **Navegar entre abas**: Clique nas abas (Atual, Detalhes, Previsão, Alertas)

### 4. **Sair**
- Clique em "Sair" no canto superior direito

---

## 🔐 Credenciais Padrão de Teste

Se quiser usar credenciais pré-cadastradas:
- **Usuário**: testuser
- **Senha**: password123

(Comente o código para registrar usuários e descomente para usar credenciais fixas)

---

## 📊 Dados Exibidos

### Aba "Atual"
- Temperatura atual em °C
- Sensação térmica
- Umidade (%)
- Velocidade do vento (km/h)
- Visibilidade (km)
- Pressão (mb)
- Índice UV

### Aba "Detalhes"
- Temperatura (mínima, máxima, atual)
- Ponto de orvalho
- Direção e velocidade do vento
- Rajadas de vento
- Pressão e umidade
- Cobertura de nuvens
- Chance de precipitação

### Aba "Previsão"
- Previsão de 7 dias
- Temperatura máxima e mínima
- Ícones de condição climática

### Aba "Alertas"
- Avisos e alertas em tempo real
- Classificação por severidade

---

## 🛠️ Arquitetura

### Backend
```
API/
├── Program.cs (Endpoints, Modelos, Autenticação JWT)
├── API.csproj
└── appsettings.json
```

### Frontend
```
Web/
├── src/
│   ├── app/
│   │   ├── app.component.ts (Componente principal)
│   │   ├── app.html (Template)
│   │   ├── app.css (Estilos)
│   │   ├── auth.service.ts (Serviço de autenticação)
│   │   ├── login.component.ts (Componente de login)
│   │   ├── weather.service.ts (Serviço de clima)
│   │   └── locationService.ts (Serviço de localização)
│   └── environments/
│       └── environment.ts (Configurações)
└── package.json
```

---

## 🔧 Variáveis de Ambiente

### Frontend (.env)
Se usar um arquivo .env, adicione:
```
VITE_WEATHER_API_KEY=sua_chave_aqui
```

### Backend (appsettings.json)
Cole a chave secreta JWT em um arquivo `appsettings.Development.json`:
```json
{
  "JwtSecret": "SUA_CHAVE_SECRETA_SUPER_SEGURA_2024_WEATHERAPP"
}
```

---

## ⚠️ Notas Importantes

1. **Banco de Dados**: Atualmente, os dados de usuários são armazenados em memória. Em produção, use um banco de dados real (SQL Server, PostgreSQL, etc.)

2. **Segurança**: A senha está sendo hashida com Base64 (apenas para demo). Em produção, use BCrypt ou similar.

3. **API de Clima**: Os dados retornados são fictícios. Para dados reais, integre a API do weatherapi.com descomentando o código.

4. **CORS**: Configurado para aceitar requisições de `http://localhost:5173` e `http://localhost:4200`

---

## 🆘 Troubleshooting

### Erro: "CORS policy"
- Certifique-se de que o backend está rodando em `http://localhost:5000`
- Verifique se o CORS foi configurado corretamente no `Program.cs`

### Erro: "Unauthorized" ou "Token inválido"
- Faça logout e login novamente
- Verifique se o token é salvo no localStorage

### Erro: "Ciudad not found"
- Os dados são fictícios. Use qualquer nome de cidade que funcionará.

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- [Documentação do Angular](https://angular.io)
- [Documentação do ASP.NET Core](https://learn.microsoft.com/pt-br/aspnet/core)
- [Documentação do JWT](https://jwt.io)

---

## 🎨 Paleta de Cores

- **Primária**: #667eea (Azul)
- **Secundária**: #764ba2 (Roxo)
- **Sucesso**: #4CAF50 (Verde)
- **Perigo**: #d32f2f (Vermelho)
- **Fundo**: #f5f7fa (Cinza claro)

---

## 📄 Licença

Este projeto é fornecido como está para fins educacionais e de desenvolvimento.

---

**Desenvolvido com ❤️ - Weather App 2024**
