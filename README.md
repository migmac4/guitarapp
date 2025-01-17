# Next.js Internationalization Example

Este é um exemplo de aplicação Next.js com internacionalização (i18n) usando App Router. O projeto demonstra como implementar suporte multilíngue em uma aplicação Next.js moderna.

## Funcionalidades

- Suporte para múltiplos idiomas (Português, Espanhol e Inglês)
- Detecção automática do idioma do navegador
- Troca de idiomas via URL (/pt, /es, /en)
- Feedback visual durante o carregamento das traduções
- Sistema de debug detalhado para rastreamento do fluxo da aplicação

## Tecnologias Utilizadas

- Next.js 13+ (App Router)
- React
- i18next
- Tailwind CSS
- TypeScript

## Estrutura do Projeto

```
src/
  ├── app/                    # App Router pages
  │   ├── [locale]/          # Dynamic locale routes
  │   └── layout.tsx         # Root layout
  ├── i18n/                  # i18n configuration
  ├── providers/             # React providers
  └── utils/                 # Utility functions

public/
  └── locales/              # Translation files
      ├── en/
      ├── es/
      └── pt/
```

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Arquivos de Tradução

Os arquivos de tradução estão localizados em `public/locales/{locale}/common.json`. Para adicionar um novo idioma:

1. Crie uma nova pasta com o código do idioma em `public/locales/`
2. Adicione o arquivo `common.json` com as traduções
3. Adicione o código do idioma em `src/i18n/settings.ts`

## Contribuindo

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar pull requests.
