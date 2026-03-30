export interface TenseComparison {
  id: string;
  title: string;
  tenseA: {
    name: string;
    structure: string;
    usage: string[];
    signalWords: string[];
    examples: { en: string; vi: string }[];
  };
  tenseB: {
    name: string;
    structure: string;
    usage: string[];
    signalWords: string[];
    examples: { en: string; vi: string }[];
  };
  keyDifference: string;
  commonMistakes: { wrong: string; correct: string; explanation: string }[];
  quiz: { sentence: string; options: string[]; correct: number; explanation: string }[];
}

export const TENSE_COMPARISONS: TenseComparison[] = [
  // ─── 1. Present Simple vs Present Continuous ───────────────────────
  {
    id: 'present-simple-vs-present-continuous',
    title: 'Present Simple vs Present Continuous',
    tenseA: {
      name: 'Present Simple',
      structure: 'S + V(s/es) + O',
      usage: [
        'Diễn tả thói quen, hành động lặp đi lặp lại',
        'Diễn tả sự thật hiển nhiên, chân lý',
        'Diễn tả lịch trình, thời gian biểu cố định',
        'Diễn tả trạng thái, sở thích, cảm xúc',
      ],
      signalWords: ['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'on Mondays'],
      examples: [
        { en: 'She drinks coffee every morning.', vi: 'Cô ấy uống cà phê mỗi sáng.' },
        { en: 'The Earth revolves around the Sun.', vi: 'Trái Đất quay quanh Mặt Trời.' },
        { en: 'The train leaves at 9 AM.', vi: 'Tàu khởi hành lúc 9 giờ sáng.' },
        { en: 'He works at a bank.', vi: 'Anh ấy làm việc ở ngân hàng.' },
      ],
    },
    tenseB: {
      name: 'Present Continuous',
      structure: 'S + am/is/are + V-ing + O',
      usage: [
        'Diễn tả hành động đang xảy ra tại thời điểm nói',
        'Diễn tả hành động tạm thời',
        'Diễn tả kế hoạch đã được sắp xếp trong tương lai gần',
        'Diễn tả sự thay đổi hoặc xu hướng',
      ],
      signalWords: ['now', 'right now', 'at the moment', 'currently', 'today', 'this week', 'look!', 'listen!'],
      examples: [
        { en: 'She is drinking coffee right now.', vi: 'Cô ấy đang uống cà phê ngay bây giờ.' },
        { en: 'I am staying with my friend this week.', vi: 'Tuần này tôi đang ở cùng bạn tôi.' },
        { en: 'We are meeting the client tomorrow.', vi: 'Ngày mai chúng tôi sẽ gặp khách hàng.' },
        { en: 'The weather is getting warmer.', vi: 'Thời tiết đang trở nên ấm hơn.' },
      ],
    },
    keyDifference:
      'Present Simple dùng cho thói quen và sự thật lâu dài; Present Continuous dùng cho hành động đang xảy ra hoặc tạm thời.',
    commonMistakes: [
      {
        wrong: 'I am knowing the answer.',
        correct: 'I know the answer.',
        explanation:
          'Động từ trạng thái (stative verbs) như know, believe, want, need không dùng với thì tiếp diễn.',
      },
      {
        wrong: 'She is go to school every day.',
        correct: 'She goes to school every day.',
        explanation:
          'Hành động lặp lại hàng ngày dùng Present Simple, không dùng Present Continuous. Ngoài ra cần chia động từ đúng (goes).',
      },
      {
        wrong: 'The movie is starting at 8 PM every Friday.',
        correct: 'The movie starts at 8 PM every Friday.',
        explanation: 'Lịch trình cố định dùng Present Simple, kể cả khi nói về tương lai.',
      },
    ],
    quiz: [
      {
        sentence: 'Water ___ at 100 degrees Celsius.',
        options: ['boils', 'is boiling'],
        correct: 0,
        explanation: 'Sự thật khoa học dùng Present Simple.',
      },
      {
        sentence: 'Look! The baby ___.',
        options: ['smiles', 'is smiling'],
        correct: 1,
        explanation: '"Look!" báo hiệu hành động đang xảy ra ngay lúc nói → Present Continuous.',
      },
      {
        sentence: 'He usually ___ to work by bus.',
        options: ['goes', 'is going'],
        correct: 0,
        explanation: '"Usually" là dấu hiệu của thói quen → Present Simple.',
      },
      {
        sentence: 'They ___ a new house at the moment.',
        options: ['build', 'are building'],
        correct: 1,
        explanation: '"At the moment" chỉ hành động đang diễn ra → Present Continuous.',
      },
      {
        sentence: 'I ___ this cake is delicious.',
        options: ['think', 'am thinking'],
        correct: 0,
        explanation: '"Think" khi mang nghĩa "cho rằng, tin rằng" là động từ trạng thái → Present Simple.',
      },
    ],
  },

  // ─── 2. Past Simple vs Past Continuous ─────────────────────────────
  {
    id: 'past-simple-vs-past-continuous',
    title: 'Past Simple vs Past Continuous',
    tenseA: {
      name: 'Past Simple',
      structure: 'S + V-ed / V2 + O',
      usage: [
        'Diễn tả hành động đã xảy ra và kết thúc trong quá khứ',
        'Diễn tả chuỗi hành động liên tiếp trong quá khứ',
        'Diễn tả thói quen trong quá khứ',
      ],
      signalWords: ['yesterday', 'last week', 'ago', 'in 2010', 'when I was young', 'then', 'at that time'],
      examples: [
        { en: 'I visited Paris last summer.', vi: 'Tôi đã đến thăm Paris mùa hè năm ngoái.' },
        { en: 'She opened the door and walked in.', vi: 'Cô ấy mở cửa và bước vào.' },
        { en: 'He played football every weekend as a child.', vi: 'Hồi nhỏ, anh ấy chơi bóng đá mỗi cuối tuần.' },
      ],
    },
    tenseB: {
      name: 'Past Continuous',
      structure: 'S + was/were + V-ing + O',
      usage: [
        'Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ',
        'Diễn tả hành động đang xảy ra thì bị một hành động khác xen vào',
        'Diễn tả hai hành động xảy ra đồng thời trong quá khứ',
        'Tạo bối cảnh, khung cảnh cho câu chuyện',
      ],
      signalWords: ['while', 'when', 'as', 'at 8 PM yesterday', 'at that time', 'all day long'],
      examples: [
        { en: 'I was reading a book at 9 PM last night.', vi: 'Tôi đang đọc sách lúc 9 giờ tối qua.' },
        { en: 'She was cooking when the phone rang.', vi: 'Cô ấy đang nấu ăn thì điện thoại reo.' },
        { en: 'While I was studying, my brother was playing games.', vi: 'Trong khi tôi đang học thì anh trai tôi đang chơi game.' },
      ],
    },
    keyDifference:
      'Past Simple diễn tả hành động đã hoàn thành trong quá khứ; Past Continuous diễn tả hành động đang diễn ra (chưa hoàn thành) tại một thời điểm trong quá khứ.',
    commonMistakes: [
      {
        wrong: 'When I was coming home, I met an old friend.',
        correct: 'When I came home, I met an old friend.',
        explanation:
          '"When" + hành động ngắn (xen vào) dùng Past Simple. Past Continuous dùng cho hành động dài đang diễn ra.',
      },
      {
        wrong: 'I was knowing him for years.',
        correct: 'I knew him for years.',
        explanation: 'Động từ trạng thái (know) không dùng ở thì tiếp diễn.',
      },
    ],
    quiz: [
      {
        sentence: 'While she ___ dinner, the lights went out.',
        options: ['cooked', 'was cooking'],
        correct: 1,
        explanation: 'Hành động dài đang diễn ra bị xen ngang → Past Continuous.',
      },
      {
        sentence: 'I ___ my keys yesterday.',
        options: ['lost', 'was losing'],
        correct: 0,
        explanation: 'Hành động hoàn thành trong quá khứ → Past Simple.',
      },
      {
        sentence: 'They ___ TV when I arrived.',
        options: ['watched', 'were watching'],
        correct: 1,
        explanation: 'Hành động đang diễn ra khi một hành động khác xen vào → Past Continuous.',
      },
      {
        sentence: 'He ___ the door and ___ out.',
        options: ['opened / walked', 'was opening / was walking'],
        correct: 0,
        explanation: 'Chuỗi hành động liên tiếp trong quá khứ → Past Simple.',
      },
      {
        sentence: 'At 7 AM yesterday, I ___ breakfast.',
        options: ['had', 'was having'],
        correct: 1,
        explanation: 'Hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ → Past Continuous.',
      },
    ],
  },

  // ─── 3. Past Simple vs Present Perfect ─────────────────────────────
  {
    id: 'past-simple-vs-present-perfect',
    title: 'Past Simple vs Present Perfect',
    tenseA: {
      name: 'Past Simple',
      structure: 'S + V-ed / V2 + O',
      usage: [
        'Diễn tả hành động xảy ra tại thời điểm xác định trong quá khứ',
        'Diễn tả hành động đã kết thúc hoàn toàn, không liên quan đến hiện tại',
        'Dùng khi hỏi hoặc nói về thời gian cụ thể (when, what time)',
      ],
      signalWords: ['yesterday', 'last year', 'in 1999', 'ago', 'when', 'at that time'],
      examples: [
        { en: 'I went to Japan in 2019.', vi: 'Tôi đã đến Nhật vào năm 2019.' },
        { en: 'She graduated from university last year.', vi: 'Cô ấy tốt nghiệp đại học năm ngoái.' },
        { en: 'When did you buy this car?', vi: 'Bạn mua chiếc xe này khi nào?' },
      ],
    },
    tenseB: {
      name: 'Present Perfect',
      structure: 'S + have/has + V3 (past participle) + O',
      usage: [
        'Diễn tả hành động đã xảy ra nhưng không nói rõ thời gian',
        'Diễn tả trải nghiệm, kinh nghiệm (đã từng / chưa từng)',
        'Diễn tả hành động bắt đầu trong quá khứ và kéo dài đến hiện tại',
        'Diễn tả hành động vừa mới xảy ra có kết quả ở hiện tại',
      ],
      signalWords: ['just', 'already', 'yet', 'ever', 'never', 'since', 'for', 'so far', 'recently'],
      examples: [
        { en: 'I have been to Japan.', vi: 'Tôi đã từng đến Nhật.' },
        { en: 'She has just finished her homework.', vi: 'Cô ấy vừa mới làm xong bài tập.' },
        { en: 'They have lived here since 2010.', vi: 'Họ đã sống ở đây từ năm 2010.' },
        { en: 'Have you ever tried sushi?', vi: 'Bạn đã từng ăn sushi chưa?' },
      ],
    },
    keyDifference:
      'Past Simple dùng khi có thời gian xác định trong quá khứ; Present Perfect dùng khi thời gian không xác định hoặc hành động còn liên quan đến hiện tại.',
    commonMistakes: [
      {
        wrong: 'I have seen that movie yesterday.',
        correct: 'I saw that movie yesterday.',
        explanation: 'Có "yesterday" (thời gian xác định) → phải dùng Past Simple, không dùng Present Perfect.',
      },
      {
        wrong: 'Did you ever visit London?',
        correct: 'Have you ever visited London?',
        explanation: '"Ever" hỏi về trải nghiệm (không xác định thời gian) → dùng Present Perfect.',
      },
      {
        wrong: 'I lived here for ten years. (vẫn đang sống)',
        correct: 'I have lived here for ten years.',
        explanation: 'Hành động bắt đầu trong quá khứ và còn tiếp diễn đến hiện tại → Present Perfect.',
      },
    ],
    quiz: [
      {
        sentence: 'I ___ to that restaurant three times so far.',
        options: ['went', 'have been'],
        correct: 1,
        explanation: '"So far" là dấu hiệu của Present Perfect.',
      },
      {
        sentence: 'She ___ her job last month.',
        options: ['quit', 'has quit'],
        correct: 0,
        explanation: '"Last month" là thời gian xác định → Past Simple.',
      },
      {
        sentence: 'They ___ married in 2015.',
        options: ['got', 'have got'],
        correct: 0,
        explanation: '"In 2015" là thời gian xác định → Past Simple.',
      },
      {
        sentence: '___ you ever ___ bungee jumping?',
        options: ['Did / try', 'Have / tried'],
        correct: 1,
        explanation: '"Ever" hỏi về trải nghiệm → Present Perfect.',
      },
      {
        sentence: 'I ___ this book. You can borrow it.',
        options: ['finished', 'have finished'],
        correct: 1,
        explanation: 'Hành động vừa hoàn thành và có kết quả ở hiện tại (sách trống, bạn có thể mượn) → Present Perfect.',
      },
    ],
  },

  // ─── 4. Present Perfect vs Present Perfect Continuous ──────────────
  {
    id: 'present-perfect-vs-present-perfect-continuous',
    title: 'Present Perfect vs Present Perfect Continuous',
    tenseA: {
      name: 'Present Perfect',
      structure: 'S + have/has + V3 (past participle) + O',
      usage: [
        'Nhấn mạnh kết quả của hành động',
        'Diễn tả hành động đã hoàn thành (có thể đếm được số lần)',
        'Dùng với trạng thái hoặc động từ không dùng ở tiếp diễn',
      ],
      signalWords: ['already', 'just', 'yet', 'ever', 'never', 'times', 'how many', 'so far'],
      examples: [
        { en: 'I have read three books this month.', vi: 'Tháng này tôi đã đọc ba cuốn sách.' },
        { en: 'She has already finished the report.', vi: 'Cô ấy đã hoàn thành báo cáo rồi.' },
        { en: 'He has known her since childhood.', vi: 'Anh ấy biết cô ấy từ nhỏ.' },
      ],
    },
    tenseB: {
      name: 'Present Perfect Continuous',
      structure: 'S + have/has + been + V-ing + O',
      usage: [
        'Nhấn mạnh quá trình, thời gian kéo dài của hành động',
        'Diễn tả hành động bắt đầu trong quá khứ và vẫn đang tiếp diễn',
        'Giải thích nguyên nhân của tình trạng hiện tại',
        'Diễn tả hành động tạm thời kéo dài',
      ],
      signalWords: ['for', 'since', 'all day', 'all morning', 'how long', 'lately', 'recently'],
      examples: [
        { en: 'I have been reading this book for two hours.', vi: 'Tôi đã đọc cuốn sách này được hai tiếng rồi.' },
        { en: 'She has been working here since January.', vi: 'Cô ấy đã làm việc ở đây từ tháng Giêng.' },
        { en: 'Your eyes are red. Have you been crying?', vi: 'Mắt bạn đỏ. Bạn khóc à?' },
        { en: 'It has been raining all morning.', vi: 'Trời đã mưa suốt cả sáng.' },
      ],
    },
    keyDifference:
      'Present Perfect nhấn mạnh kết quả (đã hoàn thành bao nhiêu); Present Perfect Continuous nhấn mạnh quá trình và thời gian kéo dài.',
    commonMistakes: [
      {
        wrong: 'I have been knowing her for years.',
        correct: 'I have known her for years.',
        explanation: '"Know" là động từ trạng thái, không dùng ở thể tiếp diễn.',
      },
      {
        wrong: 'She has been writing three letters today.',
        correct: 'She has written three letters today.',
        explanation: 'Khi đếm số lượng cụ thể (three letters), dùng Present Perfect (nhấn mạnh kết quả).',
      },
    ],
    quiz: [
      {
        sentence: 'I ___ for you for over an hour!',
        options: ['have waited', 'have been waiting'],
        correct: 1,
        explanation: 'Nhấn mạnh thời gian kéo dài ("for over an hour") → Present Perfect Continuous.',
      },
      {
        sentence: 'She ___ five emails this morning.',
        options: ['has sent', 'has been sending'],
        correct: 0,
        explanation: 'Đếm số lượng cụ thể (five emails) → Present Perfect.',
      },
      {
        sentence: 'It ___ all day. The roads are flooded.',
        options: ['has rained', 'has been raining'],
        correct: 1,
        explanation: '"All day" nhấn mạnh quá trình liên tục → Present Perfect Continuous.',
      },
      {
        sentence: 'How many pages ___ you ___?',
        options: ['have / read', 'have / been reading'],
        correct: 0,
        explanation: '"How many" hỏi về số lượng (kết quả) → Present Perfect.',
      },
      {
        sentence: 'You look tired. ___ you ___?',
        options: ['Have / exercised', 'Have / been exercising'],
        correct: 1,
        explanation: 'Giải thích tình trạng hiện tại (trông mệt) bằng hành động kéo dài → Present Perfect Continuous.',
      },
    ],
  },

  // ─── 5. Will vs Going to ───────────────────────────────────────────
  {
    id: 'will-vs-going-to',
    title: 'Will vs Going to',
    tenseA: {
      name: 'Will',
      structure: 'S + will + V (bare infinitive) + O',
      usage: [
        'Quyết định tại thời điểm nói (spontaneous decision)',
        'Đưa ra lời hứa, lời đề nghị, yêu cầu',
        'Dự đoán dựa trên ý kiến cá nhân, niềm tin',
        'Diễn tả sự thật trong tương lai',
      ],
      signalWords: ['I think', 'I believe', 'probably', 'perhaps', 'I promise', 'I\'m sure'],
      examples: [
        { en: 'I\'ll have the chicken, please.', vi: 'Cho tôi gà, làm ơn. (quyết định ngay)' },
        { en: 'I will always love you.', vi: 'Anh sẽ luôn yêu em. (lời hứa)' },
        { en: 'I think it will rain tomorrow.', vi: 'Tôi nghĩ ngày mai trời sẽ mưa. (dự đoán cá nhân)' },
        { en: 'Don\'t worry, I\'ll help you.', vi: 'Đừng lo, tôi sẽ giúp bạn. (đề nghị)' },
      ],
    },
    tenseB: {
      name: 'Going to',
      structure: 'S + am/is/are + going to + V (bare infinitive) + O',
      usage: [
        'Kế hoạch, dự định đã quyết định từ trước',
        'Dự đoán dựa trên bằng chứng hiện tại',
        'Diễn tả ý định mạnh mẽ',
      ],
      signalWords: ['tonight', 'tomorrow', 'next week', 'soon', 'plan to', 'intend to'],
      examples: [
        { en: 'I\'m going to study medicine next year.', vi: 'Năm sau tôi sẽ học y. (kế hoạch từ trước)' },
        { en: 'Look at those clouds! It\'s going to rain.', vi: 'Nhìn mây kìa! Trời sắp mưa. (bằng chứng)' },
        { en: 'They are going to move to a new apartment.', vi: 'Họ sắp chuyển đến căn hộ mới. (dự định)' },
        { en: 'She\'s going to have a baby in March.', vi: 'Cô ấy sẽ sinh em bé vào tháng Ba. (bằng chứng)' },
      ],
    },
    keyDifference:
      'Will dùng cho quyết định tức thời và dự đoán cá nhân; Going to dùng cho kế hoạch đã có từ trước và dự đoán dựa trên bằng chứng.',
    commonMistakes: [
      {
        wrong: 'Wait, I\'m going to open the door for you. (vừa mới quyết định)',
        correct: 'Wait, I\'ll open the door for you.',
        explanation: 'Khi quyết định ngay tại thời điểm nói → dùng will, không dùng going to.',
      },
      {
        wrong: 'Look out! The vase will fall!',
        correct: 'Look out! The vase is going to fall!',
        explanation: 'Dự đoán dựa trên bằng chứng trước mắt (đang thấy bình hoa sắp rơi) → dùng going to.',
      },
      {
        wrong: 'I will visit my grandma this weekend. (đã lên kế hoạch)',
        correct: 'I\'m going to visit my grandma this weekend.',
        explanation: 'Kế hoạch đã quyết định từ trước → dùng going to.',
      },
    ],
    quiz: [
      {
        sentence: '"The phone is ringing!" — "I ___ get it."',
        options: ['will', 'am going to'],
        correct: 0,
        explanation: 'Quyết định tại thời điểm nói → will.',
      },
      {
        sentence: 'We ___ buy a new house. We\'ve already saved enough money.',
        options: ['will', 'are going to'],
        correct: 1,
        explanation: 'Kế hoạch đã quyết định từ trước (đã tiết kiệm tiền) → going to.',
      },
      {
        sentence: 'Careful! You ___ spill the coffee!',
        options: ['will', 'are going to'],
        correct: 1,
        explanation: 'Dự đoán dựa trên bằng chứng hiện tại → going to.',
      },
      {
        sentence: 'I promise I ___ be on time.',
        options: ['will', 'am going to'],
        correct: 0,
        explanation: 'Lời hứa → will.',
      },
      {
        sentence: 'I ___ travel to Europe next summer. I already booked the flights.',
        options: ['will', 'am going to'],
        correct: 1,
        explanation: 'Kế hoạch đã sắp xếp từ trước (đã đặt vé) → going to.',
      },
    ],
  },

  // ─── 6. Past Simple vs Past Perfect ────────────────────────────────
  {
    id: 'past-simple-vs-past-perfect',
    title: 'Past Simple vs Past Perfect',
    tenseA: {
      name: 'Past Simple',
      structure: 'S + V-ed / V2 + O',
      usage: [
        'Diễn tả hành động xảy ra tại thời điểm xác định trong quá khứ',
        'Diễn tả chuỗi hành động theo thứ tự thời gian',
        'Diễn tả sự kiện chính trong câu chuyện',
      ],
      signalWords: ['yesterday', 'last night', 'ago', 'in 2005', 'then', 'after that'],
      examples: [
        { en: 'I arrived at the airport at 6 PM.', vi: 'Tôi đến sân bay lúc 6 giờ chiều.' },
        { en: 'She called me and told me the news.', vi: 'Cô ấy gọi cho tôi và kể cho tôi tin tức.' },
        { en: 'We played tennis and then went home.', vi: 'Chúng tôi chơi tennis rồi về nhà.' },
      ],
    },
    tenseB: {
      name: 'Past Perfect',
      structure: 'S + had + V3 (past participle) + O',
      usage: [
        'Diễn tả hành động xảy ra trước một hành động khác trong quá khứ',
        'Diễn tả hành động hoàn thành trước một thời điểm trong quá khứ',
        'Dùng trong câu điều kiện loại 3 (If + had + V3)',
        'Dùng với wish để diễn tả ước muốn về quá khứ',
      ],
      signalWords: ['before', 'after', 'by the time', 'already', 'just', 'never...before', 'until', 'when'],
      examples: [
        { en: 'I had eaten before she arrived.', vi: 'Tôi đã ăn xong trước khi cô ấy đến.' },
        { en: 'By the time he came, we had left.', vi: 'Đến lúc anh ấy đến thì chúng tôi đã đi rồi.' },
        { en: 'She had never seen snow before that trip.', vi: 'Trước chuyến đi đó, cô ấy chưa bao giờ thấy tuyết.' },
        { en: 'If I had studied harder, I would have passed.', vi: 'Nếu tôi học chăm hơn, tôi đã đậu rồi.' },
      ],
    },
    keyDifference:
      'Past Simple diễn tả hành động trong quá khứ; Past Perfect diễn tả hành động xảy ra TRƯỚC một hành động khác trong quá khứ (quá khứ của quá khứ).',
    commonMistakes: [
      {
        wrong: 'When I arrived, the movie started.',
        correct: 'When I arrived, the movie had already started.',
        explanation:
          'Phim đã bắt đầu TRƯỚC KHI tôi đến → phim dùng Past Perfect vì nó xảy ra trước.',
      },
      {
        wrong: 'After she had eaten, she had gone to bed.',
        correct: 'After she had eaten, she went to bed.',
        explanation:
          'Chỉ hành động xảy ra trước mới dùng Past Perfect. Hành động xảy ra sau dùng Past Simple.',
      },
    ],
    quiz: [
      {
        sentence: 'By the time we reached the station, the train ___.',
        options: ['left', 'had left'],
        correct: 1,
        explanation: 'Tàu đi TRƯỚC KHI chúng tôi đến → Past Perfect.',
      },
      {
        sentence: 'After she ___ dinner, she watched TV.',
        options: ['had cooked', 'cooked'],
        correct: 0,
        explanation: 'Nấu ăn xảy ra trước xem TV → Past Perfect cho hành động xảy ra trước.',
      },
      {
        sentence: 'I ___ never ___ sushi before I went to Japan.',
        options: ['had / eaten', 'have / eaten'],
        correct: 0,
        explanation: 'Hành động xảy ra trước một sự kiện khác trong quá khứ → Past Perfect.',
      },
      {
        sentence: 'She told me that she ___ a new job.',
        options: ['found', 'had found'],
        correct: 1,
        explanation: 'Tìm được việc xảy ra TRƯỚC khi kể cho tôi → Past Perfect.',
      },
      {
        sentence: 'We arrived at the cinema and ___ our seats.',
        options: ['found', 'had found'],
        correct: 0,
        explanation: 'Hai hành động liên tiếp theo thứ tự thời gian → đều dùng Past Simple.',
      },
    ],
  },

  // ─── 7. Present Simple vs Present Perfect ──────────────────────────
  {
    id: 'present-simple-vs-present-perfect',
    title: 'Present Simple vs Present Perfect',
    tenseA: {
      name: 'Present Simple',
      structure: 'S + V(s/es) + O',
      usage: [
        'Diễn tả sự thật, chân lý hiển nhiên',
        'Diễn tả thói quen, hành động lặp lại ở hiện tại',
        'Diễn tả trạng thái hiện tại (không nhấn mạnh thời gian bắt đầu)',
      ],
      signalWords: ['always', 'usually', 'every day', 'often', 'sometimes', 'generally'],
      examples: [
        { en: 'I live in Hanoi.', vi: 'Tôi sống ở Hà Nội. (sự thật hiện tại)' },
        { en: 'She works at a hospital.', vi: 'Cô ấy làm việc ở bệnh viện.' },
        { en: 'He plays guitar every evening.', vi: 'Anh ấy chơi guitar mỗi tối.' },
      ],
    },
    tenseB: {
      name: 'Present Perfect',
      structure: 'S + have/has + V3 (past participle) + O',
      usage: [
        'Diễn tả hành động bắt đầu trong quá khứ và kéo dài đến hiện tại (nhấn mạnh thời gian)',
        'Diễn tả kinh nghiệm, trải nghiệm cho đến thời điểm nói',
        'Diễn tả sự thay đổi so với trước đây',
        'Diễn tả hành động vừa mới hoàn thành có kết quả ở hiện tại',
      ],
      signalWords: ['since', 'for', 'already', 'yet', 'just', 'ever', 'never', 'recently', 'so far'],
      examples: [
        { en: 'I have lived in Hanoi since 2015.', vi: 'Tôi đã sống ở Hà Nội từ năm 2015. (nhấn mạnh thời gian)' },
        { en: 'She has worked at three different hospitals.', vi: 'Cô ấy đã làm việc ở ba bệnh viện khác nhau. (kinh nghiệm)' },
        { en: 'He has recently learned to play guitar.', vi: 'Gần đây anh ấy đã học chơi guitar. (thay đổi)' },
        { en: 'They have just arrived.', vi: 'Họ vừa mới đến.' },
      ],
    },
    keyDifference:
      'Present Simple mô tả trạng thái hiện tại hoặc thói quen, không nói về thời gian bắt đầu. Present Perfect kết nối quá khứ với hiện tại, nhấn mạnh trải nghiệm hoặc thời gian kéo dài.',
    commonMistakes: [
      {
        wrong: 'I live here for ten years.',
        correct: 'I have lived here for ten years.',
        explanation: '"For ten years" chỉ thời gian kéo dài từ quá khứ → cần Present Perfect.',
      },
      {
        wrong: 'I have live in Hanoi. (thiếu phân từ)',
        correct: 'I have lived in Hanoi.',
        explanation: 'Present Perfect cần "have/has + V3 (past participle)", không phải nguyên thể.',
      },
      {
        wrong: 'She has works here since March.',
        correct: 'She has worked here since March.',
        explanation: 'Sau "has" phải là V3 (past participle), không phải V-s.',
      },
    ],
    quiz: [
      {
        sentence: 'I ___ English every day.',
        options: ['study', 'have studied'],
        correct: 0,
        explanation: '"Every day" chỉ thói quen → Present Simple.',
      },
      {
        sentence: 'She ___ at this company since 2018.',
        options: ['works', 'has worked'],
        correct: 1,
        explanation: '"Since 2018" chỉ thời gian kéo dài từ quá khứ đến hiện tại → Present Perfect.',
      },
      {
        sentence: 'I ___ three cups of coffee today.',
        options: ['drink', 'have drunk'],
        correct: 1,
        explanation: '"Today" (ngày chưa kết thúc), đếm số lượng cho đến hiện tại → Present Perfect.',
      },
      {
        sentence: 'Water ___ at 100°C.',
        options: ['boils', 'has boiled'],
        correct: 0,
        explanation: 'Sự thật khoa học → Present Simple.',
      },
      {
        sentence: 'My English ___ a lot recently.',
        options: ['improves', 'has improved'],
        correct: 1,
        explanation: '"Recently" + sự thay đổi → Present Perfect.',
      },
    ],
  },
];
