export interface CollocationGroup {
  id: string;
  title: string;
  description: string;
  entries: {
    word: string;
    collocations: {
      phrase: string;
      meaning: string;
      example: string;
    }[];
  }[];
  tip: string;
  quiz: { sentence: string; options: string[]; correct: number }[];
}

export const COLLOCATION_GROUPS: CollocationGroup[] = [
  // ─── 1. make vs do ─────────────────────────────────────────────────
  {
    id: 'make-vs-do',
    title: 'Make vs Do',
    description:
      'Make thường dùng khi tạo ra, sản xuất cái gì đó mới. Do thường dùng cho công việc, nhiệm vụ, hoạt động chung.',
    entries: [
      {
        word: 'make',
        collocations: [
          { phrase: 'make a decision', meaning: 'đưa ra quyết định', example: 'You need to make a decision quickly.' },
          { phrase: 'make a mistake', meaning: 'mắc lỗi', example: 'Everyone makes mistakes sometimes.' },
          { phrase: 'make money', meaning: 'kiếm tiền', example: 'She makes money by selling handmade crafts.' },
          { phrase: 'make a plan', meaning: 'lập kế hoạch', example: 'Let\'s make a plan for the weekend.' },
          { phrase: 'make progress', meaning: 'tiến bộ', example: 'The students are making great progress.' },
          { phrase: 'make an effort', meaning: 'nỗ lực', example: 'He made an effort to arrive on time.' },
          { phrase: 'make a promise', meaning: 'hứa', example: 'I made a promise to help her.' },
          { phrase: 'make a complaint', meaning: 'khiếu nại', example: 'She made a complaint about the service.' },
          { phrase: 'make a suggestion', meaning: 'đưa ra gợi ý', example: 'Can I make a suggestion?' },
          { phrase: 'make a phone call', meaning: 'gọi điện thoại', example: 'I need to make a phone call.' },
          { phrase: 'make friends', meaning: 'kết bạn', example: 'It\'s easy to make friends at school.' },
          { phrase: 'make noise', meaning: 'gây ồn ào', example: 'Please don\'t make noise in the library.' },
          { phrase: 'make an appointment', meaning: 'đặt lịch hẹn', example: 'I made an appointment with the dentist.' },
          { phrase: 'make a difference', meaning: 'tạo ra sự khác biệt', example: 'Small actions can make a big difference.' },
          { phrase: 'make an excuse', meaning: 'viện cớ', example: 'Stop making excuses and start working.' },
        ],
      },
      {
        word: 'do',
        collocations: [
          { phrase: 'do homework', meaning: 'làm bài tập', example: 'Have you done your homework yet?' },
          { phrase: 'do the dishes', meaning: 'rửa bát', example: 'It\'s your turn to do the dishes.' },
          { phrase: 'do the laundry', meaning: 'giặt quần áo', example: 'I need to do the laundry this evening.' },
          { phrase: 'do exercise', meaning: 'tập thể dục', example: 'She does exercise every morning.' },
          { phrase: 'do business', meaning: 'làm ăn, kinh doanh', example: 'They do business with companies in Asia.' },
          { phrase: 'do a favor', meaning: 'giúp đỡ, làm ơn', example: 'Can you do me a favor?' },
          { phrase: 'do damage', meaning: 'gây thiệt hại', example: 'The storm did a lot of damage.' },
          { phrase: 'do research', meaning: 'nghiên cứu', example: 'We need to do more research on this topic.' },
          { phrase: 'do your best', meaning: 'cố gắng hết sức', example: 'Just do your best and don\'t worry.' },
          { phrase: 'do well', meaning: 'làm tốt', example: 'She did well on the exam.' },
          { phrase: 'do harm', meaning: 'gây hại', example: 'Smoking does harm to your health.' },
          { phrase: 'do the shopping', meaning: 'đi mua sắm', example: 'I usually do the shopping on Saturdays.' },
          { phrase: 'do the housework', meaning: 'làm việc nhà', example: 'We share doing the housework.' },
          { phrase: 'do someone a good turn', meaning: 'giúp đỡ ai', example: 'He did me a good turn by lending me his car.' },
          { phrase: 'do nothing', meaning: 'không làm gì', example: 'He sat there and did nothing all day.' },
        ],
      },
    ],
    tip: 'Mẹo: MAKE thường liên quan đến việc tạo ra, sản xuất (make a cake, make a plan). DO thường đi với công việc, nhiệm vụ (do homework, do the dishes). Ngoại lệ cần nhớ: make the bed (dọn giường), do your hair (làm tóc).',
    quiz: [
      { sentence: 'She ___ a terrible mistake at work.', options: ['made', 'did'], correct: 0 },
      { sentence: 'Have you ___ your homework?', options: ['made', 'done'], correct: 1 },
      { sentence: 'He ___ a lot of money last year.', options: ['made', 'did'], correct: 0 },
      { sentence: 'Can you ___ me a favor?', options: ['make', 'do'], correct: 1 },
      { sentence: 'They ___ an appointment with the doctor.', options: ['made', 'did'], correct: 0 },
    ],
  },

  // ─── 2. say vs tell ────────────────────────────────────────────────
  {
    id: 'say-vs-tell',
    title: 'Say vs Tell',
    description:
      'Say dùng khi nhấn mạnh lời nói, không cần người nghe. Tell cần có người nghe (tell someone something).',
    entries: [
      {
        word: 'say',
        collocations: [
          { phrase: 'say hello', meaning: 'chào hỏi', example: 'Don\'t forget to say hello to your teacher.' },
          { phrase: 'say goodbye', meaning: 'tạm biệt', example: 'She said goodbye and left.' },
          { phrase: 'say sorry', meaning: 'xin lỗi', example: 'He should say sorry for what he did.' },
          { phrase: 'say a word', meaning: 'nói một lời', example: 'He didn\'t say a word during the meeting.' },
          { phrase: 'say a prayer', meaning: 'cầu nguyện', example: 'They said a prayer before dinner.' },
          { phrase: 'say thank you', meaning: 'cảm ơn', example: 'Always say thank you when someone helps you.' },
          { phrase: 'say yes / no', meaning: 'nói có / không', example: 'She said yes to the proposal.' },
          { phrase: 'say nothing', meaning: 'không nói gì', example: 'He said nothing about the incident.' },
          { phrase: 'say something', meaning: 'nói điều gì đó', example: 'I want to say something important.' },
          { phrase: 'say so', meaning: 'nói vậy', example: 'If you don\'t agree, just say so.' },
        ],
      },
      {
        word: 'tell',
        collocations: [
          { phrase: 'tell the truth', meaning: 'nói sự thật', example: 'Please tell me the truth.' },
          { phrase: 'tell a lie', meaning: 'nói dối', example: 'Don\'t tell lies to your parents.' },
          { phrase: 'tell a story', meaning: 'kể chuyện', example: 'Grandma told us a story before bed.' },
          { phrase: 'tell a joke', meaning: 'kể chuyện cười', example: 'He loves telling jokes at parties.' },
          { phrase: 'tell the difference', meaning: 'phân biệt', example: 'Can you tell the difference between them?' },
          { phrase: 'tell the time', meaning: 'xem giờ', example: 'Can your daughter tell the time yet?' },
          { phrase: 'tell a secret', meaning: 'tiết lộ bí mật', example: 'She told me a secret about her past.' },
          { phrase: 'tell someone off', meaning: 'mắng ai', example: 'The teacher told him off for being late.' },
          { phrase: 'tell apart', meaning: 'phân biệt', example: 'The twins are hard to tell apart.' },
          { phrase: 'tell someone the way', meaning: 'chỉ đường cho ai', example: 'Could you tell me the way to the station?' },
        ],
      },
    ],
    tip: 'Mẹo: SAY + lời nói (say hello, say sorry). TELL + người nghe + nội dung (tell me the truth). Ngoại lệ: tell a lie, tell the time, tell the difference — không cần người nghe trực tiếp.',
    quiz: [
      { sentence: 'She ___ me that she was leaving.', options: ['said', 'told'], correct: 1 },
      { sentence: 'He ___ goodbye to everyone.', options: ['said', 'told'], correct: 0 },
      { sentence: 'Can you ___ the difference between these two?', options: ['say', 'tell'], correct: 1 },
      { sentence: 'Don\'t ___ a word about this to anyone.', options: ['say', 'tell'], correct: 0 },
      { sentence: 'She ___ me a funny joke yesterday.', options: ['said', 'told'], correct: 1 },
    ],
  },

  // ─── 3. look vs see vs watch ───────────────────────────────────────
  {
    id: 'look-vs-see-vs-watch',
    title: 'Look vs See vs Watch',
    description:
      'Look: chủ động nhìn vào một hướng. See: nhìn thấy (tự nhiên, không cố ý). Watch: theo dõi cái gì đang chuyển động hoặc thay đổi.',
    entries: [
      {
        word: 'look',
        collocations: [
          { phrase: 'look at', meaning: 'nhìn vào', example: 'Look at this beautiful painting!' },
          { phrase: 'look for', meaning: 'tìm kiếm', example: 'I\'m looking for my keys.' },
          { phrase: 'look after', meaning: 'chăm sóc', example: 'She looks after her elderly mother.' },
          { phrase: 'look forward to', meaning: 'mong chờ', example: 'I\'m looking forward to the holiday.' },
          { phrase: 'look up', meaning: 'tra cứu', example: 'Look up the word in the dictionary.' },
          { phrase: 'look out', meaning: 'cẩn thận', example: 'Look out! There\'s a car coming.' },
          { phrase: 'look into', meaning: 'điều tra', example: 'The police are looking into the matter.' },
          { phrase: 'look like', meaning: 'trông giống', example: 'She looks like her mother.' },
        ],
      },
      {
        word: 'see',
        collocations: [
          { phrase: 'see a doctor', meaning: 'đi khám bác sĩ', example: 'You should see a doctor about that cough.' },
          { phrase: 'see a movie', meaning: 'xem phim (ở rạp)', example: 'Let\'s see a movie this weekend.' },
          { phrase: 'see the point', meaning: 'hiểu ý', example: 'I don\'t see the point of arguing.' },
          { phrase: 'see eye to eye', meaning: 'đồng quan điểm', example: 'We don\'t always see eye to eye.' },
          { phrase: 'see someone off', meaning: 'tiễn ai', example: 'We went to the airport to see her off.' },
          { phrase: 'see through', meaning: 'nhìn thấu', example: 'I can see through his excuses.' },
          { phrase: 'see to', meaning: 'lo liệu, xử lý', example: 'I\'ll see to the arrangements.' },
          { phrase: 'see fit', meaning: 'thấy phù hợp', example: 'Do as you see fit.' },
        ],
      },
      {
        word: 'watch',
        collocations: [
          { phrase: 'watch TV', meaning: 'xem tivi', example: 'We watch TV every evening.' },
          { phrase: 'watch a game', meaning: 'xem trận đấu', example: 'Let\'s watch the football game tonight.' },
          { phrase: 'watch out', meaning: 'cẩn thận', example: 'Watch out for pickpockets in the market.' },
          { phrase: 'watch your step', meaning: 'cẩn thận bước chân', example: 'Watch your step, the floor is wet.' },
          { phrase: 'watch the clock', meaning: 'nhìn đồng hồ (chờ đợi)', example: 'Stop watching the clock and focus on work.' },
          { phrase: 'watch your language', meaning: 'giữ lời ăn tiếng nói', example: 'Watch your language in front of the children.' },
          { phrase: 'watch over', meaning: 'trông coi, bảo vệ', example: 'The dog watches over the house.' },
          { phrase: 'watch closely', meaning: 'theo dõi sát sao', example: 'Watch closely and learn the technique.' },
        ],
      },
    ],
    tip: 'Mẹo: LOOK = chủ động hướng mắt (look at the board). SEE = thấy tự nhiên, không cố ý (I saw a bird). WATCH = theo dõi thứ đang chuyển động (watch a match, watch TV).',
    quiz: [
      { sentence: 'I ___ a strange man outside the window.', options: ['looked', 'saw', 'watched'], correct: 1 },
      { sentence: 'She ___ at the photo and smiled.', options: ['looked', 'saw', 'watched'], correct: 0 },
      { sentence: 'We ___ the sunset from the balcony for an hour.', options: ['looked', 'saw', 'watched'], correct: 2 },
      { sentence: 'You should ___ a doctor about your headaches.', options: ['look', 'see', 'watch'], correct: 1 },
      { sentence: '___ out! The road is icy.', options: ['Look', 'See', 'Watch'], correct: 2 },
    ],
  },

  // ─── 4. speak vs talk ──────────────────────────────────────────────
  {
    id: 'speak-vs-talk',
    title: 'Speak vs Talk',
    description:
      'Speak mang tính trang trọng hơn, thường dùng với ngôn ngữ hoặc phát biểu chính thức. Talk thân mật hơn, nhấn mạnh cuộc trò chuyện hai chiều.',
    entries: [
      {
        word: 'speak',
        collocations: [
          { phrase: 'speak a language', meaning: 'nói một ngôn ngữ', example: 'She speaks three languages fluently.' },
          { phrase: 'speak in public', meaning: 'nói trước đám đông', example: 'He is afraid of speaking in public.' },
          { phrase: 'speak up', meaning: 'nói to hơn / lên tiếng', example: 'Could you speak up? I can\'t hear you.' },
          { phrase: 'speak out', meaning: 'nói thẳng, lên tiếng', example: 'She spoke out against injustice.' },
          { phrase: 'speak one\'s mind', meaning: 'nói thẳng suy nghĩ', example: 'Don\'t be afraid to speak your mind.' },
          { phrase: 'speak volumes', meaning: 'nói lên nhiều điều', example: 'Her silence speaks volumes.' },
          { phrase: 'speak highly of', meaning: 'nói tốt về', example: 'The boss speaks highly of her work.' },
          { phrase: 'speak for itself', meaning: 'tự nói lên tất cả', example: 'The quality of his work speaks for itself.' },
        ],
      },
      {
        word: 'talk',
        collocations: [
          { phrase: 'talk to / with someone', meaning: 'nói chuyện với ai', example: 'Can I talk to you for a minute?' },
          { phrase: 'talk about', meaning: 'nói về', example: 'Let\'s talk about the project.' },
          { phrase: 'talk nonsense', meaning: 'nói nhảm', example: 'Stop talking nonsense!' },
          { phrase: 'talk sense', meaning: 'nói có lý', example: 'For once, he\'s talking sense.' },
          { phrase: 'talk someone into', meaning: 'thuyết phục ai làm gì', example: 'She talked me into buying the dress.' },
          { phrase: 'talk someone out of', meaning: 'can ngăn ai làm gì', example: 'I talked him out of quitting his job.' },
          { phrase: 'talk behind someone\'s back', meaning: 'nói xấu sau lưng', example: 'It\'s rude to talk behind someone\'s back.' },
          { phrase: 'talk shop', meaning: 'nói chuyện công việc', example: 'Let\'s not talk shop at dinner.' },
        ],
      },
    ],
    tip: 'Mẹo: SPEAK thường trang trọng hơn, dùng với ngôn ngữ (speak English) và phát biểu (speak in public). TALK thân mật, nhấn mạnh hội thoại (talk to a friend, talk about problems).',
    quiz: [
      { sentence: 'Can you ___ French?', options: ['speak', 'talk'], correct: 0 },
      { sentence: 'I need to ___ to you about something important.', options: ['speak', 'talk'], correct: 1 },
      { sentence: 'She ___ him into going to the party.', options: ['spoke', 'talked'], correct: 1 },
      { sentence: 'He ___ at the conference yesterday.', options: ['spoke', 'talked'], correct: 0 },
      { sentence: 'Let\'s ___ about your plans for the future.', options: ['speak', 'talk'], correct: 1 },
    ],
  },

  // ─── 5. hear vs listen ─────────────────────────────────────────────
  {
    id: 'hear-vs-listen',
    title: 'Hear vs Listen',
    description:
      'Hear: nghe thấy tự nhiên, không cần cố gắng. Listen: chủ động lắng nghe, tập trung chú ý.',
    entries: [
      {
        word: 'hear',
        collocations: [
          { phrase: 'hear a noise', meaning: 'nghe thấy tiếng động', example: 'Did you hear that noise?' },
          { phrase: 'hear the news', meaning: 'nghe tin', example: 'I was shocked to hear the news.' },
          { phrase: 'hear from someone', meaning: 'nhận được tin từ ai', example: 'Have you heard from your brother lately?' },
          { phrase: 'hear about', meaning: 'nghe về', example: 'I heard about the accident on the radio.' },
          { phrase: 'hear of', meaning: 'biết đến, nghe nói về', example: 'I\'ve never heard of that band.' },
          { phrase: 'hear a case', meaning: 'xét xử vụ án', example: 'The judge will hear the case next week.' },
        ],
      },
      {
        word: 'listen',
        collocations: [
          { phrase: 'listen to music', meaning: 'nghe nhạc', example: 'She listens to music while studying.' },
          { phrase: 'listen to someone', meaning: 'lắng nghe ai', example: 'You should listen to your parents.' },
          { phrase: 'listen carefully', meaning: 'lắng nghe cẩn thận', example: 'Listen carefully to the instructions.' },
          { phrase: 'listen to a podcast', meaning: 'nghe podcast', example: 'I listen to podcasts on my commute.' },
          { phrase: 'listen in', meaning: 'nghe lén', example: 'Someone was listening in on our conversation.' },
          { phrase: 'listen out for', meaning: 'lắng nghe chờ đợi', example: 'Listen out for the doorbell.' },
        ],
      },
    ],
    tip: 'Mẹo: HEAR = tai nghe tự nhiên (I heard a bird singing). LISTEN = chủ động tập trung nghe (listen to the teacher). Hear KHÔNG dùng với "to" trực tiếp (hear music, KHÔNG phải hear to music). Listen luôn cần "to" trước tân ngữ.',
    quiz: [
      { sentence: 'Can you ___ that strange sound?', options: ['hear', 'listen'], correct: 0 },
      { sentence: 'She ___ to classical music every evening.', options: ['hears', 'listens'], correct: 1 },
      { sentence: 'I ___ about the news this morning.', options: ['heard', 'listened'], correct: 0 },
      { sentence: '___ carefully! The teacher is explaining.', options: ['Hear', 'Listen'], correct: 1 },
      { sentence: 'Have you ___ from John recently?', options: ['heard', 'listened'], correct: 0 },
    ],
  },

  // ─── 6. bring vs take ──────────────────────────────────────────────
  {
    id: 'bring-vs-take',
    title: 'Bring vs Take',
    description:
      'Bring: mang đến (hướng về phía người nói). Take: mang đi (hướng ra xa người nói).',
    entries: [
      {
        word: 'bring',
        collocations: [
          { phrase: 'bring someone a gift', meaning: 'mang quà cho ai', example: 'She brought me a gift from Paris.' },
          { phrase: 'bring up', meaning: 'nuôi nấng / đề cập', example: 'She was brought up by her grandparents.' },
          { phrase: 'bring about', meaning: 'gây ra, tạo nên', example: 'The new policy brought about many changes.' },
          { phrase: 'bring back', meaning: 'trả lại / gợi nhớ', example: 'This song brings back memories.' },
          { phrase: 'bring together', meaning: 'đoàn tụ, tập hợp', example: 'The event brought the community together.' },
          { phrase: 'bring to attention', meaning: 'lưu ý, gây chú ý', example: 'I want to bring this issue to your attention.' },
        ],
      },
      {
        word: 'take',
        collocations: [
          { phrase: 'take a photo', meaning: 'chụp ảnh', example: 'Let me take a photo of you.' },
          { phrase: 'take a break', meaning: 'nghỉ giải lao', example: 'Let\'s take a break for ten minutes.' },
          { phrase: 'take place', meaning: 'diễn ra', example: 'The meeting will take place on Friday.' },
          { phrase: 'take care of', meaning: 'chăm sóc', example: 'She takes care of her sick mother.' },
          { phrase: 'take turns', meaning: 'thay phiên', example: 'The children took turns on the swing.' },
          { phrase: 'take away', meaning: 'mang đi, lấy đi', example: 'Can I have this to take away?' },
        ],
      },
    ],
    tip: 'Mẹo: BRING = mang đến chỗ người nói (Bring me the book). TAKE = mang đi khỏi chỗ người nói (Take this to the office). Tưởng tượng: "Come and bring" vs "Go and take".',
    quiz: [
      { sentence: 'Can you ___ me a glass of water?', options: ['bring', 'take'], correct: 0 },
      { sentence: 'Don\'t forget to ___ your umbrella when you go out.', options: ['bring', 'take'], correct: 1 },
      { sentence: 'She ___ some flowers to the hospital for her friend.', options: ['brought', 'took'], correct: 1 },
      { sentence: 'Please ___ these documents to the manager\'s office.', options: ['bring', 'take'], correct: 1 },
      { sentence: 'He ___ a bottle of wine to the dinner party.', options: ['brought', 'took'], correct: 0 },
    ],
  },

  // ─── 7. borrow vs lend ─────────────────────────────────────────────
  {
    id: 'borrow-vs-lend',
    title: 'Borrow vs Lend',
    description:
      'Borrow: mượn (nhận vào). Lend: cho mượn (đưa ra). Hướng của hành động ngược nhau.',
    entries: [
      {
        word: 'borrow',
        collocations: [
          { phrase: 'borrow money', meaning: 'vay tiền', example: 'He borrowed money from the bank.' },
          { phrase: 'borrow a book', meaning: 'mượn sách', example: 'Can I borrow this book from you?' },
          { phrase: 'borrow an idea', meaning: 'mượn ý tưởng', example: 'The design borrows ideas from Japanese architecture.' },
          { phrase: 'borrow time', meaning: 'câu giờ, kéo dài thời gian', example: 'We\'re just borrowing time before the deadline.' },
        ],
      },
      {
        word: 'lend',
        collocations: [
          { phrase: 'lend money', meaning: 'cho mượn tiền', example: 'Could you lend me some money?' },
          { phrase: 'lend a hand', meaning: 'giúp một tay', example: 'Can you lend me a hand with this?' },
          { phrase: 'lend support', meaning: 'hỗ trợ', example: 'The organization lends support to local charities.' },
          { phrase: 'lend an ear', meaning: 'lắng nghe', example: 'She always lends an ear when I need to talk.' },
        ],
      },
    ],
    tip: 'Mẹo: BORROW = mượn VÀO (I borrow FROM you). LEND = cho mượn RA (You lend TO me). Không bao giờ nói "borrow me" — phải nói "lend me" hoặc "Can I borrow from you?".',
    quiz: [
      { sentence: 'Can I ___ your pen for a moment?', options: ['borrow', 'lend'], correct: 0 },
      { sentence: 'Could you ___ me $20 until Friday?', options: ['borrow', 'lend'], correct: 1 },
      { sentence: 'She ___ a book from the library.', options: ['borrowed', 'lent'], correct: 0 },
      { sentence: 'He ___ his car to his friend for the weekend.', options: ['borrowed', 'lent'], correct: 1 },
      { sentence: 'I don\'t like to ___ money to people.', options: ['borrow', 'lend'], correct: 1 },
    ],
  },

  // ─── 8. rob vs steal ───────────────────────────────────────────────
  {
    id: 'rob-vs-steal',
    title: 'Rob vs Steal',
    description:
      'Rob: cướp (nhấn mạnh nạn nhân hoặc nơi bị cướp). Steal: ăn cắp (nhấn mạnh vật bị lấy).',
    entries: [
      {
        word: 'rob',
        collocations: [
          { phrase: 'rob a bank', meaning: 'cướp ngân hàng', example: 'Two men robbed the bank yesterday.' },
          { phrase: 'rob someone', meaning: 'cướp ai', example: 'She was robbed on her way home.' },
          { phrase: 'rob someone of something', meaning: 'cướp cái gì của ai', example: 'The disease robbed him of his ability to walk.' },
          { phrase: 'rob a store', meaning: 'cướp cửa hàng', example: 'The convenience store was robbed last night.' },
        ],
      },
      {
        word: 'steal',
        collocations: [
          { phrase: 'steal money', meaning: 'ăn cắp tiền', example: 'Someone stole money from her wallet.' },
          { phrase: 'steal a car', meaning: 'ăn cắp xe', example: 'His car was stolen from the parking lot.' },
          { phrase: 'steal the show', meaning: 'chiếm hết sự chú ý', example: 'The young actress stole the show.' },
          { phrase: 'steal a glance', meaning: 'liếc trộm', example: 'He stole a glance at her across the room.' },
        ],
      },
    ],
    tip: 'Mẹo: ROB + người/nơi chốn (rob a person, rob a bank). STEAL + vật bị lấy (steal a phone, steal money). KHÔNG nói "rob money" hay "steal a bank".',
    quiz: [
      { sentence: 'Someone ___ my wallet on the bus.', options: ['robbed', 'stole'], correct: 1 },
      { sentence: 'The masked men ___ the jewelry store.', options: ['robbed', 'stole'], correct: 0 },
      { sentence: 'They ___ $10,000 from the safe.', options: ['robbed', 'stole'], correct: 1 },
      { sentence: 'She was ___ of her necklace in broad daylight.', options: ['robbed', 'stolen'], correct: 0 },
      { sentence: 'The baby ___ the show at the wedding.', options: ['robbed', 'stole'], correct: 1 },
    ],
  },
];
