# Portfólio | Henrique Moraes

Site estático em HTML, CSS e JavaScript puros. Não precisa de build nem de dependências.

## Estrutura

```
index.html          página inicial
itau.html           estudo de caso do Itaú (versão provisória)
styles.css          estilos gerais, temas claro/escuro e responsividade
case.css            estilos do estudo de caso
script.js           tema, menu, efeitos e a gota de vidro líquido
vercel.json         configuração da Vercel
assets/
  favicon.svg
  fonts/            Anton, Instrument Serif e Plus Jakarta Sans (hospedadas no site)
  img/              suas fotos e capas dos projetos
  curriculo-henrique-moraes.pdf
```

## Publicar na Vercel

**Opção 1, pelo GitHub (recomendado)**
1. Crie um repositório vazio no GitHub (sem README).
2. Envie o conteúdo desta pasta (veja "Enviar para o GitHub" abaixo).
3. Em vercel.com, clique em **Add New → Project** e importe o repositório.
4. Em *Framework Preset* deixe **Other**. Não precisa de Build Command nem de Output Directory.
5. Clique em **Deploy**. A cada novo `git push`, o site atualiza sozinho.

**Opção 2, arrastando a pasta**
Instale a Vercel CLI (`npm i -g vercel`), entre nesta pasta pelo terminal e rode `vercel --prod`.

Para usar domínio próprio: no projeto da Vercel, vá em **Settings → Domains**.

## Enviar para o GitHub

Esta pasta já é um repositório Git com o commit pronto. Depois de criar o repositório vazio:

```
git remote add origin https://github.com/SEU-USUARIO/portfolio.git
git push -u origin main
```

Se você já tinha enviado a versão anterior para o mesmo repositório, substitua os arquivos pelos desta pasta e faça um novo commit.

## Atualizar conteúdo

- **Capas que faltam:** salve como `assets/img/projetos/tanasacola.jpg` e `assets/img/projetos/converto.jpg`. Elas aparecem sozinhas nos cards.
- **Currículo:** substitua `assets/curriculo-henrique-moraes.pdf` mantendo o mesmo nome.
- **Link do Behance do Itaú:** em `itau.html`, troque o link do botão "Ver projeto no Behance" pelo link direto do projeto quando ele estiver publicado.
- **Artigos do Medium:** os dois títulos do card são exemplos; troque em `index.html`.

## Testar no computador

Rode `npx serve .` nesta pasta e abra o endereço que aparecer.

## Larguras testadas

Desktop 1440, 1366, 1280, 1180, 1100 e 1024px; tablet 900 e 820px; celular 414, 390, 375, 360 e 320px. Temas claro e escuro.
