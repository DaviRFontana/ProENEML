# ProENEM Lab — Front (arquivos estáticos)

Este diretório contém o **front-end estático** do projeto (HTML/CSS/JS puros). Ele roda em qualquer servidor estático.

## O que tem aqui

- **Autenticação**: login e cadastro
- **Políticas**: termos de uso e privacidade
- **Tema**: claro/escuro/sistema (persistido via `localStorage`)

## Estrutura de pastas

- **`pages/`**: páginas HTML
  - **`authentication_login.html`**: login
  - **`authentication_register.html`**: cadastro
  - **`policies.html`**: políticas / termos
- **`css/`**: estilos
  - **`presets.css`**: tokens globais e toolbar de tema
  - **`animations.css`**: `@keyframes` (feedback/validação)
  - **`authentication.css`**: layout e UI do módulo de autenticação
  - **`authentication_register.css`**: ajustes específicos do cadastro
  - **`policies.css`**: estilos da página de políticas
- **`js/`**: scripts
  - **`auth.js`**: validação do formulário, mostrar/ocultar senha e força da senha (cadastro)
  - **`general_system.js`**: tema (atributo `data-theme` no `<html>` + `aria-current`)
- **`images/`**: assets do front

## Como rodar localmente

Abra via **servidor estático** (ajuda com caminhos relativos, cache e simula melhor o deploy).

### Opção A — Live Server (Cursor/VS Code)

- Abra a pasta `front/public/`
- Inicie o Live Server e abra `pages/authentication_login.html`

### Opção B — Python

No terminal, dentro de `front/public/`:

```bash
python -m http.server 5500
```

Depois abra `http://localhost:5500/pages/authentication_login.html`.

## Páginas (atalhos)

- **Login**: `pages/authentication_login.html`
- **Cadastro**: `pages/authentication_register.html`
- **Políticas**: `pages/policies.html`

## Checklist rápido de teste

- **Tema**: claro/escuro/sistema, recarregar e confirmar persistência
- **Validação**: email e senha; no cadastro também apelido e termos
- **Senha visível**: alternância mostrar/ocultar + ARIA (`aria-pressed`, `aria-label`)
- **Responsividade**: retrato, até 1024px e telas com pouca altura

---

## Referência rápida (IDs importantes)

Alguns comportamentos dependem de IDs específicos no HTML:

- **Form**: `auth_form_content`
- **Botão submit**: `auth_form_content_submit_button`
- **Email**: `auth_form_content_email_input` + erro `auth_form_content_email_title_error`
- **Senha**: `auth_form_content_password_input` + erro `auth_form_content_password_title_error`
- **Toggle senha**: `auth_form_content_password_toggle`
- **Cadastro**: `auth_form_content_username_input`, `auth_form_content_terms_checkbox`, `auth_form_content_terms_error`

Se você renomear IDs no HTML, ajuste os seletores em `js/auth.js` e confira os seletores em `css/authentication.css`.
