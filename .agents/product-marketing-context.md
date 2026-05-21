# Product Marketing Context — Gulf Blvd Ecosystem

> This file is the shared source of truth for all marketing agents working across the four Gulf Blvd local-service sites.

## 1. Overview

Four local home-service websites targeting homeowners along Florida's Gulf Boulevard corridor (SR-699, Pinellas County), operated as a rank-and-rent lead generation network. Each site captures leads via an embedded contact form and rents or sells those leads to local contractors.

| Site | Domain | Niche |
|------|--------|-------|
| Gulf Blvd Screen Repair | gulfblvdscreenrepair.com | Pool cage rescreening, lanai/porch screening, screen panel repair |
| Gulf Blvd Tree Service | gulfblvdtreeexperts.com | Tree removal, trimming, stump grinding, emergency storm response |
| Gulf Blvd Landscaping | gulfblvdlandscaping.com | Lawn care, landscape design, irrigation, hurricane prep |
| Gulf Blvd Concrete | gulfblvdconcrete.com | Driveways, patios, walkways, decorative concrete |

## 2. Geographic Focus

**Primary corridor:** Gulf Boulevard (SR-699), Pinellas County, FL — a barrier island strip running ~30 miles along the Gulf of Mexico.

**Target cities:**
- Indian Rocks Beach
- Indian Shores
- Redington Shores
- Redington Beach
- Madeira Beach
- Treasure Island
- St. Pete Beach
- Clearwater Beach

**Secondary reach:** Largo, Seminole, Pinellas Park (inland Pinellas County homeowners who also maintain beachfront or rental properties).

## 3. Target Audience

**Primary:** Homeowners in Pinellas County, FL — a mix of primary residents and vacation/investment property owners.

**Psychographics:**
- High proportion of short-term rental (Airbnb/VRBO) owners who need fast, reliable contractors to maintain 5-star property ratings
- Retirees and snowbirds (seasonal residents) with disposable income, high standards, and low tolerance for delays
- Coastal homeowners acutely aware of salt air corrosion, humidity, and hurricane season (June–November)
- Motivated by property value preservation, HOA compliance, and guest/tenant satisfaction
- Prefer licensed, insured local contractors over national chains; trust Google reviews and photos

**Seasonal pattern:** Demand spikes October–April (snowbird season) and immediately after tropical storms/hurricanes.

## 4. Customer Personas

**Persona A — "Airbnb Amy"** (Screen Repair / Landscaping)
- Owns 1–3 beachfront rental properties on Gulf Blvd
- Primary fear: bad guest review mentioning broken screens, overgrown yard, or damaged pool cage
- Search intent: "pool cage rescreening near me" / "screen repair Gulf Blvd" / "landscaping company Treasure Island"
- Decision trigger: guest complaint, upcoming booking window, pre-season property check
- Price sensitivity: LOW — fast turnaround and reliability matter more than cost

**Persona B — "Storm Damage Dan"** (Tree Service / Screen Repair / Concrete)
- Year-round resident whose property took storm damage (downed tree, shredded screen, cracked driveway)
- Primary fear: further property damage, HOA fine, insurance claim denied
- Search intent: "emergency tree removal Clearwater Beach" / "storm damage screen repair Madeira Beach"
- Decision trigger: storm just passed; visible damage; insurance adjuster scheduled
- Price sensitivity: MEDIUM — will get 2–3 quotes but needs someone who can start this week

**Persona C — "Retirement Rita"** (Landscaping / Concrete / Screen Repair)
- Snowbird who returns to FL October–November; wants property looking pristine
- Primary goal: low-maintenance curb appeal, functional outdoor living spaces
- Search intent: "landscaping Pinellas County" / "patio contractors St. Pete Beach" / "lanai screening Indian Rocks Beach"
- Decision trigger: end-of-summer return, HOA letter, neighbor's nice yard
- Price sensitivity: LOW-MEDIUM — quality matters; has budget

**Persona D — "Flip or Rent Fred"** (Concrete / Screen Repair / Landscaping)
- Investor buying or renovating a Gulf Blvd property for resale or rental
- Primary goal: fast, clean, professional work that photographs well for listings
- Search intent: "concrete driveway replacement Clearwater" / "pool cage repair before listing"
- Decision trigger: listing date, pre-inspection punch list, tenant move-in deadline
- Price sensitivity: MEDIUM — budget-conscious but understands ROI of curb appeal

## 5. Competitive Landscape

- Most search results on Gulf Blvd terms are dominated by Clearwater/St. Petersburg metro contractors who may not service barrier islands specifically
- Local operators are often solo owner-operators without strong web presence — Google My Business only
- Opportunity: rank-and-rent sites can outrank local operators by offering dedicated, city-specific landing pages with strong on-page SEO
- Differentiator to emphasize in copy: *Gulf Blvd specialists* — contractors who know the coastal environment (salt air, hurricane codes, waterfront permitting)

## 6. Messaging & Tone

**Brand voice:** Helpful neighbor, not a corporation. Conversational, reassuring, specific to the Gulf Coast lifestyle.

**Key messages per niche:**

*Screen Repair:*
- "Your pool cage is your outdoor living room — keep it working year-round"
- Hurricane prep angle: rescreened cages withstand wind better than old, torn screens
- Airbnb angle: "Guests notice broken screens. We fix them fast."

*Tree Service:*
- "Don't wait for the next storm — remove hazard trees now"
- Emphasize: licensed + insured, same-week availability, debris cleanup included
- Hurricane season urgency: pre-storm trimming prevents property damage

*Landscaping:*
- "Salt air and sandy soil require a landscaper who knows Florida's coast"
- Drought-tolerant and Florida-native plant angles (reduces irrigation costs)
- Hurricane prep: palm trimming, securing loose planters, drainage

*Concrete:*
- "Pinellas County's humidity cracks driveways fast — we use the right mix for coastal Florida"
- Emphasize: stamped/decorative options for vacation rental curb appeal
- "Before listing your property, replace that cracked driveway"

## 7. Lead Form Strategy

All 4 sites use the same embedded contact form structure:
- Fields: Name, Phone, Email, Service needed (dropdown), Message
- Form handler: Vercel serverless function + Resend API (email notification)
- CTA copy should create urgency without being pushy: "Get a Free Estimate", "Request Your Quote Today"
- Above-the-fold CTA on every page

## 8. SEO Strategy

**Primary keyword pattern:** `[service] [city]` (e.g., "pool cage rescreening Madeira Beach")

**City pages:** Each site has dedicated city landing pages for all 8 target cities, optimized individually.

**Blog content:** Each site has 10+ blog posts targeting long-tail keywords (how-to, cost guides, storm prep, seasonal content).

**Schema markup:** LocalBusiness + Service schemas on all pages. Screen Repair uses `HomeAndConstructionBusiness`.

**Domain strategy:** Exact-match-ish domains per niche (`gulfblvdscreenrepair.com`, `gulfblvdtreeexperts.com`, etc.) for topical authority signals.
