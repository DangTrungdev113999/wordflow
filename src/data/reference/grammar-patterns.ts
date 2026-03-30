export interface GrammarPattern {
  id: string;
  pattern: string;
  meaning: string;
  structure: string;
  examples: { en: string; vi: string }[];
  commonMistake: {
    wrong: string;
    correct: string;
  };
  relatedPatterns?: string[];
  level: 'A2' | 'B1' | 'B2';
}

export const GRAMMAR_PATTERNS: GrammarPattern[] = [
  // ── A2 LEVEL (~10) ───────────────────────────────────────────────────
  {
    id: 'pattern-a2-01',
    pattern: 'want + to V',
    meaning: 'Muốn làm gì',
    structure: 'Subject + want(s) + to + V (bare infinitive)',
    examples: [
      { en: 'I want to learn English.', vi: 'Tôi muốn học tiếng Anh.' },
      { en: 'She wants to travel to Japan.', vi: 'Cô ấy muốn đi du lịch Nhật Bản.' },
    ],
    commonMistake: {
      wrong: 'I want learn English.',
      correct: 'I want to learn English.',
    },
    relatedPatterns: ['pattern-a2-02', 'pattern-a2-05'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-02',
    pattern: 'need + to V',
    meaning: 'Cần làm gì',
    structure: 'Subject + need(s) + to + V (bare infinitive)',
    examples: [
      { en: 'You need to study harder.', vi: 'Bạn cần học chăm hơn.' },
      { en: 'He needs to see a doctor.', vi: 'Anh ấy cần đi khám bác sĩ.' },
    ],
    commonMistake: {
      wrong: 'You need study harder.',
      correct: 'You need to study harder.',
    },
    relatedPatterns: ['pattern-a2-01'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-03',
    pattern: 'like + V-ing',
    meaning: 'Thích làm gì (sở thích chung)',
    structure: 'Subject + like(s) + V-ing',
    examples: [
      { en: 'I like reading books.', vi: 'Tôi thích đọc sách.' },
      { en: 'She likes cooking Vietnamese food.', vi: 'Cô ấy thích nấu món Việt Nam.' },
    ],
    commonMistake: {
      wrong: 'I like read books.',
      correct: 'I like reading books.',
    },
    relatedPatterns: ['pattern-a2-04', 'pattern-b1-01'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-04',
    pattern: 'love + V-ing',
    meaning: 'Rất thích làm gì',
    structure: 'Subject + love(s) + V-ing',
    examples: [
      { en: 'They love playing football.', vi: 'Họ rất thích chơi bóng đá.' },
      { en: 'I love listening to music.', vi: 'Tôi rất thích nghe nhạc.' },
    ],
    commonMistake: {
      wrong: 'I love listen to music.',
      correct: 'I love listening to music.',
    },
    relatedPatterns: ['pattern-a2-03', 'pattern-a2-06'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-05',
    pattern: 'would like + to V',
    meaning: 'Muốn làm gì (lịch sự hơn "want")',
    structure: 'Subject + would like + to + V (bare infinitive)',
    examples: [
      { en: 'I would like to order a coffee.', vi: 'Tôi muốn gọi một ly cà phê.' },
      { en: 'Would you like to join us?', vi: 'Bạn có muốn tham gia cùng chúng tôi không?' },
    ],
    commonMistake: {
      wrong: 'I would like ordering a coffee.',
      correct: 'I would like to order a coffee.',
    },
    relatedPatterns: ['pattern-a2-01'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-06',
    pattern: 'hate + V-ing',
    meaning: 'Ghét làm gì',
    structure: 'Subject + hate(s) + V-ing',
    examples: [
      { en: 'I hate waking up early.', vi: 'Tôi ghét dậy sớm.' },
      { en: 'She hates waiting in line.', vi: 'Cô ấy ghét xếp hàng chờ.' },
    ],
    commonMistake: {
      wrong: 'I hate wake up early.',
      correct: 'I hate waking up early.',
    },
    relatedPatterns: ['pattern-a2-03', 'pattern-a2-04'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-07',
    pattern: 'be good at + V-ing',
    meaning: 'Giỏi về việc gì',
    structure: 'Subject + be + good at + V-ing / noun',
    examples: [
      { en: 'She is good at singing.', vi: 'Cô ấy hát giỏi.' },
      { en: 'He is good at mathematics.', vi: 'Anh ấy giỏi toán.' },
    ],
    commonMistake: {
      wrong: 'She is good at sing.',
      correct: 'She is good at singing.',
    },
    relatedPatterns: ['pattern-a2-08'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-08',
    pattern: 'be interested in + V-ing',
    meaning: 'Quan tâm, hứng thú với việc gì',
    structure: 'Subject + be + interested in + V-ing / noun',
    examples: [
      { en: 'I am interested in learning Japanese.', vi: 'Tôi hứng thú với việc học tiếng Nhật.' },
      { en: 'Are you interested in art?', vi: 'Bạn có quan tâm đến nghệ thuật không?' },
    ],
    commonMistake: {
      wrong: 'I am interested in learn Japanese.',
      correct: 'I am interested in learning Japanese.',
    },
    relatedPatterns: ['pattern-a2-07'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-09',
    pattern: 'try + to V',
    meaning: 'Cố gắng làm gì',
    structure: 'Subject + try/tries + to + V (bare infinitive)',
    examples: [
      { en: 'I will try to finish it today.', vi: 'Tôi sẽ cố gắng hoàn thành nó hôm nay.' },
      { en: 'She tried to open the door.', vi: 'Cô ấy cố gắng mở cửa.' },
    ],
    commonMistake: {
      wrong: 'I try finish it today.',
      correct: 'I try to finish it today.',
    },
    relatedPatterns: ['pattern-a2-01', 'pattern-a2-02'],
    level: 'A2',
  },
  {
    id: 'pattern-a2-10',
    pattern: 'begin / start + V-ing',
    meaning: 'Bắt đầu làm gì',
    structure: 'Subject + begin(s) / start(s) + V-ing (hoặc to V)',
    examples: [
      { en: 'It started raining heavily.', vi: 'Trời bắt đầu mưa to.' },
      { en: 'She began learning English at age 5.', vi: 'Cô ấy bắt đầu học tiếng Anh từ 5 tuổi.' },
    ],
    commonMistake: {
      wrong: 'It started rain heavily.',
      correct: 'It started raining heavily.',
    },
    relatedPatterns: ['pattern-a2-03'],
    level: 'A2',
  },

  // ── B1 LEVEL (~15) ──────────────────────────────────────────────────
  {
    id: 'pattern-b1-01',
    pattern: 'enjoy + V-ing',
    meaning: 'Thưởng thức, tận hưởng việc gì',
    structure: 'Subject + enjoy(s) + V-ing',
    examples: [
      { en: 'I enjoy reading novels.', vi: 'Tôi thích đọc tiểu thuyết.' },
      { en: 'They enjoyed watching the sunset.', vi: 'Họ thích ngắm hoàng hôn.' },
    ],
    commonMistake: {
      wrong: 'I enjoy to read novels.',
      correct: 'I enjoy reading novels.',
    },
    relatedPatterns: ['pattern-a2-03', 'pattern-b1-02'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-02',
    pattern: 'avoid + V-ing',
    meaning: 'Tránh làm gì',
    structure: 'Subject + avoid(s) + V-ing',
    examples: [
      { en: 'You should avoid eating too much sugar.', vi: 'Bạn nên tránh ăn quá nhiều đường.' },
      { en: 'He avoids talking about politics.', vi: 'Anh ấy tránh nói về chính trị.' },
    ],
    commonMistake: {
      wrong: 'You should avoid to eat too much sugar.',
      correct: 'You should avoid eating too much sugar.',
    },
    relatedPatterns: ['pattern-b1-01', 'pattern-b1-03'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-03',
    pattern: 'suggest + V-ing',
    meaning: 'Đề nghị, gợi ý làm gì',
    structure: 'Subject + suggest(s) + V-ing / that + S + (should) + V',
    examples: [
      { en: 'I suggest going to the park.', vi: 'Tôi đề nghị đi công viên.' },
      { en: 'She suggested that we should leave early.', vi: 'Cô ấy gợi ý rằng chúng ta nên đi sớm.' },
    ],
    commonMistake: {
      wrong: 'I suggest to go to the park.',
      correct: 'I suggest going to the park.',
    },
    relatedPatterns: ['pattern-b1-04'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-04',
    pattern: 'recommend + V-ing',
    meaning: 'Khuyên nên, giới thiệu làm gì',
    structure: 'Subject + recommend(s) + V-ing / that + S + (should) + V',
    examples: [
      { en: 'I recommend visiting Hoi An.', vi: 'Tôi khuyên bạn nên đến Hội An.' },
      { en: 'The doctor recommended taking more rest.', vi: 'Bác sĩ khuyên nên nghỉ ngơi nhiều hơn.' },
    ],
    commonMistake: {
      wrong: 'I recommend to visit Hoi An.',
      correct: 'I recommend visiting Hoi An.',
    },
    relatedPatterns: ['pattern-b1-03'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-05',
    pattern: 'used to + V',
    meaning: 'Đã từng, trước đây hay làm gì (thói quen quá khứ, nay không còn)',
    structure: 'Subject + used to + V (bare infinitive)',
    examples: [
      { en: 'I used to play football when I was young.', vi: 'Tôi đã từng chơi bóng đá khi còn nhỏ.' },
      { en: 'She used to live in Hanoi.', vi: 'Cô ấy đã từng sống ở Hà Nội.' },
    ],
    commonMistake: {
      wrong: 'I used to playing football.',
      correct: 'I used to play football.',
    },
    relatedPatterns: ['pattern-b1-06'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-06',
    pattern: 'be used to + V-ing',
    meaning: 'Quen với việc gì (hiện tại)',
    structure: 'Subject + be + used to + V-ing / noun',
    examples: [
      { en: 'I am used to waking up early.', vi: 'Tôi đã quen với việc dậy sớm.' },
      { en: 'She is used to the hot weather.', vi: 'Cô ấy đã quen với thời tiết nóng.' },
    ],
    commonMistake: {
      wrong: 'I am used to wake up early.',
      correct: 'I am used to waking up early.',
    },
    relatedPatterns: ['pattern-b1-05', 'pattern-b1-07'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-07',
    pattern: 'get used to + V-ing',
    meaning: 'Dần quen với việc gì (quá trình)',
    structure: 'Subject + get(s) + used to + V-ing / noun',
    examples: [
      { en: 'You will get used to living here.', vi: 'Bạn sẽ dần quen với việc sống ở đây.' },
      { en: 'I\'m getting used to the new job.', vi: 'Tôi đang dần quen với công việc mới.' },
    ],
    commonMistake: {
      wrong: 'You will get used to live here.',
      correct: 'You will get used to living here.',
    },
    relatedPatterns: ['pattern-b1-06'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-08',
    pattern: 'look forward to + V-ing',
    meaning: 'Mong chờ, trông đợi làm gì',
    structure: 'Subject + look(s) forward to + V-ing / noun',
    examples: [
      { en: 'I look forward to hearing from you.', vi: 'Tôi mong chờ được nghe tin từ bạn.' },
      { en: 'We are looking forward to the holiday.', vi: 'Chúng tôi đang mong chờ kỳ nghỉ.' },
    ],
    commonMistake: {
      wrong: 'I look forward to hear from you.',
      correct: 'I look forward to hearing from you.',
    },
    relatedPatterns: ['pattern-b1-06'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-09',
    pattern: 'spend + time + V-ing',
    meaning: 'Dành thời gian làm gì',
    structure: 'Subject + spend(s) + time/money + V-ing',
    examples: [
      { en: 'I spend two hours studying every day.', vi: 'Tôi dành hai tiếng học mỗi ngày.' },
      { en: 'She spends a lot of money shopping.', vi: 'Cô ấy tiêu rất nhiều tiền mua sắm.' },
    ],
    commonMistake: {
      wrong: 'I spend two hours to study every day.',
      correct: 'I spend two hours studying every day.',
    },
    level: 'B1',
  },
  {
    id: 'pattern-b1-10',
    pattern: 'mind + V-ing',
    meaning: 'Phiền, ngại làm gì',
    structure: 'Subject + mind(s) + V-ing',
    examples: [
      { en: 'Do you mind opening the window?', vi: 'Bạn có phiền mở cửa sổ không?' },
      { en: 'I don\'t mind waiting.', vi: 'Tôi không ngại chờ.' },
    ],
    commonMistake: {
      wrong: 'Do you mind to open the window?',
      correct: 'Do you mind opening the window?',
    },
    relatedPatterns: ['pattern-b1-01'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-11',
    pattern: 'keep + V-ing',
    meaning: 'Tiếp tục làm gì, cứ làm gì mãi',
    structure: 'Subject + keep(s) + V-ing',
    examples: [
      { en: 'Keep trying and you will succeed.', vi: 'Cứ cố gắng và bạn sẽ thành công.' },
      { en: 'She keeps asking me the same question.', vi: 'Cô ấy cứ hỏi tôi cùng một câu hỏi.' },
    ],
    commonMistake: {
      wrong: 'Keep to try and you will succeed.',
      correct: 'Keep trying and you will succeed.',
    },
    level: 'B1',
  },
  {
    id: 'pattern-b1-12',
    pattern: 'stop + V-ing',
    meaning: 'Dừng, ngừng làm gì',
    structure: 'Subject + stop(s) + V-ing (ngừng) / to V (dừng lại để làm gì khác)',
    examples: [
      { en: 'He stopped smoking last year.', vi: 'Anh ấy đã bỏ hút thuốc năm ngoái.' },
      { en: 'She stopped to buy some water.', vi: 'Cô ấy dừng lại để mua nước.' },
    ],
    commonMistake: {
      wrong: 'He stopped to smoke. (khi muốn nói "bỏ hút thuốc")',
      correct: 'He stopped smoking. (= bỏ hút thuốc)',
    },
    relatedPatterns: ['pattern-b1-13'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-13',
    pattern: 'remember + V-ing / to V',
    meaning: 'Nhớ đã làm gì (V-ing) / Nhớ phải làm gì (to V)',
    structure: 'Subject + remember(s) + V-ing (quá khứ) / to V (tương lai)',
    examples: [
      { en: 'I remember meeting her at the party.', vi: 'Tôi nhớ đã gặp cô ấy ở bữa tiệc.' },
      { en: 'Remember to lock the door.', vi: 'Nhớ khóa cửa nhé.' },
    ],
    commonMistake: {
      wrong: 'I remember to meet her at the party. (khi muốn nói "nhớ đã gặp")',
      correct: 'I remember meeting her at the party.',
    },
    relatedPatterns: ['pattern-b1-12'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-14',
    pattern: 'be afraid of + V-ing',
    meaning: 'Sợ làm gì, sợ điều gì',
    structure: 'Subject + be + afraid of + V-ing / noun',
    examples: [
      { en: 'She is afraid of flying.', vi: 'Cô ấy sợ đi máy bay.' },
      { en: 'Are you afraid of dogs?', vi: 'Bạn có sợ chó không?' },
    ],
    commonMistake: {
      wrong: 'She is afraid of fly.',
      correct: 'She is afraid of flying.',
    },
    relatedPatterns: ['pattern-a2-08'],
    level: 'B1',
  },
  {
    id: 'pattern-b1-15',
    pattern: 'it\'s worth + V-ing',
    meaning: 'Đáng để làm gì',
    structure: 'It\'s (not) worth + V-ing',
    examples: [
      { en: 'It\'s worth visiting Da Nang.', vi: 'Đà Nẵng rất đáng đến thăm.' },
      { en: 'It\'s not worth arguing about it.', vi: 'Không đáng để tranh cãi về việc đó.' },
    ],
    commonMistake: {
      wrong: 'It\'s worth to visit Da Nang.',
      correct: 'It\'s worth visiting Da Nang.',
    },
    level: 'B1',
  },

  // ── B2 LEVEL (~15) ──────────────────────────────────────────────────
  {
    id: 'pattern-b2-01',
    pattern: 'make + O + V (bare)',
    meaning: 'Bắt/khiến ai làm gì',
    structure: 'Subject + make(s) + object + V (bare infinitive, không có "to")',
    examples: [
      { en: 'The teacher made the students rewrite the essay.', vi: 'Giáo viên bắt học sinh viết lại bài luận.' },
      { en: 'That movie made me cry.', vi: 'Bộ phim đó khiến tôi khóc.' },
    ],
    commonMistake: {
      wrong: 'The teacher made the students to rewrite the essay.',
      correct: 'The teacher made the students rewrite the essay.',
    },
    relatedPatterns: ['pattern-b2-02'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-02',
    pattern: 'let + O + V (bare)',
    meaning: 'Cho phép ai làm gì',
    structure: 'Subject + let(s) + object + V (bare infinitive, không có "to")',
    examples: [
      { en: 'My parents let me stay up late.', vi: 'Bố mẹ cho phép tôi thức khuya.' },
      { en: 'Don\'t let the children play near the road.', vi: 'Đừng để trẻ con chơi gần đường.' },
    ],
    commonMistake: {
      wrong: 'My parents let me to stay up late.',
      correct: 'My parents let me stay up late.',
    },
    relatedPatterns: ['pattern-b2-01', 'pattern-b2-03'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-03',
    pattern: 'have + O + V (bare)',
    meaning: 'Nhờ/yêu cầu ai làm gì',
    structure: 'Subject + have/has + object (person) + V (bare infinitive)',
    examples: [
      { en: 'I\'ll have my assistant call you.', vi: 'Tôi sẽ nhờ trợ lý gọi cho bạn.' },
      { en: 'She had the mechanic check the car.', vi: 'Cô ấy nhờ thợ kiểm tra xe.' },
    ],
    commonMistake: {
      wrong: 'I\'ll have my assistant to call you.',
      correct: 'I\'ll have my assistant call you.',
    },
    relatedPatterns: ['pattern-b2-01', 'pattern-b2-02'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-04',
    pattern: 'would rather + V (bare)',
    meaning: 'Thà, thích hơn (làm gì)',
    structure: 'Subject + would rather + V (bare infinitive) + than + V (bare infinitive)',
    examples: [
      { en: 'I would rather stay home than go out.', vi: 'Tôi thà ở nhà còn hơn đi ra ngoài.' },
      { en: 'She\'d rather drink tea than coffee.', vi: 'Cô ấy thích uống trà hơn cà phê.' },
    ],
    commonMistake: {
      wrong: 'I would rather to stay home.',
      correct: 'I would rather stay home.',
    },
    relatedPatterns: ['pattern-b2-05'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-05',
    pattern: 'had better + V (bare)',
    meaning: 'Nên, tốt hơn hết là (lời khuyên mạnh)',
    structure: 'Subject + had better (\'d better) + V (bare infinitive)',
    examples: [
      { en: 'You had better study for the exam.', vi: 'Bạn nên học cho kỳ thi đi.' },
      { en: 'We\'d better leave now or we\'ll be late.', vi: 'Chúng ta nên đi ngay kẻo trễ.' },
    ],
    commonMistake: {
      wrong: 'You had better to study for the exam.',
      correct: 'You had better study for the exam.',
    },
    relatedPatterns: ['pattern-b2-04'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-06',
    pattern: 'too + adj/adv + to V',
    meaning: 'Quá ... đến nỗi không thể ...',
    structure: 'Subject + be + too + adjective + (for someone) + to + V',
    examples: [
      { en: 'This coffee is too hot to drink.', vi: 'Cà phê này quá nóng để uống.' },
      { en: 'He is too young to drive.', vi: 'Anh ấy quá trẻ để lái xe.' },
    ],
    commonMistake: {
      wrong: 'This coffee is too hot to drinking.',
      correct: 'This coffee is too hot to drink.',
    },
    relatedPatterns: ['pattern-b2-07', 'pattern-b2-08'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-07',
    pattern: 'adj/adv + enough + to V',
    meaning: 'Đủ ... để ...',
    structure: 'Subject + be + adjective + enough + (for someone) + to + V',
    examples: [
      { en: 'She is old enough to make her own decisions.', vi: 'Cô ấy đủ lớn để tự quyết định.' },
      { en: 'He runs fast enough to win the race.', vi: 'Anh ấy chạy đủ nhanh để thắng cuộc đua.' },
    ],
    commonMistake: {
      wrong: 'She is enough old to make her own decisions.',
      correct: 'She is old enough to make her own decisions.',
    },
    relatedPatterns: ['pattern-b2-06'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-08',
    pattern: 'so + adj/adv + that',
    meaning: 'Quá ... đến nỗi ...',
    structure: 'Subject + be + so + adjective + that + clause',
    examples: [
      { en: 'She was so tired that she fell asleep immediately.', vi: 'Cô ấy mệt đến nỗi ngủ thiếp đi ngay.' },
      { en: 'He spoke so quickly that I couldn\'t understand.', vi: 'Anh ấy nói nhanh đến nỗi tôi không hiểu được.' },
    ],
    commonMistake: {
      wrong: 'She was so tired that she was fell asleep.',
      correct: 'She was so tired that she fell asleep immediately.',
    },
    relatedPatterns: ['pattern-b2-09', 'pattern-b2-06'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-09',
    pattern: 'such + (a/an) + adj + N + that',
    meaning: 'Quá ... đến nỗi ... (nhấn mạnh danh từ)',
    structure: 'Subject + be + such + (a/an) + adjective + noun + that + clause',
    examples: [
      { en: 'It was such a beautiful day that we went to the beach.', vi: 'Ngày hôm đó đẹp đến nỗi chúng tôi đi biển.' },
      { en: 'She is such a good teacher that everyone loves her.', vi: 'Cô ấy là giáo viên tốt đến nỗi ai cũng yêu quý.' },
    ],
    commonMistake: {
      wrong: 'It was so a beautiful day that we went to the beach.',
      correct: 'It was such a beautiful day that we went to the beach.',
    },
    relatedPatterns: ['pattern-b2-08'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-10',
    pattern: 'unless = if ... not',
    meaning: 'Trừ khi, nếu không',
    structure: 'Unless + clause (khẳng định), main clause',
    examples: [
      { en: 'Unless you study hard, you will fail.', vi: 'Trừ khi bạn học chăm, bạn sẽ trượt.' },
      { en: 'I won\'t go unless you come with me.', vi: 'Tôi sẽ không đi trừ khi bạn đi cùng.' },
    ],
    commonMistake: {
      wrong: 'Unless you don\'t study hard, you will fail.',
      correct: 'Unless you study hard, you will fail.',
    },
    relatedPatterns: ['pattern-b2-11'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-11',
    pattern: 'wish + Past Simple',
    meaning: 'Ước (điều trái với hiện tại)',
    structure: 'Subject + wish(es) + (that) + Subject + V (past simple)',
    examples: [
      { en: 'I wish I had more free time.', vi: 'Tôi ước tôi có nhiều thời gian rảnh hơn.' },
      { en: 'She wishes she could speak French.', vi: 'Cô ấy ước cô ấy có thể nói tiếng Pháp.' },
    ],
    commonMistake: {
      wrong: 'I wish I have more free time.',
      correct: 'I wish I had more free time.',
    },
    relatedPatterns: ['pattern-b2-12'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-12',
    pattern: 'wish + Past Perfect',
    meaning: 'Ước (điều trái với quá khứ, hối tiếc)',
    structure: 'Subject + wish(es) + (that) + Subject + had + V3 (past participle)',
    examples: [
      { en: 'I wish I had studied harder at school.', vi: 'Tôi ước tôi đã học chăm hơn ở trường.' },
      { en: 'She wishes she hadn\'t said that.', vi: 'Cô ấy ước cô ấy đã không nói điều đó.' },
    ],
    commonMistake: {
      wrong: 'I wish I studied harder at school. (khi nói về quá khứ)',
      correct: 'I wish I had studied harder at school.',
    },
    relatedPatterns: ['pattern-b2-11'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-13',
    pattern: 'not only ... but also',
    meaning: 'Không chỉ ... mà còn ...',
    structure: 'Not only + clause/phrase + but also + clause/phrase',
    examples: [
      { en: 'She is not only beautiful but also intelligent.', vi: 'Cô ấy không chỉ xinh đẹp mà còn thông minh.' },
      { en: 'He not only plays guitar but also sings well.', vi: 'Anh ấy không chỉ chơi guitar mà còn hát hay.' },
    ],
    commonMistake: {
      wrong: 'She is not only beautiful but intelligent.',
      correct: 'She is not only beautiful but also intelligent.',
    },
    relatedPatterns: ['pattern-b2-14'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-14',
    pattern: 'neither ... nor',
    meaning: 'Không ... cũng không ...',
    structure: 'Neither + noun/clause + nor + noun/clause',
    examples: [
      { en: 'Neither the teacher nor the students were ready.', vi: 'Cả giáo viên và học sinh đều chưa sẵn sàng.' },
      { en: 'I have neither time nor money.', vi: 'Tôi không có thời gian cũng không có tiền.' },
    ],
    commonMistake: {
      wrong: 'I don\'t have neither time nor money.',
      correct: 'I have neither time nor money.',
    },
    relatedPatterns: ['pattern-b2-13'],
    level: 'B2',
  },
  {
    id: 'pattern-b2-15',
    pattern: 'the + comparative, the + comparative',
    meaning: 'Càng ... càng ...',
    structure: 'The + comparative + (S + V), the + comparative + (S + V)',
    examples: [
      { en: 'The harder you work, the more successful you will be.', vi: 'Bạn càng làm việc chăm, bạn càng thành công.' },
      { en: 'The sooner, the better.', vi: 'Càng sớm càng tốt.' },
    ],
    commonMistake: {
      wrong: 'More you study, more you learn.',
      correct: 'The more you study, the more you learn.',
    },
    level: 'B2',
  },
];
