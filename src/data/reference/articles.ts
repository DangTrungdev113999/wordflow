export interface ArticleRule {
  article: 'a' | 'an' | 'the' | 'zero';
  rules: {
    when: string;
    examples: { en: string; vi: string }[];
    tip: string;
  }[];
  specialCases: string[];
  commonMistakes: { wrong: string; correct: string; explanation: string }[];
}

export const ARTICLE_RULES: ArticleRule[] = [
  // ─── A ───────────────────────────────────────────────────────────────

  {
    article: 'a',
    rules: [
      {
        when: 'Dùng khi đề cập đến một danh từ đếm được số ít lần đầu tiên (người nghe chưa biết)',
        examples: [
          {
            en: 'I saw a dog in the park.',
            vi: 'Tôi thấy một con chó trong công viên. (lần đầu nhắc đến)',
          },
          {
            en: 'She bought a new car.',
            vi: 'Cô ấy mua một chiếc xe mới.',
          },
          {
            en: 'There is a book on the table.',
            vi: 'Có một cuốn sách trên bàn.',
          },
        ],
        tip: 'A dùng khi người nghe chưa biết bạn đang nói về cái nào cụ thể. Sau đó dùng THE.',
      },
      {
        when: 'Dùng với nghề nghiệp',
        examples: [
          {
            en: 'She is a doctor.',
            vi: 'Cô ấy là bác sĩ.',
          },
          {
            en: 'He wants to be a teacher.',
            vi: 'Anh ấy muốn trở thành giáo viên.',
          },
        ],
        tip: 'Tiếng Anh PHẢI có mạo từ trước nghề nghiệp. Tiếng Việt không cần nên hay quên.',
      },
      {
        when: 'Dùng với danh từ đếm được số ít mang nghĩa chung chung, đại diện cho cả loại',
        examples: [
          {
            en: 'A dog is a loyal animal.',
            vi: 'Chó là loài động vật trung thành. (nói chung về loài chó)',
          },
          {
            en: 'A smartphone is an essential tool today.',
            vi: 'Điện thoại thông minh là công cụ thiết yếu ngày nay.',
          },
        ],
        tip: 'Có thể thay bằng số nhiều không mạo từ: "Dogs are loyal animals."',
      },
      {
        when: 'Dùng trong các cụm chỉ số lượng, tần suất, giá cả',
        examples: [
          {
            en: 'I go to the gym three times a week.',
            vi: 'Tôi đi tập gym ba lần một tuần.',
          },
          {
            en: 'This costs $5 a kilogram.',
            vi: 'Cái này giá 5 đô một ký.',
          },
          {
            en: 'He drives at 60 miles an hour.',
            vi: 'Anh ấy lái xe 60 dặm một giờ.',
          },
        ],
        tip: 'A/AN = mỗi, một (per). "Twice a day" = hai lần mỗi ngày.',
      },
    ],
    specialCases: [
      'a university (phát âm /juː-/, bắt đầu bằng phụ âm nên dùng A, không dùng AN)',
      'a one-way street ("one" phát âm /wʌn/, bắt đầu bằng phụ âm)',
      'a European country ("European" phát âm /jʊərə-/, bắt đầu bằng phụ âm)',
      'a uniform, a useful tool, a united team (âm /juː-/ là phụ âm)',
      'a half, a hundred, a thousand (dùng A trước half, hundred, thousand)',
    ],
    commonMistakes: [
      {
        wrong: 'She is doctor.',
        correct: 'She is a doctor.',
        explanation: 'Trong tiếng Anh, nghề nghiệp cần mạo từ. Tiếng Việt nói "Cô ấy là bác sĩ" nhưng tiếng Anh phải có "a".',
      },
      {
        wrong: 'I need a water.',
        correct: 'I need water. / I need a glass of water.',
        explanation: '"Water" là danh từ không đếm được, không dùng A/AN trực tiếp. Dùng lượng từ nếu cần.',
      },
      {
        wrong: 'He is a honest man.',
        correct: 'He is an honest man.',
        explanation: '"Honest" phát âm /ˈɒnɪst/, chữ H câm nên âm đầu là nguyên âm, dùng AN.',
      },
      {
        wrong: 'I saw an dog.',
        correct: 'I saw a dog.',
        explanation: '"Dog" bắt đầu bằng phụ âm /d/, phải dùng A.',
      },
    ],
  },

  // ─── AN ──────────────────────────────────────────────────────────────

  {
    article: 'an',
    rules: [
      {
        when: 'Dùng trước danh từ bắt đầu bằng nguyên âm (/æ, e, ɪ, ɒ, ʌ/ v.v.) — quy tắc phát âm, KHÔNG phải chữ cái',
        examples: [
          {
            en: 'She ate an apple.',
            vi: 'Cô ấy ăn một quả táo.',
          },
          {
            en: 'He is an engineer.',
            vi: 'Anh ấy là kỹ sư.',
          },
          {
            en: 'I need an umbrella.',
            vi: 'Tôi cần một cái ô.',
          },
        ],
        tip: 'Mẹo: đọc to từ đó lên. Nếu âm đầu là nguyên âm thì dùng AN.',
      },
      {
        when: 'Dùng trước các từ bắt đầu bằng H câm',
        examples: [
          {
            en: 'She waited for an hour.',
            vi: 'Cô ấy đợi một tiếng.',
          },
          {
            en: 'He is an honest person.',
            vi: 'Anh ấy là người trung thực.',
          },
          {
            en: 'It would be an honour.',
            vi: 'Đó sẽ là một vinh dự.',
          },
        ],
        tip: 'Các từ H câm phổ biến: hour, honest, honour, heir. Chữ H không phát âm nên dùng AN.',
      },
      {
        when: 'Dùng trước các chữ viết tắt phát âm bắt đầu bằng nguyên âm',
        examples: [
          {
            en: 'She works for an NGO.',
            vi: 'Cô ấy làm việc cho một tổ chức phi chính phủ. (NGO đọc là /ɛn-dʒiː-oʊ/)',
          },
          {
            en: 'He sent an SMS.',
            vi: 'Anh ấy gửi một tin nhắn SMS. (SMS đọc là /ɛs-ɛm-ɛs/)',
          },
          {
            en: 'It was an FBI investigation.',
            vi: 'Đó là cuộc điều tra của FBI. (FBI đọc là /ɛf-biː-aɪ/)',
          },
        ],
        tip: 'Chữ viết tắt: xem ÂM ĐẦU khi đọc. F (/ɛf/), H (/eɪtʃ/), L (/ɛl/), M (/ɛm/), N (/ɛn/), R (/ɑːr/), S (/ɛs/), X (/ɛks/) đều bắt đầu bằng nguyên âm.',
      },
    ],
    specialCases: [
      'an hour, an honest, an honour, an heir (H câm — dùng AN)',
      'an MBA, an NGO, an SMS, an FBI agent (chữ viết tắt bắt đầu bằng nguyên âm khi đọc)',
      'an 8-year-old boy (eight bắt đầu bằng /eɪ/ — nguyên âm)',
      'an X-ray (X đọc là /ɛks/ — bắt đầu bằng nguyên âm)',
      'a UFO (UFO đọc là /juː-ɛf-oʊ/, âm đầu /j/ là phụ âm — dùng A)',
    ],
    commonMistakes: [
      {
        wrong: 'a umbrella',
        correct: 'an umbrella',
        explanation: '"Umbrella" bắt đầu bằng nguyên âm /ʌ/, phải dùng AN.',
      },
      {
        wrong: 'an university',
        correct: 'a university',
        explanation: '"University" phát âm /juːnɪˈvɜːrsɪti/, âm đầu /j/ là phụ âm, dùng A.',
      },
      {
        wrong: 'a hour',
        correct: 'an hour',
        explanation: '"Hour" phát âm /aʊər/, chữ H câm nên âm đầu là nguyên âm, dùng AN.',
      },
      {
        wrong: 'an European',
        correct: 'a European',
        explanation: '"European" phát âm /jʊərəˈpiːən/, âm đầu /j/ là phụ âm, dùng A.',
      },
    ],
  },

  // ─── THE ─────────────────────────────────────────────────────────────

  {
    article: 'the',
    rules: [
      {
        when: 'Dùng khi danh từ đã được nhắc đến trước đó (người nghe đã biết)',
        examples: [
          {
            en: 'I bought a book yesterday. The book is very interesting.',
            vi: 'Tôi mua một cuốn sách hôm qua. Cuốn sách đó rất hay.',
          },
          {
            en: 'She has a cat and a dog. The cat is white.',
            vi: 'Cô ấy có một con mèo và một con chó. Con mèo thì màu trắng.',
          },
        ],
        tip: 'Lần đầu dùng A/AN, lần sau dùng THE vì người nghe đã biết bạn nói cái nào.',
      },
      {
        when: 'Dùng khi chỉ sự vật duy nhất, ai cũng biết',
        examples: [
          {
            en: 'The sun rises in the east.',
            vi: 'Mặt trời mọc ở phía đông.',
          },
          {
            en: 'The moon is bright tonight.',
            vi: 'Trăng sáng tối nay.',
          },
          {
            en: 'The earth revolves around the sun.',
            vi: 'Trái đất quay quanh mặt trời.',
          },
        ],
        tip: 'Các sự vật duy nhất: the sun, the moon, the earth, the sky, the sea, the internet, the environment.',
      },
      {
        when: 'Dùng với so sánh nhất (superlatives) và số thứ tự (ordinals)',
        examples: [
          {
            en: 'She is the tallest student in the class.',
            vi: 'Cô ấy là học sinh cao nhất lớp.',
          },
          {
            en: 'This is the best restaurant in town.',
            vi: 'Đây là nhà hàng ngon nhất thành phố.',
          },
          {
            en: 'He was the first person to arrive.',
            vi: 'Anh ấy là người đầu tiên đến.',
          },
        ],
        tip: 'So sánh nhất và số thứ tự LUÔN đi với THE.',
      },
      {
        when: 'Dùng khi ngữ cảnh xác định rõ đang nói về cái nào',
        examples: [
          {
            en: 'Can you close the door? (cửa trong phòng này)',
            vi: 'Bạn đóng cửa được không?',
          },
          {
            en: 'Where is the bathroom?',
            vi: 'Phòng tắm ở đâu? (trong căn nhà/nhà hàng này)',
          },
          {
            en: 'The children are playing outside.',
            vi: 'Bọn trẻ đang chơi ngoài trời. (những đứa trẻ mà cả hai cùng biết)',
          },
        ],
        tip: 'Nếu cả người nói và người nghe đều biết đang nói cái nào thì dùng THE.',
      },
      {
        when: 'Dùng với cụm danh từ có "of" (of-phrase) hoặc mệnh đề quan hệ xác định',
        examples: [
          {
            en: 'The capital of France is Paris.',
            vi: 'Thủ đô của Pháp là Paris.',
          },
          {
            en: 'The color of the sky changed.',
            vi: 'Màu sắc của bầu trời thay đổi.',
          },
          {
            en: 'The man who called you is here.',
            vi: 'Người đàn ông đã gọi cho bạn đang ở đây.',
          },
        ],
        tip: 'Khi có "of" hoặc mệnh đề quan hệ giúp xác định, danh từ thường cần THE.',
      },
    ],
    specialCases: [
      'the + tên sông, biển, đại dương: the Mekong, the Pacific, the Red Sea',
      'the + tên dãy núi, quần đảo: the Alps, the Philippines, the Himalayas',
      'the + tên quốc gia có Republic, Kingdom, States: the UK, the USA, the Czech Republic',
      'the + nhạc cụ: play the piano, play the guitar (nhưng: play piano cũng đúng trong AmE)',
      'the + tính từ chỉ nhóm người: the rich, the poor, the elderly, the homeless',
      'the + tên gia đình (số nhiều): the Nguyens, the Smiths',
    ],
    commonMistakes: [
      {
        wrong: 'I love the nature.',
        correct: 'I love nature.',
        explanation: '"Nature" khi dùng nghĩa chung (thiên nhiên nói chung) không cần THE.',
      },
      {
        wrong: 'She plays the tennis.',
        correct: 'She plays tennis.',
        explanation: 'Tên môn thể thao không dùng THE. Chỉ nhạc cụ mới cần THE.',
      },
      {
        wrong: 'I go to the school every day. (học sinh đi học)',
        correct: 'I go to school every day.',
        explanation: 'Khi nói về chức năng (đi học), không dùng THE: go to school, go to church, go to bed.',
      },
      {
        wrong: 'The life is short.',
        correct: 'Life is short.',
        explanation: 'Danh từ trừu tượng nghĩa chung không cần THE: life, love, happiness, freedom.',
      },
      {
        wrong: 'I visited Paris. Paris is the capital of the France.',
        correct: 'Paris is the capital of France.',
        explanation: 'Tên quốc gia đơn lẻ không dùng THE: France, Japan, Vietnam (nhưng: the UK, the USA).',
      },
    ],
  },

  // ─── ZERO ARTICLE ───────────────────────────────────────────────────

  {
    article: 'zero',
    rules: [
      {
        when: 'Dùng với danh từ không đếm được khi nói chung chung',
        examples: [
          {
            en: 'Water is essential for life.',
            vi: 'Nước rất cần thiết cho sự sống.',
          },
          {
            en: 'Music makes me happy.',
            vi: 'Âm nhạc khiến tôi vui.',
          },
          {
            en: 'Information is power.',
            vi: 'Thông tin là sức mạnh.',
          },
        ],
        tip: 'Danh từ không đếm được nghĩa chung = không cần mạo từ. Nếu cụ thể thì dùng THE.',
      },
      {
        when: 'Dùng với danh từ số nhiều khi nói chung chung về cả loại',
        examples: [
          {
            en: 'Dogs are loyal animals.',
            vi: 'Chó là loài trung thành.',
          },
          {
            en: 'Books can change your life.',
            vi: 'Sách có thể thay đổi cuộc đời bạn.',
          },
          {
            en: 'Computers have revolutionized the world.',
            vi: 'Máy tính đã cách mạng hóa thế giới.',
          },
        ],
        tip: 'Nói chung về cả loại: dùng số nhiều không mạo từ. "Dogs are..." (chó nói chung) vs "The dogs are..." (những con chó cụ thể).',
      },
      {
        when: 'Dùng với tên ngôn ngữ, môn học, môn thể thao',
        examples: [
          {
            en: 'She speaks English and French.',
            vi: 'Cô ấy nói tiếng Anh và tiếng Pháp.',
          },
          {
            en: 'I study mathematics at university.',
            vi: 'Tôi học toán ở đại học.',
          },
          {
            en: 'He plays basketball every weekend.',
            vi: 'Anh ấy chơi bóng rổ mỗi cuối tuần.',
          },
        ],
        tip: 'Ngôn ngữ, môn học, thể thao: không cần mạo từ.',
      },
      {
        when: 'Dùng với bữa ăn, phương tiện đi lại (by + transport), và một số cụm cố định',
        examples: [
          {
            en: 'I have breakfast at 7 a.m.',
            vi: 'Tôi ăn sáng lúc 7 giờ.',
          },
          {
            en: 'She goes to work by bus.',
            vi: 'Cô ấy đi làm bằng xe buýt.',
          },
          {
            en: 'He is in bed. (đang nằm ngủ)',
            vi: 'Anh ấy đang nằm trên giường.',
          },
        ],
        tip: 'Bữa ăn (breakfast, lunch, dinner), by + phương tiện (by car, by train), và cụm cố định (go to bed, at home, at work, go to school) không dùng mạo từ.',
      },
    ],
    specialCases: [
      'Tên người: John, Mary, Nguyen Van A (không dùng mạo từ)',
      'Tên quốc gia đơn lẻ: Vietnam, Japan, France (nhưng: the UK, the USA)',
      'Tên thành phố: Hanoi, Tokyo, Paris (không dùng mạo từ)',
      'Tên núi đơn lẻ: Mount Everest, Mount Fuji (nhưng dãy núi: the Alps)',
      'Tên hồ: Lake Baikal, West Lake (nhưng sông: the Mekong)',
      'Tên lục địa: Asia, Europe, Africa (không dùng mạo từ)',
      'Cụm cố định: go to school, go to bed, go to church, go to prison, at home, at work, by car, by train, on foot',
    ],
    commonMistakes: [
      {
        wrong: 'I like the music. (nói chung)',
        correct: 'I like music.',
        explanation: 'Khi nói về âm nhạc nói chung, không dùng THE. Chỉ dùng THE khi cụ thể: "I like the music in this café."',
      },
      {
        wrong: 'She speaks the English.',
        correct: 'She speaks English.',
        explanation: 'Tên ngôn ngữ không dùng mạo từ.',
      },
      {
        wrong: 'I had the breakfast at home.',
        correct: 'I had breakfast at home.',
        explanation: 'Bữa ăn nói chung không dùng mạo từ. Chỉ dùng THE khi cụ thể: "The breakfast at that hotel was amazing."',
      },
      {
        wrong: 'He goes to work by the bus.',
        correct: 'He goes to work by bus.',
        explanation: 'Cấu trúc "by + phương tiện" không dùng mạo từ: by bus, by car, by plane.',
      },
      {
        wrong: 'The cats are cute. (nói chung về loài mèo)',
        correct: 'Cats are cute.',
        explanation: 'Khi nói chung về cả loài, dùng số nhiều không mạo từ. "The cats" = những con mèo cụ thể.',
      },
    ],
  },
];
