import type { ConfusingPair } from '../features/word-usage/models';

export const CONFUSING_PAIRS: ConfusingPair[] = [
  // ============================================================
  // SPELLING (~12 pairs)
  // ============================================================
  {
    id: 'affect-effect',
    word1: 'affect',
    word2: 'effect',
    category: 'spelling',
    comparison: [
      {
        word: 'affect',
        partOfSpeech: 'verb',
        meaning: 'Ảnh hưởng, tác động đến',
        example: 'The cold weather affected her health.',
        translation: 'Thời tiết lạnh đã ảnh hưởng đến sức khỏe cô ấy.',
      },
      {
        word: 'effect',
        partOfSpeech: 'noun',
        meaning: 'Kết quả, hiệu ứng, tác dụng',
        example: 'The medicine had a positive effect.',
        translation: 'Thuốc có tác dụng tích cực.',
      },
    ],
    commonMistake: 'Người Việt thường nhầm lẫn vì hai từ phát âm gần giống nhau. "Affect" là động từ (hành động), "effect" là danh từ (kết quả).',
    memoryTip: '💡 Nhớ: Affect = Action (cả hai bắt đầu bằng A), Effect = End result (cả hai bắt đầu bằng E).',
    quiz: {
      sentences: [
        {
          sentence: 'The new policy will _____ thousands of workers.',
          correct: 'affect',
          explanation: 'Cần động từ "ảnh hưởng đến" sau will, nên dùng "affect".',
        },
        {
          sentence: 'The medicine had no _____ on me.',
          correct: 'effect',
          explanation: 'Sau "had no" cần danh từ, nên dùng "effect" (tác dụng).',
        },
      ],
    },
  },
  {
    id: 'advice-advise',
    word1: 'advice',
    word2: 'advise',
    category: 'spelling',
    comparison: [
      {
        word: 'advice',
        partOfSpeech: 'noun (không đếm được)',
        meaning: 'Lời khuyên',
        example: 'She gave me good advice.',
        translation: 'Cô ấy cho tôi lời khuyên tốt.',
      },
      {
        word: 'advise',
        partOfSpeech: 'verb',
        meaning: 'Khuyên, khuyên bảo',
        example: 'I advise you to study harder.',
        translation: 'Tôi khuyên bạn nên học chăm hơn.',
      },
    ],
    commonMistake: 'Hay viết nhầm "advice" khi cần động từ. Nhớ rằng "advice" là danh từ không đếm được (không có "an advice").',
    memoryTip: '💡 Advice có "c" như "counsel" (danh từ). Advise có "s" như "suggest" (động từ).',
    quiz: {
      sentences: [
        {
          sentence: 'Can you _____ me on which course to take?',
          correct: 'advise',
          explanation: 'Sau "Can you" cần động từ, nên dùng "advise" (khuyên).',
        },
        {
          sentence: 'Let me give you a piece of _____.',
          correct: 'advice',
          explanation: '"A piece of" đi với danh từ, nên dùng "advice" (lời khuyên).',
        },
      ],
    },
  },
  {
    id: 'loose-lose',
    word1: 'loose',
    word2: 'lose',
    category: 'spelling',
    comparison: [
      {
        word: 'loose',
        partOfSpeech: 'adjective',
        meaning: 'Lỏng, rộng, không chặt',
        example: 'These pants are too loose.',
        translation: 'Cái quần này quá rộng.',
      },
      {
        word: 'lose',
        partOfSpeech: 'verb',
        meaning: 'Mất, thua, đánh mất',
        example: "Don't lose your keys.",
        translation: 'Đừng đánh mất chìa khóa.',
      },
    ],
    commonMistake: 'Rất hay viết "loose" khi muốn nói "mất" (lose). Chỉ khác một chữ "o" nhưng nghĩa hoàn toàn khác.',
    memoryTip: '💡 "Lose" mất một chữ "o" vì nó đã bị ĐÁNH MẤT rồi! "Loose" còn đủ hai chữ "oo" vì nó RỘNG quá.',
    quiz: {
      sentences: [
        {
          sentence: 'I always _____ my phone.',
          correct: 'lose',
          explanation: 'Cần động từ "đánh mất", dùng "lose".',
        },
        {
          sentence: 'The screw is _____. Tighten it.',
          correct: 'loose',
          explanation: 'Cần tính từ "lỏng", dùng "loose".',
        },
      ],
    },
  },
  {
    id: 'quite-quiet',
    word1: 'quite',
    word2: 'quiet',
    category: 'spelling',
    comparison: [
      {
        word: 'quite',
        partOfSpeech: 'adverb',
        meaning: 'Khá, tương đối, hoàn toàn',
        example: 'The test was quite difficult.',
        translation: 'Bài kiểm tra khá khó.',
      },
      {
        word: 'quiet',
        partOfSpeech: 'adjective',
        meaning: 'Yên tĩnh, im lặng',
        example: 'Please be quiet in the library.',
        translation: 'Xin hãy im lặng trong thư viện.',
      },
    ],
    commonMistake: 'Hai từ chỉ khác nhau thứ tự "e" và "t" nhưng nghĩa hoàn toàn khác biệt.',
    memoryTip: '💡 "Quiet" có chữ "i" ở giữa - tưởng tượng ngón tay đặt lên môi ra hiệu "suỵt, im lặng!".',
    quiz: {
      sentences: [
        {
          sentence: 'The movie was _____ interesting.',
          correct: 'quite',
          explanation: 'Cần trạng từ "khá" để bổ nghĩa cho "interesting", dùng "quite".',
        },
        {
          sentence: 'The baby is sleeping, please be _____.',
          correct: 'quiet',
          explanation: 'Cần tính từ "yên tĩnh", dùng "quiet".',
        },
      ],
    },
  },
  {
    id: 'principal-principle',
    word1: 'principal',
    word2: 'principle',
    category: 'spelling',
    comparison: [
      {
        word: 'principal',
        partOfSpeech: 'noun / adjective',
        meaning: 'Hiệu trưởng; chính, chủ yếu',
        example: 'The principal announced the new rules.',
        translation: 'Hiệu trưởng công bố các quy định mới.',
      },
      {
        word: 'principle',
        partOfSpeech: 'noun',
        meaning: 'Nguyên tắc, nguyên lý',
        example: 'He is a man of principle.',
        translation: 'Ông ấy là người có nguyên tắc.',
      },
    ],
    commonMistake: 'Hai từ phát âm giống nhau hoàn toàn nên rất dễ viết nhầm.',
    memoryTip: '💡 PrinciPAL - hiệu trưởng là PAL (bạn) của bạn. PrinciPLE - nguyên tắc là RULE (quy tắc, kết thúc bằng LE).',
    quiz: {
      sentences: [
        {
          sentence: 'The _____ of the school gave a speech.',
          correct: 'principal',
          explanation: 'Nói về hiệu trưởng, dùng "principal".',
        },
        {
          sentence: 'Honesty is an important _____.',
          correct: 'principle',
          explanation: 'Nói về nguyên tắc sống, dùng "principle".',
        },
      ],
    },
  },
  {
    id: 'stationary-stationery',
    word1: 'stationary',
    word2: 'stationery',
    category: 'spelling',
    comparison: [
      {
        word: 'stationary',
        partOfSpeech: 'adjective',
        meaning: 'Đứng yên, không di chuyển',
        example: 'The car remained stationary.',
        translation: 'Chiếc xe vẫn đứng yên.',
      },
      {
        word: 'stationery',
        partOfSpeech: 'noun',
        meaning: 'Văn phòng phẩm (giấy, bút,...)',
        example: 'I need to buy some stationery for school.',
        translation: 'Tôi cần mua văn phòng phẩm cho trường.',
      },
    ],
    commonMistake: 'Chỉ khác nhau một chữ cái: "a" vs "e" ở vị trí gần cuối.',
    memoryTip: '💡 StationERY có chữ "e" như "envelope" (phong bì) - đều là văn phòng phẩm. StationARY có chữ "a" như "stay" (đứng yên).',
    quiz: {
      sentences: [
        {
          sentence: 'The bus was _____ at the traffic light.',
          correct: 'stationary',
          explanation: 'Xe buýt đứng yên, dùng "stationary".',
        },
        {
          sentence: 'She bought pens and other _____ for the office.',
          correct: 'stationery',
          explanation: 'Mua bút và đồ dùng văn phòng, dùng "stationery".',
        },
      ],
    },
  },
  {
    id: 'complement-compliment',
    word1: 'complement',
    word2: 'compliment',
    category: 'spelling',
    comparison: [
      {
        word: 'complement',
        partOfSpeech: 'noun / verb',
        meaning: 'Bổ sung, phần bổ trợ',
        example: 'Red wine complements steak perfectly.',
        translation: 'Rượu vang đỏ bổ sung hoàn hảo cho bít tết.',
      },
      {
        word: 'compliment',
        partOfSpeech: 'noun / verb',
        meaning: 'Lời khen, khen ngợi',
        example: 'She received many compliments on her dress.',
        translation: 'Cô ấy nhận được nhiều lời khen về chiếc váy.',
      },
    ],
    commonMistake: 'Chỉ khác "e" và "i" ở giữa từ nhưng nghĩa rất khác nhau.',
    memoryTip: '💡 ComplEment = complEte (bổ sung cho đầy đủ). ComplIment = "I" like you (tôi khen bạn).',
    quiz: {
      sentences: [
        {
          sentence: 'That scarf really _____ your outfit.',
          correct: 'complements',
          explanation: 'Khăn "bổ sung, làm hoàn thiện" bộ trang phục, dùng "complements".',
        },
        {
          sentence: 'He paid her a nice _____ about her cooking.',
          correct: 'compliment',
          explanation: 'Anh ấy "khen" việc nấu ăn, dùng "compliment".',
        },
      ],
    },
  },
  {
    id: 'desert-dessert',
    word1: 'desert',
    word2: 'dessert',
    category: 'spelling',
    comparison: [
      {
        word: 'desert',
        partOfSpeech: 'noun',
        meaning: 'Sa mạc',
        example: 'The Sahara is the largest desert in Africa.',
        translation: 'Sahara là sa mạc lớn nhất châu Phi.',
      },
      {
        word: 'dessert',
        partOfSpeech: 'noun',
        meaning: 'Món tráng miệng',
        example: 'We had ice cream for dessert.',
        translation: 'Chúng tôi ăn kem tráng miệng.',
      },
    ],
    commonMistake: 'Rất hay nhầm số chữ "s". Desert (1 chữ s) = sa mạc, dessert (2 chữ s) = tráng miệng.',
    memoryTip: '💡 Dessert có 2 chữ "s" vì bạn luôn muốn ăn thêm (second serving). Desert có 1 chữ "s" vì sa mạc thiếu mọi thứ.',
    quiz: {
      sentences: [
        {
          sentence: 'The camel walked across the hot _____.',
          correct: 'desert',
          explanation: 'Lạc đà đi qua sa mạc, dùng "desert" (1 chữ s).',
        },
        {
          sentence: 'What would you like for _____? Cake or fruit?',
          correct: 'dessert',
          explanation: 'Hỏi về món tráng miệng, dùng "dessert" (2 chữ s).',
        },
      ],
    },
  },
  {
    id: 'accept-except',
    word1: 'accept',
    word2: 'except',
    category: 'spelling',
    comparison: [
      {
        word: 'accept',
        partOfSpeech: 'verb',
        meaning: 'Chấp nhận, đồng ý nhận',
        example: 'She accepted the job offer.',
        translation: 'Cô ấy chấp nhận lời mời làm việc.',
      },
      {
        word: 'except',
        partOfSpeech: 'preposition / conjunction',
        meaning: 'Ngoại trừ, trừ ra',
        example: 'Everyone passed except Tom.',
        translation: 'Mọi người đều đậu ngoại trừ Tom.',
      },
    ],
    commonMistake: 'Phát âm khá giống nhau, dễ nhầm khi viết. "Accept" bắt đầu bằng "ac-", "except" bắt đầu bằng "ex-".',
    memoryTip: '💡 ACcept = ACquire (nhận lấy). EXcept = EXclude (loại trừ).',
    quiz: {
      sentences: [
        {
          sentence: 'I _____ your apology.',
          correct: 'accept',
          explanation: 'Chấp nhận lời xin lỗi, dùng "accept".',
        },
        {
          sentence: 'All students passed _____ John.',
          correct: 'except',
          explanation: 'Ngoại trừ John, dùng "except".',
        },
      ],
    },
  },
  {
    id: 'emigrate-immigrate',
    word1: 'emigrate',
    word2: 'immigrate',
    category: 'spelling',
    comparison: [
      {
        word: 'emigrate',
        partOfSpeech: 'verb',
        meaning: 'Di cư (rời khỏi nước)',
        example: 'They emigrated from Vietnam in 1990.',
        translation: 'Họ di cư khỏi Việt Nam năm 1990.',
      },
      {
        word: 'immigrate',
        partOfSpeech: 'verb',
        meaning: 'Nhập cư (vào nước khác)',
        example: 'Many people immigrate to the US every year.',
        translation: 'Nhiều người nhập cư vào Mỹ mỗi năm.',
      },
    ],
    commonMistake: 'Người Việt hay nhầm vì tiếng Việt thường chỉ dùng một từ "di cư". Emigrate = rời đi, immigrate = đến nơi mới.',
    memoryTip: '💡 Emigrate = Exit (rời khỏi). Immigrate = In (vào trong). Cùng bắt đầu bằng chữ cái giống nhau!',
    quiz: {
      sentences: [
        {
          sentence: 'His family _____ from Italy to find a better life.',
          correct: 'emigrated',
          explanation: 'Rời khỏi Italy, dùng "emigrated" (di cư đi).',
        },
        {
          sentence: 'Thousands of people _____ to Canada each year.',
          correct: 'immigrate',
          explanation: 'Đến Canada (nhập cư vào), dùng "immigrate".',
        },
      ],
    },
  },
  {
    id: 'ensure-insure',
    word1: 'ensure',
    word2: 'insure',
    category: 'spelling',
    comparison: [
      {
        word: 'ensure',
        partOfSpeech: 'verb',
        meaning: 'Đảm bảo, chắc chắn',
        example: 'Please ensure the door is locked.',
        translation: 'Xin hãy đảm bảo cửa đã khóa.',
      },
      {
        word: 'insure',
        partOfSpeech: 'verb',
        meaning: 'Bảo hiểm, mua bảo hiểm',
        example: 'You should insure your car.',
        translation: 'Bạn nên mua bảo hiểm cho xe.',
      },
    ],
    commonMistake: 'Cả hai đều liên quan đến "bảo đảm" nhưng "insure" chỉ dùng cho bảo hiểm tài chính.',
    memoryTip: '💡 INsure = INsurance (bảo hiểm). Ensure = make sure (chắc chắn, đảm bảo chung).',
    quiz: {
      sentences: [
        {
          sentence: 'Please _____ that all windows are closed before leaving.',
          correct: 'ensure',
          explanation: 'Đảm bảo chắc chắn, dùng "ensure".',
        },
        {
          sentence: 'Did you _____ the house against fire?',
          correct: 'insure',
          explanation: 'Mua bảo hiểm cho nhà, dùng "insure".',
        },
      ],
    },
  },
  {
    id: 'weather-whether',
    word1: 'weather',
    word2: 'whether',
    category: 'spelling',
    comparison: [
      {
        word: 'weather',
        partOfSpeech: 'noun',
        meaning: 'Thời tiết',
        example: 'The weather is beautiful today.',
        translation: 'Thời tiết hôm nay đẹp.',
      },
      {
        word: 'whether',
        partOfSpeech: 'conjunction',
        meaning: 'Liệu có... hay không',
        example: "I don't know whether he will come.",
        translation: 'Tôi không biết liệu anh ấy có đến không.',
      },
    ],
    commonMistake: 'Phát âm hoàn toàn giống nhau nên hay viết nhầm. "Weather" nói về trời, "whether" nói về sự lựa chọn.',
    memoryTip: '💡 weATHER có "eat" trong đó - bạn ĂN ngoài trời khi thời tiết đẹp. wHETHER có "he" - liệu HE có đến không?',
    quiz: {
      sentences: [
        {
          sentence: 'The _____ forecast says it will rain tomorrow.',
          correct: 'weather',
          explanation: 'Dự báo thời tiết, dùng "weather".',
        },
        {
          sentence: "I can't decide _____ to go or stay.",
          correct: 'whether',
          explanation: 'Lựa chọn giữa đi hay ở, dùng "whether".',
        },
      ],
    },
  },

  // ============================================================
  // MEANING (~15 pairs)
  // ============================================================
  {
    id: 'borrow-lend',
    word1: 'borrow',
    word2: 'lend',
    category: 'meaning',
    comparison: [
      {
        word: 'borrow',
        partOfSpeech: 'verb',
        meaning: 'Mượn (lấy từ người khác)',
        example: 'Can I borrow your pen?',
        translation: 'Tôi mượn bút của bạn được không?',
      },
      {
        word: 'lend',
        partOfSpeech: 'verb',
        meaning: 'Cho mượn (đưa cho người khác)',
        example: 'Can you lend me your pen?',
        translation: 'Bạn cho tôi mượn bút được không?',
      },
    ],
    commonMistake: 'Người Việt thường nói "Can you borrow me...?" vì tiếng Việt chỉ dùng "mượn" cho cả hai chiều. Phải nói "Can you lend me...?".',
    memoryTip: '💡 Borrow = nhận VỀ phía mình. Lend = đưa ĐI khỏi mình. Hướng của đồ vật là chìa khóa!',
    quiz: {
      sentences: [
        {
          sentence: 'Could you _____ me some money until Friday?',
          correct: 'lend',
          explanation: 'Nhờ người khác cho mượn tiền, dùng "lend" (cho mượn).',
        },
        {
          sentence: 'I need to _____ a book from the library.',
          correct: 'borrow',
          explanation: 'Lấy sách từ thư viện về, dùng "borrow" (mượn).',
        },
      ],
    },
  },
  {
    id: 'bring-take',
    word1: 'bring',
    word2: 'take',
    category: 'meaning',
    comparison: [
      {
        word: 'bring',
        partOfSpeech: 'verb',
        meaning: 'Mang đến, đem đến (hướng về phía người nói)',
        example: 'Bring me a glass of water, please.',
        translation: 'Mang cho tôi một ly nước nhé.',
      },
      {
        word: 'take',
        partOfSpeech: 'verb',
        meaning: 'Mang đi, đem đi (rời khỏi người nói)',
        example: 'Take this letter to the post office.',
        translation: 'Mang lá thư này đến bưu điện.',
      },
    ],
    commonMistake: 'Tiếng Việt dùng "mang" cho cả hai, nhưng tiếng Anh phân biệt hướng di chuyển: bring = đến, take = đi.',
    memoryTip: '💡 Bring = come + carry (mang ĐẾN). Take = go + carry (mang ĐI). Nghĩ về hướng di chuyển!',
    quiz: {
      sentences: [
        {
          sentence: "Don't forget to _____ your umbrella when you go out.",
          correct: 'take',
          explanation: 'Mang theo khi đi ra ngoài (rời khỏi), dùng "take".',
        },
        {
          sentence: 'Can you _____ some snacks to the party tonight?',
          correct: 'bring',
          explanation: 'Mang đồ ăn đến buổi tiệc, dùng "bring".',
        },
      ],
    },
  },
  {
    id: 'say-tell',
    word1: 'say',
    word2: 'tell',
    category: 'meaning',
    comparison: [
      {
        word: 'say',
        partOfSpeech: 'verb',
        meaning: 'Nói (tập trung vào lời nói)',
        example: 'She said that she was tired.',
        translation: 'Cô ấy nói rằng cô ấy mệt.',
      },
      {
        word: 'tell',
        partOfSpeech: 'verb',
        meaning: 'Kể, bảo (nói với ai đó)',
        example: 'She told me that she was tired.',
        translation: 'Cô ấy bảo tôi rằng cô ấy mệt.',
      },
    ],
    commonMistake: 'Hay nhầm "She said me..." (sai). Say không đi trực tiếp với người nghe, phải dùng "say to me" hoặc "tell me".',
    memoryTip: '💡 Say = nói (lời nói). Tell = bảo ai đó (cần người nghe). Tell luôn cần túc từ (tell someone).',
    quiz: {
      sentences: [
        {
          sentence: 'He _____ me a funny story yesterday.',
          correct: 'told',
          explanation: 'Kể cho ai nghe (có túc từ "me"), dùng "told".',
        },
        {
          sentence: 'What did she _____?',
          correct: 'say',
          explanation: 'Hỏi về lời nói (không có người nghe cụ thể), dùng "say".',
        },
      ],
    },
  },
  {
    id: 'watch-look',
    word1: 'watch',
    word2: 'look',
    category: 'meaning',
    comparison: [
      {
        word: 'watch',
        partOfSpeech: 'verb',
        meaning: 'Xem, theo dõi (chuyển động, diễn biến)',
        example: "I like to watch movies on weekends.",
        translation: 'Tôi thích xem phim vào cuối tuần.',
      },
      {
        word: 'look',
        partOfSpeech: 'verb',
        meaning: 'Nhìn (chủ động hướng mắt về phía)',
        example: 'Look at this beautiful painting!',
        translation: 'Nhìn bức tranh đẹp này!',
      },
    ],
    commonMistake: 'Tiếng Việt dùng "nhìn/xem" khá linh hoạt, nhưng tiếng Anh phân biệt: watch = theo dõi diễn biến, look = hướng mắt nhìn.',
    memoryTip: '💡 Watch = xem CÓ CHUYỂN ĐỘNG (phim, trận đấu). Look = nhìn TĨNH (tranh, ảnh). "Look at" cần giới từ "at"!',
    quiz: {
      sentences: [
        {
          sentence: "Let's _____ the football match tonight.",
          correct: 'watch',
          explanation: 'Theo dõi trận đấu (có chuyển động), dùng "watch".',
        },
        {
          sentence: '_____ at the stars! They are so bright.',
          correct: 'Look',
          explanation: 'Hướng mắt nhìn lên trời, dùng "Look" (+ at).',
        },
      ],
    },
  },
  {
    id: 'hear-listen',
    word1: 'hear',
    word2: 'listen',
    category: 'meaning',
    comparison: [
      {
        word: 'hear',
        partOfSpeech: 'verb',
        meaning: 'Nghe thấy (tự nhiên, không chủ ý)',
        example: 'I can hear music from the next room.',
        translation: 'Tôi nghe thấy nhạc từ phòng bên.',
      },
      {
        word: 'listen',
        partOfSpeech: 'verb',
        meaning: 'Lắng nghe (chủ ý, tập trung)',
        example: 'Listen to the teacher carefully.',
        translation: 'Hãy lắng nghe cô giáo cẩn thận.',
      },
    ],
    commonMistake: 'Tiếng Việt nói "nghe" cho cả hai. "Hear" là tự nhiên nghe thấy, "listen" là cố ý lắng nghe.',
    memoryTip: '💡 Hear = tai tự nghe thấy (tự động). Listen = chủ động tập trung lắng nghe (cần cố gắng). "Listen to" cần giới từ "to"!',
    quiz: {
      sentences: [
        {
          sentence: 'Can you _____ that strange noise?',
          correct: 'hear',
          explanation: 'Nghe thấy tiếng lạ (không chủ ý), dùng "hear".',
        },
        {
          sentence: 'You should _____ to your parents.',
          correct: 'listen',
          explanation: 'Chủ động lắng nghe lời bố mẹ, dùng "listen".',
        },
      ],
    },
  },
  {
    id: 'learn-teach',
    word1: 'learn',
    word2: 'teach',
    category: 'meaning',
    comparison: [
      {
        word: 'learn',
        partOfSpeech: 'verb',
        meaning: 'Học (tiếp thu kiến thức)',
        example: "I'm learning English.",
        translation: 'Tôi đang học tiếng Anh.',
      },
      {
        word: 'teach',
        partOfSpeech: 'verb',
        meaning: 'Dạy (truyền đạt kiến thức)',
        example: 'She teaches English at a high school.',
        translation: 'Cô ấy dạy tiếng Anh ở trường cấp 3.',
      },
    ],
    commonMistake: 'Hay nhầm "He learned me English" (sai). Phải nói "He taught me English". Learn = học, teach = dạy.',
    memoryTip: '💡 Learn = bạn NHẬN kiến thức. Teach = bạn CHO kiến thức. Hai hướng ngược nhau!',
    quiz: {
      sentences: [
        {
          sentence: 'My mother _____ me how to cook.',
          correct: 'taught',
          explanation: 'Mẹ DẠY cho tôi nấu ăn, dùng "taught" (quá khứ của teach).',
        },
        {
          sentence: 'I want to _____ how to play the guitar.',
          correct: 'learn',
          explanation: 'Muốn HỌC chơi guitar, dùng "learn".',
        },
      ],
    },
  },
  {
    id: 'remember-remind',
    word1: 'remember',
    word2: 'remind',
    category: 'meaning',
    comparison: [
      {
        word: 'remember',
        partOfSpeech: 'verb',
        meaning: 'Nhớ (tự nhớ ra)',
        example: 'I remember my first day at school.',
        translation: 'Tôi nhớ ngày đầu tiên đi học.',
      },
      {
        word: 'remind',
        partOfSpeech: 'verb',
        meaning: 'Nhắc nhở (làm ai nhớ ra)',
        example: 'Remind me to call the doctor.',
        translation: 'Nhắc tôi gọi cho bác sĩ nhé.',
      },
    ],
    commonMistake: 'Hay nói "Please remember me to..." (sai). Phải nói "Please remind me to...". Remember = tự nhớ, remind = nhắc ai.',
    memoryTip: '💡 Remember = RE (lại) + MEMBER (thành viên) - tự nhớ lại. Remind = RE + MIND - đưa vào tâm trí AI ĐÓ.',
    quiz: {
      sentences: [
        {
          sentence: 'Please _____ me to buy milk on the way home.',
          correct: 'remind',
          explanation: 'Nhờ nhắc nhở (tác động đến người khác), dùng "remind".',
        },
        {
          sentence: 'Do you _____ the name of that restaurant?',
          correct: 'remember',
          explanation: 'Tự nhớ ra tên nhà hàng, dùng "remember".',
        },
      ],
    },
  },
  {
    id: 'rob-steal',
    word1: 'rob',
    word2: 'steal',
    category: 'meaning',
    comparison: [
      {
        word: 'rob',
        partOfSpeech: 'verb',
        meaning: 'Cướp (người hoặc nơi chốn)',
        example: 'They robbed the bank yesterday.',
        translation: 'Họ cướp ngân hàng hôm qua.',
      },
      {
        word: 'steal',
        partOfSpeech: 'verb',
        meaning: 'Ăn cắp, đánh cắp (đồ vật)',
        example: 'Someone stole my wallet.',
        translation: 'Ai đó đã ăn cắp ví của tôi.',
      },
    ],
    commonMistake: 'Hay nhầm "They robbed my wallet" (sai). Rob + người/nơi, steal + đồ vật. Nói "rob someone OF something".',
    memoryTip: '💡 Rob = cướp NGƯỜI/NƠI (rob a person, rob a bank). Steal = lấy ĐỒ (steal money, steal a car).',
    quiz: {
      sentences: [
        {
          sentence: 'Someone _____ my bicycle last night.',
          correct: 'stole',
          explanation: 'Lấy cắp đồ vật (xe đạp), dùng "stole" (quá khứ của steal).',
        },
        {
          sentence: 'The masked men _____ the jewelry store.',
          correct: 'robbed',
          explanation: 'Cướp một nơi chốn (tiệm vàng), dùng "robbed".',
        },
      ],
    },
  },
  {
    id: 'hope-wish',
    word1: 'hope',
    word2: 'wish',
    category: 'meaning',
    comparison: [
      {
        word: 'hope',
        partOfSpeech: 'verb',
        meaning: 'Hy vọng (có thể xảy ra)',
        example: 'I hope it will be sunny tomorrow.',
        translation: 'Tôi hy vọng ngày mai trời nắng.',
      },
      {
        word: 'wish',
        partOfSpeech: 'verb',
        meaning: 'Ước (khó hoặc không thể xảy ra)',
        example: 'I wish I could fly.',
        translation: 'Tôi ước tôi có thể bay.',
      },
    ],
    commonMistake: 'Hay dùng "hope" khi nên dùng "wish" cho điều không thể. "I hope I could fly" (sai) -> "I wish I could fly".',
    memoryTip: '💡 Hope = CÓ KHẢ NĂNG xảy ra (thực tế). Wish = KHÓ/KHÔNG THỂ xảy ra (ước mơ). Wish thường đi với quá khứ giả định.',
    quiz: {
      sentences: [
        {
          sentence: 'I _____ you a Merry Christmas!',
          correct: 'wish',
          explanation: 'Chúc mừng ai đó, dùng "wish".',
        },
        {
          sentence: 'I _____ the weather will be nice for the picnic.',
          correct: 'hope',
          explanation: 'Hy vọng điều có thể xảy ra, dùng "hope".',
        },
      ],
    },
  },
  {
    id: 'trip-travel',
    word1: 'trip',
    word2: 'travel',
    category: 'meaning',
    comparison: [
      {
        word: 'trip',
        partOfSpeech: 'noun',
        meaning: 'Chuyến đi (cụ thể, ngắn)',
        example: 'We took a trip to Da Lat last weekend.',
        translation: 'Chúng tôi đi Đà Lạt cuối tuần trước.',
      },
      {
        word: 'travel',
        partOfSpeech: 'verb / noun',
        meaning: 'Du lịch, đi lại (nói chung)',
        example: 'I love to travel around the world.',
        translation: 'Tôi thích du lịch vòng quanh thế giới.',
      },
    ],
    commonMistake: 'Hay nhầm "I went to a travel to..." (sai). Trip là danh từ đếm được (a trip), travel chủ yếu dùng như động từ.',
    memoryTip: '💡 Trip = một chuyến đi CỤ THỂ (a business trip, a day trip). Travel = hoạt động đi lại NÓI CHUNG (I love travel).',
    quiz: {
      sentences: [
        {
          sentence: 'How was your _____ to Japan?',
          correct: 'trip',
          explanation: 'Một chuyến đi cụ thể, dùng "trip".',
        },
        {
          sentence: 'He likes to _____ by train.',
          correct: 'travel',
          explanation: 'Hoạt động đi lại nói chung, dùng "travel" (động từ).',
        },
      ],
    },
  },
  {
    id: 'job-work',
    word1: 'job',
    word2: 'work',
    category: 'meaning',
    comparison: [
      {
        word: 'job',
        partOfSpeech: 'noun (đếm được)',
        meaning: 'Công việc (vị trí cụ thể)',
        example: 'She got a new job at Google.',
        translation: 'Cô ấy có công việc mới ở Google.',
      },
      {
        word: 'work',
        partOfSpeech: 'noun (không đếm được) / verb',
        meaning: 'Công việc (nói chung), làm việc',
        example: 'I have a lot of work to do today.',
        translation: 'Tôi có nhiều việc phải làm hôm nay.',
      },
    ],
    commonMistake: 'Hay nói "I have many works" (sai) vì work không đếm được. Nói "much work" hoặc "many jobs".',
    memoryTip: '💡 Job = danh từ ĐẾM ĐƯỢC, vị trí cụ thể (a job, two jobs). Work = KHÔNG ĐẾM ĐƯỢC, hoạt động làm việc chung.',
    quiz: {
      sentences: [
        {
          sentence: 'He is looking for a _____ in marketing.',
          correct: 'job',
          explanation: 'Tìm một vị trí công việc cụ thể, dùng "job".',
        },
        {
          sentence: "I can't go out tonight. I have too much _____.",
          correct: 'work',
          explanation: 'Nhiều việc phải làm (nói chung), dùng "work".',
        },
      ],
    },
  },
  {
    id: 'house-home',
    word1: 'house',
    word2: 'home',
    category: 'meaning',
    comparison: [
      {
        word: 'house',
        partOfSpeech: 'noun',
        meaning: 'Ngôi nhà (tòa nhà vật lý)',
        example: 'They built a new house last year.',
        translation: 'Họ xây ngôi nhà mới năm ngoái.',
      },
      {
        word: 'home',
        partOfSpeech: 'noun / adverb',
        meaning: 'Nhà (nơi ở, mái ấm)',
        example: "Let's go home.",
        translation: 'Chúng ta về nhà đi.',
      },
    ],
    commonMistake: 'Hay nói "go to home" (sai). "Home" khi là trạng từ không cần "to". Nói "go home" (không có to).',
    memoryTip: '💡 House = tòa nhà VẬT LÝ (mua, bán, xây). Home = mái ấm TÌNH CẢM (gia đình, thuộc về). "Go home" không có "to"!',
    quiz: {
      sentences: [
        {
          sentence: 'This _____ has three bedrooms and two bathrooms.',
          correct: 'house',
          explanation: 'Mô tả cấu trúc vật lý của tòa nhà, dùng "house".',
        },
        {
          sentence: "There's no place like _____.",
          correct: 'home',
          explanation: 'Nói về mái ấm, nơi thuộc về, dùng "home".',
        },
      ],
    },
  },
  {
    id: 'fun-funny',
    word1: 'fun',
    word2: 'funny',
    category: 'meaning',
    comparison: [
      {
        word: 'fun',
        partOfSpeech: 'noun / adjective',
        meaning: 'Vui, thú vị (niềm vui)',
        example: 'We had a lot of fun at the beach.',
        translation: 'Chúng tôi rất vui ở bãi biển.',
      },
      {
        word: 'funny',
        partOfSpeech: 'adjective',
        meaning: 'Buồn cười, hài hước',
        example: 'That joke was really funny.',
        translation: 'Câu đùa đó thật buồn cười.',
      },
    ],
    commonMistake: 'Hay nói "The party was very funny" khi muốn nói "vui" (sai). Party thì "fun" chứ không "funny" (buồn cười).',
    memoryTip: '💡 Fun = vui vẻ, thú vị (có thể là danh từ). Funny = buồn cười, gây cười (luôn là tính từ).',
    quiz: {
      sentences: [
        {
          sentence: 'The comedy show was so _____! I laughed a lot.',
          correct: 'funny',
          explanation: 'Buồn cười, gây cười, dùng "funny".',
        },
        {
          sentence: "Swimming in the pool is _____. Let's do it again!",
          correct: 'fun',
          explanation: 'Vui vẻ, thú vị, dùng "fun".',
        },
      ],
    },
  },
  {
    id: 'beside-besides',
    word1: 'beside',
    word2: 'besides',
    category: 'meaning',
    comparison: [
      {
        word: 'beside',
        partOfSpeech: 'preposition',
        meaning: 'Bên cạnh (vị trí)',
        example: 'She sat beside me on the bus.',
        translation: 'Cô ấy ngồi bên cạnh tôi trên xe buýt.',
      },
      {
        word: 'besides',
        partOfSpeech: 'preposition / adverb',
        meaning: 'Ngoài ra, bên cạnh đó',
        example: "Besides English, she also speaks French.",
        translation: 'Ngoài tiếng Anh, cô ấy còn nói tiếng Pháp.',
      },
    ],
    commonMistake: 'Chỉ khác chữ "s" cuối nhưng nghĩa hoàn toàn khác. "Beside" = vị trí, "besides" = thêm vào đó.',
    memoryTip: '💡 Beside (không s) = bên cạnh (VỊ TRÍ). Besides (có s) = ngoài ra (THÊM VÀO). Chữ "s" thêm vào = "thêm" ý nghĩa!',
    quiz: {
      sentences: [
        {
          sentence: 'Come and sit _____ me.',
          correct: 'beside',
          explanation: 'Ngồi bên cạnh (vị trí không gian), dùng "beside".',
        },
        {
          sentence: '_____ being smart, she is also very kind.',
          correct: 'Besides',
          explanation: 'Ngoài ra, thêm vào đó, dùng "Besides".',
        },
      ],
    },
  },
  {
    id: 'historic-historical',
    word1: 'historic',
    word2: 'historical',
    category: 'meaning',
    comparison: [
      {
        word: 'historic',
        partOfSpeech: 'adjective',
        meaning: 'Lịch sử, có ý nghĩa lịch sử',
        example: 'The moon landing was a historic event.',
        translation: 'Việc đổ bộ lên mặt trăng là sự kiện lịch sử.',
      },
      {
        word: 'historical',
        partOfSpeech: 'adjective',
        meaning: 'Thuộc về lịch sử, liên quan đến lịch sử',
        example: 'This is a historical novel set in the 18th century.',
        translation: 'Đây là tiểu thuyết lịch sử lấy bối cảnh thế kỷ 18.',
      },
    ],
    commonMistake: 'Historic = quan trọng, đáng ghi nhớ trong lịch sử. Historical = liên quan đến quá khứ nói chung.',
    memoryTip: '💡 Historic = QUAN TRỌNG, đáng nhớ (historic moment). Historical = THUỘC VỀ quá khứ (historical data, historical novel).',
    quiz: {
      sentences: [
        {
          sentence: "The signing of the treaty was a _____ moment for the country.",
          correct: 'historic',
          explanation: 'Khoảnh khắc quan trọng, đáng ghi nhớ, dùng "historic".',
        },
        {
          sentence: 'The museum has a large collection of _____ artifacts.',
          correct: 'historical',
          explanation: 'Hiện vật thuộc về lịch sử, dùng "historical".',
        },
      ],
    },
  },

  // ============================================================
  // GRAMMAR (~10 pairs)
  // ============================================================
  {
    id: 'lie-lay',
    word1: 'lie',
    word2: 'lay',
    category: 'grammar',
    comparison: [
      {
        word: 'lie',
        partOfSpeech: 'verb (nội động từ)',
        meaning: 'Nằm (tự mình nằm)',
        example: 'I want to lie down on the sofa.',
        translation: 'Tôi muốn nằm xuống ghế sofa.',
      },
      {
        word: 'lay',
        partOfSpeech: 'verb (ngoại động từ)',
        meaning: 'Đặt, để (đặt vật gì xuống)',
        example: 'Lay the book on the table.',
        translation: 'Đặt cuốn sách lên bàn.',
      },
    ],
    commonMistake: 'Rất dễ nhầm vì quá khứ của "lie" là "lay"! lie-lay-lain (nằm) vs lay-laid-laid (đặt).',
    memoryTip: '💡 Lie = tự NẰM (không cần túc từ). Lay = ĐẶT vật gì (cần túc từ). "Lay" luôn cần đối tượng phía sau!',
    quiz: {
      sentences: [
        {
          sentence: 'Please _____ the baby in the crib gently.',
          correct: 'lay',
          explanation: 'Đặt em bé xuống (cần túc từ "the baby"), dùng "lay".',
        },
        {
          sentence: "I'm tired. I need to _____ down for a while.",
          correct: 'lie',
          explanation: 'Tự mình nằm xuống (không có túc từ), dùng "lie".',
        },
      ],
    },
  },
  {
    id: 'rise-raise',
    word1: 'rise',
    word2: 'raise',
    category: 'grammar',
    comparison: [
      {
        word: 'rise',
        partOfSpeech: 'verb (nội động từ)',
        meaning: 'Tăng lên, mọc lên (tự nó)',
        example: 'The sun rises in the east.',
        translation: 'Mặt trời mọc ở phía đông.',
      },
      {
        word: 'raise',
        partOfSpeech: 'verb (ngoại động từ)',
        meaning: 'Nâng lên, tăng lên (do tác động)',
        example: 'Raise your hand if you have a question.',
        translation: 'Giơ tay lên nếu bạn có câu hỏi.',
      },
    ],
    commonMistake: 'Hay nhầm "The price raised" (sai). Giá tự tăng thì dùng "rose" (quá khứ của rise).',
    memoryTip: '💡 Rise = TỰ lên (mặt trời mọc, giá tăng). Raise = AI ĐÓ nâng lên (giơ tay, tăng lương). Raise luôn cần túc từ!',
    quiz: {
      sentences: [
        {
          sentence: 'The company decided to _____ salaries by 10%.',
          correct: 'raise',
          explanation: 'Công ty quyết định tăng lương (tác động), dùng "raise".',
        },
        {
          sentence: 'Prices have _____ significantly this year.',
          correct: 'risen',
          explanation: 'Giá tự tăng lên (không ai tác động), dùng "risen" (quá khứ phân từ của rise).',
        },
      ],
    },
  },
  {
    id: 'sit-set',
    word1: 'sit',
    word2: 'set',
    category: 'grammar',
    comparison: [
      {
        word: 'sit',
        partOfSpeech: 'verb (nội động từ)',
        meaning: 'Ngồi (tự mình ngồi)',
        example: 'Please sit down.',
        translation: 'Xin hãy ngồi xuống.',
      },
      {
        word: 'set',
        partOfSpeech: 'verb (ngoại động từ)',
        meaning: 'Đặt, để, thiết lập',
        example: 'Set the vase on the shelf.',
        translation: 'Đặt bình hoa lên kệ.',
      },
    ],
    commonMistake: 'Giống cặp lie/lay, sit là nội động từ (không cần túc từ), set là ngoại động từ (cần túc từ).',
    memoryTip: '💡 Sit = tự NGỒI (sit down). Set = ĐẶT vật gì (set the table). Quy tắc giống lie/lay và rise/raise!',
    quiz: {
      sentences: [
        {
          sentence: 'Could you _____ the alarm for 6 AM?',
          correct: 'set',
          explanation: 'Đặt (cài) đồng hồ báo thức (cần túc từ), dùng "set".',
        },
        {
          sentence: 'Come and _____ next to me.',
          correct: 'sit',
          explanation: 'Tự ngồi xuống (không cần túc từ), dùng "sit".',
        },
      ],
    },
  },
  {
    id: 'who-whom',
    word1: 'who',
    word2: 'whom',
    category: 'grammar',
    comparison: [
      {
        word: 'who',
        partOfSpeech: 'pronoun (chủ ngữ)',
        meaning: 'Ai (làm chủ ngữ)',
        example: 'Who called you yesterday?',
        translation: 'Ai đã gọi cho bạn hôm qua?',
      },
      {
        word: 'whom',
        partOfSpeech: 'pronoun (tân ngữ)',
        meaning: 'Ai (làm tân ngữ)',
        example: 'To whom did you give the letter?',
        translation: 'Bạn đưa lá thư cho ai?',
      },
    ],
    commonMistake: 'Nhiều người bỏ qua "whom" hoàn toàn. Trong văn viết trang trọng, dùng "whom" khi nó là tân ngữ.',
    memoryTip: '💡 Thay bằng he/she = dùng WHO. Thay bằng him/her = dùng WHOM. Whom và him đều kết thúc bằng "m"!',
    quiz: {
      sentences: [
        {
          sentence: '_____ is responsible for this project?',
          correct: 'Who',
          explanation: 'Làm chủ ngữ của câu (ai chịu trách nhiệm), dùng "Who".',
        },
        {
          sentence: 'With _____ are you traveling?',
          correct: 'whom',
          explanation: 'Sau giới từ "with" cần tân ngữ, dùng "whom".',
        },
      ],
    },
  },
  {
    id: 'fewer-less',
    word1: 'fewer',
    word2: 'less',
    category: 'grammar',
    comparison: [
      {
        word: 'fewer',
        partOfSpeech: 'determiner',
        meaning: 'Ít hơn (danh từ đếm được)',
        example: 'There are fewer students this year.',
        translation: 'Năm nay có ít học sinh hơn.',
      },
      {
        word: 'less',
        partOfSpeech: 'determiner',
        meaning: 'Ít hơn (danh từ không đếm được)',
        example: 'I have less time today.',
        translation: 'Hôm nay tôi có ít thời gian hơn.',
      },
    ],
    commonMistake: 'Hay nói "less people" (sai). "People" đếm được nên phải dùng "fewer people".',
    memoryTip: '💡 Fewer = đếm ĐƯỢC (fewer apples, fewer cars). Less = KHÔNG đếm được (less water, less money). Fewer = For counting!',
    quiz: {
      sentences: [
        {
          sentence: 'There were _____ than 50 people at the event.',
          correct: 'fewer',
          explanation: '"People" đếm được, dùng "fewer".',
        },
        {
          sentence: 'You should eat _____ sugar.',
          correct: 'less',
          explanation: '"Sugar" không đếm được, dùng "less".',
        },
      ],
    },
  },
  {
    id: 'farther-further',
    word1: 'farther',
    word2: 'further',
    category: 'grammar',
    comparison: [
      {
        word: 'farther',
        partOfSpeech: 'adverb / adjective',
        meaning: 'Xa hơn (khoảng cách vật lý)',
        example: 'The airport is farther than I thought.',
        translation: 'Sân bay xa hơn tôi nghĩ.',
      },
      {
        word: 'further',
        partOfSpeech: 'adverb / adjective',
        meaning: 'Thêm nữa, xa hơn (nghĩa bóng)',
        example: 'We need further discussion on this topic.',
        translation: 'Chúng ta cần thảo luận thêm về chủ đề này.',
      },
    ],
    commonMistake: 'Trong tiếng Anh Mỹ hiện đại, "further" dùng cho cả hai nghĩa, nhưng "farther" chỉ dùng cho khoảng cách vật lý.',
    memoryTip: '💡 FARther = FAR (xa) - khoảng cách VẬT LÝ. FURther = thêm nữa - TRỪU TƯỢNG (further information).',
    quiz: {
      sentences: [
        {
          sentence: 'For _____ information, please visit our website.',
          correct: 'further',
          explanation: 'Thông tin thêm (nghĩa trừu tượng), dùng "further".',
        },
        {
          sentence: 'Can you run _____? The finish line is still ahead.',
          correct: 'farther',
          explanation: 'Khoảng cách vật lý (chạy xa hơn), dùng "farther".',
        },
      ],
    },
  },
  {
    id: 'its-its',
    word1: "its",
    word2: "it's",
    category: 'grammar',
    comparison: [
      {
        word: 'its',
        partOfSpeech: 'possessive pronoun',
        meaning: 'Của nó (sở hữu)',
        example: 'The dog wagged its tail.',
        translation: 'Con chó vẫy đuôi của nó.',
      },
      {
        word: "it's",
        partOfSpeech: 'contraction',
        meaning: 'Nó là / Nó đã (it is / it has)',
        example: "It's raining outside.",
        translation: 'Trời đang mưa bên ngoài.',
      },
    ],
    commonMistake: 'Lỗi cực kỳ phổ biến! "Its" (không dấu phẩy) = sở hữu. "It\'s" (có dấu phẩy) = it is / it has.',
    memoryTip: '💡 Thử thay bằng "it is" - nếu đúng nghĩa thì dùng "it\'s". Nếu không thì dùng "its" (sở hữu, không có dấu phẩy).',
    quiz: {
      sentences: [
        {
          sentence: "_____ a beautiful day today.",
          correct: "It's",
          explanation: '"It is a beautiful day" - viết tắt thành "It\'s".',
        },
        {
          sentence: 'The cat is licking _____ paws.',
          correct: 'its',
          explanation: 'Chân của nó (sở hữu), dùng "its" (không có dấu phẩy).',
        },
      ],
    },
  },
  {
    id: 'your-youre',
    word1: 'your',
    word2: "you're",
    category: 'grammar',
    comparison: [
      {
        word: 'your',
        partOfSpeech: 'possessive adjective',
        meaning: 'Của bạn (sở hữu)',
        example: 'Is this your book?',
        translation: 'Đây là sách của bạn à?',
      },
      {
        word: "you're",
        partOfSpeech: 'contraction',
        meaning: 'Bạn là (you are)',
        example: "You're very kind.",
        translation: 'Bạn rất tốt bụng.',
      },
    ],
    commonMistake: 'Cũng giống its/it\'s, rất hay viết nhầm. "Your" = sở hữu, "you\'re" = you are.',
    memoryTip: '💡 Thử thay bằng "you are" - nếu đúng nghĩa thì dùng "you\'re". Nếu không thì dùng "your" (sở hữu).',
    quiz: {
      sentences: [
        {
          sentence: "_____ going to love this movie!",
          correct: "You're",
          explanation: '"You are going to love" - viết tắt thành "You\'re".',
        },
        {
          sentence: "Don't forget _____ keys.",
          correct: 'your',
          explanation: 'Chìa khóa của bạn (sở hữu), dùng "your".',
        },
      ],
    },
  },
  {
    id: 'their-there-theyre',
    word1: 'their',
    word2: "there",
    category: 'grammar',
    comparison: [
      {
        word: 'their',
        partOfSpeech: 'possessive adjective',
        meaning: 'Của họ (sở hữu)',
        example: 'Their house is very big.',
        translation: 'Nhà của họ rất lớn.',
      },
      {
        word: "there",
        partOfSpeech: 'adverb',
        meaning: 'Ở đó, đằng kia',
        example: 'The book is over there on the shelf.',
        translation: 'Cuốn sách ở đằng kia trên kệ.',
      },
    ],
    commonMistake: 'Ba từ their/there/they\'re phát âm giống nhau. Their = sở hữu, there = vị trí, they\'re = they are.',
    memoryTip: '💡 THEIR có "heir" (người thừa kế) = SỞ HỮU. THERE có "here" = VỊ TRÍ. THEY\'RE = THEY ARE (thử thay xem có đúng không).',
    quiz: {
      sentences: [
        {
          sentence: '_____ are many restaurants in this area.',
          correct: 'There',
          explanation: '"There are" = có (nói về sự tồn tại), dùng "There".',
        },
        {
          sentence: 'The students forgot _____ homework.',
          correct: 'their',
          explanation: 'Bài tập về nhà của họ (sở hữu), dùng "their".',
        },
      ],
    },
  },
  {
    id: 'to-too',
    word1: 'to',
    word2: 'too',
    category: 'grammar',
    comparison: [
      {
        word: 'to',
        partOfSpeech: 'preposition / particle',
        meaning: 'Đến, để (giới từ chỉ hướng / trước động từ)',
        example: 'I want to go to school.',
        translation: 'Tôi muốn đi đến trường.',
      },
      {
        word: 'too',
        partOfSpeech: 'adverb',
        meaning: 'Quá, cũng',
        example: 'This coffee is too hot. I like tea too.',
        translation: 'Cà phê này quá nóng. Tôi cũng thích trà.',
      },
    ],
    commonMistake: 'Hay viết nhầm "to" thay cho "too" và ngược lại. "Too" = quá/cũng (2 chữ o), "to" = giới từ (1 chữ o).',
    memoryTip: '💡 TOO có thêm một chữ "o" vì nó nghĩa là "QUÁ nhiều" hoặc "CŨNG" (thêm vào). TO chỉ là giới từ đơn giản.',
    quiz: {
      sentences: [
        {
          sentence: 'This bag is _____ heavy for me to carry.',
          correct: 'too',
          explanation: 'Quá nặng (mức độ), dùng "too".',
        },
        {
          sentence: 'I need _____ finish this report by tomorrow.',
          correct: 'to',
          explanation: 'Giới từ trước động từ "finish", dùng "to".',
        },
      ],
    },
  },

  // ============================================================
  // USAGE (~13 pairs)
  // ============================================================
  {
    id: 'do-make',
    word1: 'do',
    word2: 'make',
    category: 'usage',
    comparison: [
      {
        word: 'do',
        partOfSpeech: 'verb',
        meaning: 'Làm (hành động, nhiệm vụ)',
        example: 'I need to do my homework.',
        translation: 'Tôi cần làm bài tập về nhà.',
      },
      {
        word: 'make',
        partOfSpeech: 'verb',
        meaning: 'Làm, tạo ra (sản phẩm, kết quả)',
        example: 'She made a delicious cake.',
        translation: 'Cô ấy làm một chiếc bánh ngon.',
      },
    ],
    commonMistake: 'Người Việt hay nhầm vì tiếng Việt chỉ dùng "làm". Do the dishes (rửa bát), make the bed (dọn giường).',
    memoryTip: '💡 DO = thực hiện hành động/nhiệm vụ (do homework, do exercise). MAKE = tạo ra thứ gì đó (make food, make a decision).',
    quiz: {
      sentences: [
        {
          sentence: 'Can you _____ me a favor?',
          correct: 'do',
          explanation: 'Giúp đỡ là hành động, dùng "do a favor".',
        },
        {
          sentence: "Let's _____ a plan for the weekend.",
          correct: 'make',
          explanation: 'Tạo ra kế hoạch, dùng "make a plan".',
        },
      ],
    },
  },
  {
    id: 'actually-currently',
    word1: 'actually',
    word2: 'currently',
    category: 'usage',
    comparison: [
      {
        word: 'actually',
        partOfSpeech: 'adverb',
        meaning: 'Thực ra, thực tế là',
        example: "Actually, I don't agree with you.",
        translation: 'Thực ra, tôi không đồng ý với bạn.',
      },
      {
        word: 'currently',
        partOfSpeech: 'adverb',
        meaning: 'Hiện tại, hiện nay',
        example: "I'm currently working on a new project.",
        translation: 'Hiện tại tôi đang làm dự án mới.',
      },
    ],
    commonMistake: 'Người Việt hay dùng "actually" khi muốn nói "hiện tại" do ảnh hưởng từ "actuellement" (tiếng Pháp). Actually ≠ hiện tại!',
    memoryTip: '💡 Actually = THỰC RA (dùng để đính chính). Currently = HIỆN TẠI (dùng để nói về thời gian). Hai từ hoàn toàn khác nghĩa!',
    quiz: {
      sentences: [
        {
          sentence: "_____, I think you're wrong about that.",
          correct: 'Actually',
          explanation: 'Đính chính, nói thực ra, dùng "Actually".',
        },
        {
          sentence: 'She is _____ living in Ho Chi Minh City.',
          correct: 'currently',
          explanation: 'Nói về hiện tại, dùng "currently".',
        },
      ],
    },
  },
  {
    id: 'sensible-sensitive',
    word1: 'sensible',
    word2: 'sensitive',
    category: 'usage',
    comparison: [
      {
        word: 'sensible',
        partOfSpeech: 'adjective',
        meaning: 'Hợp lý, khôn ngoan, thực tế',
        example: 'That seems like a sensible decision.',
        translation: 'Đó có vẻ là quyết định hợp lý.',
      },
      {
        word: 'sensitive',
        partOfSpeech: 'adjective',
        meaning: 'Nhạy cảm, dễ bị tổn thương',
        example: 'She is very sensitive about her weight.',
        translation: 'Cô ấy rất nhạy cảm về cân nặng.',
      },
    ],
    commonMistake: 'Hay nhầm "sensible" là "nhạy cảm" do giống "sensitive". Sensible = biết điều, hợp lý. Sensitive = nhạy cảm.',
    memoryTip: '💡 SensiBLE = reasonaBLE (hợp lý). SensiTIVE = sENSITIVE (nhạy cảm, dễ tổn thương).',
    quiz: {
      sentences: [
        {
          sentence: 'Wearing sunscreen is a _____ thing to do.',
          correct: 'sensible',
          explanation: 'Việc hợp lý, khôn ngoan, dùng "sensible".',
        },
        {
          sentence: "Please don't shout at him. He's very _____.",
          correct: 'sensitive',
          explanation: 'Dễ bị tổn thương, nhạy cảm, dùng "sensitive".',
        },
      ],
    },
  },
  {
    id: 'economic-economical',
    word1: 'economic',
    word2: 'economical',
    category: 'usage',
    comparison: [
      {
        word: 'economic',
        partOfSpeech: 'adjective',
        meaning: 'Thuộc về kinh tế',
        example: 'The country is facing economic problems.',
        translation: 'Đất nước đang đối mặt với vấn đề kinh tế.',
      },
      {
        word: 'economical',
        partOfSpeech: 'adjective',
        meaning: 'Tiết kiệm, không lãng phí',
        example: 'This car is very economical on fuel.',
        translation: 'Chiếc xe này rất tiết kiệm xăng.',
      },
    ],
    commonMistake: 'Economic = liên quan đến nền kinh tế. Economical = tiết kiệm chi phí. Hai nghĩa rất khác nhau.',
    memoryTip: '💡 Economic = ECONOMY (nền kinh tế). Economical = SAVING (tiết kiệm). Thêm "-al" thì nghĩa thay đổi!',
    quiz: {
      sentences: [
        {
          sentence: 'The _____ growth of Vietnam has been impressive.',
          correct: 'economic',
          explanation: 'Tăng trưởng kinh tế (thuộc nền kinh tế), dùng "economic".',
        },
        {
          sentence: 'LED bulbs are more _____ than regular bulbs.',
          correct: 'economical',
          explanation: 'Tiết kiệm điện hơn, dùng "economical".',
        },
      ],
    },
  },
  {
    id: 'classic-classical',
    word1: 'classic',
    word2: 'classical',
    category: 'usage',
    comparison: [
      {
        word: 'classic',
        partOfSpeech: 'adjective / noun',
        meaning: 'Kinh điển, xuất sắc, tiêu biểu',
        example: 'Romeo and Juliet is a classic love story.',
        translation: 'Romeo và Juliet là câu chuyện tình yêu kinh điển.',
      },
      {
        word: 'classical',
        partOfSpeech: 'adjective',
        meaning: 'Cổ điển (thuộc về nghệ thuật/thời cổ đại)',
        example: 'She plays classical music on the piano.',
        translation: 'Cô ấy chơi nhạc cổ điển trên piano.',
      },
    ],
    commonMistake: 'Classic = kinh điển, xuất sắc qua thời gian. Classical = thuộc về phong cách cổ điển (nhạc, kiến trúc, văn học cổ đại).',
    memoryTip: '💡 Classic = BEST of its kind (kinh điển, tuyệt vời). Classical = OLD STYLE (phong cách cổ điển: classical music, classical literature).',
    quiz: {
      sentences: [
        {
          sentence: 'Mozart and Beethoven are famous _____ composers.',
          correct: 'classical',
          explanation: 'Nhạc sĩ thuộc thể loại nhạc cổ điển, dùng "classical".',
        },
        {
          sentence: "That was a _____ example of poor communication.",
          correct: 'classic',
          explanation: 'Ví dụ tiêu biểu, kinh điển, dùng "classic".',
        },
      ],
    },
  },
  {
    id: 'hard-hardly',
    word1: 'hard',
    word2: 'hardly',
    category: 'usage',
    comparison: [
      {
        word: 'hard',
        partOfSpeech: 'adjective / adverb',
        meaning: 'Khó, cứng / chăm chỉ, mạnh',
        example: 'She works very hard.',
        translation: 'Cô ấy làm việc rất chăm chỉ.',
      },
      {
        word: 'hardly',
        partOfSpeech: 'adverb',
        meaning: 'Hầu như không, gần như không',
        example: 'I can hardly hear you.',
        translation: 'Tôi gần như không nghe thấy bạn.',
      },
    ],
    commonMistake: 'KHÔNG PHẢI thêm "-ly" vào "hard" để thành trạng từ "chăm chỉ". "Hardly" có nghĩa hoàn toàn khác!',
    memoryTip: '💡 Hard (trạng từ) = chăm chỉ, mạnh. Hardly = hầu như KHÔNG. "She works hard" (chăm chỉ) ≠ "She hardly works" (gần như không làm)!',
    quiz: {
      sentences: [
        {
          sentence: 'He studied _____ for the exam and got an A.',
          correct: 'hard',
          explanation: 'Học chăm chỉ, dùng "hard" (trạng từ).',
        },
        {
          sentence: 'I _____ know anyone at this party.',
          correct: 'hardly',
          explanation: 'Hầu như không quen ai, dùng "hardly".',
        },
      ],
    },
  },
  {
    id: 'late-lately',
    word1: 'late',
    word2: 'lately',
    category: 'usage',
    comparison: [
      {
        word: 'late',
        partOfSpeech: 'adjective / adverb',
        meaning: 'Muộn, trễ',
        example: 'Sorry, I arrived late.',
        translation: 'Xin lỗi, tôi đến muộn.',
      },
      {
        word: 'lately',
        partOfSpeech: 'adverb',
        meaning: 'Gần đây, dạo này',
        example: 'I have been very busy lately.',
        translation: 'Dạo này tôi rất bận.',
      },
    ],
    commonMistake: 'Tương tự hard/hardly. "Late" = muộn, trễ. "Lately" KHÔNG phải trạng từ của "late" mà nghĩa là "gần đây".',
    memoryTip: '💡 Late = MUỘN (arrive late). Lately = GẦN ĐÂY (= recently). Thêm "-ly" thay đổi nghĩa hoàn toàn!',
    quiz: {
      sentences: [
        {
          sentence: 'The bus arrived 20 minutes _____.',
          correct: 'late',
          explanation: 'Đến muộn (trễ giờ), dùng "late".',
        },
        {
          sentence: 'Have you seen any good movies _____?',
          correct: 'lately',
          explanation: 'Gần đây, dạo này (= recently), dùng "lately".',
        },
      ],
    },
  },
  {
    id: 'free-freely',
    word1: 'free',
    word2: 'freely',
    category: 'usage',
    comparison: [
      {
        word: 'free',
        partOfSpeech: 'adjective / adverb',
        meaning: 'Miễn phí, tự do / miễn phí',
        example: 'The concert is free.',
        translation: 'Buổi hòa nhạc miễn phí.',
      },
      {
        word: 'freely',
        partOfSpeech: 'adverb',
        meaning: 'Tự do, thoải mái (không bị hạn chế)',
        example: 'You can speak freely here.',
        translation: 'Bạn có thể nói thoải mái ở đây.',
      },
    ],
    commonMistake: '"Free" khi là trạng từ = miễn phí. "Freely" = tự do, không hạn chế. "For free" = miễn phí.',
    memoryTip: '💡 Free = MIỄN PHÍ (get it free, for free). Freely = TỰ DO, thoải mái (speak freely, move freely).',
    quiz: {
      sentences: [
        {
          sentence: 'Children under 5 can enter _____.',
          correct: 'free',
          explanation: 'Vào miễn phí, dùng "free" (trạng từ).',
        },
        {
          sentence: 'In a democracy, people can express their opinions _____.',
          correct: 'freely',
          explanation: 'Bày tỏ ý kiến tự do, thoải mái, dùng "freely".',
        },
      ],
    },
  },
  {
    id: 'ago-before',
    word1: 'ago',
    word2: 'before',
    category: 'usage',
    comparison: [
      {
        word: 'ago',
        partOfSpeech: 'adverb',
        meaning: 'Cách đây (tính từ hiện tại)',
        example: 'I moved here three years ago.',
        translation: 'Tôi chuyển đến đây ba năm trước.',
      },
      {
        word: 'before',
        partOfSpeech: 'preposition / adverb',
        meaning: 'Trước (một thời điểm / sự kiện)',
        example: 'I had met her before the party.',
        translation: 'Tôi đã gặp cô ấy trước buổi tiệc.',
      },
    ],
    commonMistake: '"Ago" luôn dùng với thì quá khứ đơn, tính từ hiện tại. "Before" dùng với quá khứ hoàn thành hoặc trước sự kiện.',
    memoryTip: '💡 AGO = khoảng thời gian + ago (2 days ago, a week ago) + quá khứ đơn. BEFORE = trước một MỐC thời gian cụ thể.',
    quiz: {
      sentences: [
        {
          sentence: 'I graduated from university five years _____.',
          correct: 'ago',
          explanation: 'Cách đây 5 năm (tính từ hiện tại), dùng "ago".',
        },
        {
          sentence: 'Please finish the report _____ Friday.',
          correct: 'before',
          explanation: 'Trước thứ Sáu (mốc thời gian cụ thể), dùng "before".',
        },
      ],
    },
  },
  {
    id: 'already-yet',
    word1: 'already',
    word2: 'yet',
    category: 'usage',
    comparison: [
      {
        word: 'already',
        partOfSpeech: 'adverb',
        meaning: 'Đã, rồi (sớm hơn dự kiến)',
        example: "I've already finished my homework.",
        translation: 'Tôi đã làm xong bài tập rồi.',
      },
      {
        word: 'yet',
        partOfSpeech: 'adverb',
        meaning: 'Chưa, đã... chưa (câu phủ định/nghi vấn)',
        example: "I haven't finished yet.",
        translation: 'Tôi chưa xong.',
      },
    ],
    commonMistake: 'Already dùng trong câu khẳng định. Yet dùng trong câu phủ định và nghi vấn. Không nói "I have yet finished" (sai).',
    memoryTip: '💡 Already = ĐÃ (câu khẳng định, đặt giữa câu). Yet = CHƯA (câu phủ định/hỏi, đặt cuối câu). Have you finished yet? I have already finished.',
    quiz: {
      sentences: [
        {
          sentence: 'Have you eaten lunch _____?',
          correct: 'yet',
          explanation: 'Câu hỏi (đã... chưa), dùng "yet" ở cuối câu.',
        },
        {
          sentence: "Don't worry, I've _____ booked the tickets.",
          correct: 'already',
          explanation: 'Câu khẳng định (đã... rồi), dùng "already".',
        },
      ],
    },
  },
  {
    id: 'also-too',
    word1: 'also',
    word2: 'too',
    category: 'usage',
    comparison: [
      {
        word: 'also',
        partOfSpeech: 'adverb',
        meaning: 'Cũng (đặt giữa câu, trang trọng hơn)',
        example: 'She also speaks Japanese.',
        translation: 'Cô ấy cũng nói tiếng Nhật.',
      },
      {
        word: 'too',
        partOfSpeech: 'adverb',
        meaning: 'Cũng (đặt cuối câu, thân mật hơn)',
        example: 'I like pizza. I like pasta too.',
        translation: 'Tôi thích pizza. Tôi cũng thích mì Ý.',
      },
    ],
    commonMistake: 'Hay đặt "also" cuối câu (sai) hoặc "too" giữa câu (sai). Also = giữa câu, too = cuối câu, as well = cuối câu.',
    memoryTip: '💡 ALSO = giữa câu (trước động từ chính). TOO = cuối câu. AS WELL = cuối câu (trang trọng hơn too). Cả ba đều nghĩa "cũng".',
    quiz: {
      sentences: [
        {
          sentence: 'He speaks English and he _____ speaks French.',
          correct: 'also',
          explanation: 'Đặt giữa câu, trước động từ chính, dùng "also".',
        },
        {
          sentence: 'I love swimming. My sister loves it _____.',
          correct: 'too',
          explanation: 'Đặt cuối câu, dùng "too".',
        },
      ],
    },
  },
  {
    id: 'between-among',
    word1: 'between',
    word2: 'among',
    category: 'usage',
    comparison: [
      {
        word: 'between',
        partOfSpeech: 'preposition',
        meaning: 'Giữa (hai đối tượng rõ ràng)',
        example: 'Choose between coffee and tea.',
        translation: 'Chọn giữa cà phê và trà.',
      },
      {
        word: 'among',
        partOfSpeech: 'preposition',
        meaning: 'Giữa, trong số (nhiều đối tượng)',
        example: 'She is popular among her classmates.',
        translation: 'Cô ấy được yêu thích trong số bạn cùng lớp.',
      },
    ],
    commonMistake: 'Tiếng Việt dùng "giữa" cho cả hai. Between = 2 đối tượng cụ thể. Among = nhóm nhiều đối tượng.',
    memoryTip: '💡 Between = giữa HAI (between A and B). Among = trong số NHIỀU (among friends, among students).',
    quiz: {
      sentences: [
        {
          sentence: "What's the difference _____ these two words?",
          correct: 'between',
          explanation: 'Giữa hai từ (2 đối tượng cụ thể), dùng "between".',
        },
        {
          sentence: 'He found the lost ring _____ the pile of clothes.',
          correct: 'among',
          explanation: 'Trong đống quần áo (nhiều đồ vật), dùng "among".',
        },
      ],
    },
  },
  {
    id: 'specially-especially',
    word1: 'specially',
    word2: 'especially',
    category: 'usage',
    comparison: [
      {
        word: 'specially',
        partOfSpeech: 'adverb',
        meaning: 'Đặc biệt, riêng biệt (cho mục đích cụ thể)',
        example: 'This dress was specially made for her.',
        translation: 'Chiếc váy này được may riêng cho cô ấy.',
      },
      {
        word: 'especially',
        partOfSpeech: 'adverb',
        meaning: 'Đặc biệt là, nhất là (nhấn mạnh)',
        example: 'I love all fruits, especially mangoes.',
        translation: 'Tôi thích tất cả trái cây, đặc biệt là xoài.',
      },
    ],
    commonMistake: 'Specially = được làm riêng, cho mục đích đặc biệt. Especially = nhất là, đặc biệt là (nhấn mạnh trong nhóm).',
    memoryTip: '💡 Specially = làm RIÊNG (specially designed). Especially = NHẤT LÀ, nổi bật (especially important). Especially = extra special!',
    quiz: {
      sentences: [
        {
          sentence: 'I love Vietnamese food, _____ pho.',
          correct: 'especially',
          explanation: 'Nhất là, đặc biệt là phở (nhấn mạnh trong nhóm), dùng "especially".',
        },
        {
          sentence: 'These shoes were _____ designed for running.',
          correct: 'specially',
          explanation: 'Được thiết kế riêng cho mục đích cụ thể, dùng "specially".',
        },
      ],
    },
  },
];
