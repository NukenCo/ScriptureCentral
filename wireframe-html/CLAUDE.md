# Wireframe HTML — ScriptureCentral

> Atualizado: esta pasta deixou de ser só baixa-fidelidade. Ela agora também
> recebe implementações pixel-fiéis portadas diretamente do Figma, usando os
> tokens de `../design/tokens.css` como fonte única de cor/tipografia/espaçamento.

Fidelidade: **alta** para as telas portadas do Figma (ex: `index.html`,
frame "Template" / node 302:617 do arquivo Playground) — cores reais,
tipografia real (General Sans + DM Serif Text), assets exportados do Figma
em `assets/`. HTML/CSS puro, sem build tool — abre direto no navegador.

Se uma tela ainda não tiver sido desenhada em alta fidelidade no Figma, é
válido prototipar aqui em baixa fidelidade (sem cor real, sem imagens finais)
só para validar layout e hierarquia antes de ir para o Figma — mas isso deixou
de ser a única finalidade da pasta.

Skill instalada: frontend-design (via npx skills add). Usar para revisar a
qualidade visual do HTML/CSS desta pasta.

## Responsividade (mobile + desktop)

Cada tela é desenhada duas vezes no Figma — mobile (~390px) e desktop
(1920px) — mas vira **um único arquivo HTML**, nunca dois. O CSS é
mobile-first; as regras de desktop entram logo depois das regras mobile do
mesmo componente, no mesmo arquivo/seção, via:

```css
.componente { /* regras mobile */ }

@media (min-width: 1280px) {
  .componente { /* regras desktop, a partir daqui */ }
}
```

- Breakpoint fixo: `1280px` (cobre notebooks comuns, não só monitores full
  HD). Não existe breakpoint de tablet — só mobile e desktop.
- Container desktop: `var(--container-desktop)` (1200px, definido em
  `../design/tokens.css`) — escala o frame de 1920px do Figma para uma
  largura de leitura confortável, centralizada.
- `wireframe-html/legacy/` guarda telas descontinuadas só como referência
  histórica (ex: o `index.html` anterior ao redesign do carousel de 7 dias)
  — não fazem parte do fluxo do app e não recebem o gate de senha.
