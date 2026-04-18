# Módulo de autenticação (front estático)

Este documento descreve o que foi otimizado na pasta `public` relacionada a login/cadastro, como reproduzir o comportamento visual (CSS) e o fluxo em JavaScript.

## Arquivos envolvidos

| Arquivo | Função |
|--------|--------|
| `pages/authentication_login.html` | Página de login |
| `pages/authentication_register.html` | Página de cadastro |
| `css/presets.css` | Variáveis globais, tema claro/escuro, toolbar de tema |
| `css/animations.css` | `@keyframes` usados no formulário e validação |
| `css/authentication.css` | Layout responsivo, formulário, painel lateral decorativo |
| `css/authentication_register.css` | Ajustes extras só na página de registro |
| `js/auth.js` | Validação do formulário e alternância mostrar/ocultar senha |
| `js/general_system.js` | Persistência do tema (`localStorage`) e `aria-current` nos botões |

## Otimizações aplicadas

### CSS (`authentication.css`)

- **Media queries unificadas**: as regras que escondem `#auth_style_container` e aplicam o fundo em `#auth_form_container` estavam repetidas em `(orientation: portrait), (max-width: 1024px)` e em `(max-height: 767px)`. Passaram a um único bloco com condição composta por **vírgula** (OU lógico): `(orientation: portrait), (max-width: 1024px), (max-height: 767px)`. O bloco `(max-height: 767px)` mantém apenas o que é específico dali (grid do `body` e título oculto).

### JavaScript (`auth.js`)

- **Constantes** para strings de animação e tempos, evitando repetição e o erro anterior de espaço em branco antes do nome da animação ao “resetar”.
- **Helpers** `clearError`, `flashFieldError`, `resetButtonAnim` para centralizar o padrão animação + `setTimeout`.
- **Validação de e-mail** com expressão regular simples (`EMAIL_OK`) em vez de apenas `includes("@")`.
- **Termos no cadastro**: mensagem de termos não aceitos vai para `#auth_form_content_terms_error` quando existir (página de registro), com fallback para o erro da senha só onde não houver elemento de termos.
- **Envio do formulário**: o handler é registrado com `submit` em `#auth_form_content` no `DOMContentLoaded`, removendo `onclick` inline do HTML (melhor cache, CSP e manutenção).

### JavaScript (`general_system.js`)

- **Lista única** `THEME_TOGGLE_IDS` para IDs dos três botões, usada tanto na sincronização do `aria-current` quanto nos listeners, evitando repetir os mesmos literais.

### HTML

- Botões de envio sem `onclick`; o comportamento fica em `auth.js`.

---

## Como replicar a lógica do CSS

### Variáveis (`:root` e `html[data-theme]`)

Em `authentication.css`, tokens como `--auth-form-width` e URLs de arte (`--auth-art-1` …) definem tamanhos fluidos e imagens. O tema manual sobrescreve o automático:

- `html[data-theme="light"]` e `html[data-theme="dark"]` definem URLs e `--auth-style-background`.
- `:root:not([data-theme])` dentro de `@media (prefers-color-scheme: light|dark)` aplica o padrão quando o JS remove `data-theme` (modo sistema).

**Para replicar**: declare variáveis em `:root`, depois especialize com `html[data-theme="..."]` e, se quiser sistema, `@media (prefers-color-scheme: ...) { :root:not([data-theme]) { ... } }`.

### Operadores e lógica em `@media`

| Sintaxe | Significado |
|--------|-------------|
| `,` entre consultas | **OU**: qualquer condição verdadeira aplica o bloco. Ex.: `(orientation: portrait), (max-width: 1024px)`. |
| `and` | **E**: todas as condições precisam ser verdadeiras. Ex.: `(min-width: 1025px) and (orientation: landscape)`. |
| `not` | Inverte uma media feature (menos comum neste projeto). |

Exemplo do projeto: telas largas em paisagem usam grid em duas colunas; retrato ou até 1024px empilham o layout.

### Funções CSS usadas (valores calculados)

| Função | Uso aqui |
|--------|-----------|
| `clamp(mín, preferido, máx)` | Tipografia e espaçamentos que escalam entre limites. |
| `min(a, b)` / `max(a, b)` | Larguras/alturas máximas e `padding` com *safe area* (`max(0.75rem, env(safe-area-inset-...))`). |
| `calc()` | Ex.: `calc(var(--z-modal) + 1)` ou `calc(-1 * var(--auth-layer-pop-y))`. |
| `color-mix(in srgb, cor1 %, cor2 %)` | Bordas e fundos sutis misturando cor do texto e fundo. |
| `env(safe-area-inset-*)` | Respeita entalhes e barras do sistema em dispositivos móveis. |

### Pseudoclasses e pseudoelementos

| Seletor | Papel |
|---------|--------|
| `:focus` | Campo ativo: opacidade e borda de destaque. |
| `:focus-visible` | Foco por teclado: anel ou sombra sem duplicar foco de mouse. |
| `:focus-within` no container | Quando qualquer filho focado, estiliza rótulo ou dica (ex.: cor do título do campo). |
| `:hover` | Botões, camada artística, checkbox custom. |
| `:checked` | Checkbox dos termos: altera `::before` e mostra o SVG irmão (`+`). |
| `:empty` | Esconde `.auth_form_content_terms_error` quando não há texto. |
| `:not([data-theme])` | `:root` sem tema forçado → segue `prefers-color-scheme`. |
| `::before` | Checkbox: “caixa” desenhada; `body::before` no tema escuro força camada de fundo. |
| `::-ms-reveal` / `::-ms-clear` | Esconde controles nativos de senha no Edge legado. |
| `[aria-pressed="true"]` / `:not([aria-pressed="true"])` | Troca ícones SVG do botão de mostrar senha. |

### Seletores de atributo

Ex.: `.auth_form_content_password_toggle[aria-pressed="false"]` combina classe + estado ARIA para CSS puro alinhado ao que o JS atualiza.

### Animações

Nomes como `fade_in_rest_auth` estão definidos em `animations.css` e referenciados com `animation: nome duração easing;` nos componentes do formulário.

---

## Como replicar as funções do JavaScript

### `general_system.js`

1. **`applySavedTheme` (IIFE)**  
   Executa ao carregar o script: lê `localStorage` (`auth_theme`). Se for `"light"` ou `"dark"`, aplica `document.documentElement.setAttribute("data-theme", ...)`.

2. **`sync_theme_toggle_brightness_from_storage()`**  
   Lê de novo o `localStorage`, decide qual dos três botões deve ter `aria-current="true"` e remove esse atributo dos outros.

3. **`toggle_theme(theme)`**  
   - `"system"`: remove `data-theme` do `<html>` e apaga a chave do `localStorage`.  
   - `"light"` / `"dark"`: grava `data-theme` e persiste no `localStorage`.  
   Chama `sync_theme_toggle_brightness_from_storage()` ao final.

4. **`DOMContentLoaded`**  
   Sincroniza ARIA e associa `click` em cada botão a `toggle_theme("light"|"dark"|"system")`.

**Para replicar em outra página**: inclua os três botões com os mesmos IDs, `presets.css` e `general_system.js`; a toolbar já estilizada em `presets.css`.

### `auth.js`

1. **`clearError(el)`**  
   Limpa texto e zera animação inline do elemento de erro.

2. **`flashFieldError(el, message)`**  
   Define mensagem, aplica `ANIM_FIELD` e agenda `clearError` após `FIELD_ERR_MS`.

3. **`resetButtonAnim(btn, ms)`**  
   Após `ms` milissegundos, define `animation: none` no botão (fim do feedback visual).

4. **`verify_authentication(e)`**  
   - `e.preventDefault()` no evento `submit`.  
   - Obtém referências aos campos e erros pelo `id`.  
   - Limpa todos os erros.  
   - Calcula `userOk`, `emailOk`, `passOk`, `termsOk` (usuário só conta se existir campo de usuário).  
   - Se inválido: animação de erro no botão + `flashFieldError` nos campos com problema; termos usam `#auth_form_content_terms_error` se existir.  
   - Se válido: animação curta de sucesso no botão.

5. **`initPasswordToggle()`**  
   Alterna `type` entre `password` e `text`, atualiza `aria-pressed` e `aria-label`.

6. **`DOMContentLoaded`**  
   - `document.getElementById("auth_form_content")?.addEventListener("submit", verify_authentication)`  
   - `initPasswordToggle()`

**Para replicar o fluxo de validação**: mantenha os mesmos `id`s ou ajuste os seletores no topo de `verify_authentication`; garanta que o `<form>` tenha `id="auth_form_content"` e que `animations.css` esteja linkado para as `@keyframes` usadas nas strings `ANIM_*`.

---

## Como testar localmente

Abra os HTML pelo servidor estático ou diretamente no navegador (alguns recursos podem se comportar melhor com servidor):

- Login: `pages/authentication_login.html`
- Cadastro: `pages/authentication_register.html`

Verifique: troca de tema, validação com campos inválidos, aceite dos termos no cadastro, botão de mostrar/ocultar senha e layout em largura estreita, paisagem e altura baixa (`max-height`).
