export interface CommonMistake {
  id: string;
  category: 'tense' | 'preposition' | 'article' | 'word-order' | 'pronunciation' | 'vocabulary';
  title: string;
  wrong: string;
  correct: string;
  explanation: string;
  tip: string;
  relatedLesson?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
}

export const COMMON_MISTAKES: CommonMistake[] = [
  // ── TENSE (~10) ──────────────────────────────────────────────────────
  {
    id: 'tense-01',
    category: 'tense',
    title: 'Quên thêm -s/-es ngôi thứ 3 số ít',
    wrong: 'She go to school every day.',
    correct: 'She goes to school every day.',
    explanation:
      'Tiếng Việt không chia động từ theo ngôi, nên người Việt rất hay quên thêm -s/-es khi chủ ngữ là he/she/it ở thì hiện tại đơn.',
    tip: 'Nhớ quy tắc: He / She / It + V-s/es. Hãy luôn kiểm tra chủ ngữ trước khi viết động từ.',
    relatedLesson: 'present-simple',
    level: 'A1',
  },
  {
    id: 'tense-02',
    category: 'tense',
    title: 'Dùng sai thì hiện tại đơn thay cho hiện tại tiếp diễn',
    wrong: 'Look! She runs very fast.',
    correct: 'Look! She is running very fast.',
    explanation:
      'Khi hành động đang xảy ra ngay lúc nói (có dấu hiệu: look, listen, now, right now...), phải dùng thì hiện tại tiếp diễn.',
    tip: 'Gặp "Look!", "Listen!", "now", "right now", "at the moment" → dùng hiện tại tiếp diễn (am/is/are + V-ing).',
    relatedLesson: 'present-continuous',
    level: 'A1',
  },
  {
    id: 'tense-03',
    category: 'tense',
    title: 'Nhầm lẫn since và for',
    wrong: 'I have lived here since 5 years.',
    correct: 'I have lived here for 5 years.',
    explanation:
      'Since đi với mốc thời gian cụ thể (since 2020, since Monday). For đi với khoảng thời gian (for 5 years, for 2 hours). Người Việt hay dùng "since" cho mọi trường hợp vì dịch từ "từ/được".',
    tip: '"Since" = mốc thời gian (since 2020). "For" = khoảng thời gian (for 3 days). Hỏi "bao lâu?" → for. Hỏi "từ khi nào?" → since.',
    relatedLesson: 'present-perfect',
    level: 'A2',
  },
  {
    id: 'tense-04',
    category: 'tense',
    title: 'Dùng quá khứ đơn thay cho hiện tại hoàn thành',
    wrong: 'I already finished my homework.',
    correct: 'I have already finished my homework.',
    explanation:
      'Khi nói về hành động đã hoàn thành có kết quả liên quan đến hiện tại, hoặc dùng với already/yet/just, cần dùng thì hiện tại hoàn thành.',
    tip: 'Gặp already, yet, just, ever, never → ưu tiên dùng thì hiện tại hoàn thành (have/has + V3).',
    relatedLesson: 'present-perfect',
    level: 'A2',
  },
  {
    id: 'tense-05',
    category: 'tense',
    title: 'Thêm -ed cho động từ bất quy tắc',
    wrong: 'Yesterday I goed to the park.',
    correct: 'Yesterday I went to the park.',
    explanation:
      'Nhiều động từ tiếng Anh bất quy tắc, không thêm -ed ở quá khứ. Người Việt hay áp dụng quy tắc V-ed cho tất cả động từ.',
    tip: 'Học thuộc bảng động từ bất quy tắc. Các từ phổ biến: go→went, eat→ate, see→saw, come→came, do→did, have→had.',
    relatedLesson: 'past-simple',
    level: 'A1',
  },
  {
    id: 'tense-06',
    category: 'tense',
    title: 'Dùng "did" kèm động từ chia quá khứ',
    wrong: 'I didn\'t went to school yesterday.',
    correct: 'I didn\'t go to school yesterday.',
    explanation:
      'Khi dùng trợ động từ "did/didn\'t" trong câu phủ định và câu hỏi ở quá khứ, động từ chính phải ở dạng nguyên mẫu.',
    tip: 'Đã có "did/didn\'t" thì động từ chính giữ nguyên mẫu: Did you go? / I didn\'t go.',
    relatedLesson: 'past-simple',
    level: 'A1',
  },
  {
    id: 'tense-07',
    category: 'tense',
    title: 'Dùng will cho kế hoạch đã lên lịch',
    wrong: 'I will meet my friend tomorrow. We booked the restaurant already.',
    correct: 'I am meeting my friend tomorrow. We have booked the restaurant already.',
    explanation:
      'Khi kế hoạch đã được sắp xếp trước, nên dùng hiện tại tiếp diễn (be going to / present continuous) thay vì "will".',
    tip: '"Will" cho quyết định ngay lúc nói. "Be going to / be + V-ing" cho kế hoạch đã lên lịch.',
    relatedLesson: 'future-simple',
    level: 'A2',
  },
  {
    id: 'tense-08',
    category: 'tense',
    title: 'Quên dùng "was/were" trong quá khứ tiếp diễn',
    wrong: 'I reading a book when she called.',
    correct: 'I was reading a book when she called.',
    explanation:
      'Thì quá khứ tiếp diễn cần trợ động từ was/were trước V-ing. Người Việt hay bỏ qua vì tiếng Việt không có trợ động từ.',
    tip: 'Quá khứ tiếp diễn: was/were + V-ing. "When" thường đi kèm 2 thì: quá khứ tiếp diễn + quá khứ đơn.',
    relatedLesson: 'past-continuous',
    level: 'A2',
  },
  {
    id: 'tense-09',
    category: 'tense',
    title: 'Nhầm "used to" và "use to"',
    wrong: 'I use to play football when I was young.',
    correct: 'I used to play football when I was young.',
    explanation:
      'Cấu trúc nói về thói quen trong quá khứ là "used to + V". Chỉ viết "use to" khi đi sau "did/didn\'t" (Did you use to...?).',
    tip: 'Câu khẳng định: "used to + V". Câu phủ định/hỏi: "didn\'t use to / Did ... use to?"',
    level: 'A2',
  },
  {
    id: 'tense-10',
    category: 'tense',
    title: 'Dùng hiện tại đơn trong mệnh đề thời gian tương lai',
    wrong: 'When I will arrive, I will call you.',
    correct: 'When I arrive, I will call you.',
    explanation:
      'Sau các liên từ chỉ thời gian (when, before, after, as soon as, until), dùng thì hiện tại đơn để nói về tương lai, không dùng "will".',
    tip: 'When/Before/After/As soon as + thì hiện tại đơn (KHÔNG dùng will).',
    level: 'B1',
  },

  // ── PREPOSITION (~8) ─────────────────────────────────────────────────
  {
    id: 'prep-01',
    category: 'preposition',
    title: 'Nhầm in/on/at chỉ thời gian',
    wrong: 'I was born in Monday.',
    correct: 'I was born on Monday.',
    explanation:
      'In dùng cho tháng/năm/mùa (in May, in 2020, in summer). On dùng cho ngày/thứ (on Monday, on January 1st). At dùng cho giờ cụ thể (at 7 o\'clock).',
    tip: 'AT + giờ | ON + ngày/thứ | IN + tháng/năm/mùa. Ngoại lệ: at night, at the weekend (British).',
    relatedLesson: 'prepositions-time',
    level: 'A1',
  },
  {
    id: 'prep-02',
    category: 'preposition',
    title: 'Nhầm in/on/at chỉ nơi chốn',
    wrong: 'She is in the bus.',
    correct: 'She is on the bus.',
    explanation:
      'Dùng "on" cho phương tiện công cộng (on the bus/train/plane). Dùng "in" cho xe nhỏ, không gian kín (in the car, in the room).',
    tip: 'ON the bus/train/plane/ship (phương tiện lớn). IN the car/taxi (phương tiện nhỏ). AT địa điểm cụ thể (at school, at home).',
    relatedLesson: 'prepositions-place',
    level: 'A1',
  },
  {
    id: 'prep-03',
    category: 'preposition',
    title: 'Dùng "depend of" thay vì "depend on"',
    wrong: 'It depends of the weather.',
    correct: 'It depends on the weather.',
    explanation:
      'Trong tiếng Anh, "depend" luôn đi với giới từ "on", không phải "of". Người Việt hay nhầm do ảnh hưởng từ tiếng Pháp hoặc do dịch sát nghĩa.',
    tip: 'Luôn nhớ: depend ON something/someone. Không bao giờ dùng "depend of".',
    level: 'A2',
  },
  {
    id: 'prep-04',
    category: 'preposition',
    title: 'Thêm giới từ thừa sau "discuss"',
    wrong: 'We need to discuss about this problem.',
    correct: 'We need to discuss this problem.',
    explanation:
      '"Discuss" là ngoại động từ, đi trực tiếp với tân ngữ, không cần giới từ "about". Tương tự: enter (không cần "into"), reach (không cần "to").',
    tip: 'Discuss + something (KHÔNG có about). Muốn dùng "about" thì: talk about, speak about.',
    level: 'A2',
  },
  {
    id: 'prep-05',
    category: 'preposition',
    title: 'Nhầm "interested in" thành "interested about/with"',
    wrong: 'I am interested about science.',
    correct: 'I am interested in science.',
    explanation:
      'Tính từ "interested" luôn đi với giới từ "in". Đây là collocation cố định trong tiếng Anh.',
    tip: 'Các cụm cần nhớ: interested IN, good AT, afraid OF, worried ABOUT, keen ON.',
    level: 'A2',
  },
  {
    id: 'prep-06',
    category: 'preposition',
    title: 'Dùng "married with" thay vì "married to"',
    wrong: 'She is married with a doctor.',
    correct: 'She is married to a doctor.',
    explanation:
      'Trong tiếng Anh, "married" đi với "to" (be married to someone), không phải "with". Người Việt dịch từ "kết hôn với" nên hay dùng sai.',
    tip: 'Be married TO someone. Get married TO someone. KHÔNG dùng "married with".',
    level: 'A2',
  },
  {
    id: 'prep-07',
    category: 'preposition',
    title: 'Thiếu giới từ sau "listen"',
    wrong: 'I like to listen music.',
    correct: 'I like to listen to music.',
    explanation:
      '"Listen" là nội động từ, cần giới từ "to" trước tân ngữ. Khác với "hear" (ngoại động từ, không cần giới từ).',
    tip: 'Listen TO something/someone. Hear something/someone (không cần "to").',
    level: 'A1',
  },
  {
    id: 'prep-08',
    category: 'preposition',
    title: 'Dùng "arrive to" thay vì "arrive in/at"',
    wrong: 'We arrived to the airport at 6 AM.',
    correct: 'We arrived at the airport at 6 AM.',
    explanation:
      '"Arrive" đi với "at" (địa điểm nhỏ, cụ thể) hoặc "in" (thành phố, quốc gia). Không bao giờ dùng "arrive to".',
    tip: 'Arrive AT + địa điểm nhỏ (at the station). Arrive IN + thành phố/nước (in London). KHÔNG dùng "arrive to".',
    level: 'A2',
  },

  // ── ARTICLE (~6) ─────────────────────────────────────────────────────
  {
    id: 'art-01',
    category: 'article',
    title: 'Thiếu mạo từ trước danh từ đếm được số ít',
    wrong: 'She is teacher.',
    correct: 'She is a teacher.',
    explanation:
      'Tiếng Việt không có mạo từ nên người Việt rất hay quên dùng a/an trước danh từ đếm được số ít. Trong tiếng Anh, danh từ đếm được số ít phải có mạo từ hoặc từ hạn định.',
    tip: 'Danh từ đếm được số ít luôn cần: a/an, the, my, this, that... Không bao giờ đứng một mình.',
    relatedLesson: 'articles',
    level: 'A1',
  },
  {
    id: 'art-02',
    category: 'article',
    title: 'Dùng "the" trước danh từ chung chung',
    wrong: 'The life is beautiful.',
    correct: 'Life is beautiful.',
    explanation:
      'Khi nói về khái niệm chung chung, không dùng "the". Chỉ dùng "the" khi nói về một thứ cụ thể mà người nghe biết.',
    tip: 'Nói chung chung → không dùng "the": Music is relaxing. Love is important. Books are useful.',
    relatedLesson: 'articles',
    level: 'A2',
  },
  {
    id: 'art-03',
    category: 'article',
    title: 'Nhầm a và an',
    wrong: 'She is an university student.',
    correct: 'She is a university student.',
    explanation:
      'Dùng "a" hay "an" phụ thuộc vào ÂM đầu tiên, không phải chữ cái đầu tiên. "University" bắt đầu bằng âm /juː/ (phụ âm) nên dùng "a".',
    tip: 'Dùng AN trước nguyên âm (a, e, i, o, u âm). Dùng A trước phụ âm. Chú ý: a university, a uniform, an hour, an honest man.',
    relatedLesson: 'articles',
    level: 'A1',
  },
  {
    id: 'art-04',
    category: 'article',
    title: 'Thêm "the" trước tên riêng của quốc gia đơn',
    wrong: 'I live in the Vietnam.',
    correct: 'I live in Vietnam.',
    explanation:
      'Tên quốc gia đơn không dùng "the" (Vietnam, Japan, France). Chỉ dùng "the" cho tên có Republic, Kingdom, States, v.v. (the UK, the USA, the Philippines).',
    tip: 'Không dùng "the": Vietnam, Japan, France, Germany. Dùng "the": the USA, the UK, the Netherlands, the Philippines.',
    level: 'A2',
  },
  {
    id: 'art-05',
    category: 'article',
    title: 'Thiếu "the" khi nói về thứ duy nhất',
    wrong: 'Sun is very hot today.',
    correct: 'The sun is very hot today.',
    explanation:
      'Khi nói về vật duy nhất (the sun, the moon, the earth, the internet, the sky...), phải dùng "the".',
    tip: 'Vật duy nhất luôn dùng "the": the sun, the moon, the earth, the sky, the internet, the government.',
    relatedLesson: 'articles',
    level: 'A2',
  },
  {
    id: 'art-06',
    category: 'article',
    title: 'Dùng mạo từ trước tính từ sở hữu',
    wrong: 'This is the my book.',
    correct: 'This is my book.',
    explanation:
      'Không dùng mạo từ (a/an/the) cùng với tính từ sở hữu (my, your, his, her...). Chỉ dùng một trong hai.',
    tip: 'KHÔNG: the my, a my, the your. Chọn một: "the book" HOẶC "my book".',
    relatedLesson: 'articles',
    level: 'A1',
  },

  // ── WORD ORDER (~6) ──────────────────────────────────────────────────
  {
    id: 'wo-01',
    category: 'word-order',
    title: 'Đặt trạng từ sai vị trí: "I very like"',
    wrong: 'I very like this movie.',
    correct: 'I really like this movie.',
    explanation:
      'Người Việt hay dịch sát "Tôi rất thích" thành "I very like". Trong tiếng Anh, "very" không bổ nghĩa cho động từ, mà phải dùng "really" hoặc "very much" (đặt cuối câu).',
    tip: '"Very" + tính từ/trạng từ (very good). "Really" + động từ (I really like). Hoặc: I like it very much.',
    level: 'A1',
  },
  {
    id: 'wo-02',
    category: 'word-order',
    title: 'Sai trật tự tính từ',
    wrong: 'She has a red beautiful big dress.',
    correct: 'She has a beautiful big red dress.',
    explanation:
      'Tiếng Anh có thứ tự tính từ cố định: Opinion – Size – Age – Shape – Color – Origin – Material – Purpose.',
    tip: 'Nhớ: Ý kiến → Kích thước → Tuổi → Hình dạng → Màu sắc → Xuất xứ → Chất liệu → Mục đích.',
    level: 'A2',
  },
  {
    id: 'wo-03',
    category: 'word-order',
    title: 'Đặt trạng từ tần suất sai vị trí',
    wrong: 'I go always to school by bus.',
    correct: 'I always go to school by bus.',
    explanation:
      'Trạng từ tần suất (always, usually, often, sometimes, never) đặt trước động từ thường và sau động từ "to be".',
    tip: 'Trước động từ thường: I always eat. Sau "to be": She is always happy.',
    relatedLesson: 'adverbs-frequency',
    level: 'A1',
  },
  {
    id: 'wo-04',
    category: 'word-order',
    title: 'Đặt "enough" sai vị trí',
    wrong: 'She is enough old to drive.',
    correct: 'She is old enough to drive.',
    explanation:
      '"Enough" đứng SAU tính từ/trạng từ (old enough, fast enough) nhưng đứng TRƯỚC danh từ (enough money, enough time).',
    tip: 'Tính từ/Trạng từ + enough: tall enough, quickly enough. Enough + danh từ: enough water, enough time.',
    level: 'A2',
  },
  {
    id: 'wo-05',
    category: 'word-order',
    title: 'Sai trật tự câu hỏi: thiếu đảo ngữ',
    wrong: 'Where you are going?',
    correct: 'Where are you going?',
    explanation:
      'Câu hỏi tiếng Anh cần đảo trợ động từ lên trước chủ ngữ. Người Việt hay giữ trật tự câu trần thuật vì tiếng Việt không đảo ngữ.',
    tip: 'Câu hỏi: Từ hỏi + trợ động từ + chủ ngữ + động từ? Where ARE you going? What DID you do?',
    relatedLesson: 'question-words',
    level: 'A1',
  },
  {
    id: 'wo-06',
    category: 'word-order',
    title: 'Đặt "also" sai vị trí',
    wrong: 'I also am a student.',
    correct: 'I am also a student.',
    explanation:
      '"Also" đặt sau "to be" nhưng đặt trước động từ thường. Quy tắc tương tự trạng từ tần suất.',
    tip: 'Sau "to be": She is also kind. Trước động từ thường: He also plays guitar.',
    level: 'A2',
  },

  // ── PRONUNCIATION (~5) ───────────────────────────────────────────────
  {
    id: 'pron-01',
    category: 'pronunciation',
    title: 'Không phát âm phụ âm cuối',
    wrong: 'Phát âm "book" thành /bʊ/, "cat" thành /kæ/',
    correct: 'Phát âm đầy đủ: "book" /bʊk/, "cat" /kæt/',
    explanation:
      'Tiếng Việt hầu như không có phụ âm cuối rõ ràng, nên người Việt hay nuốt mất âm cuối (t, k, p, d, s, z...). Điều này gây khó hiểu cho người nghe.',
    tip: 'Tập phát âm rõ các phụ âm cuối. Bắt đầu với: -t, -k, -p, -d, -s, -z. Đọc chậm, cường điệu âm cuối khi luyện tập.',
    level: 'A1',
  },
  {
    id: 'pron-02',
    category: 'pronunciation',
    title: 'Nhầm lẫn /s/ và /ʃ/ (sh)',
    wrong: 'Phát âm "she" thành /siː/ (giống "see")',
    correct: 'Phát âm "she" là /ʃiː/, "see" là /siː/',
    explanation:
      'Nhiều người Việt (đặc biệt miền Bắc) không phân biệt /s/ và /ʃ/. Điều này khiến "she" và "see", "ship" và "sip" nghe giống nhau.',
    tip: '/ʃ/ (sh): môi tròn, lưỡi cong lên. /s/: môi bẹt, lưỡi phẳng. Luyện cặp: she-see, ship-sip, show-so.',
    level: 'A1',
  },
  {
    id: 'pron-03',
    category: 'pronunciation',
    title: 'Không phát âm /θ/ và /ð/ (th)',
    wrong: 'Phát âm "think" thành /tɪŋk/ hoặc /fɪŋk/',
    correct: 'Phát âm "think" là /θɪŋk/ — đặt lưỡi giữa hai hàm răng',
    explanation:
      'Âm /θ/ (think, three) và /ð/ (this, that) không có trong tiếng Việt. Người Việt thường thay bằng /t/, /d/ hoặc /f/, /v/.',
    tip: 'Đặt đầu lưỡi giữa hai hàm răng và thổi hơi. /θ/ (voiceless): think, three, thank. /ð/ (voiced): this, that, the.',
    level: 'A1',
  },
  {
    id: 'pron-04',
    category: 'pronunciation',
    title: 'Nhầm trọng âm: nhấn sai âm tiết',
    wrong: 'Phát âm "develop" nhấn âm 1: /ˈdɪvələp/',
    correct: 'Phát âm "develop" nhấn âm 2: /dɪˈveləp/',
    explanation:
      'Tiếng Việt mỗi âm tiết đều rõ ràng với thanh điệu riêng. Tiếng Anh có trọng âm, các âm không nhấn sẽ bị lướt qua. Nhấn sai trọng âm khiến người bản xứ khó hiểu.',
    tip: 'Khi học từ mới, luôn học trọng âm cùng. Dùng từ điển online để nghe phát âm chuẩn. Quy tắc chung: từ 2 âm tiết — danh từ nhấn âm 1, động từ nhấn âm 2.',
    level: 'A2',
  },
  {
    id: 'pron-05',
    category: 'pronunciation',
    title: 'Không phát âm cụm phụ âm (consonant clusters)',
    wrong: 'Phát âm "strengths" thành /sə.tren/ hoặc "streets" thành /sə.tri/',
    correct: 'Phát âm "strengths" /streŋθs/, "streets" /striːts/',
    explanation:
      'Tiếng Việt không có cụm phụ âm đầu (str-, bl-, pr-...) nên người Việt hay thêm nguyên âm /ə/ vào giữa để dễ đọc.',
    tip: 'Luyện đọc chậm cụm phụ âm: str- (street), bl- (blue), pr- (price), spl- (splash). Không thêm âm /ə/ vào giữa.',
    level: 'A2',
  },

  // ── VOCABULARY (~5) ──────────────────────────────────────────────────
  {
    id: 'vocab-01',
    category: 'vocabulary',
    title: 'Dùng "have" thay cho "there is/there are"',
    wrong: 'In my class have many students.',
    correct: 'There are many students in my class.',
    explanation:
      'Người Việt dịch sát "Trong lớp tôi có nhiều học sinh" nên dùng "have". Tiếng Anh dùng "there is/are" để nói sự tồn tại.',
    tip: 'Nói "ở đâu có cái gì" → There is/are. "Have" chỉ dùng khi có chủ ngữ sở hữu: I have a book.',
    relatedLesson: 'there-is-are',
    level: 'A1',
  },
  {
    id: 'vocab-02',
    category: 'vocabulary',
    title: 'Nhầm "borrow" và "lend"',
    wrong: 'Can you borrow me your pen?',
    correct: 'Can you lend me your pen?',
    explanation:
      '"Borrow" = mượn (lấy từ người khác). "Lend" = cho mượn (đưa cho người khác). Tiếng Việt dùng một từ "mượn" cho cả hai nghĩa.',
    tip: 'Borrow FROM someone (mượn từ ai). Lend TO someone (cho ai mượn). "Can I borrow your pen?" = "Can you lend me your pen?"',
    level: 'A2',
  },
  {
    id: 'vocab-03',
    category: 'vocabulary',
    title: 'Dùng "open/close" cho thiết bị điện',
    wrong: 'Please open the light.',
    correct: 'Please turn on the light.',
    explanation:
      'Tiếng Việt dùng "mở/tắt" cho cả cửa và thiết bị điện. Tiếng Anh phân biệt: open/close (cửa, sách...) và turn on/turn off (đèn, TV, máy...).',
    tip: 'Open/close: cửa, sách, hộp. Turn on/off: đèn, TV, máy tính, điều hòa.',
    level: 'A1',
  },
  {
    id: 'vocab-04',
    category: 'vocabulary',
    title: 'Nhầm "say" và "tell"',
    wrong: 'She said me that she was tired.',
    correct: 'She told me that she was tired.',
    explanation:
      '"Say" không cần tân ngữ chỉ người trực tiếp (say something, say that...). "Tell" cần tân ngữ chỉ người (tell someone something).',
    tip: 'Say something (to someone). Tell someone something. She said (that)... She told me (that)...',
    level: 'A2',
  },
  {
    id: 'vocab-05',
    category: 'vocabulary',
    title: 'Dùng "play" cho mọi hoạt động giải trí',
    wrong: 'I like to play internet.',
    correct: 'I like to surf the internet.',
    explanation:
      'Tiếng Việt dùng "chơi" rất rộng (chơi game, chơi internet, chơi nhạc). Tiếng Anh dùng từ khác nhau: play games, surf the internet, play music, browse the web.',
    tip: 'Play + thể thao/nhạc cụ/game. Surf/browse + the internet. Watch + TV/movies. Do + homework/exercise.',
    level: 'A1',
  },
];
