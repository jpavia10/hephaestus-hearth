# HEARTH-GROK-inventory-verify_20261110-1705: verification pass on the shipped 120 inventory categories

Checked file: `hearth_gemini_inventory_categories_20261108-2345.json` (Drive id 1noH4BieBes6T3mh0Tn8uR3pxfJOxyUOB, HEA-GEM-07, merged 2026-11-09). Grok, 20261110-1705 UTC, WS-HEARTH reset.

## What I checked (all 120 rows read)

1. **Structure:** `n` runs 1–120 in order. All 120 category names are unique. Every `rooms` value is one of the 10 room words in the task, and every `fields` value is one of the 9 field words. **0 problems.**
2. **Room assignment:** I compared each row's rooms against the room lists on the real checklist pages (CDI Form 408 room pages; III's General / Living / Dining / Bedrooms / Kitchen / Bathrooms / Home Office / Garage-Basement-Attic-Shed / Porch-Patio lists; Nationwide's room list; FEMA NFIP's basement building-coverage list) and checked for duplicates or overlaps between categories.
3. **Source trace:** I fetched each of the 4 cited pages today (the CDI PDF has a full 41-page text layer, and Liberty Mutual, III and Nationwide returned HTTP 200) and searched each page for the row's `quote` as an exact string.

## Results

- **Mis-categorized: 2 rows** (#54 and #9). Corrections are below.
- **Advisory: 10 rows** (#111–#120, house systems). The rooms are right. Tag them as dwelling, not contents.
- **Categorized correctly: 108 rows.**
- **Field-list notes: 5 rows** (#24, #25, #26, #42, #86). These are field choices, not categorization errors.
- **Source trace failed for every row: 120 of 120 quotes do not appear on the page they cite.** The 111 rows that cite the CDI PDF quote section headers that are not in that PDF: 'KITCHEN Item Blender…', 'LAUNDRY / UTILITY ROOM', 'CLOTHING (Master Closet)', 'GARAGE / BASEMENT / ATTIC', 'PATIO / PORCH / OUTDOOR', 'STRUCTURAL / BUILDING ITEMS & SYSTEMS'. The PDF's real sections are Living Room, Dining Room, Kitchen, Master Bedroom, Master Bathroom, Bedrooms 2–4, Bathrooms 2–4, Family Room, Office/Library/Study, Den or Loft, Linen Closet, Books, Jewelry, Collectibles/Fine Arts/Antiques, Garage/Workshop, Outdoor Equipment, Computer Equipment, Sporting Equipment and Miscellaneous. The PDF never mentions a freezer, toaster, furnace, water heater, sump pump, generator or solar. The Liberty Mutual (6 rows), III (2 rows) and Nationwide (1 row) quotes are not on those pages either. Under HEA-GEM-07's own rule ('every one traced to a checklist page'), the source column needs redoing.
- **Replacement evidence:** I traced 102 of 120 categories to a verbatim item on a real page (CDI, III, Nationwide or FEMA NFIP), with the section named. Each row's `verified_support` field has it. **18 rows have no support on any page I checked:** #5 range hood and exhaust fan, #6 garbage disposal, #7 trash compactor, #9 ice maker, #10 water purifier and filtration system, #20 barstools and kitchen island seating, #51 cedar chest and hope chest, #54 jewelry box and watch winder safe, #64 handbags, purses, and designer totes, #65 belts, scarves, ties, hats, and gloves, #73 medicine cabinet contents, cosmetics, and toiletries, #80 paper shredder, #90 clothes iron, garment steamer, and ironing board, #107 outdoor fire pit and patio heater, #116 standby or portable backup generator, #117 rooftop solar panels and inverter system, #118 home security alarm and camera system, #119 automatic garage door opener. The categories themselves are reasonable. They just need a real checklist citation, or Claude can accept them without one.

## Corrections (mis-categorized)

| # | Category | Shipped rooms | Issue | Correction |
|---|---|---|---|---|
| 9 | ice maker | kitchen, outdoor | The 'outdoor' room is unsupported. No cited page lists an ice maker outdoors, and a standalone ice maker is a kitchen/bar appliance. III files outdoor appliances under Porch/Patio 'Outdoor cooking equipment'. | rooms: ['kitchen']. Log an outdoor-kitchen ice maker under a Porch/Patio 'outdoor cooking equipment' category, not here. |
| 54 | jewelry box and watch winder safe | bedrooms | Two different things in one category: a jewelry box (a furnishing) and a safe. CDI lists 'Safe' as its own line in the Master Bedroom list; neither cited page has a 'jewelry box and watch winder safe' item. | Rename #54 to 'jewelry box and watch winder' (rooms: bedrooms). Move safes into #76, renamed 'filing cabinets, document safes and home safes', with rooms office, bedrooms, basement. The count stays 120. |

## Advisory (house systems = dwelling, not contents)

| # | Category | Shipped rooms | Verified support |
|---|---|---|---|
| 111 | furnace and central heating system | house systems, basement, garage | “Furnaces and water heaters” — FEMA NFIP, What Does Flood Insurance Cover in a Basement? (fact sheet) |
| 112 | central air conditioner and heat pump | house systems, outdoor | “Central air conditioners” — FEMA NFIP, What Does Flood Insurance Cover in a Basement? (fact sheet) |
| 113 | water heater (tank or tankless) | house systems, basement, garage, laundry | “Furnaces and water heaters” — FEMA NFIP, What Does Flood Insurance Cover in a Basement? (fact sheet) |
| 114 | main electrical panel and subpanels | house systems, basement, garage | “Electrical junction and circuit breaker boxes” — FEMA NFIP, What Does Flood Insurance Cover in a Basement? (fact sheet) |
| 115 | sump pump and battery backup pump | house systems, basement | “Sump pumps, heat pumps” — FEMA NFIP, What Does Flood Insurance Cover in a Basement? (fact sheet) |
| 116 | standby or portable backup generator | house systems, garage, outdoor | none on checked pages |
| 117 | rooftop solar panels and inverter system | house systems, outdoor, garage | none on checked pages |
| 118 | home security alarm and camera system | house systems, living areas, outdoor | none on checked pages |
| 119 | automatic garage door opener | house systems, garage | none on checked pages |
| 120 | wood stove and fireplace insert | house systems, living areas, basement | “Fireplace” — California Department of Insurance, Home Inventory Guide (Form 408) |

## Field-list notes

| # | Category | Note |
|---|---|---|
| 24 | fine china and porcelain dinnerware | 'serial' does not apply to china/porcelain. CDI's dining list records 'Service for' (piece count) instead. Drop serial. |
| 25 | crystal and stemware glassware | 'serial' does not apply to crystal/stemware. Drop serial. |
| 26 | sterling silver and flatware service | Drop 'serial'. CDI's Silverware line asks for 'Specific Brand Name/Model' and 'Service for how many', so keep model. |
| 42 | framed artwork, paintings, and wall hangings | Artwork has no brand/model/serial. CDI's 'Collectibles, Fine Arts & Antiques' page says to schedule these items 'for their appraised value'. Drop model/serial; add an appraisal field when the schema allows it. |
| 86 | books, reference library, and collectible media | Books have no brand/model/serial. CDI's Books page records 'Category Series Titles'. Drop brand/model/serial. |

## All 120 rows

| # | Category | Shipped rooms | Quote on cited page? | Verdict | Verified support (section: item) |
|---|---|---|---|---|---|
| 1 | refrigerator | kitchen, garage | no | ok | California Department of Insurance · Kitchen: “Refrigerator” |
| 2 | range and oven | kitchen | no | ok | California Department of Insurance · Kitchen: “Stove/Range” |
| 3 | dishwasher | kitchen | no | ok | California Department of Insurance · Kitchen: “Dishwasher” |
| 4 | microwave oven | kitchen | no | ok | Insurance Information Institute · Kitchen: “Microwave oven” |
| 5 | range hood and exhaust fan | kitchen | no | ok | — |
| 6 | garbage disposal | kitchen | no | ok | — |
| 7 | trash compactor | kitchen | no | ok | — |
| 8 | chest or upright freezer | kitchen, laundry, garage, basement | no | ok | Insurance Information Institute · Kitchen: “Freezer” |
| 9 | ice maker | kitchen, outdoor | no | fix | — |
| 10 | water purifier and filtration system | kitchen, basement | no | ok | — |
| 11 | coffee maker and espresso machine | kitchen | no | ok | Insurance Information Institute · Kitchen: “Coffee makers/other small appliances” |
| 12 | stand mixer and hand mixer | kitchen | no | ok | California Department of Insurance · Kitchen: “Mixer/Blender” |
| 13 | blender and food processor | kitchen | no | ok | California Department of Insurance · Kitchen: “Mixer/Blender” |
| 14 | toaster and toaster oven | kitchen | no | ok | Insurance Information Institute · Kitchen: “Coffee makers/other small appliances” |
| 15 | air fryer | kitchen | no | ok | Insurance Information Institute · Kitchen: “Coffee makers/other small appliances” |
| 16 | slow cooker and pressure cooker | kitchen | no | ok | Insurance Information Institute · Kitchen: “Coffee makers/other small appliances” |
| 17 | pots, pans, and cookware sets | kitchen | no | ok | California Department of Insurance · Kitchen: “Pots & Pans” |
| 18 | cutlery, chef knives, and kitchen utensils | kitchen | no | ok | California Department of Insurance · Kitchen: “Cutlery/utensils” |
| 19 | everyday dishes, stoneware, and bowls | kitchen, living areas | no | ok | Insurance Information Institute · Kitchen: “Dishes” |
| 20 | barstools and kitchen island seating | kitchen | no | ok | — |
| 21 | dining table and chairs | kitchen, living areas | no | ok | Insurance Information Institute · Dining Room: “Table Chairs” |
| 22 | buffet and sideboard | living areas | no | ok | California Department of Insurance · Dining Room: “Buffet/Server” |
| 23 | china cabinet and hutch | living areas | no | ok | California Department of Insurance · Dining Room: “China cabinet” |
| 24 | fine china and porcelain dinnerware | living areas, kitchen | no | ok | Insurance Information Institute · Dining Room: “China” |
| 25 | crystal and stemware glassware | living areas, kitchen | no | ok | Insurance Information Institute · Dining Room: “Crystal” |
| 26 | sterling silver and flatware service | living areas, kitchen | no | ok | California Department of Insurance · Dining Room: “Sterling Silver” |
| 27 | tablecloths and formal table linens | living areas, kitchen | no | ok | Insurance Information Institute · Dining Room: “Table linens” |
| 28 | bar cart and tea cart | living areas, kitchen | no | ok | Insurance Information Institute · Dining Room: “Serving table/cart” |
| 29 | sofa and sectional couch | living areas, basement | no | ok | Insurance Information Institute · Living Room: “Sofa” |
| 30 | recliner and accent chairs | living areas, bedrooms | no | ok | California Department of Insurance · Bedroom No. 2: “Recliner” |
| 31 | coffee table | living areas, basement | no | ok | Insurance Information Institute · Living Room: “Coffee table” |
| 32 | end tables and side tables | living areas | no | ok | Insurance Information Institute · Living Room: “End tables” |
| 33 | entertainment center and media console | living areas, basement | no | ok | Insurance Information Institute · Living Room: “Entertainment center/wall units” |
| 34 | bookcases and display shelving | living areas, office, bedrooms | no | ok | Insurance Information Institute · General Household: “Bookcases” |
| 35 | television | living areas, bedrooms, basement, kitchen | no | ok | Insurance Information Institute · General Appliances: “Televisions” |
| 36 | stereo receiver, soundbar, and audio speakers | living areas, basement | no | ok | Insurance Information Institute · General Appliances: “Stereo equipment” |
| 37 | Blu-ray/DVD player and streaming media players | living areas, bedrooms, basement | no | ok | Insurance Information Institute · General Appliances: “VCR/DVD player” |
| 38 | video game consoles and VR headsets | living areas, bedrooms, basement | no | ok | California Department of Insurance · Master Bedroom: “Playstation/Xbox/etc.” |
| 39 | area rugs and oriental carpets | living areas, bedrooms, office | no | ok | Insurance Information Institute · General Household: “Carpet/rugs” |
| 40 | curtains, drapes, and window blinds | living areas, bedrooms, kitchen, office | no | ok | Insurance Information Institute · General Household: “Window treatments” |
| 41 | floor lamps and table lamps | living areas, bedrooms, office | no | ok | Insurance Information Institute · General Household: “Lamps/light fixtures” |
| 42 | framed artwork, paintings, and wall hangings | living areas, bedrooms, office | no | ok | Insurance Information Institute · General Household: “Pictures/wall hangings” |
| 43 | wall mirrors and floor mirrors | living areas, bedrooms, bathrooms | no | ok | Insurance Information Institute · General Household: “Mirrors” |
| 44 | grandfather clock, mantel clock, and wall clocks | living areas, bedrooms, kitchen | no | ok | Insurance Information Institute · General Household: “Clocks” |
| 45 | fireplace screen, grates, and hearth tools | living areas | no | ok | California Department of Insurance · Living Room: “Fireplace” |
| 46 | musical instruments and pianos | living areas, office, basement | no | ok | Insurance Information Institute · Living Room: “Piano/other musical instruments” |
| 47 | bed frame, headboard, and mattress set | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Beds” |
| 48 | dresser and chest of drawers | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Dressers/chests” |
| 49 | nightstands and bedside tables | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Night tables” |
| 50 | wardrobe and armoire | bedrooms | no | ok | California Department of Insurance · Master Bedroom: “Armoire” |
| 51 | cedar chest and hope chest | bedrooms | no | ok | — |
| 52 | bedding, sheets, duvets, and blankets | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Bed linens” |
| 53 | clock radio and smart bedside speaker | bedrooms | no | ok | California Department of Insurance · Master Bedroom: “Clock radio” |
| 54 | jewelry box and watch winder safe | bedrooms | no | fix | — |
| 55 | fine jewelry, rings, and necklaces | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Jewelry” |
| 56 | wristwatches and luxury timepieces | bedrooms | no | ok | Nationwide · room list: “Jewelry and watches” |
| 57 | suits, blazers, and formalwear | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Suits” |
| 58 | dresses and evening gowns | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Dresses” |
| 59 | coats, leather jackets, and winter outerwear | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Coats” |
| 60 | shirts, blouses, and sweaters | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Shirts” |
| 61 | pants, jeans, slacks, and skirts | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Skirts” |
| 62 | shoes, dress footwear, and sneakers | bedrooms | no | ok | Insurance Information Institute · Bedrooms: “Shoes” |
| 63 | boots and weather footwear | bedrooms, garage | no | ok | Nationwide · room list: “Clothing and shoes” |
| 64 | handbags, purses, and designer totes | bedrooms | no | ok | — |
| 65 | belts, scarves, ties, hats, and gloves | bedrooms | no | ok | — |
| 66 | luggage, suitcases, and garment bags | bedrooms, garage, basement | no | ok | Insurance Information Institute · Garage/Basement/Attic/Shed: “Luggage/trunks” |
| 67 | bath towels, hand towels, and bath mats | bathrooms | no | ok | Insurance Information Institute · Bathrooms: “Towels” |
| 68 | hair dryer, curling iron, and styling appliances | bathrooms, bedrooms | no | ok | Insurance Information Institute · Bathrooms: “Hair dryer/other electrical appliances” |
| 69 | electric razor and electric toothbrush | bathrooms | no | ok | California Department of Insurance · Master Bathroom: “Electric razor” |
| 70 | bathroom scale | bathrooms | no | ok | Insurance Information Institute · Bathrooms: “Scale” |
| 71 | clothes hamper | bathrooms, bedrooms, laundry | no | ok | California Department of Insurance · Master Bathroom: “Hamper” |
| 72 | shower curtain and bath hardware | bathrooms | no | ok | Insurance Information Institute · Bathrooms: “Shower curtains” |
| 73 | medicine cabinet contents, cosmetics, and toiletries | bathrooms | no | ok | — |
| 74 | office desk and standing desk | office, bedrooms | no | ok | Insurance Information Institute · Home Office/Study/Den: “Desk” |
| 75 | ergonomic office chair | office | no | ok | Insurance Information Institute · Home Office/Study/Den: “Chairs” |
| 76 | filing cabinets and document safes | office, basement | no | ok | California Department of Insurance · Office/Library/Study: “File cabinets” |
| 77 | desktop computer and external monitors | office | no | ok | California Department of Insurance · Computer Equipment: “Computer tower/CPU” |
| 78 | laptop computer and tablet | office, living areas, bedrooms | no | ok | California Department of Insurance · Computer Equipment: “Laptop” |
| 79 | printer, scanner, and copier | office | no | ok | Insurance Information Institute · Home Office/Study/Den: “Printer” |
| 80 | paper shredder | office | no | ok | — |
| 81 | Wi-Fi router, modem, and network switch | office, living areas, basement | no | ok | California Department of Insurance · Computer Equipment: “External modem” |
| 82 | external hard drives and NAS backup storage | office | no | ok | California Department of Insurance · Computer Equipment: “External drive” |
| 83 | uninterruptible power supply (UPS) and surge protectors | office, living areas, basement | no | ok | California Department of Insurance · Living Room: “Power strips” |
| 84 | digital camera, lenses, and photography gear | office, bedrooms | no | ok | California Department of Insurance · Computer Equipment: “Digital camera” |
| 85 | smartphones and mobile communication devices | office, bedrooms, living areas | no | ok | Insurance Information Institute · General Appliances: “Phones” |
| 86 | books, reference library, and collectible media | office, living areas, bedrooms | no | ok | Insurance Information Institute · Home Office/Study/Den: “Books” |
| 87 | washing machine | laundry, basement | no | ok | Insurance Information Institute · General Appliances: “Washer/Dryer” |
| 88 | clothes dryer | laundry, basement | no | ok | Insurance Information Institute · General Appliances: “Washer/Dryer” |
| 89 | vacuum cleaner and robotic vacuum | laundry, kitchen, living areas | no | ok | Insurance Information Institute · General Appliances: “Vacuum cleaner” |
| 90 | clothes iron, garment steamer, and ironing board | laundry, bedrooms | no | ok | — |
| 91 | sewing machine | laundry, bedrooms, office | no | ok | Insurance Information Institute · General Appliances: “Sewing machine” |
| 92 | power tools (drills, saws, sanders) | garage, basement | no | ok | California Department of Insurance · Garage/Workshop: “Drills” |
| 93 | hand tools and socket wrench sets | garage, basement | no | ok | California Department of Insurance · Garage/Workshop: “Tools” |
| 94 | rolling tool chest and workbench | garage, basement | no | ok | Insurance Information Institute · Garage/Basement/Attic/Shed: “Work bench” |
| 95 | air compressor | garage, basement | no | ok | Nationwide · room list: “Tools” |
| 96 | wet/dry shop vacuum | garage, basement | no | ok | Nationwide · room list: “Tools” |
| 97 | pressure washer | garage, outdoor | no | ok | Nationwide · room list: “Tools” |
| 98 | ladders and step stools | garage, basement | no | ok | Insurance Information Institute · Garage/Basement/Attic/Shed: “Ladders” |
| 99 | lawn mower, string trimmer, and edger | garage, outdoor | no | ok | California Department of Insurance · Garage/Workshop: “Lawn mower” |
| 100 | snow blower | garage, outdoor | no | ok | Insurance Information Institute · Garage/Basement/Attic/Shed: “Snow blower” |
| 101 | bicycles and e-bikes | garage, outdoor | no | ok | Insurance Information Institute · Garage/Basement/Attic/Shed: “Bicycles” |
| 102 | golf clubs, skis, and sporting goods | garage, basement | no | ok | California Department of Insurance · Sporting Equipment: “Golf clubs” |
| 103 | camping tents, sleeping bags, and fishing gear | garage, basement | no | ok | Nationwide · room list: “Outdoor gear” |
| 104 | treadmill, stationary bike, and home gym equipment | basement, garage, bedrooms | no | ok | Insurance Information Institute · General Appliances: “Exercise equipment” |
| 105 | barbecue grill and outdoor smoker | outdoor | no | ok | California Department of Insurance · Outdoor Equipment: “BBQ grill” |
| 106 | patio dining set, outdoor loungers, and umbrella | outdoor | no | ok | California Department of Insurance · Outdoor Equipment: “Patio set” |
| 107 | outdoor fire pit and patio heater | outdoor | no | ok | — |
| 108 | hot tub and outdoor spa | outdoor | no | ok | Insurance Information Institute · Porch/Patio: “Jacuzzi” |
| 109 | swimming pool pump, filter, and robotic cleaner | outdoor | no | ok | California Department of Insurance · Outdoor Equipment: “Pool/Spa equipment” |
| 110 | children's swing set and outdoor play structure | outdoor | no | ok | California Department of Insurance · Outdoor Equipment: “Bench/Swings” |
| 111 | furnace and central heating system | house systems, basement, garage | no | advisory | FEMA NFIP · Building Coverage in a Basement: “Furnaces and water heaters” |
| 112 | central air conditioner and heat pump | house systems, outdoor | no | advisory | FEMA NFIP · Building Coverage in a Basement: “Central air conditioners” |
| 113 | water heater (tank or tankless) | house systems, basement, garage, laundry | no | advisory | FEMA NFIP · Building Coverage in a Basement: “Furnaces and water heaters” |
| 114 | main electrical panel and subpanels | house systems, basement, garage | no | advisory | FEMA NFIP · Building Coverage in a Basement: “Electrical junction and circuit breaker boxes” |
| 115 | sump pump and battery backup pump | house systems, basement | no | advisory | FEMA NFIP · Building Coverage in a Basement: “Sump pumps, heat pumps” |
| 116 | standby or portable backup generator | house systems, garage, outdoor | no | advisory | — |
| 117 | rooftop solar panels and inverter system | house systems, outdoor, garage | no | advisory | — |
| 118 | home security alarm and camera system | house systems, living areas, outdoor | no | advisory | — |
| 119 | automatic garage door opener | house systems, garage | no | advisory | — |
| 120 | wood stove and fireplace insert | house systems, living areas, basement | no | advisory | California Department of Insurance · Living Room: “Fireplace” |

## Sources (fetched 2026-11-10)

- California Department of Insurance, Home Inventory Guide (Form 408): https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/upload/Website-Version-Home-Inventory_Revision-September-17th-2.pdf
- Insurance Information Institute, Home inventory brochure: https://www.iii.org/article/brochure-home-inventory
- Nationwide, Home inventory checklist: https://www.nationwide.com/lc/resources/home/articles/home-inventory-checklist
- FEMA NFIP, What Does Flood Insurance Cover in a Basement? (fact sheet): https://www.agents.floodsmart.gov/sites/default/files/media/document/2025-07/fema-nfip-basement-flooding-fact-sheet-01-2022.pdf
- Liberty Mutual, home inventory checklist (cited by 6 shipped rows; quote not found): https://www.libertymutual.com/insurance-resources/property/home-inventory-checklist-and-template
