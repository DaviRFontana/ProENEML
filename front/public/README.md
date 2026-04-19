# ProENEM Lab — Front (arquivos estáticos)

Este diretório contém o **front-end estático** do projeto (HTML/CSS/JS puros). Ele roda em qualquer servidor estático e hoje inclui principalmente:

- **Autenticação** (login/cadastro)
- **Políticas de privacidade e termos de uso**
- **Tema** (claro/escuro/sistema) persistido via `localStorage`

## Estrutura

- `pages/`: páginas HTML
  - `authentication_login.html`: login
  - `authentication_register.html`: cadastro
  - `policies.html`: políticas / termos
- `css/`: estilos e animações
  - `presets.css`: tokens globais, tema e toolbar de tema
  - `animations.css`: `@keyframes` (feedback/validação)
  - `authentication.css`: layout e UI do módulo de autenticação
  - `authentication_register.css`: ajustes específicos do cadastro
  - `policies.css`: estilos da página de políticas
- `js/`: scripts
  - `auth.js`: validação do formulário e alternância mostrar/ocultar senha
  - `general_system.js`: tema (atributo `data-theme` no `<html>` + `aria-current`)
- `images/`: assets do front

## Como rodar localmente

O ideal é abrir via **servidor estático** (evita diferenças de caminho/cache e simula melhor deploy).

### Opção A — VS Code / Cursor (Live Server)

- Abra a pasta `front/public/`
- Inicie o Live Server e navegue para `pages/authentication_login.html`

### Opção B — Python (se tiver instalado)

No terminal, dentro de `front/public/`:

```bash
python -m http.server 5500
```

Depois acesse `http://localhost:5500/pages/authentication_login.html`.

## Páginas

- **Login**: `pages/authentication_login.html`
- **Cadastro**: `pages/authentication_register.html`
- **Políticas**: `pages/policies.html`

## Checklist rápido de teste

- **Tema**: botões (claro/escuro/sistema), recarregar página e confirmar persistência.
- **Login/Cadastro**: validação (email, senha; e apelido/termos no cadastro).
- **Senha visível**: alternância mostrar/ocultar e atributos ARIA (`aria-pressed` / `aria-label`).
- **Responsividade**: retrato, até 1024px e telas “baixas” (altura pequena).

---

## Guia rápido: CSS (tema e responsividade)

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

## Guia rápido: JavaScript (tema e autenticação)

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

## Convenções importantes (IDs esperados)

Alguns comportamentos dependem de IDs específicos no HTML:

- **Form**: `auth_form_content`
- **Botão submit**: `auth_form_content_submit_button`
- **Email**: `auth_form_content_email_input` + erro `auth_form_content_email_title_error`
- **Senha**: `auth_form_content_password_input` + erro `auth_form_content_password_title_error`
- **Toggle senha**: `auth_form_content_password_toggle`
- **Cadastro** (quando existir): `auth_form_content_username_input`, `auth_form_content_terms_checkbox`, `auth_form_content_terms_error`

Se você renomear IDs no HTML, ajuste os seletores em `js/auth.js` e valide se os estilos ainda batem com os seletores em `css/authentication.css`.
