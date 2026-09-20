# rpg-tools

Fichas de personagem interativas em HTML puro, feitas para usar no celular durante a sessão.

## Fichas

| Personagem | Arquivo | Link (GitHub Pages) |
|---|---|---|
| Vaelun — Changeling, Bruxo (Lâmina Maldita) nível 3 | `sheets/vaelun/` | https://matheusdubin.github.io/rpg-tools/sheets/vaelun/ |
| Sokomo Kudiome — Humano, Bardo (Colégio do Conhecimento) nível 3 | `sheets/sokomo/` | https://matheusdubin.github.io/rpg-tools/sheets/sokomo/ |

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

O motor da ficha é compartilhado: `shared/sheet.js` monta a página inteira (abas Combate,
Magias, Atributos, Traços, Mais; cálculos; pips; salvamento; descansos) a partir do objeto
`window.CHAR` definido em `sheets/<nome>/char.js`. `shared/sheet.css` tem o visual.

Cada ficha fica em `sheets/<nome>/` com `index.html` (só carrega os scripts), `char.js` (os
dados do personagem), `manifest.webmanifest` (ícone na tela de início), `sw.js` (cache para
uso offline) e `icon.svg`.

### Criar uma ficha nova

1. Copie a pasta `sheets/sokomo/` para `sheets/<nome>/`.
2. Edite `char.js`: `id`, `name`, `subtitle`, `level`, `scores`, `saves`, `skills`, `spellcasting`
   (`slots` é um array por nível: `[4,2]` = 4 de 1º e 2 de 2º; `slotRecharge` é `long` ou
   `short`), `resources` (contadores com pips), `attacks`, `spells`, `features` etc.
3. Nos textos, chaves entre chaves viram números calculados: `{dc}`, `{spellAtk}`, `{prof}`,
   `{level}`, `{cha}`/`{chaS}` (modificador sem/com sinal), `{sk_persuasao}` (perícia, nome sem
   acento), `{atk_ID}`/`{dmg_ID}` (ataque com aquele `id`), `{ac}`, `{ini}` e o que `extraVars`
   devolver.
4. Troque o título e o `short_name` em `index.html` e `manifest.webmanifest`, a letra em
   `icon.svg` e o nome do cache em `sw.js`.
5. Adicione o link em `index.html` da raiz.
