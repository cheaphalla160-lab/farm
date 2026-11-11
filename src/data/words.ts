import { VocabularyWord } from '../types';

export const CORE_VOCABULARY: VocabularyWord[] = [
  {
    id: 'farm',
    word: 'farm',
    ipa: '/fɑːrm/',
    syllables: ['farm'],
    meaning: '农场；庄稼地',
    partOfSpeech: 'n.',
    example: 'Old MacDonald has a big green farm with many animals.',
    exampleTranslation: '老麦克唐纳有一个种满植物、养着许多动物的大农场。',
    teacherNote: '发音重点：元音字母组合 ar 发长元音 /ɑː/，发音时口张大，舌身平放，后微缩，注意卷舌音 /r/。',
    funFact: 'Farms produce fresh food for millions of people every single day!',
    color: '#10b981', // emerald
    iconName: 'Barn',
    category: 'core'
  },
  {
    id: 'farmer',
    word: 'farmer',
    ipa: '/ˈfɑːrmər/',
    syllables: ['far', 'mer'],
    meaning: '农民；农场主',
    partOfSpeech: 'n.',
    example: 'The kind farmer wakes up early to feed the friendly animals.',
    exampleTranslation: '善良的农夫大清早起床给友好的动物们喂食。',
    teacherNote: '构词法解析：farm (动词/名词: 农田) + -er (表示...人) = farmer (耕作者/农夫)。后缀 -er 发弱读 /ər/。',
    funFact: 'Farmers need to know about weather, plants, animals, and soil science!',
    color: '#f59e0b', // amber
    iconName: 'UserCheck',
    category: 'core'
  },
  {
    id: 'sunshine',
    word: 'sunshine',
    ipa: '/ˈsʌnʃaɪn/',
    syllables: ['sun', 'shine'],
    meaning: '阳光；晴朗',
    partOfSpeech: 'n.',
    example: 'Golden sunshine warms the apples on the branches.',
    exampleTranslation: '金色的阳光温暖了树枝上的苹果。',
    teacherNote: '复合词记忆：sun (太阳) + shine (发光/照耀) = sunshine。前部 sun 读短元音 /ʌ/，后部 shine 含有双元音 /aɪ/。',
    funFact: 'Plants use sunshine to make their own food through photosynthesis (光合作用)!',
    color: '#eab308', // yellow
    iconName: 'Sun',
    category: 'core'
  },
  {
    id: 'basket',
    word: 'basket',
    ipa: '/ˈbæskɪt/',
    syllables: ['bas', 'ket'],
    meaning: '篮子；筐',
    partOfSpeech: 'n.',
    example: 'We put the sweet red apples into our wooden basket.',
    exampleTranslation: '我们把香甜的红苹果放进木篮子里。',
    teacherNote: '发音规律：美音 a 读 /æ/ (梅花音，口型张开约两指)，英音多读 /ɑː/。后半音节 -ket 中 e 弱化为 /ɪ/。',
    funFact: 'Traditional farm baskets were handwoven from willow branches and bamboo!',
    color: '#d97706', // warm wood
    iconName: 'ShoppingBag',
    category: 'core'
  },
  {
    id: 'apple',
    word: 'apple',
    ipa: '/ˈæpl/',
    syllables: ['ap', 'ple'],
    meaning: '苹果',
    partOfSpeech: 'n.',
    example: 'An apple a day keeps the doctor away!',
    exampleTranslation: '一日一苹果，医生远离我！',
    teacherNote: '发音重点：首字母 a 发短元音 /æ/，结尾 -le 形成成音节 /l/，舌尖抵住上齿龈，气流从舌两侧流出。',
    funFact: 'There are more than 7,500 varieties of apples grown around the world!',
    color: '#ef4444', // red
    iconName: 'Apple',
    category: 'core'
  },
  {
    id: 'apple-tree',
    word: 'apple tree',
    ipa: '/ˈæpl triː/',
    syllables: ['ap', 'ple', 'tree'],
    meaning: '苹果树',
    partOfSpeech: 'n. phr.',
    example: 'The tall apple tree is full of ripe, juicy red apples.',
    exampleTranslation: '高大的苹果树上结满了成熟多汁的红苹果。',
    teacherNote: '复合词组组合：apple + tree。发音时注意 tree 中 tr 辅音连缀发 /tr/，双元辅音结合紧密，长元音 /iː/。',
    funFact: 'An apple tree can live and produce delicious fruit for over 100 years!',
    color: '#15803d', // forest green
    iconName: 'Trees',
    category: 'core'
  },
  {
    id: 'potato',
    word: 'potato',
    ipa: '/pəˈteɪtoʊ/',
    syllables: ['po', 'ta', 'to'],
    meaning: '土豆；马铃薯',
    partOfSpeech: 'n.',
    example: 'The farmer dug fresh potatoes out of the rich dark soil.',
    exampleTranslation: '农夫从肥沃的黑土壤里挖出了新鲜的土豆。',
    teacherNote: '重音规则：三音节单词，重音落在第二音节 /teɪ/ 上。首音节 po 弱读为 /pə/，复数需加 -es: potatoes。',
    funFact: 'Potatoes were the very first vegetable to be grown in outer space in 1995!',
    color: '#b45309', // potato earth brown
    iconName: 'Nut',
    category: 'core'
  }
];

export const BONUS_VOCABULARY: VocabularyWord[] = [
  {
    id: 'tractor',
    word: 'tractor',
    ipa: '/ˈtræktər/',
    syllables: ['trac', 'tor'],
    meaning: '拖拉机',
    partOfSpeech: 'n.',
    example: 'The green tractor helps plow the large fields quickly.',
    exampleTranslation: '绿色的拖拉机帮助迅速耕犁大片田地。',
    teacherNote: '词根 tract 表示"拉、拖"，tractor 即"拖拽的机械"。',
    funFact: 'Modern tractors can even use GPS satellite signals to drive straight automatically!',
    color: '#059669',
    iconName: 'Truck',
    category: 'bonus'
  },
  {
    id: 'soil',
    word: 'soil',
    ipa: '/sɔɪl/',
    syllables: ['soil'],
    meaning: '土壤；泥土',
    partOfSpeech: 'n.',
    example: 'Healthy dark soil makes our farm crops grow tall and strong.',
    exampleTranslation: '肥沃健康的黑土让农作物茁壮成长。',
    teacherNote: '发音重难点：双元音 oi 读 /ɔɪ/，收尾滑动至成音节 /l/。',
    funFact: 'Just one teaspoon of healthy farm soil contains more microorganisms than people on Earth!',
    color: '#78350f',
    iconName: 'Shovel',
    category: 'bonus'
  }
];
