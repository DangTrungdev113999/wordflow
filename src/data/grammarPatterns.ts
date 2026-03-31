// Phase 13-3: Grammar Patterns — ~30 patterns, 5 categories
// Focus: common mistakes Vietnamese learners make

import type { GrammarPattern, GrammarCategory } from '../features/word-usage/models';

export const GRAMMAR_PATTERNS: GrammarPattern[] = [
  // ──────────────────────────────────────────────────
  // VERB PATTERNS — V-ing vs to V
  // ──────────────────────────────────────────────────
  {
    id: 'remember-ving-vs-to-v',
    pattern: 'remember + V-ing vs to V',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'remember + V-ing',
        meaning: 'nhớ đã làm gì (quá khứ)',
        example: { sentence: 'I remember locking the door before leaving.', translation: 'Tôi nhớ đã khóa cửa trước khi đi.', highlight: 'remember locking' },
        usage: 'Hành động đã xảy ra rồi, bạn nhớ lại nó.',
      },
      {
        structure: 'remember + to V',
        meaning: 'nhớ phải làm gì (tương lai)',
        example: { sentence: 'Remember to call me when you arrive.', translation: 'Nhớ gọi cho tôi khi bạn đến nhé.', highlight: 'Remember to call' },
        usage: 'Hành động chưa xảy ra, cần nhớ để làm.',
      },
    ],
    commonMistake: 'Người Việt hay dùng lẫn vì tiếng Việt không phân biệt "nhớ đã làm" vs "nhớ phải làm".',
    memoryTip: '💡 V-ing = đã xảy ra (quá khứ). to V = chưa làm (tương lai, cần nhớ).',
    quiz: {
      items: [
        { sentence: 'I remember _____ her at the party last year.', options: ['meeting', 'to meet'], correct: 0, explanation: 'Đã gặp rồi (quá khứ) → remember + V-ing' },
        { sentence: 'Please remember _____ the lights before you leave.', options: ['turning off', 'to turn off'], correct: 1, explanation: 'Chưa làm, cần nhớ → remember + to V' },
        { sentence: 'Do you remember _____ this song when we were kids?', options: ['singing', 'to sing'], correct: 0, explanation: 'Nhớ lại hành động quá khứ → remember + V-ing' },
      ],
    },
  },
  {
    id: 'stop-ving-vs-to-v',
    pattern: 'stop + V-ing vs to V',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'stop + V-ing',
        meaning: 'ngừng làm gì đó',
        example: { sentence: 'She stopped smoking last year.', translation: 'Cô ấy đã bỏ hút thuốc năm ngoái.', highlight: 'stopped smoking' },
        usage: 'Dừng hẳn hành động đang làm.',
      },
      {
        structure: 'stop + to V',
        meaning: 'dừng lại để làm gì khác',
        example: { sentence: 'He stopped to buy coffee on the way.', translation: 'Anh ấy dừng lại để mua cà phê trên đường.', highlight: 'stopped to buy' },
        usage: 'Dừng hành động hiện tại để chuyển sang hành động mới.',
      },
    ],
    commonMistake: 'Hay nhầm "stop smoking" (bỏ thuốc) với "stop to smoke" (dừng lại để hút thuốc) — nghĩa ngược nhau!',
    memoryTip: '💡 stop + V-ing = QUIT. stop + to V = PAUSE to do something else.',
    quiz: {
      items: [
        { sentence: 'The doctor told me to stop _____ junk food.', options: ['eating', 'to eat'], correct: 0, explanation: 'Bỏ hẳn → stop + V-ing' },
        { sentence: 'We stopped _____ some photos of the sunset.', options: ['taking', 'to take'], correct: 1, explanation: 'Dừng lại để chụp ảnh → stop + to V' },
      ],
    },
  },
  {
    id: 'try-ving-vs-to-v',
    pattern: 'try + V-ing vs to V',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'try + V-ing',
        meaning: 'thử làm gì (xem kết quả ra sao)',
        example: { sentence: 'Try adding some salt to the soup.', translation: 'Thử thêm muối vào súp xem sao.', highlight: 'Try adding' },
        usage: 'Thử nghiệm, không chắc kết quả.',
      },
      {
        structure: 'try + to V',
        meaning: 'cố gắng làm gì (khó khăn)',
        example: { sentence: 'I tried to open the door but it was stuck.', translation: 'Tôi cố gắng mở cửa nhưng nó bị kẹt.', highlight: 'tried to open' },
        usage: 'Nỗ lực làm điều gì đó khó.',
      },
    ],
    commonMistake: 'Tiếng Việt "thử" và "cố gắng" đôi khi dùng lẫn. Trong tiếng Anh, try + V-ing ≠ try + to V.',
    memoryTip: '💡 try + V-ing = experiment (thử). try + to V = attempt (cố).',
    quiz: {
      items: [
        { sentence: 'Have you tried _____ the computer off and on again?', options: ['turning', 'to turn'], correct: 0, explanation: 'Thử xem có fix không → try + V-ing' },
        { sentence: 'She tried _____ the heavy box but couldn\'t lift it.', options: ['moving', 'to move'], correct: 1, explanation: 'Cố gắng nhưng không nổi → try + to V' },
      ],
    },
  },
  {
    id: 'forget-ving-vs-to-v',
    pattern: 'forget + V-ing vs to V',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'forget + V-ing',
        meaning: 'quên đã làm gì (quá khứ)',
        example: { sentence: 'I\'ll never forget visiting Paris for the first time.', translation: 'Tôi sẽ không bao giờ quên lần đầu đến Paris.', highlight: 'forget visiting' },
        usage: 'Hành động đã xảy ra, bạn quên (hoặc không quên) trải nghiệm đó.',
      },
      {
        structure: 'forget + to V',
        meaning: 'quên phải làm gì (chưa làm)',
        example: { sentence: 'I forgot to buy milk on the way home.', translation: 'Tôi quên mua sữa trên đường về.', highlight: 'forgot to buy' },
        usage: 'Quên không thực hiện hành động cần làm.',
      },
    ],
    commonMistake: 'Tương tự remember: V-ing = quá khứ, to V = tương lai. Người Việt hay nhầm vì tiếng Việt chỉ dùng "quên".',
    memoryTip: '💡 Giống remember: V-ing = nhìn lại quá khứ. to V = quên không làm.',
    quiz: {
      items: [
        { sentence: 'I\'ll never forget _____ you for the first time.', options: ['meeting', 'to meet'], correct: 0, explanation: 'Trải nghiệm quá khứ → forget + V-ing' },
        { sentence: 'Don\'t forget _____ your homework before class.', options: ['doing', 'to do'], correct: 1, explanation: 'Chưa làm, cần nhớ → forget + to V' },
      ],
    },
  },
  {
    id: 'regret-ving-vs-to-v',
    pattern: 'regret + V-ing vs to V',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'regret + V-ing',
        meaning: 'hối hận đã làm gì',
        example: { sentence: 'I regret telling her the truth.', translation: 'Tôi hối hận đã nói sự thật với cô ấy.', highlight: 'regret telling' },
        usage: 'Hối tiếc về hành động đã làm trong quá khứ.',
      },
      {
        structure: 'regret + to V',
        meaning: 'rất tiếc phải thông báo (formal)',
        example: { sentence: 'We regret to inform you that your application was rejected.', translation: 'Chúng tôi rất tiếc phải thông báo đơn của bạn bị từ chối.', highlight: 'regret to inform' },
        usage: 'Dùng trong văn phong trang trọng khi thông báo tin xấu.',
      },
    ],
    commonMistake: '"Regret to V" KHÔNG phải "hối hận sẽ làm". Nó chỉ dùng trong formal context = "rất tiếc phải...".',
    memoryTip: '💡 regret + V-ing = hối hận (quá khứ). regret + to V = rất tiếc phải (formal, hiện tại).',
    quiz: {
      items: [
        { sentence: 'I regret _____ so much money on that trip.', options: ['spending', 'to spend'], correct: 0, explanation: 'Hối hận đã tiêu → regret + V-ing' },
        { sentence: 'We regret _____ you that the flight has been cancelled.', options: ['informing', 'to inform'], correct: 1, explanation: 'Rất tiếc phải thông báo (formal) → regret + to V' },
      ],
    },
  },
  {
    id: 'need-ving-vs-to-v',
    pattern: 'need + V-ing vs to V',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'need + V-ing',
        meaning: 'cần được làm gì (bị động)',
        example: { sentence: 'The car needs washing.', translation: 'Xe cần được rửa.', highlight: 'needs washing' },
        usage: 'Vật cần ai đó làm gì cho nó. Mang nghĩa passive: needs washing = needs to be washed.',
      },
      {
        structure: 'need + to V',
        meaning: 'cần phải làm gì (chủ động)',
        example: { sentence: 'I need to study for the exam.', translation: 'Tôi cần ôn thi.', highlight: 'need to study' },
        usage: 'Chủ ngữ cần tự thực hiện hành động.',
      },
    ],
    commonMistake: '"The house needs cleaning" = nhà cần được dọn. KHÔNG phải "nhà cần dọn dẹp" (chủ động).',
    memoryTip: '💡 need + V-ing = cần ĐƯỢC (passive). need + to V = cần PHẢI (active).',
    quiz: {
      items: [
        { sentence: 'Your hair needs _____.', options: ['cutting', 'to cut'], correct: 0, explanation: 'Tóc cần được cắt (passive) → need + V-ing' },
        { sentence: 'You need _____ harder to pass the exam.', options: ['studying', 'to study'], correct: 1, explanation: 'Bạn cần phải học (active) → need + to V' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // USED TO patterns
  // ──────────────────────────────────────────────────
  {
    id: 'used-to-v',
    pattern: 'used to + V',
    category: 'used-to',
    forms: [
      {
        structure: 'used to + V (bare)',
        meaning: 'đã từng làm gì (thói quen cũ, không còn nữa)',
        example: { sentence: 'I used to play football every weekend.', translation: 'Tôi đã từng chơi bóng mỗi cuối tuần.', highlight: 'used to play' },
        usage: 'Thói quen hoặc trạng thái trong quá khứ, bây giờ không còn.',
      },
      {
        structure: 'didn\'t use to + V',
        meaning: 'trước đây không (nhưng giờ thì có)',
        example: { sentence: 'She didn\'t use to like coffee.', translation: 'Trước đây cô ấy không thích cà phê.', highlight: 'didn\'t use to like' },
        usage: 'Phủ định: trước không, giờ thì có.',
      },
    ],
    commonMistake: 'Hay viết sai "use to" (thiếu d) ở dạng khẳng định. Dạng phủ định "didn\'t use to" mới bỏ d.',
    memoryTip: '💡 used to + V = WAS, BUT NOT ANYMORE. Chỉ dùng cho quá khứ.',
    quiz: {
      items: [
        { sentence: 'He _____ smoke, but he quit 5 years ago.', options: ['used to', 'is used to', 'gets used to'], correct: 0, explanation: 'Thói quen cũ không còn → used to' },
        { sentence: 'They didn\'t _____ eat sushi, but now they love it.', options: ['used to', 'use to', 'using to'], correct: 1, explanation: 'Sau didn\'t → use to (không có d)' },
      ],
    },
  },
  {
    id: 'be-used-to-ving',
    pattern: 'be used to + V-ing',
    category: 'used-to',
    forms: [
      {
        structure: 'be used to + V-ing / noun',
        meaning: 'quen với việc gì (hiện tại)',
        example: { sentence: 'I\'m used to waking up early now.', translation: 'Giờ tôi đã quen dậy sớm rồi.', highlight: 'used to waking up' },
        usage: 'Đã quen, không còn thấy lạ hay khó nữa.',
      },
      {
        structure: 'be not used to + V-ing',
        meaning: 'chưa quen với việc gì',
        example: { sentence: 'He isn\'t used to the cold weather.', translation: 'Anh ấy chưa quen với thời tiết lạnh.', highlight: 'isn\'t used to' },
        usage: 'Chưa adapt, vẫn thấy khó hoặc lạ.',
      },
    ],
    commonMistake: 'Nhầm "be used to" (quen với) với "used to" (đã từng). Sau "be used to" phải dùng V-ing hoặc noun!',
    memoryTip: '💡 be used to = be accustomed to = đã quen. Sau TO đây là giới từ → V-ing.',
    quiz: {
      items: [
        { sentence: 'After 3 years in Japan, she is used to _____ with chopsticks.', options: ['eat', 'eating', 'ate'], correct: 1, explanation: 'be used to + V-ing (đã quen)' },
        { sentence: 'I\'m not used to _____ so early.', options: ['wake up', 'waking up', 'woke up'], correct: 1, explanation: 'be not used to + V-ing (chưa quen)' },
      ],
    },
  },
  {
    id: 'get-used-to-ving',
    pattern: 'get used to + V-ing',
    category: 'used-to',
    forms: [
      {
        structure: 'get used to + V-ing / noun',
        meaning: 'dần quen với (quá trình)',
        example: { sentence: 'You\'ll get used to living here soon.', translation: 'Bạn sẽ sớm quen sống ở đây thôi.', highlight: 'get used to living' },
        usage: 'Đang trong quá trình quen dần. Có thể dùng ở mọi thì.',
      },
      {
        structure: 'can\'t get used to + V-ing',
        meaning: 'không thể quen nổi',
        example: { sentence: 'I can\'t get used to this noise.', translation: 'Tôi không thể quen nổi tiếng ồn này.', highlight: 'can\'t get used to' },
        usage: 'Dù đã cố nhưng vẫn không quen được.',
      },
    ],
    commonMistake: 'Nhầm get used to (quá trình dần quen) với be used to (đã quen rồi). Get = đang trở nên, be = đã là.',
    memoryTip: '💡 get used to = BECOMING accustomed (process). be used to = ALREADY accustomed (state).',
    quiz: {
      items: [
        { sentence: 'It took me a while to get used to _____ on the left side of the road.', options: ['drive', 'driving', 'drove'], correct: 1, explanation: 'get used to + V-ing (dần quen)' },
        { sentence: 'He finally _____ used to the new schedule.', options: ['got', 'was', 'had'], correct: 0, explanation: 'get used to = dần quen (quá trình)' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // CONDITIONALS
  // ──────────────────────────────────────────────────
  {
    id: 'zero-conditional',
    pattern: 'Zero Conditional',
    category: 'conditional',
    forms: [
      {
        structure: 'If + present simple, present simple',
        meaning: 'sự thật chung, luôn đúng',
        example: { sentence: 'If you heat water to 100°C, it boils.', translation: 'Nếu bạn đun nước đến 100°C, nó sôi.', highlight: 'If you heat' },
        usage: 'Sự thật khoa học, quy luật tự nhiên, thói quen luôn xảy ra.',
      },
      {
        structure: 'When + present simple, present simple',
        meaning: 'khi... thì... (luôn đúng)',
        example: { sentence: 'When it rains, the streets get wet.', translation: 'Khi trời mưa, đường trở nên ướt.', highlight: 'When it rains' },
        usage: 'Có thể thay If bằng When vì kết quả luôn xảy ra.',
      },
    ],
    commonMistake: 'Người Việt hay dùng "will" trong mệnh đề kết quả: "If you heat water, it WILL boil" — sai! Zero conditional dùng present simple ở CẢ HAI vế.',
    memoryTip: '💡 Zero = sự thật 100%. Cả 2 vế đều present simple. Không dùng will/would.',
    quiz: {
      items: [
        { sentence: 'If you _____ ice in water, it floats.', options: ['put', 'will put', 'would put'], correct: 0, explanation: 'Zero conditional: sự thật → present simple cả 2 vế' },
        { sentence: 'Water _____ if you heat it to 100°C.', options: ['boils', 'will boil', 'would boil'], correct: 0, explanation: 'Zero conditional: quy luật → present simple' },
      ],
    },
  },
  {
    id: 'first-conditional',
    pattern: 'First Conditional',
    category: 'conditional',
    forms: [
      {
        structure: 'If + present simple, will + V',
        meaning: 'nếu... thì sẽ... (có thể xảy ra)',
        example: { sentence: 'If it rains tomorrow, I will stay home.', translation: 'Nếu mai trời mưa, tôi sẽ ở nhà.', highlight: 'If it rains' },
        usage: 'Tình huống có thể xảy ra trong tương lai, kết quả thực tế.',
      },
      {
        structure: 'If + present simple, can/may + V',
        meaning: 'nếu... có thể sẽ...',
        example: { sentence: 'If you finish early, you can leave.', translation: 'Nếu bạn xong sớm, bạn có thể đi.', highlight: 'If you finish' },
        usage: 'Kết quả là sự cho phép hoặc khả năng.',
      },
    ],
    commonMistake: 'Sai phổ biến: "If it WILL rain..." — KHÔNG dùng will trong mệnh đề If! Chỉ dùng present simple.',
    memoryTip: '💡 Mệnh đề IF luôn dùng PRESENT SIMPLE. Will chỉ ở mệnh đề kết quả.',
    quiz: {
      items: [
        { sentence: 'If she _____ hard, she will pass the exam.', options: ['studies', 'will study', 'studied'], correct: 0, explanation: 'First conditional: If + present simple' },
        { sentence: 'I _____ you if I need help.', options: ['call', 'will call', 'would call'], correct: 1, explanation: 'First conditional: mệnh đề kết quả dùng will' },
      ],
    },
  },
  {
    id: 'second-conditional',
    pattern: 'Second Conditional',
    category: 'conditional',
    forms: [
      {
        structure: 'If + past simple, would + V',
        meaning: 'nếu... (không thật) thì sẽ...',
        example: { sentence: 'If I had more money, I would travel the world.', translation: 'Nếu tôi có nhiều tiền hơn, tôi sẽ đi du lịch thế giới.', highlight: 'If I had' },
        usage: 'Tình huống không thật ở hiện tại hoặc khó xảy ra. Dùng để tưởng tượng.',
      },
      {
        structure: 'If + were, would + V',
        meaning: 'nếu tôi là... (giả định)',
        example: { sentence: 'If I were you, I would accept the offer.', translation: 'Nếu tôi là bạn, tôi sẽ nhận lời.', highlight: 'If I were' },
        usage: 'Lời khuyên qua giả định. Dùng "were" cho tất cả ngôi (formal).',
      },
    ],
    commonMistake: '"If I WAS you" — dùng được nhưng "If I WERE you" formal và đúng ngữ pháp hơn. Past simple ở đây KHÔNG chỉ quá khứ!',
    memoryTip: '💡 Second = UNREAL present. Past tense nhưng nói về hiện tại/tương lai không thật.',
    quiz: {
      items: [
        { sentence: 'If I _____ rich, I would buy a house by the sea.', options: ['am', 'was', 'were'], correct: 2, explanation: 'Second conditional: giả định → If + were (formal)' },
        { sentence: 'She _____ happy if she got the job.', options: ['will be', 'would be', 'is'], correct: 1, explanation: 'Second conditional: không thật → would + V' },
      ],
    },
  },
  {
    id: 'third-conditional',
    pattern: 'Third Conditional',
    category: 'conditional',
    forms: [
      {
        structure: 'If + past perfect, would have + V3',
        meaning: 'nếu đã... thì đã sẽ... (quá khứ không thật)',
        example: { sentence: 'If I had studied harder, I would have passed.', translation: 'Nếu tôi đã học chăm hơn, tôi đã đỗ rồi.', highlight: 'If I had studied' },
        usage: 'Hối tiếc về quá khứ. Việc ĐÃ KHÔNG xảy ra, giả định nếu nó xảy ra.',
      },
      {
        structure: 'If + past perfect, could have + V3',
        meaning: 'nếu đã... thì đã có thể...',
        example: { sentence: 'If you had told me, I could have helped.', translation: 'Nếu bạn đã nói, tôi đã có thể giúp.', highlight: 'If you had told' },
        usage: 'Khả năng đã có thể xảy ra nhưng không, vì điều kiện không đúng.',
      },
    ],
    commonMistake: 'Hay nhầm: "If I WOULD HAVE studied..." — SAI! Mệnh đề If dùng past perfect, KHÔNG dùng would.',
    memoryTip: '💡 Third = UNREAL past. Dùng khi hối tiếc. If + HAD + V3, would HAVE + V3.',
    quiz: {
      items: [
        { sentence: 'If she _____ the email, she would have replied.', options: ['saw', 'had seen', 'has seen'], correct: 1, explanation: 'Third conditional: If + past perfect (had + V3)' },
        { sentence: 'I would have come if I _____ about the party.', options: ['knew', 'had known', 'have known'], correct: 1, explanation: 'Third conditional: giả định quá khứ → had + V3' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // REPORTED SPEECH
  // ──────────────────────────────────────────────────
  {
    id: 'say-vs-tell',
    pattern: 'say vs tell',
    category: 'reported-speech',
    forms: [
      {
        structure: 'say (that) + clause',
        meaning: 'nói rằng... (không cần người nghe)',
        example: { sentence: 'She said that she was tired.', translation: 'Cô ấy nói rằng cô ấy mệt.', highlight: 'said that' },
        usage: 'Say KHÔNG cần object (người nghe) trực tiếp phía sau.',
      },
      {
        structure: 'tell + someone + (that) + clause',
        meaning: 'nói với ai rằng... (cần người nghe)',
        example: { sentence: 'She told me that she was tired.', translation: 'Cô ấy nói với tôi rằng cô ấy mệt.', highlight: 'told me' },
        usage: 'Tell LUÔN CẦN object (người nghe) ngay sau. "Tell that..." là SAI.',
      },
    ],
    commonMistake: '"She said me..." — SAI! Say không đi kèm object trực tiếp. Phải dùng "said to me" hoặc "told me".',
    memoryTip: '💡 SAY something. TELL someone something. Tell luôn cần người nghe!',
    quiz: {
      items: [
        { sentence: 'He _____ that he would come later.', options: ['said', 'told', 'said me'], correct: 0, explanation: 'Không có người nghe → say (that)' },
        { sentence: 'She _____ me the truth about what happened.', options: ['said', 'told', 'said to'], correct: 1, explanation: 'Có người nghe (me) → tell someone' },
        { sentence: 'They _____ they were leaving early.', options: ['said', 'told', 'said to us'], correct: 0, explanation: 'Không có object → said (that)' },
      ],
    },
  },
  {
    id: 'tense-backshift',
    pattern: 'Tense Backshift in Reported Speech',
    category: 'reported-speech',
    forms: [
      {
        structure: 'present → past',
        meaning: 'lùi thì khi tường thuật',
        example: { sentence: '"I am happy" → He said he was happy.', translation: '"Tôi vui" → Anh ấy nói anh ấy vui.', highlight: 'am → was' },
        usage: 'Present simple → past simple, present continuous → past continuous.',
      },
      {
        structure: 'past → past perfect',
        meaning: 'quá khứ lùi thành quá khứ hoàn thành',
        example: { sentence: '"I bought a car" → She said she had bought a car.', translation: '"Tôi đã mua xe" → Cô ấy nói cô ấy đã mua xe.', highlight: 'bought → had bought' },
        usage: 'Past simple → past perfect. Will → would. Can → could.',
      },
    ],
    commonMistake: 'Người Việt hay giữ nguyên thì vì tiếng Việt không lùi thì: "He said he IS happy" — sai nếu context quá khứ.',
    memoryTip: '💡 Mỗi thì lùi 1 bậc: am/is → was, will → would, can → could, have → had.',
    quiz: {
      items: [
        { sentence: '"I will help you." → She said she _____ help me.', options: ['will', 'would', 'can'], correct: 1, explanation: 'will → would khi tường thuật' },
        { sentence: '"I am studying." → He said he _____ studying.', options: ['is', 'was', 'has been'], correct: 1, explanation: 'am → was (present continuous → past continuous)' },
      ],
    },
  },
  {
    id: 'reported-questions',
    pattern: 'Reported Questions',
    category: 'reported-speech',
    forms: [
      {
        structure: 'asked + if/whether + S + V',
        meaning: 'hỏi liệu... (yes/no question)',
        example: { sentence: '"Are you free?" → She asked if I was free.', translation: '"Bạn rảnh không?" → Cô ấy hỏi liệu tôi có rảnh không.', highlight: 'asked if' },
        usage: 'Yes/No question → dùng if hoặc whether. Bỏ trật tự đảo ngữ.',
      },
      {
        structure: 'asked + Wh-word + S + V',
        meaning: 'hỏi ai/gì/ở đâu...',
        example: { sentence: '"Where do you live?" → He asked where I lived.', translation: '"Bạn sống ở đâu?" → Anh ấy hỏi tôi sống ở đâu.', highlight: 'asked where' },
        usage: 'Wh-question giữ wh-word nhưng đổi sang trật tự câu trần thuật (S + V).',
      },
    ],
    commonMistake: '"He asked where DID I live" — SAI! Câu tường thuật KHÔNG dùng trật tự đảo ngữ. Phải là "where I lived".',
    memoryTip: '💡 Reported question = trật tự bình thường (S + V), KHÔNG đảo. Lùi thì.',
    quiz: {
      items: [
        { sentence: '"Do you like pizza?" → She asked me _____ pizza.', options: ['do I like', 'if I liked', 'did I like'], correct: 1, explanation: 'Yes/No → if + S + V (không đảo), lùi thì' },
        { sentence: '"What time is it?" → He asked me what time _____.', options: ['is it', 'it was', 'was it'], correct: 1, explanation: 'Wh-question → trật tự bình thường S + V, lùi thì' },
      ],
    },
  },
  {
    id: 'reported-commands',
    pattern: 'Reported Commands & Requests',
    category: 'reported-speech',
    forms: [
      {
        structure: 'told + someone + to V',
        meaning: 'bảo ai làm gì',
        example: { sentence: '"Close the door." → She told me to close the door.', translation: '"Đóng cửa đi." → Cô ấy bảo tôi đóng cửa.', highlight: 'told me to close' },
        usage: 'Mệnh lệnh → told + object + to V.',
      },
      {
        structure: 'asked + someone + not to V',
        meaning: 'yêu cầu ai đừng làm gì',
        example: { sentence: '"Please don\'t be late." → He asked us not to be late.', translation: '"Xin đừng trễ." → Anh ấy yêu cầu chúng tôi đừng trễ.', highlight: 'asked us not to be' },
        usage: 'Yêu cầu lịch sự → asked. Phủ định: not to V.',
      },
    ],
    commonMistake: '"He told me don\'t go" — SAI! Phải dùng "told me NOT TO go".',
    memoryTip: '💡 Commands: told + someone + to V. Phủ định: + not to V. Không dùng don\'t.',
    quiz: {
      items: [
        { sentence: '"Sit down." → The teacher told us _____.', options: ['sit down', 'to sit down', 'sitting down'], correct: 1, explanation: 'Reported command → told + object + to V' },
        { sentence: '"Don\'t touch that." → She told the children _____ that.', options: ['don\'t touch', 'not to touch', 'to not touch'], correct: 1, explanation: 'Phủ định → not to V' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // PASSIVE VOICE
  // ──────────────────────────────────────────────────
  {
    id: 'basic-passive',
    pattern: 'Basic Passive Voice',
    category: 'passive',
    forms: [
      {
        structure: 'S + be + V3 (+ by agent)',
        meaning: 'bị/được ai đó làm gì',
        example: { sentence: 'The cake was made by my mother.', translation: 'Bánh được làm bởi mẹ tôi.', highlight: 'was made' },
        usage: 'Nhấn mạnh hành động hoặc đối tượng, không quan trọng ai làm.',
      },
      {
        structure: 'Active → Passive conversion',
        meaning: 'đổi chủ động → bị động',
        example: { sentence: 'They built this bridge in 1990. → This bridge was built in 1990.', translation: 'Họ xây cầu này năm 1990. → Cầu này được xây năm 1990.', highlight: 'was built' },
        usage: 'Object (active) → Subject (passive). Thêm be + V3. By agent thường lược bỏ.',
      },
    ],
    commonMistake: 'Người Việt hay quên chia "be" theo thì: "The book write by..." — thiếu was/is. Phải có be + V3!',
    memoryTip: '💡 Passive = be + V3. Chia "be" theo thì: is/are (present), was/were (past), will be (future).',
    quiz: {
      items: [
        { sentence: 'English _____ in many countries.', options: ['speaks', 'is spoken', 'is speaking'], correct: 1, explanation: 'Passive present: is + V3 (spoken)' },
        { sentence: 'The window _____ by the children yesterday.', options: ['broke', 'was broken', 'has broken'], correct: 1, explanation: 'Passive past: was + V3 (broken)' },
      ],
    },
  },
  {
    id: 'passive-modal',
    pattern: 'Passive with Modals',
    category: 'passive',
    forms: [
      {
        structure: 'modal + be + V3',
        meaning: 'có thể/nên/phải được làm gì',
        example: { sentence: 'This problem can be solved easily.', translation: 'Vấn đề này có thể được giải quyết dễ dàng.', highlight: 'can be solved' },
        usage: 'Modal (can/should/must/will/may) + be + V3.',
      },
      {
        structure: 'modal + have been + V3',
        meaning: 'có thể đã/lẽ ra đã được làm gì',
        example: { sentence: 'The email should have been sent yesterday.', translation: 'Email lẽ ra đã phải được gửi hôm qua.', highlight: 'should have been sent' },
        usage: 'Dùng khi nói về quá khứ với modal: should have been / could have been + V3.',
      },
    ],
    commonMistake: '"It can solved" — thiếu "be"! Sau modal luôn cần BE trước V3.',
    memoryTip: '💡 Modal passive: modal + BE + V3. Đừng quên "be"!',
    quiz: {
      items: [
        { sentence: 'Homework must _____ before Friday.', options: ['finish', 'be finished', 'been finished'], correct: 1, explanation: 'Modal passive: must + be + V3' },
        { sentence: 'The report should _____ submitted last week.', options: ['be', 'have been', 'been'], correct: 1, explanation: 'Past modal passive: should + have been + V3' },
      ],
    },
  },
  {
    id: 'get-passive',
    pattern: 'Get Passive',
    category: 'passive',
    forms: [
      {
        structure: 'get + V3',
        meaning: 'bị/được (informal, nhấn mạnh tình huống)',
        example: { sentence: 'He got fired from his job last week.', translation: 'Anh ấy bị sa thải tuần trước.', highlight: 'got fired' },
        usage: 'Informal hơn "be passive". Thường mang nghĩa tiêu cực hoặc bất ngờ.',
      },
      {
        structure: 'get + V3 (positive events)',
        meaning: 'được (điều tốt xảy ra)',
        example: { sentence: 'She got promoted to manager.', translation: 'Cô ấy được thăng chức lên quản lý.', highlight: 'got promoted' },
        usage: 'Cũng dùng cho sự kiện tích cực: got married, got paid, got promoted.',
      },
    ],
    commonMistake: 'Dùng "get passive" trong writing formal — không phù hợp! Get passive chỉ dùng informal/spoken English.',
    memoryTip: '💡 get + V3 = informal passive. got hurt, got lost, got married. Hay gặp trong daily English.',
    quiz: {
      items: [
        { sentence: 'Be careful or you\'ll get _____.', options: ['hurt', 'hurting', 'to hurt'], correct: 0, explanation: 'Get passive: get + V3 (hurt)' },
        { sentence: 'They _____ married in June.', options: ['were', 'got', 'had'], correct: 1, explanation: 'Get passive (informal): got + V3 (married)' },
      ],
    },
  },
  {
    id: 'passive-reporting-verbs',
    pattern: 'Passive with Reporting Verbs',
    category: 'passive',
    forms: [
      {
        structure: 'It is said/believed/thought + that...',
        meaning: 'người ta nói/tin/nghĩ rằng...',
        example: { sentence: 'It is believed that he is innocent.', translation: 'Người ta tin rằng anh ấy vô tội.', highlight: 'It is believed' },
        usage: 'Dùng khi không muốn nêu nguồn cụ thể. Formal, academic.',
      },
      {
        structure: 'S + be said/believed + to V',
        meaning: 'ai đó được cho là...',
        example: { sentence: 'He is believed to be innocent.', translation: 'Anh ấy được cho là vô tội.', highlight: 'is believed to be' },
        usage: 'Cấu trúc rút gọn, formal hơn. S + be + V3 + to V.',
      },
    ],
    commonMistake: 'Nhầm cấu trúc: "He is believed that is innocent" — SAI! Dùng to V, không dùng that clause.',
    memoryTip: '💡 2 cấu trúc: It is said THAT... HOẶC He is said TO...',
    quiz: {
      items: [
        { sentence: '_____ that the company will close next month.', options: ['It is said', 'He is said', 'They said'], correct: 0, explanation: 'It is said + that clause' },
        { sentence: 'She is thought _____ the best candidate.', options: ['that she is', 'to be', 'being'], correct: 1, explanation: 'S + be thought + to V' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // More VERB PATTERNS
  // ──────────────────────────────────────────────────
  {
    id: 'suggest-recommend-pattern',
    pattern: 'suggest / recommend + V-ing',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'suggest/recommend + V-ing',
        meaning: 'gợi ý/khuyên làm gì',
        example: { sentence: 'I suggest taking a break.', translation: 'Tôi gợi ý nghỉ giải lao.', highlight: 'suggest taking' },
        usage: 'Sau suggest/recommend dùng V-ing (KHÔNG dùng to V!).',
      },
      {
        structure: 'suggest/recommend + that + S + V(bare)',
        meaning: 'gợi ý rằng ai đó nên...',
        example: { sentence: 'I suggest that he take a break.', translation: 'Tôi gợi ý anh ấy nên nghỉ.', highlight: 'suggest that he take' },
        usage: 'Subjunctive: dùng V nguyên thể (bare infinitive). KHÔNG dùng "takes" hay "should take".',
      },
    ],
    commonMistake: '"I suggest to take..." — SAI! Suggest KHÔNG đi với to V. Phải dùng V-ing hoặc that + S + V(bare).',
    memoryTip: '💡 suggest + V-ing ✅ suggest + to V ❌. Đây là lỗi rất phổ biến!',
    quiz: {
      items: [
        { sentence: 'The doctor suggested _____ more water.', options: ['to drink', 'drinking', 'drink'], correct: 1, explanation: 'suggest + V-ing (KHÔNG dùng to V)' },
        { sentence: 'I recommend that she _____ the early train.', options: ['takes', 'take', 'taking'], correct: 1, explanation: 'suggest/recommend + that + S + V(bare) — subjunctive' },
      ],
    },
  },
  {
    id: 'wish-if-only',
    pattern: 'wish / if only',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'wish + past simple',
        meaning: 'ước gì (hiện tại không thật)',
        example: { sentence: 'I wish I had more free time.', translation: 'Ước gì tôi có nhiều thời gian rảnh hơn.', highlight: 'wish I had' },
        usage: 'Ước điều trái ngược hiện tại. Past simple nhưng nói về hiện tại.',
      },
      {
        structure: 'wish + past perfect',
        meaning: 'ước gì đã (hối tiếc quá khứ)',
        example: { sentence: 'I wish I had studied harder.', translation: 'Ước gì tôi đã học chăm hơn.', highlight: 'wish I had studied' },
        usage: 'Hối tiếc về quá khứ. Đã không làm, giờ ước.',
      },
    ],
    commonMistake: '"I wish I HAVE more time" — SAI! Sau wish dùng past tense (had). "I wish I STUDIED harder" = ước hiện tại. "I wish I HAD STUDIED" = ước quá khứ.',
    memoryTip: '💡 wish + past simple = ước HIỆN TẠI. wish + past perfect = ước QUÁ KHỨ.',
    quiz: {
      items: [
        { sentence: 'I wish I _____ speak French fluently.', options: ['can', 'could', 'will'], correct: 1, explanation: 'wish + past: can → could (ước hiện tại)' },
        { sentence: 'She wishes she _____ the job offer last year.', options: ['accepted', 'had accepted', 'has accepted'], correct: 1, explanation: 'wish + past perfect: hối tiếc quá khứ' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // More CONDITIONALS
  // ──────────────────────────────────────────────────
  {
    id: 'mixed-conditional',
    pattern: 'Mixed Conditional',
    category: 'conditional',
    forms: [
      {
        structure: 'If + past perfect, would + V (bare)',
        meaning: 'nếu quá khứ khác → hiện tại khác',
        example: { sentence: 'If I had taken that job, I would be rich now.', translation: 'Nếu tôi đã nhận công việc đó, giờ tôi đã giàu.', highlight: 'If I had taken' },
        usage: 'Kết hợp: điều kiện quá khứ (3rd) + kết quả hiện tại (2nd).',
      },
      {
        structure: 'If + past simple, would have + V3',
        meaning: 'nếu hiện tại khác → quá khứ khác',
        example: { sentence: 'If she were braver, she would have spoken up.', translation: 'Nếu cô ấy dũng cảm hơn, cô ấy đã lên tiếng.', highlight: 'If she were' },
        usage: 'Kết hợp: tính cách hiện tại (2nd) + hành động quá khứ (3rd).',
      },
    ],
    commonMistake: 'Mixed conditional trộn 2nd + 3rd. Không phải lỗi — đây là grammar nâng cao mà Vietnamese learners hay bỏ qua.',
    memoryTip: '💡 Mixed = pha trộn 2 thế giới: If quá khứ → kết quả hiện tại, hoặc If hiện tại → kết quả quá khứ.',
    quiz: {
      items: [
        { sentence: 'If I had saved money, I _____ able to buy a house now.', options: ['would be', 'would have been', 'will be'], correct: 0, explanation: 'Past condition → present result: would + V' },
        { sentence: 'If he were more careful, he _____ the mistake yesterday.', options: ['wouldn\'t make', 'wouldn\'t have made', 'won\'t make'], correct: 1, explanation: 'Present condition → past result: would have + V3' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // More PASSIVE
  // ──────────────────────────────────────────────────
  {
    id: 'have-something-done',
    pattern: 'have something done',
    category: 'passive',
    forms: [
      {
        structure: 'have + object + V3',
        meaning: 'nhờ ai làm gì cho mình',
        example: { sentence: 'I had my hair cut yesterday.', translation: 'Tôi đã đi cắt tóc hôm qua.', highlight: 'had my hair cut' },
        usage: 'Dùng khi bạn KHÔNG tự làm mà thuê/nhờ người khác.',
      },
      {
        structure: 'get + object + V3',
        meaning: 'nhờ/bắt ai làm gì (informal)',
        example: { sentence: 'I need to get my car repaired.', translation: 'Tôi cần đem xe đi sửa.', highlight: 'get my car repaired' },
        usage: 'Informal version. Cũng có thể mang nghĩa "bị": I got my phone stolen.',
      },
    ],
    commonMistake: '"I cut my hair" = TỰ CẮT tóc mình. "I had my hair cut" = ĐI CẮT (nhờ thợ). Rất khác nhau!',
    memoryTip: '💡 have/get + object + V3 = nhờ ai đó làm. KHÔNG phải tự làm.',
    quiz: {
      items: [
        { sentence: 'She _____ her nails done every two weeks.', options: ['has', 'does', 'makes'], correct: 0, explanation: 'have + object + V3 = nhờ người khác làm' },
        { sentence: 'We need to get the roof _____.', options: ['repair', 'repaired', 'repairing'], correct: 1, explanation: 'get + object + V3 (past participle)' },
      ],
    },
  },

  // ──────────────────────────────────────────────────
  // More REPORTED SPEECH
  // ──────────────────────────────────────────────────
  {
    id: 'reported-modals',
    pattern: 'Reported Speech with Modals',
    category: 'reported-speech',
    forms: [
      {
        structure: 'will → would, can → could',
        meaning: 'modal lùi thì khi tường thuật',
        example: { sentence: '"I will help." → He said he would help.', translation: '"Tôi sẽ giúp." → Anh ấy nói anh ấy sẽ giúp.', highlight: 'will → would' },
        usage: 'will → would. can → could. may → might. shall → should.',
      },
      {
        structure: 'must → had to (hoặc giữ must)',
        meaning: 'must có thể lùi hoặc giữ nguyên',
        example: { sentence: '"You must finish." → She said I had to finish.', translation: '"Bạn phải hoàn thành." → Cô ấy nói tôi phải hoàn thành.', highlight: 'must → had to' },
        usage: 'must → had to (obligation). must giữ nguyên nếu vẫn đúng: "She said I must be careful."',
      },
    ],
    commonMistake: '"He said he can swim" — nên lùi thì: "said he COULD swim". Nhiều Vietnamese learners quên lùi modal.',
    memoryTip: '💡 Modal cũng lùi 1 bậc: will→would, can→could, may→might. Could/would/should/might GIỮA NGUYÊN.',
    quiz: {
      items: [
        { sentence: '"I can drive." → She said she _____ drive.', options: ['can', 'could', 'will'], correct: 1, explanation: 'can → could khi tường thuật' },
        { sentence: '"You must leave now." → He told me I _____ leave immediately.', options: ['must', 'had to', 'have to'], correct: 1, explanation: 'must → had to (obligation)' },
      ],
    },
  },

  // More USED TO
  {
    id: 'would-vs-used-to',
    pattern: 'would vs used to',
    category: 'used-to',
    forms: [
      {
        structure: 'used to + V',
        meaning: 'thói quen + trạng thái cũ',
        example: { sentence: 'I used to live in Hanoi.', translation: 'Tôi đã từng sống ở Hà Nội.', highlight: 'used to live' },
        usage: 'Dùng cho cả thói quen lặp lại VÀ trạng thái (live, be, have, know...).',
      },
      {
        structure: 'would + V',
        meaning: 'thói quen cũ (chỉ hành động lặp)',
        example: { sentence: 'Every summer, we would go to the beach.', translation: 'Mỗi mùa hè, chúng tôi thường đi biển.', highlight: 'would go' },
        usage: 'CHỈ dùng cho thói quen lặp lại. KHÔNG dùng cho trạng thái!',
      },
    ],
    commonMistake: '"I would live in Hanoi" — SAI! "Live" là trạng thái, phải dùng "used to live". Would chỉ cho hành động lặp lại.',
    memoryTip: '💡 used to = habits + states. would = habits ONLY (no states).',
    quiz: {
      items: [
        { sentence: 'She _____ have long hair when she was young.', options: ['used to', 'would', 'both are correct'], correct: 0, explanation: '"Have" là trạng thái → chỉ dùng used to, không dùng would' },
        { sentence: 'When I was a kid, I _____ play in the park every day.', options: ['used to', 'would', 'both are correct'], correct: 2, explanation: '"Play" là hành động lặp → dùng cả used to và would đều đúng' },
      ],
    },
  },

  // Additional verb patterns
  {
    id: 'avoid-enjoy-mind-pattern',
    pattern: 'avoid / enjoy / mind + V-ing',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'avoid / enjoy / mind + V-ing',
        meaning: 'tránh / thích / phiền + V-ing',
        example: { sentence: 'She enjoys reading novels before bed.', translation: 'Cô ấy thích đọc tiểu thuyết trước khi ngủ.', highlight: 'enjoys reading' },
        usage: 'Các verb này LUÔN đi với V-ing. Không bao giờ dùng to V.',
      },
      {
        structure: 'consider / imagine / practise + V-ing',
        meaning: 'cân nhắc / tưởng tượng / luyện tập + V-ing',
        example: { sentence: 'Have you considered moving to a new city?', translation: 'Bạn đã cân nhắc chuyển đến thành phố mới chưa?', highlight: 'considered moving' },
        usage: 'Nhóm verbs chỉ đi với V-ing: avoid, enjoy, mind, consider, imagine, practise, finish, suggest, deny, risk.',
      },
    ],
    commonMistake: '"I enjoy to read" — SAI! "I avoid to eat" — SAI! Các verb này BẮT BUỘC dùng V-ing.',
    memoryTip: '💡 MEGAFIPS: Mind, Enjoy, Give up, Avoid, Finish, Imagine, Practise, Suggest → luôn + V-ing.',
    quiz: {
      items: [
        { sentence: 'Do you mind _____ the window?', options: ['to open', 'opening', 'open'], correct: 1, explanation: 'mind + V-ing (luôn luôn)' },
        { sentence: 'She avoids _____ junk food.', options: ['to eat', 'eating', 'eat'], correct: 1, explanation: 'avoid + V-ing (bắt buộc)' },
      ],
    },
  },
  {
    id: 'want-hope-expect-pattern',
    pattern: 'want / hope / expect + to V',
    category: 'verb-pattern',
    forms: [
      {
        structure: 'want / hope / decide + to V',
        meaning: 'muốn / hy vọng / quyết định + to V',
        example: { sentence: 'I want to learn Japanese.', translation: 'Tôi muốn học tiếng Nhật.', highlight: 'want to learn' },
        usage: 'Các verb này LUÔN đi với to V. Không dùng V-ing.',
      },
      {
        structure: 'agree / refuse / promise + to V',
        meaning: 'đồng ý / từ chối / hứa + to V',
        example: { sentence: 'He agreed to help us with the project.', translation: 'Anh ấy đồng ý giúp chúng tôi với dự án.', highlight: 'agreed to help' },
        usage: 'Nhóm verbs chỉ đi với to V: want, hope, decide, agree, refuse, promise, expect, plan, manage, afford.',
      },
    ],
    commonMistake: '"I want going" — SAI! "She decided studying" — SAI! Phải dùng to V.',
    memoryTip: '💡 Want, Hope, Decide, Agree, Refuse, Promise → luôn + to V.',
    quiz: {
      items: [
        { sentence: 'She decided _____ abroad next year.', options: ['studying', 'to study', 'study'], correct: 1, explanation: 'decide + to V (luôn luôn)' },
        { sentence: 'They refused _____ the contract.', options: ['signing', 'to sign', 'sign'], correct: 1, explanation: 'refuse + to V (bắt buộc)' },
      ],
    },
  },
];

// Category labels for UI
export const GRAMMAR_CATEGORIES: { value: GrammarCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'verb-pattern', label: 'Verb Patterns' },
  { value: 'used-to', label: 'Used to' },
  { value: 'conditional', label: 'Conditionals' },
  { value: 'reported-speech', label: 'Reported Speech' },
  { value: 'passive', label: 'Passive Voice' },
];
