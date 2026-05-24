# RankAndRent — Gulf Blvd Ecosystem

Monorepo com sites Astro de Rank-and-Rent para serviços locais em Gulf Boulevard, FL (Pinellas County). Adaptado do modelo Murrieta, CA. Cada site é independente (sem código compartilhado), mas segue a mesma arquitetura Astro.

## Language

All content, copy, components, page text, meta descriptions, blog posts, and commit messages must be written in **English**. This is a US market project targeting English-speaking customers in Pinellas County, FL.

---

## Inventário dos Sites

| Site | Porta dev | Domínio | Config central |
|---|---|---|---|
| `screen-repair` | 4324 | gulfblvdrescreening.com | `screen-repair/src/config.ts` |
| `concrete` | 4325 | gulfblvdconcrete.com | `concrete/src/config.ts` |
| `tree-service` | 4326 | gulfblvdtreeexperts.com | `tree-service/src/config.ts` |
| *(site 4 — TBD)* | 4327 | TBD | TBD |
| `landscaping` | 4328 | gulfblvdlandscape.com | `landscaping/src/config.ts` |

O ecossistema está crescendo. Quando novos sites forem adicionados, atualizar esta tabela e registrar a porta de dev (usar 4325, 4326, ... em sequência).

---

## Regras para Agentes

### Escopo — declare sempre ao iniciar

**Modo single-site:** toque APENAS em `gulf-blvd-ecosystem/{site}/`. Não leia nem modifique os outros sites.

**Modo cross-site:** aplique a mesma mudança nos sites relevantes. Use sub-agentes paralelos (um por site) ou aplique sequencialmente. Documente por que é cross-site.

**Fronteira de ecossistema:** Este é um repositório dedicado exclusivamente ao Gulf Blvd Ecosystem (Pinellas County, FL). Outros ecossistemas geográficos (ex: Murrieta, CA) vivem em repositórios separados.

---

### Componentes Estruturais — replicar entre sites quando houver mais de um

Quando houver ≥2 sites neste ecossistema, mudanças nesses arquivos devem ser aplicadas em todos:

- `src/components/Nav.astro`
- `src/components/Footer.astro`
- `src/components/Hero.astro`
- `src/layouts/BaseLayout.astro`
- `tailwind.config.mjs` — estrutura e plugins (não as cores de brand)
- `astro.config.mjs` — plugins e integrações

Se a mudança for intencional em apenas 1 site, documente o motivo no commit.

---

### Componentes de Conteúdo — podem variar por site

- `src/pages/` — copy SEO específica do nicho
- `src/content/blog/` — posts específicos
- `src/components/ServiceCard.astro` — copy dos serviços
- `public/` — imagens e favicon
- `tailwind.config.mjs` — apenas as cores de brand (`primary`, `accent`, `cta`)

---

### Dados de Negócio — nunca hardcode em componentes

Telefone, email, nome, domínio, serviços = sempre via `src/config.ts` (`SITE_CONFIG`).

**Exceção conhecida:** `areaServed` em `BaseLayout.astro` está hardcoded (as 8 cidades do Gulf Blvd corridor). É específico de cada site e pode permanecer assim até refatoração futura.

---

### BaseLayout.astro — Como Adicionar Props Corretamente

O `BaseLayout.astro` já tem um bloco `interface Props` definido. **Nunca declare um segundo `interface Props`** — isso duplica a interface e não causa erro de build no Astro (TypeScript em modo lenient), mas cria confusão e comportamento inesperado.

**Correto — adicionar ao bloco existente:**
```typescript
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  aggregateRating?: { ratingValue: string; reviewCount: string }; // ← adicione aqui
}
```

**Props opcionais de schema (FAQPage, HowTo, etc.):** não adicionar ao BaseLayout. Em vez disso, inserir um `<script type="application/ld+json">` diretamente na página que o usa — é o padrão já estabelecido no projeto.

Props já existentes no BaseLayout (screen-repair):
- `title`, `description`, `canonicalUrl`, `ogImage` — básicos
- `aggregateRating?: { ratingValue, reviewCount }` — injeta no schema quando fornecido

---

### GA4 / gtag — Regra Obrigatória no Astro

Scripts do GA4 em qualquer `BaseLayout.astro` **devem** ter `is:inline` e atribuir `window.gtag` explicitamente:

```html
<!-- correto -->
<script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);}
  window.gtag('js', new Date());
  window.gtag('config', 'G-XXXXXX');
</script>
```

**Por quê:** Astro processa `<script>` sem `is:inline` como ES module (adiciona `type="module"` implicitamente). Em ES modules, `function gtag(){}` é local ao módulo e nunca vira `window.gtag`. Componentes que tentam chamar `window.gtag` recebem `undefined` e todos os eventos customizados do GA4 são silenciosamente descartados — sem erro no console, sem indício de falha.

**Sintoma:** `page_view` e `form_start` chegam ao GA4 (eventos automáticos do script externo), mas eventos custom como `generate_lead` e `phone_click` nunca aparecem — nem no Realtime, nem no Events.

Em componentes (LeadForm, Nav, etc.) que chamam gtag, sempre usar bracket notation:

```js
if (typeof (window as any).gtag === 'function') {
  (window as any).gtag('event', 'nome_do_evento', { event_category: '...', event_label: '...' });
}
```

**IDs GA4 por site:**
| Site | ID |
|---|---|
| screen-repair | `G-XXXXXXXXXX` ← **PLACEHOLDER — substituir antes do go-live** |
| concrete | `G-XXXXXXXXXX` ← **PLACEHOLDER — substituir antes do go-live** |

---

### OG Images — Convenção

Imagens referenciadas em `<meta property="og:image">` **devem estar em `public/images/`**, não em `src/assets/images/`. Arquivos em `src/assets/` são processados pelo pipeline do Astro e não acessíveis como URLs estáticas nos meta tags.

| Site | OG image padrão | Status |
|---|---|---|
| screen-repair | `public/images/hero.jpg` | ⚠️ **ARQUIVO AINDA NÃO EXISTE** |
| concrete | `public/images/hero.jpg` | ⚠️ **ARQUIVO AINDA NÃO EXISTE** |

O default no `BaseLayout.astro` do screen-repair é `ogImage = '/images/hero.jpg'`. Este arquivo precisa ser criado manualmente (foto real 1200×630px, tema pool cage / Gulf Coast) antes do go-live.

---

### ⚠️ Pendências Pré-Go-Live

#### screen-repair
- [ ] Substituir `(727) 555-0100` pelo número real em `screen-repair/src/config.ts`
- [ ] Substituir `G-XXXXXXXXXX` pelo ID real do GA4 em `screen-repair/src/layouts/BaseLayout.astro` (2 ocorrências)
- [ ] Criar `screen-repair/public/images/hero.jpg` (foto real 1200×630px — pool cage ou Gulf Coast)
- [ ] Configurar `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_EMAIL`, `OWNER_EMAIL` no dashboard do Vercel (não commitar `.env` com chaves reais)
- [ ] Adicionar arquivo de verificação do Google Search Console em `screen-repair/public/`
- [x] Domínio `gulfblvdrescreening.com` confirmado e configurado em `screen-repair/astro.config.mjs`

#### concrete
- [ ] Substituir `(727) 555-0200` pelo número real em `concrete/src/config.ts`
- [ ] Substituir `G-XXXXXXXXXX` pelo ID real do GA4 em `concrete/src/layouts/BaseLayout.astro` (2 ocorrências)
- [ ] Criar `concrete/public/images/hero.jpg` (foto real 1200×630px — pool deck ou driveway FL)
- [ ] Configurar `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_EMAIL`, `OWNER_EMAIL` no dashboard do Vercel
- [ ] Adicionar arquivo de verificação do Google Search Console em `concrete/public/`
- [ ] Confirmar domínio `gulfblvdconcrete.com` e atualizar `site:` no `concrete/astro.config.mjs`
- [ ] Configurar projeto Vercel: Root Directory = `gulf-blvd-ecosystem/concrete`, enable "files outside root"

#### tree-service
- [ ] Substituir `(727) 555-0326` pelo número real em `tree-service/src/config.ts`
- [ ] Substituir `G-XXXXXXXXXX` pelo ID real do GA4 em `tree-service/src/layouts/BaseLayout.astro` (2 ocorrências)
- [ ] Criar `tree-service/public/images/hero.jpg` (foto real 1200×630px — tree service / Gulf Coast FL)
- [ ] Configurar `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_EMAIL`, `OWNER_EMAIL` no dashboard do Vercel
- [ ] Adicionar arquivo de verificação do Google Search Console em `tree-service/public/`
- [ ] Confirmar domínio `gulfblvdtreeexperts.com` e atualizar `site:` no `tree-service/astro.config.mjs`
- [ ] Configurar projeto Vercel: Root Directory = `gulf-blvd-ecosystem/tree-service`, enable "files outside root"

#### landscaping
- [ ] Substituir `(727) 555-0400` pelo número real em `landscaping/src/config.ts`
- [ ] Substituir `G-XXXXXXXXXX` pelo ID real do GA4 em `landscaping/src/layouts/BaseLayout.astro` (2 ocorrências)
- [ ] Criar `landscaping/public/images/hero.jpg` (foto real 1200×630px — jardim tropical Gulf Coast)
- [ ] Configurar `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_EMAIL`, `OWNER_EMAIL` no dashboard do Vercel
- [ ] Adicionar arquivo de verificação do Google Search Console em `landscaping/public/`
- [x] Domínio `gulfblvdlandscape.com` confirmado e configurado em `landscaping/astro.config.mjs`
- [ ] Configurar projeto Vercel: Root Directory = `gulf-blvd-ecosystem/landscaping`, enable "files outside root"

**⚠️ Segurança:** Nunca commitar `.env` com valores reais. O `.gitignore` já exclui `.env*`. Usar variáveis de ambiente no dashboard do Vercel para produção.

---

### Diferenças Arquiteturais em Relação ao Murrieta Ecosystem

Esta seção existe para evitar retrabalho. Ao portar padrões do Murrieta, verifique cada item:

| Aspecto | Murrieta | Gulf Blvd (este ecossistema) |
|---|---|---|
| Schema type | `LocalBusiness` | `HomeAndConstructionBusiness` |
| City pages URL | `/temecula/`, `/wildomar/` (root) | `/cities/indian-rocks-beach/` (subfolder) |
| CrossLinkWidget | Sim (Footer cross-linka os 3 sites) | A implementar quando houver ≥2 sites |
| Footer 3ª coluna | Links para sites irmãos | Links para as cidades do Gulf Blvd (por ora) |
| Hero `badges` prop | Hardcoded por site | Prop `badges?: string[]` aceita override por página |
| Contexto geográfico | Inland Southern CA, Santa Ana winds | Gulf Coast FL, salt air corrosion, hurricane season |
| Material diferenciador | — | Nylo-Tec / stainless fasteners vs. steel que enferruja em salt air |
| Inseto-alvo | — | No-see-ums (Culicoides) → require 20×20 mesh (padrão 18×14 não bloqueia) |
| AggregateRating placeholder | tree: 4.9/87 \| land: 4.8/62 \| concrete: 4.9/74 | screen-repair: 4.9/94 \| concrete: 4.9/81 |

---

### Inventário de Páginas por Site

#### screen-repair (estado atual — maio 2026)

**Service pages (7):**
- `/services/pool-cage-rescreening`
- `/services/screen-panel-repair`
- `/services/lanai-porch-screening`
- `/services/pet-screen-installation`
- `/services/storm-damage-repair`
- `/services/screen-door-repair`
- `/services/screw-fastener-replacement`

**City pages (8):**
- `/cities/indian-rocks-beach` | `/cities/indian-shores` | `/cities/redington-shores` | `/cities/redington-beach`
- `/cities/madeira-beach` | `/cities/treasure-island` | `/cities/st-pete-beach` | `/cities/clearwater-beach`

**Blog posts (10):**
- `pool-cage-rescreening-cost-st-pete-beach.md`
- `storm-damage-screen-repair-gulf-blvd.md`
- `best-pool-cage-rescreening-madeira-beach.md`
- `how-long-pool-cage-screen-last-florida.md`
- `pet-screen-vs-standard-screen-florida.md`
- `rusted-pool-cage-screws-gulf-coast.md`
- `airbnb-property-screen-repair-treasure-island.md`
- `lanai-door-screen-repair-clearwater.md`
- `pool-enclosure-rescreening-indian-rocks-beach.md`
- `porch-screening-services-indian-shores.md`

> Antes de criar uma nova página, verificar o inventário acima — evita duplicatas.

#### tree-service (estado atual — maio 2026)

**Service pages (7):**
- `/services/tree-removal` | `/services/tree-trimming` | `/services/tree-pruning`
- `/services/stump-grinding` | `/services/emergency-tree-service` | `/services/land-clearing`
- `/services/tree-planting`

**City pages (8):**
- `/cities/indian-rocks-beach` | `/cities/indian-shores` | `/cities/redington-beach` | `/cities/redington-shores`
- `/cities/north-redington-beach` | `/cities/madeira-beach` | `/cities/treasure-island` | `/cities/st-pete-beach`

**Blog posts (10):**
- `hurricane-tree-prep-gulf-blvd.md` (featured, HowTo schema)
- `emergency-tree-service-after-hurricane.md` (featured, HowTo schema)
- `tree-removal-cost-gulf-blvd-fl.md`
- `pinellas-county-tree-permit-guide.md`
- `salt-air-tree-damage-gulf-coast.md`
- `sabal-palm-trimming-gulf-blvd.md`
- `live-oak-pruning-florida.md`
- `stump-grinding-cost-florida.md`
- `best-trees-for-gulf-blvd-florida.md`
- `tree-service-vacation-rental-gulf-blvd.md`

#### landscaping (estado atual — maio 2026)

**Service pages (5):**
- `/services/lawn-care` | `/services/landscape-design` | `/services/hurricane-storm-prep`
- `/services/irrigation-systems` | `/services/mulching-ground-cover`

**City pages (8):**
- `/cities/indian-rocks-beach` | `/cities/indian-shores` | `/cities/redington-beach` | `/cities/redington-shores`
- `/cities/north-redington-beach` | `/cities/madeira-beach` | `/cities/treasure-island` | `/cities/st-pete-beach`

**Blog posts (10):**
- `st-augustine-grass-lawn-care-gulf-blvd.md` (featured, HowTo schema)
- `hurricane-landscape-prep-gulf-blvd.md` (featured, HowTo schema)
- `salt-tolerant-plants-gulf-blvd-florida.md`
- `tropical-landscape-design-gulf-coast-florida.md`
- `swfwmd-irrigation-watering-restrictions-gulf-blvd.md`
- `lawn-care-vacation-rental-gulf-blvd.md`
- `mulching-guide-florida-coastal-garden.md`
- `hoa-landscaping-rules-pinellas-county-condos.md`
- `bougainvillea-care-gulf-coast-florida.md`
- `lawn-fertilizer-schedule-florida-gulf-coast.md`

---

#### concrete (estado atual — maio 2026)

**Service pages (12):**
- `/services/concrete-driveways` | `/services/pool-deck-resurfacing` | `/services/concrete-patios`
- `/services/concrete-walkways-sidewalks` | `/services/concrete-repair` | `/services/decorative-concrete`
- `/services/marine-grade-concrete-sealing` | `/services/concrete-walls` | `/services/concrete-foundations`
- `/services/concrete-slabs` | `/services/mudjacking-slab-leveling` | `/services/concrete-overlay`

**City pages (8):**
- `/cities/indian-rocks-beach` | `/cities/indian-shores` | `/cities/redington-shores` | `/cities/redington-beach`
- `/cities/madeira-beach` | `/cities/treasure-island` | `/cities/st-pete-beach` | `/cities/clearwater-beach`

**Blog posts (28):**
- `concrete-pool-deck-cost-st-pete-beach.md` | `pool-deck-resurfacing-clearwater-fl.md`
- `stamped-concrete-gulf-coast-fl.md` | `stamped-vs-plain-concrete-pool-deck.md`
- `best-time-pour-concrete-florida-heat.md` | `concrete-curing-time-florida-humidity.md`
- `why-concrete-cracks-florida-humidity.md` | `concrete-efflorescence-salt-air.md`
- `salt-air-concrete-damage-gulf-blvd.md` | `marine-grade-concrete-sealing-fl.md`
- `concrete-vs-pavers-pool-deck-florida.md` | `concrete-vs-travertine-pool-deck.md`
- `concrete-driveway-vs-paver-florida.md` | `concrete-driveway-home-value-florida.md`
- `concrete-driveway-cost-gulf-blvd.md` | `hurricane-resistant-concrete-foundations.md`
- `concrete-pool-cage-base-installation.md` | `how-long-concrete-driveway-last-florida.md`
- `concrete-patio-ideas-coastal-florida.md` | `outdoor-living-concrete-gulf-coast.md`
- `patio-ideas-gulf-blvd-fl.md` | `concrete-patio-vs-wood-deck-florida.md`
- `slab-leveling-florida-soil.md` | `small-concrete-jobs-gulf-blvd.md`
- `concrete-permits-pinellas-county.md` | `concrete-contractor-insurance-florida.md`
- `how-to-make-concrete-walkway-look-better.md` | `airbnb-vacation-rental-pool-deck-fl.md`

---

### Schema.org — Inventário Completo

| Página / Template | Schemas presentes |
|---|---|
| Todas as páginas (BaseLayout) | `HomeAndConstructionBusiness` (+ `AggregateRating` opcional via prop) |
| `index.astro` | `FAQPage` (inline, 8 perguntas) + `AggregateRating` (via BaseLayout prop) |
| City pages (`/cities/*`) | `FAQPage` (inline, 4 perguntas por cidade) + `BreadcrumbList` |
| Service pages (`/services/*`) | `Service` + `BreadcrumbList` |
| `blog/[...slug].astro` | `BlogPosting` + `BreadcrumbList` + `HowTo` (condicional via frontmatter `howToSteps`) |

**Geo coordinates (screen-repair):** latitude `27.8948` / longitude `-82.8386` (Indian Rocks Beach)

---

### Convenções de Commit

```
feat(screen-repair): adiciona seção de depoimentos na homepage
fix(screen-repair): corrige schema FAQPage na city page de Madeira Beach
content(screen-repair): novo post sobre pet screen vs standard mesh
seo(screen-repair): atualiza meta descriptions das 8 city pages
chore(gulf-blvd-ecosystem): atualiza dependências Astro
```

**Prefixos:** `feat` | `fix` | `chore` | `content` | `seo` | `style`  
**Escopo:** nome do site (`screen-repair`, `concrete`, futuros TBD) ou `gulf-blvd-ecosystem` para mudanças de infra

---

### Build — obrigatório antes de concluir

```bash
# Do root do monorepo
npm run build --workspace=gulf-blvd-ecosystem/screen-repair

# Do diretório do site (alternativa)
cd gulf-blvd-ecosystem/screen-repair && npm run build
```

Build falhou = não commitar. Corrija primeiro.

**Sinal de saúde no log do build:** a linha `[build] output: "hybrid"` deve aparecer sempre. Se aparecer `[build] output: "static"`, o Vercel está buildando do diretório errado (ver seção Vercel abaixo).

---

### Vercel — Configuração e Diagnóstico

Cada site tem seu próprio projeto na Vercel. Configurações obrigatórias em cada projeto:

#### Dashboard (Project Settings → Build and Deployment)

| Projeto Vercel | Root Directory |
|---|---|
| gulf-blvd-screen-repair | `gulf-blvd-ecosystem/screen-repair` |
| gulf-blvd-concrete | `gulf-blvd-ecosystem/concrete` |

"Include files outside the root directory in the Build Step" deve estar **Enabled**.

#### vercel.json (screen-repair — atual)

```json
{
  "buildCommand": "npm run build",
  "installCommand": "cd ../.. && npm install",
  "framework": "astro",
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.gulfblvdrescreening.com" }],
      "destination": "https://gulfblvdrescreening.com/:path*",
      "permanent": true
    }
  ]
}
```

O `cd ../.. && npm install` é essencial — instala do root do monorepo para que o workspace hoisting funcione corretamente (deps transitivas como `zod` ficam disponíveis).

O redirect `www → não-www` é obrigatório. Sem ele, o Google rastreia as duas versões e classifica as páginas `www` como "Página alternativa com tag canônica adequada" no Search Console, desperdiçando crawl budget.

#### package.json (cada site deve ter)

```json
"engines": {
  "node": "20.x"
}
```

**Por quê:** `@astrojs/vercel@7.x` só reconhece Node 18 e 20 no seu mapa interno. Se o Vercel buildar com Node 22 (padrão atual), o adapter faz fallback para `nodejs18.x`. Node 18 foi removido da Vercel em 2025 (EOL). Pinnar Node 20 evita esse ciclo.

#### Diagnóstico rápido de falhas

| Sintoma no log | Causa | Fix |
|---|---|---|
| `[build] output: "static"` | Root Directory errado no dashboard | Configurar `gulf-blvd-ecosystem/{site}` no dashboard |
| `Missing pages directory: src/pages` | Idem (buildando da raiz do repo) | Idem |
| `invalid "runtime": nodejs18.x` | Vercel buildou com Node 22, adapter fez fallback | Garantir `engines.node: "20.x"` no package.json do site |
| `Cannot find module 'zod'` | installCommand rodando só no subdiretório | Garantir `cd ../.. && npm install` no vercel.json |

#### Diagnóstico rápido de SEO (Search Console)

| Sintoma no Search Console | Causa | Fix |
|---|---|---|
| "Página alternativa com tag canônica adequada" em ~N páginas | `www.dominio.com` acessível sem redirect | Garantir o bloco `redirects` no `vercel.json` redirecionando `www` → não-`www` |

---

### Protocolo Multi-Agente (cross-site simultâneo)

*Aplicável quando o ecossistema tiver ≥2 sites.*

1. **Coordenador** define a spec completa da mudança (o quê, onde, como)
2. Spawnar N sub-agentes, cada um com:
   - A spec completa
   - Seu site designado
   - Instrução: tocar APENAS em `gulf-blvd-ecosystem/{site}/`
3. Cada agente commita separadamente com o escopo correto
4. Agente coordenador verifica build em todos os sites ao final

---

## Comandos Rápidos

```bash
# Dev (do root do monorepo)
npm run dev:screen       # http://localhost:4324
npm run dev:fl-concrete  # http://localhost:4325
npm run dev:fl-tree      # http://localhost:4326
npm run dev:landscaping  # http://localhost:4328

# Build
npm run build --workspace=gulf-blvd-ecosystem/screen-repair
npm run build --workspace=gulf-blvd-ecosystem/concrete

# Preview pós-build
cd gulf-blvd-ecosystem/screen-repair && npm run preview
cd gulf-blvd-ecosystem/concrete && npm run preview
```

---

## Arquitetura de Componentes

```
{site}/
├── src/
│   ├── config.ts          ← dados do negócio (phone, email, services, locations)
│   ├── env.d.ts
│   ├── layouts/
│   │   └── BaseLayout.astro  ← layout base com SEO/Schema.org
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── LeadForm.astro
│   │   ├── ServiceCard.astro
│   │   └── BlogPostCard.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── privacy.astro
│   │   ├── api/
│   │   │   └── contact.ts     ← endpoint Resend (export const prerender = false)
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── cities/            ← subfolder (diferente do Murrieta que usa root)
│   │   │   └── {slug}.astro
│   │   └── services/
│   │       ├── index.astro
│   │       └── {slug}.astro
│   └── content/
│       ├── config.ts          ← Zod schema das collections
│       └── blog/              ← posts em markdown
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── llms.txt
│   └── images/
│       └── hero.jpg           ← ⚠️ CRIAR ANTES DO GO-LIVE (1200×630px)
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── vercel.json
├── package.json
└── .env.example
```
