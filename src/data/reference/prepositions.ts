export interface PrepositionRule {
  category: 'time' | 'place' | 'movement';
  preposition: string;
  rules: {
    usage: string;
    examples: string[];
    tip?: string;
  }[];
  commonMistakes: {
    wrong: string;
    correct: string;
  }[];
}

export const PREPOSITION_RULES: PrepositionRule[] = [
  // ─── TIME PREPOSITIONS ───────────────────────────────────────────────

  {
    category: 'time',
    preposition: 'in',
    rules: [
      {
        usage: 'Dùng với tháng, năm, mùa, thập kỷ, thế kỷ',
        examples: [
          'I was born in 1995.',
          'We usually go on holiday in summer.',
          'The company was founded in March.',
        ],
        tip: 'Nhớ: IN dùng cho khoảng thời gian dài (tháng, năm, mùa).',
      },
      {
        usage: 'Dùng với buổi trong ngày (morning, afternoon, evening)',
        examples: [
          'I like to read in the morning.',
          'She exercises in the evening.',
        ],
        tip: 'Ngoại lệ: "at night" chứ KHÔNG phải "in the night".',
      },
      {
        usage: 'Dùng để diễn tả "trong vòng bao lâu nữa" (tương lai)',
        examples: [
          'The train will arrive in 10 minutes.',
          'He will graduate in two years.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'in Monday', correct: 'on Monday' },
      { wrong: 'in the night', correct: 'at night' },
    ],
  },
  {
    category: 'time',
    preposition: 'on',
    rules: [
      {
        usage: 'Dùng với ngày trong tuần',
        examples: [
          'I have a meeting on Monday.',
          'We go to church on Sundays.',
        ],
        tip: 'ON dùng cho ngày cụ thể.',
      },
      {
        usage: 'Dùng với ngày tháng cụ thể',
        examples: [
          'Her birthday is on March 5th.',
          'The event is on December 25, 2025.',
        ],
      },
      {
        usage: 'Dùng với các dịp đặc biệt có chứa "day"',
        examples: [
          'What do you do on New Year\'s Day?',
          'We had a picnic on my birthday.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'on 2024', correct: 'in 2024' },
      { wrong: 'on March', correct: 'in March' },
    ],
  },
  {
    category: 'time',
    preposition: 'at',
    rules: [
      {
        usage: 'Dùng với giờ cụ thể',
        examples: [
          'The meeting starts at 9 a.m.',
          'I wake up at 6 o\'clock every day.',
        ],
        tip: 'AT dùng cho thời điểm chính xác.',
      },
      {
        usage: 'Dùng với các thời điểm đặc biệt: night, midnight, noon, dawn, sunset',
        examples: [
          'The stars are beautiful at night.',
          'We arrived at midnight.',
          'Let\'s meet at noon.',
        ],
      },
      {
        usage: 'Dùng với các kỳ nghỉ không có "day": at Christmas, at Easter, at the weekend (BrE)',
        examples: [
          'We visit our grandparents at Christmas.',
          'What are you doing at the weekend?',
        ],
        tip: 'Người Mỹ nói "on the weekend", người Anh nói "at the weekend".',
      },
    ],
    commonMistakes: [
      { wrong: 'at Monday', correct: 'on Monday' },
      { wrong: 'at the morning', correct: 'in the morning' },
    ],
  },
  {
    category: 'time',
    preposition: 'for',
    rules: [
      {
        usage: 'Dùng để diễn tả khoảng thời gian kéo dài bao lâu',
        examples: [
          'I have lived here for five years.',
          'She studied English for two hours.',
          'They waited for a long time.',
        ],
        tip: 'FOR trả lời câu hỏi "bao lâu?" (how long?).',
      },
      {
        usage: 'Dùng với thì hoàn thành để chỉ khoảng thời gian từ quá khứ đến hiện tại',
        examples: [
          'We have been friends for 10 years.',
          'He has worked here for three months.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'I have lived here since five years.', correct: 'I have lived here for five years.' },
      { wrong: 'for 2010 (chỉ mốc thời gian)', correct: 'since 2010' },
    ],
  },
  {
    category: 'time',
    preposition: 'since',
    rules: [
      {
        usage: 'Dùng để chỉ mốc thời gian bắt đầu (từ khi nào)',
        examples: [
          'I have known her since 2015.',
          'He has been sick since Monday.',
          'We have lived here since January.',
        ],
        tip: 'SINCE trả lời câu hỏi "từ khi nào?" — luôn đi kèm thì hoàn thành.',
      },
      {
        usage: 'Dùng với mệnh đề (since + S + V)',
        examples: [
          'I have been happy since I moved here.',
          'She has changed a lot since she graduated.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'since three years', correct: 'for three years' },
      { wrong: 'I know her since 2015.', correct: 'I have known her since 2015.' },
    ],
  },
  {
    category: 'time',
    preposition: 'during',
    rules: [
      {
        usage: 'Dùng để diễn tả sự việc xảy ra trong suốt một khoảng thời gian (đi với danh từ)',
        examples: [
          'I fell asleep during the movie.',
          'It rained during the night.',
          'She lived abroad during the war.',
        ],
        tip: 'DURING + danh từ (không dùng với số đếm thời gian). Muốn nói "trong 2 giờ" thì dùng FOR.',
      },
      {
        usage: 'Dùng để nhấn mạnh một thời điểm nào đó bên trong khoảng thời gian',
        examples: [
          'During the meeting, he received an urgent call.',
          'I met some interesting people during my trip.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'during two hours', correct: 'for two hours' },
      { wrong: 'during I was sleeping', correct: 'while I was sleeping' },
    ],
  },
  {
    category: 'time',
    preposition: 'by',
    rules: [
      {
        usage: 'Dùng để diễn tả hạn chót — "trước thời điểm đó" hoặc "muộn nhất là"',
        examples: [
          'Please submit the report by Friday.',
          'I will finish by 5 p.m.',
          'By the time he arrived, we had already left.',
        ],
        tip: 'BY = "không trễ hơn". Khác với BEFORE (trước thời điểm, không nhấn hạn chót).',
      },
    ],
    commonMistakes: [
      { wrong: 'by three hours (chỉ khoảng thời gian)', correct: 'in three hours / within three hours' },
      { wrong: 'I finish by yesterday.', correct: 'I finished by yesterday.' },
    ],
  },
  {
    category: 'time',
    preposition: 'until',
    rules: [
      {
        usage: 'Dùng để diễn tả hành động kéo dài đến một thời điểm nào đó rồi dừng lại',
        examples: [
          'I will wait until 6 p.m.',
          'She worked until midnight.',
          'Let\'s wait until the rain stops.',
        ],
        tip: 'UNTIL (= till) nhấn mạnh sự tiếp diễn cho đến mốc thời gian.',
      },
      {
        usage: 'Dùng trong cấu trúc "not ... until" để diễn tả "mãi đến ... mới"',
        examples: [
          'I didn\'t realize my mistake until she told me.',
          'He won\'t arrive until tomorrow.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'I will wait until 3 hours.', correct: 'I will wait for 3 hours.' },
      { wrong: 'until (dùng với hạn chót nộp bài)', correct: 'by (dùng BY khi muốn nói "hạn chót")' },
    ],
  },
  {
    category: 'time',
    preposition: 'before',
    rules: [
      {
        usage: 'Dùng để diễn tả thời điểm trước một sự kiện hoặc mốc thời gian',
        examples: [
          'I always have coffee before work.',
          'Please arrive before 8 a.m.',
          'She had never been abroad before 2020.',
        ],
        tip: 'BEFORE = trước khi. Có thể theo sau bởi danh từ hoặc mệnh đề.',
      },
      {
        usage: 'Dùng trong cấu trúc "before + V-ing"',
        examples: [
          'Wash your hands before eating.',
          'Think carefully before making a decision.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'before two days', correct: 'two days ago / two days before (that)' },
      { wrong: 'before I will leave', correct: 'before I leave' },
    ],
  },
  {
    category: 'time',
    preposition: 'after',
    rules: [
      {
        usage: 'Dùng để diễn tả thời điểm sau một sự kiện hoặc mốc thời gian',
        examples: [
          'Let\'s go for a walk after lunch.',
          'After the meeting, I went home.',
          'She felt better after a good night\'s sleep.',
        ],
        tip: 'AFTER = sau khi. Theo sau bởi danh từ, V-ing, hoặc mệnh đề.',
      },
      {
        usage: 'Dùng trong cấu trúc "after + V-ing"',
        examples: [
          'After finishing the exam, he felt relieved.',
          'She went to bed after watching the movie.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'after two days (kể từ bây giờ)', correct: 'in two days' },
      { wrong: 'after I will arrive', correct: 'after I arrive' },
    ],
  },

  // ─── PLACE PREPOSITIONS ──────────────────────────────────────────────

  {
    category: 'place',
    preposition: 'in',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí bên trong một không gian kín hoặc có ranh giới',
        examples: [
          'She is in the room.',
          'He lives in Vietnam.',
          'There is milk in the fridge.',
        ],
        tip: 'IN = bên trong. Dùng cho thành phố, quốc gia, phòng, hộp, v.v.',
      },
      {
        usage: 'Dùng với phương tiện đi lại nhỏ (ngồi bên trong): car, taxi',
        examples: [
          'She is waiting in the car.',
          'I left my phone in the taxi.',
        ],
      },
      {
        usage: 'Dùng với đường phố (BrE), hoặc khu vực',
        examples: [
          'He lives in Baker Street.',
          'There are many restaurants in this area.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'in the bus (xe buýt)', correct: 'on the bus' },
      { wrong: 'in TV', correct: 'on TV' },
    ],
  },
  {
    category: 'place',
    preposition: 'on',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí trên bề mặt',
        examples: [
          'The book is on the table.',
          'There is a picture on the wall.',
          'She sat on the floor.',
        ],
        tip: 'ON = trên bề mặt, có tiếp xúc.',
      },
      {
        usage: 'Dùng với phương tiện công cộng lớn: bus, train, plane, ship',
        examples: [
          'I met her on the bus.',
          'We had lunch on the plane.',
        ],
      },
      {
        usage: 'Dùng với tầng lầu, đường phố (AmE), và phương tiện truyền thông',
        examples: [
          'My office is on the 5th floor.',
          'She lives on Main Street.',
          'I saw it on the internet.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'on the car', correct: 'in the car' },
      { wrong: 'on the corner of the room', correct: 'in the corner of the room' },
    ],
  },
  {
    category: 'place',
    preposition: 'at',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí tại một điểm cụ thể, địa chỉ cụ thể',
        examples: [
          'I\'ll meet you at the bus stop.',
          'She works at 123 Main Street.',
          'He is at the door.',
        ],
        tip: 'AT = tại một điểm, nhấn mạnh vị trí chứ không phải bên trong.',
      },
      {
        usage: 'Dùng với nơi chốn khi nhấn mạnh hoạt động hơn vị trí vật lý',
        examples: [
          'She is at school. (đang học)',
          'He is at work. (đang làm việc)',
          'They are at home.',
        ],
        tip: 'So sánh: "at school" (đang học) vs "in the school" (ở bên trong tòa nhà trường).',
      },
    ],
    commonMistakes: [
      { wrong: 'at Vietnam', correct: 'in Vietnam' },
      { wrong: 'I arrived at home.', correct: 'I arrived home. (home là trạng từ, không cần at)' },
    ],
  },
  {
    category: 'place',
    preposition: 'above',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí cao hơn nhưng không nhất thiết ngay phía trên',
        examples: [
          'The plane flew above the clouds.',
          'The temperature is above average.',
          'There is a shelf above the desk.',
        ],
        tip: 'ABOVE = cao hơn (có thể lệch). OVER = ngay phía trên (thường trực tiếp hơn).',
      },
      {
        usage: 'Dùng trong nghĩa trừu tượng: vượt trên, hơn',
        examples: [
          'She is above suspicion.',
          'His work is above average.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'above the bridge (đi qua cầu)', correct: 'over the bridge / across the bridge' },
      { wrong: 'above 50 people (hơn 50 người)', correct: 'over 50 people / more than 50 people' },
    ],
  },
  {
    category: 'place',
    preposition: 'below',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí thấp hơn nhưng không nhất thiết ngay bên dưới',
        examples: [
          'The valley is far below us.',
          'The temperature dropped below zero.',
        ],
        tip: 'BELOW = thấp hơn. UNDER = ngay bên dưới.',
      },
      {
        usage: 'Dùng trong nghĩa trừu tượng: dưới mức',
        examples: [
          'His score is below the passing grade.',
          'The price fell below expectations.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'below the table (ngay bên dưới bàn)', correct: 'under the table' },
      { wrong: 'below the blanket', correct: 'under the blanket' },
    ],
  },
  {
    category: 'place',
    preposition: 'between',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí ở giữa HAI người hoặc vật (hoặc các nhóm riêng biệt)',
        examples: [
          'The park is between the school and the hospital.',
          'She sat between Tom and Jerry.',
          'There is a path between the two houses.',
        ],
        tip: 'BETWEEN dùng cho 2 đối tượng cụ thể. AMONG dùng cho nhóm từ 3 trở lên.',
      },
    ],
    commonMistakes: [
      { wrong: 'between the crowd', correct: 'among the crowd' },
      { wrong: 'between three countries (không phân biệt cụ thể)', correct: 'among three countries' },
    ],
  },
  {
    category: 'place',
    preposition: 'among',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí ở giữa một nhóm từ 3 trở lên (không phân biệt rõ ràng)',
        examples: [
          'She found the letter among the old papers.',
          'He was popular among his classmates.',
          'The house is hidden among the trees.',
        ],
        tip: 'AMONG = giữa đám đông, nhóm. Nhấn mạnh sự hòa lẫn.',
      },
      {
        usage: 'Dùng khi chia sẻ hoặc phân phối cho nhiều người',
        examples: [
          'The money was divided among the five children.',
          'This is a common problem among teenagers.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'among two people', correct: 'between two people' },
      { wrong: 'among you and me', correct: 'between you and me' },
    ],
  },
  {
    category: 'place',
    preposition: 'next to',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí ngay bên cạnh',
        examples: [
          'The pharmacy is next to the supermarket.',
          'She sat next to me on the bus.',
          'There is a park next to our house.',
        ],
        tip: 'NEXT TO = BESIDE = bên cạnh. Cả hai đều dùng được.',
      },
    ],
    commonMistakes: [
      { wrong: 'next of the bank', correct: 'next to the bank' },
      { wrong: 'I sat next her.', correct: 'I sat next to her.' },
    ],
  },
  {
    category: 'place',
    preposition: 'behind',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí phía sau',
        examples: [
          'The garden is behind the house.',
          'Someone is standing behind you.',
          'The sun disappeared behind the clouds.',
        ],
        tip: 'BEHIND >< IN FRONT OF: hai giới từ trái nghĩa nhau.',
      },
      {
        usage: 'Dùng trong nghĩa trừu tượng: chậm trễ, tụt hậu',
        examples: [
          'We are behind schedule.',
          'She is behind in her studies.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'behind of the building', correct: 'behind the building' },
      { wrong: 'in behind', correct: 'behind / in the back' },
    ],
  },
  {
    category: 'place',
    preposition: 'in front of',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí phía trước, đối diện mặt trước',
        examples: [
          'There is a car parked in front of the house.',
          'Don\'t stand in front of the TV.',
          'She gave a speech in front of 500 people.',
        ],
        tip: 'IN FRONT OF = phía trước (bên ngoài). Khác với IN THE FRONT OF = phía trước (bên trong).',
      },
    ],
    commonMistakes: [
      { wrong: 'in front the building', correct: 'in front of the building' },
      { wrong: 'He sat in front of the car. (ghế trước trong xe)', correct: 'He sat in the front of the car.' },
    ],
  },
  {
    category: 'place',
    preposition: 'near',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí gần, ở lân cận',
        examples: [
          'Is there a bank near here?',
          'We live near the airport.',
          'She sat near the window.',
        ],
        tip: 'NEAR = gần (khoảng cách tương đối). NEXT TO = ngay sát bên cạnh.',
      },
      {
        usage: 'Dùng trong nghĩa trừu tượng: gần đến, sắp',
        examples: [
          'The project is near completion.',
          'It was near impossible to finish on time.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'near to the station (thừa "to")', correct: 'near the station' },
      { wrong: 'near of my house', correct: 'near my house' },
    ],
  },
  {
    category: 'place',
    preposition: 'opposite',
    rules: [
      {
        usage: 'Dùng để chỉ vị trí đối diện, ở phía bên kia',
        examples: [
          'The bank is opposite the post office.',
          'She sat opposite me at the dinner table.',
          'There is a café opposite the hotel.',
        ],
        tip: 'OPPOSITE = đối diện. Không cần thêm "to" hay "of" sau opposite (giới từ).',
      },
    ],
    commonMistakes: [
      { wrong: 'opposite of the school (khi dùng như giới từ)', correct: 'opposite the school' },
      { wrong: 'in opposite', correct: 'opposite / on the opposite side' },
    ],
  },

  // ─── MOVEMENT PREPOSITIONS ───────────────────────────────────────────

  {
    category: 'movement',
    preposition: 'to',
    rules: [
      {
        usage: 'Dùng để chỉ hướng di chuyển đến một nơi',
        examples: [
          'I go to school every day.',
          'She drove to the airport.',
          'We walked to the park.',
        ],
        tip: 'TO = đến. Ngoại lệ: go home, go abroad, go downtown (không dùng TO).',
      },
      {
        usage: 'Dùng với các động từ chỉ hướng: give to, send to, speak to',
        examples: [
          'Please give this book to John.',
          'I sent an email to my manager.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'go to home', correct: 'go home' },
      { wrong: 'go to abroad', correct: 'go abroad' },
    ],
  },
  {
    category: 'movement',
    preposition: 'from',
    rules: [
      {
        usage: 'Dùng để chỉ điểm xuất phát, nguồn gốc',
        examples: [
          'I come from Vietnam.',
          'She drove from Hanoi to Ho Chi Minh City.',
          'He took the book from the shelf.',
        ],
        tip: 'FROM = từ. Thường đi cùng TO để tạo cặp from ... to ...',
      },
      {
        usage: 'Dùng để chỉ khoảng cách',
        examples: [
          'The school is 2 km from my house.',
          'We are far from the city center.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'I come from the Vietnam.', correct: 'I come from Vietnam.' },
      { wrong: 'from here to there by 5 km', correct: 'It is 5 km from here to there.' },
    ],
  },
  {
    category: 'movement',
    preposition: 'into',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động từ bên ngoài vào bên trong',
        examples: [
          'She walked into the room.',
          'He jumped into the pool.',
          'Pour the milk into the glass.',
        ],
        tip: 'INTO = đi vào bên trong (có chuyển động). IN = ở bên trong (trạng thái).',
      },
      {
        usage: 'Dùng để chỉ sự biến đổi',
        examples: [
          'The caterpillar turned into a butterfly.',
          'Translate this into English.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'She walked in the room. (nhấn mạnh chuyển động vào)', correct: 'She walked into the room.' },
      { wrong: 'I am into the office. (trạng thái)', correct: 'I am in the office.' },
    ],
  },
  {
    category: 'movement',
    preposition: 'out of',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động từ bên trong ra bên ngoài',
        examples: [
          'She walked out of the building.',
          'He took the keys out of his pocket.',
          'The cat jumped out of the box.',
        ],
        tip: 'OUT OF >< INTO: hai giới từ trái nghĩa nhau.',
      },
      {
        usage: 'Dùng trong nghĩa trừu tượng: hết, không còn',
        examples: [
          'We are out of milk.',
          'The car ran out of gas.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'out from the room', correct: 'out of the room' },
      { wrong: 'She went out the door. (thiếu of)', correct: 'She went out of the door.' },
    ],
  },
  {
    category: 'movement',
    preposition: 'through',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động xuyên qua, đi qua bên trong',
        examples: [
          'We drove through the tunnel.',
          'The ball went through the window.',
          'She walked through the park.',
        ],
        tip: 'THROUGH = xuyên qua (từ đầu này sang đầu kia, đi qua bên trong).',
      },
      {
        usage: 'Dùng trong nghĩa trừu tượng: trải qua, nhờ vào',
        examples: [
          'I learned a lot through experience.',
          'She got the job through a friend.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'We walked through the bridge.', correct: 'We walked across the bridge.' },
      { wrong: 'through the street (đi ngang qua)', correct: 'across the street' },
    ],
  },
  {
    category: 'movement',
    preposition: 'across',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động đi ngang qua bề mặt, từ bên này sang bên kia',
        examples: [
          'She walked across the street.',
          'The bridge goes across the river.',
          'He swam across the lake.',
        ],
        tip: 'ACROSS = đi ngang qua bề mặt. THROUGH = đi xuyên qua bên trong.',
      },
      {
        usage: 'Dùng để chỉ vị trí ở phía bên kia',
        examples: [
          'The store is across the street.',
          'He lives across the river from us.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'across the tunnel', correct: 'through the tunnel' },
      { wrong: 'across the forest (đi xuyên rừng)', correct: 'through the forest' },
    ],
  },
  {
    category: 'movement',
    preposition: 'along',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động dọc theo chiều dài của cái gì đó',
        examples: [
          'We walked along the river.',
          'There are trees along the road.',
          'She ran along the beach.',
        ],
        tip: 'ALONG = dọc theo. Thường dùng với đường, sông, bờ biển.',
      },
    ],
    commonMistakes: [
      { wrong: 'along the room (bên trong phòng)', correct: 'across the room / through the room' },
      { wrong: 'along to the path', correct: 'along the path' },
    ],
  },
  {
    category: 'movement',
    preposition: 'up',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động từ thấp lên cao',
        examples: [
          'She climbed up the stairs.',
          'The cat ran up the tree.',
          'Prices have gone up.',
        ],
        tip: 'UP >< DOWN: hai giới từ trái nghĩa nhau.',
      },
      {
        usage: 'Dùng để chỉ di chuyển dọc theo (hướng lên phía trước)',
        examples: [
          'He walked up the street.',
          'Go up this road and turn left.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'up to the stairs (thừa to)', correct: 'up the stairs' },
      { wrong: 'go up to abroad', correct: 'go abroad / go up north' },
    ],
  },
  {
    category: 'movement',
    preposition: 'down',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động từ cao xuống thấp',
        examples: [
          'She walked down the stairs.',
          'The ball rolled down the hill.',
          'Tears ran down her cheeks.',
        ],
        tip: 'DOWN = hướng xuống. Cũng có thể dùng để chỉ di chuyển dọc theo (hướng xa hơn).',
      },
      {
        usage: 'Dùng để chỉ di chuyển dọc theo (hướng xa hơn)',
        examples: [
          'Go down this road and you\'ll see the shop.',
          'He lives further down the street.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'down of the mountain', correct: 'down the mountain' },
      { wrong: 'go down to the stairs', correct: 'go down the stairs' },
    ],
  },
  {
    category: 'movement',
    preposition: 'towards',
    rules: [
      {
        usage: 'Dùng để chỉ hướng di chuyển tiến về phía (chưa đến nơi)',
        examples: [
          'She walked towards the door.',
          'The car is heading towards the city.',
          'He ran towards me.',
        ],
        tip: 'TOWARDS = hướng về phía (có thể chưa đến). TO = đến tận nơi.',
      },
      {
        usage: 'Dùng trong nghĩa trừu tượng: đối với, hướng tới',
        examples: [
          'Her attitude towards work is very positive.',
          'We are making progress towards our goal.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'towards to the station', correct: 'towards the station' },
      { wrong: 'I went towards home. (đã đến nhà)', correct: 'I went home. / I walked towards home. (đang trên đường)' },
    ],
  },
  {
    category: 'movement',
    preposition: 'past',
    rules: [
      {
        usage: 'Dùng để chỉ chuyển động đi ngang qua, vượt qua một điểm',
        examples: [
          'She drove past the school.',
          'He walked past me without saying hello.',
          'The bus went right past the stop.',
        ],
        tip: 'PAST = đi ngang qua (không dừng lại). Khác THROUGH (đi xuyên qua bên trong).',
      },
      {
        usage: 'Dùng để chỉ vượt quá',
        examples: [
          'It\'s past midnight.',
          'The shop is just past the traffic lights.',
        ],
      },
    ],
    commonMistakes: [
      { wrong: 'past through the park', correct: 'past the park / through the park' },
      { wrong: 'I walked passed the store.', correct: 'I walked past the store. ("past" là giới từ, "passed" là quá khứ của "pass")' },
    ],
  },
];
