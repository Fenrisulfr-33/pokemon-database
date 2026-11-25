# Bulbapedia differences: `pokedexEntries`

Checked 1025 files against Bulbapedia on 2026-11-24
(`npm run bulbapedia:check -- pokedexEntries`). Nothing here has been applied yet.

Set **Decision** to `accept` or `reject`, then run
`npm run bulbapedia:apply -- pokedexEntries` to apply the
accepted rows. Decisions are kept when the check is re-run.

| Kind | Meaning |
| --- | --- |
| wording | Bulbapedia's text has different words; accepting writes it in our casing and apostrophe style. |
| punctuation | Only spacing, hyphens, dashes or quotes differ. |
| missing | Bulbapedia has an entry for this game and we don't; accepting adds it. |
| extra | We have an entry Bulbapedia doesn't list for the base form (often a form's entry); accepting removes it. |
| form | Our text is Bulbapedia's entry for another form (see the note). Usually Bulbapedia lists a different default form first; reject if ours is the right form. |
| split | Our combined key covers games whose Bulbapedia texts differ; split the key by hand. |

## Differences (11)

| ID | Pokemon | Game | Kind | Ours | Bulbapedia | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `386-deoxys/fr` | Deoxys | `fr` | extra | This DEOXYS has transformed into its aggressive guise. It can fool enemies by altering its appearance. | *Matches Bulbapedia's "Attack Forme" entry* |  |
| `386-deoxys/lg` | Deoxys | `lg` | extra | When it changes form, an aurora appears. It absorbs attacks by altering its cellular structure. | *Matches Bulbapedia's "Defense Forme" entry* |  |
| `386-deoxys/em` | Deoxys | `em` | extra | A POKéMON that mutated from an extraterrestrial virus exposed to a laser beam. Its body is configured for superior agility and speed. | *Matches Bulbapedia's "Speed Forme" entry* |  |
| `718-zygarde/su` | Zygarde | `su` | form | This is Zygarde’s form when it has gathered 50% of its cells. It wipes out all those who oppose it, showing not a shred of mercy. | *Ours is Bulbapedia's "50% Forme" entry; this is its "10% Forme" entry*: Its sharp fangs make short work of finishing off its enemies, but it’s unable to maintain this body indefinitely. After a period of time, it falls apart. |  |
| `718-zygarde/mo` | Zygarde | `mo` | form | It’s thought to be monitoring the ecosystem. There are rumors that even greater power lies hidden within it. | *Ours is Bulbapedia's "50% Forme" entry; this is its "10% Forme" entry*: This is Zygarde’s form when about 10% of its cells have been gathered. It runs across the land at speeds greater than 60 mph. |  |
| `718-zygarde/us` | Zygarde | `us` | form | This is Zygarde’s form when about half of its pieces have been assembled. It plays the role of monitoring the ecosystem. | *Ours is Bulbapedia's "50% Forme" entry; this is its "10% Forme" entry*: This is Zygarde when about 10% of its pieces have been assembled. It leaps at its opponent’s chest and sinks its sharp fangs into them. |  |
| `718-zygarde/um` | Zygarde | `um` | form | Some say it can change to an even more powerful form when battling those who threaten the ecosystem. | *Ours is Bulbapedia's "50% Forme" entry; this is its "10% Forme" entry*: Born when around 10% of Zygarde’s cells have been gathered from all over, this form is skilled in close-range combat. |  |
| `901-ursaluna/sc` | Ursaluna | `sc` | extra | It crossed the sea and drifted ashore in a new land. Surviving in this place led it to take on a unique appearance and gain special powers. | *Matches Bulbapedia's "Bloodmoon" entry* |  |
| `901-ursaluna/vi` | Ursaluna | `vi` | extra | This special Ursaluna can see in the dark with its left eye and protects itself with mud that is as hard as iron. | *Matches Bulbapedia's "Bloodmoon" entry* |  |
| `925-maushold/sc` | Maushold | `sc` | form | The two little ones just appeared one day. The group might be a family of related Pokémon, but nobody knows for sure. | *Ours is Bulbapedia's "Family of Four" entry; this is its "Family of Three" entry*: They build huge nests with many rooms that are used for different purposes, such as eating and sleeping. |  |
| `925-maushold/vi` | Maushold | `vi` | form | The larger pair protects the little ones during battles. When facing strong opponents, the whole group will join the fight. | *Ours is Bulbapedia's "Family of Four" entry; this is its "Family of Three" entry*: The little one just appeared one day. They all live together like a family, but the relationship between the three is still unclear. |  |

## Spacing and punctuation (0)

None.
