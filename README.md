# rpg-tools

Fichas de personagem interativas em HTML puro, feitas para usar no celular durante a sessão.

## Fichas

| Personagem | Arquivo | Link (GitHub Pages) |
|---|---|---|
| Vaelun — Changeling, Bruxo (Lâmina Maldita) nível 3 | `sheets/vaelun/index.html` | https://matheusdubin.github.io/rpg-tools/sheets/vaelun/ |

## Como usar no iPhone

Abrir o arquivo `.html` baixado pelo app **Arquivos** não funciona: o iOS mostra a página no
Quick Look, que renderiza o HTML mas **não executa JavaScript**. Por isso nada respondia ao toque.

O jeito que funciona é abrir a ficha **pelo Safari, hospedada no GitHub Pages**:

1. No GitHub, vá em **Settings → Pages**, em *Build and deployment* escolha
   **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
   (Só precisa fazer isso uma vez; leva um ou dois minutos para publicar.)
2. No iPhone, abra https://matheusdubin.github.io/rpg-tools/sheets/vaelun/ no Safari.
3. Toque em **Compartilhar → Adicionar à Tela de Início**. A ficha vira um "app" em tela cheia
   e continua funcionando mesmo sem internet depois do primeiro acesso.

Tudo que você muda (PV, espaços de magia, anotações, moedas…) é salvo automaticamente no
próprio aparelho. Para levar a ficha para outro aparelho, use o botão **Dados** → *Copiar código*
ou *Baixar arquivo* e depois *Carregar do texto* / *Abrir arquivo* no outro.

## Desenvolvimento

Não há build. Para testar localmente:

```sh
python3 -m http.server 8000
# abra http://localhost:8000/sheets/vaelun/
```

A ficha é dividida em abas (Combate, Magias, Atributos, Traços, Mais). Os textos de magias e
características ficam nos arrays `SPELLS` e `FEATURES` dentro do `index.html`; chaves entre
chaves como `{dc}` são trocadas pelos números calculados da ficha.

Cada ficha fica em `sheets/<nome>/` com `index.html`, `manifest.webmanifest` (ícone na tela de
início), `sw.js` (cache para uso offline) e `icon.svg`.
