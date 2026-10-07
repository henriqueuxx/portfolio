# Portfólio | Henrique Moraes

Site estático (HTML, CSS e JavaScript puros). Não precisa de build nem de dependências.

## Estrutura

```
index.html          página
styles.css          estilos, temas claro/escuro e responsividade
script.js           botão de tema, navegação e ano
vercel.json         configuração da Vercel
assets/
  favicon.svg
  fonts/            Anton, Instrument Serif e Plus Jakarta Sans (hospedadas no site)
  curriculo-henrique-moraes.pdf
  img/              suas fotos e capas (veja assets/img/LEIA-ME.txt)
```

## Antes de publicar

1. Coloque suas imagens em `assets/img/` com os nomes do `LEIA-ME.txt`.
2. Quando tiver páginas de estudo de caso, troque o `href` de cada card de projeto em `index.html` (hoje apontam para o seu Behance).
3. Troque os títulos dos artigos do card do Medium pelos seus textos reais.
4. Para atualizar o currículo, substitua `assets/curriculo-henrique-moraes.pdf` mantendo o mesmo nome.

## Publicar na Vercel

**Opção 1, pelo GitHub (recomendado):**
1. Crie um repositório no GitHub e envie esta pasta.
2. Em vercel.com, clique em **Add New → Project** e importe o repositório.
3. Em *Framework Preset* deixe **Other**. Não precisa de Build Command nem Output Directory.
4. Clique em **Deploy**. A cada `git push`, o site atualiza sozinho.

**Opção 2, pelo terminal:**
```
npm i -g vercel
vercel        # primeira vez: responde às perguntas
vercel --prod # publica em produção
```

Para usar domínio próprio: no projeto da Vercel, vá em **Settings → Domains**.

## Testar no computador

Rode `npx serve .` na pasta e abra o endereço que aparecer. (Abrir o `index.html` direto também funciona.)

## Breakpoints

| Faixa | Largura |
|---|---|
| Desktop grande | 1280px ou mais |
| Desktop | 1024 a 1279px |
| Tablet | 641 a 1023px |
| Celular | até 640px |
