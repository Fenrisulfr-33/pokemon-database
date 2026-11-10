# Database

## Collections

- abilities
- evolutions
- form-tabs
- moves
- national-dex

### Abilities

```json
{
  _id: NumberInt('1'),
  key: 'stench',
  name: {
    english: 'Stench'
  },
  generation: NumberInt('3'),
  effect: {
    shortEffect: 'Has a 10% chance of making target Pokémon flinch with each hit.',
    full: 'This Pokémon\'s damaging moves have a 10% chance to make the target flinch with each hit if they do not already cause flinching as a secondary effect. This ability does not stack with a held item. Overworld: The wild encounter rate is halved while this Pokémon is first in the party.'
  },
  description: {
    'ruby-sapphire': 'Helps repel wild POKéMON.',
    emerald: 'Helps repel wild POKéMON.',
    'firered-leafgreen': 'Helps repel wild POKéMON.',
    'diamond-pearl': 'The stench helps keep wild Pokémon away.',
    platinum: 'The stench helps keep wild Pokémon away.',
    'heartgold-soulsilver': 'The stench helps keep wild Pokémon away.',
    'black-white': 'The stench may cause the target to flinch.',
    'black-2-white-2': 'The stench may cause the target to flinch.',
    'x-y': 'The stench may cause the target to flinch.',
    'omega-ruby-alpha-sapphire': 'The stench may cause the target to flinch.',
    'sun-moon': 'By releasing stench when attacking, this Pokémon may cause the target to flinch.',
    'ultra-sun-ultra-moon': 'By releasing stench when attacking, this Pokémon may cause the target to flinch.',
    'lets-go-pikachu-lets-go-eevee': 'By releasing stench when attacking, this Pokémon may cause the target to flinch.',
    'sword-shield': 'By releasing stench when attacking, this Pokémon may cause the target to flinch.'
  },
  pokemonWithAbility: {
    normal: [
      {
        name: 'Grimer',
        id: NumberInt('88')
      },
      {
        name: 'Muk',
        id: NumberInt('89')
      },
      {
        name: 'Stunky',
        id: NumberInt('434')
      },
      {
        name: 'Skuntank',
        id: NumberInt('435')
      },
      {
        name: 'Trubbish',
        id: NumberInt('568')
      },
      {
        name: 'Garbodor',
        id: NumberInt('569')
      }
    ],
    hidden: [
      {
        name: 'Gloom',
        id: NumberInt('44')
      },
      {
        name: 'Koffing',
        id: NumberInt('109')
      },
      {
        name: 'Weezing',
        id: NumberInt('110')
      }
    ]
  }
}
```

### Moves

```json
{
  _id: NumberInt('1'),
  key: 'pound',
  name: {
    english: 'Pound',
    japanese: 'はたく',
    chinese: '拍击',
    korean: '막치기',
    german: 'Destructor',
    french: 'Klaps',
    italian: 'Pound',
    spanish: 'Botta'
  },
  type: 'Normal',
  category: 'Physical',
  contest: 'Tough',
  pp: NumberInt('35'),
  power: NumberInt('40'),
  accuracy: NumberInt('100'),
  contact: null,
  generation: NumberInt('1'),
  target: 'selected-pokemon',
  changes: [],
  description: {
    'gold-silver': 'Pounds with fore\u00ad\nlegs or tail.',
    crystal: 'Pounds with fore\u00ad\nlegs or tail.',
    'ruby-sapphire': 'Pounds the foe with\nforelegs or tail.',
    emerald: 'Pounds the foe with\nforelegs or tail.',
    'firered-leafgreen': 'A physical attack\ndelivered with a\nlong tail or a\nforeleg, etc.',
    'diamond-pearl': 'The foe is physically\npounded with a long\ntail or a foreleg,\netc.\n',
    platinum: 'The foe is physically\npounded with a long\ntail or a foreleg,\netc.\n',
    'heartgold-soulsilver': 'The foe is physically\npounded with a long\ntail or a foreleg,\netc.\n',
    'black-white': 'The target is physically pounded with\na long tail or a foreleg, etc.',
    'black-2-white-2': 'The target is physically pounded with\na long tail or a foreleg, etc.',
    'x-y': 'The target is physically pounded with\na long tail, a foreleg, or the like.',
    'omega-ruby-alpha-sapphire': 'The target is physically pounded with\na long tail, a foreleg, or the like.',
    'sun-moon': 'The target is physically pounded with a long tail, a\nforeleg, or the like.',
    'ultra-sun-ultra-moon': 'The target is physically pounded with a long tail, a\nforeleg, or the like.',
    'lets-go-pikachu-lets-go-eevee': 'The target is physically pounded with a long tail, a\nforeleg, or the like.',
    'sword-shield': 'The target is physically pounded with a long tail, a\nforeleg, or the like.'
  },
  effect: {
    full: 'Inflicts regular damage.',
    shortEffect: 'Inflicts regular damage with no additional effect.'
  },
  priority: NumberInt('0')
}
```

### Learnsets

```json
```