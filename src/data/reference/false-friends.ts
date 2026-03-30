export interface FalseFriend {
  id: string;
  word: string;
  commonMistake: string;
  correctMeaning: string;
  wrongUsage: string;
  examples: { en: string; vi: string }[];
  tip: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
}

export const FALSE_FRIENDS: FalseFriend[] = [
  {
    id: 'actually',
    word: 'actually',
    commonMistake: 'Tưởng "actually" nghĩa là "hiện tại" (actual → actuel trong tiếng Pháp)',
    correctMeaning: 'Thực ra, thật ra (dùng để nhấn mạnh hoặc chỉnh sửa thông tin)',
    wrongUsage:
      'Using "actually" to mean "currently" — e.g., "I actually live in Hanoi" intending to say "I currently live in Hanoi".',
    examples: [
      {
        en: 'Actually, I don\'t agree with you.',
        vi: 'Thật ra, tôi không đồng ý với bạn.',
      },
      {
        en: 'She looks young, but she\'s actually 40.',
        vi: 'Cô ấy trông trẻ, nhưng thực ra cô ấy 40 tuổi.',
      },
    ],
    tip: '"Actually" = thật ra/thực ra. "Hiện tại" = currently, at present, at the moment.',
    level: 'A2',
  },
  {
    id: 'eventually',
    word: 'eventually',
    commonMistake: 'Tưởng "eventually" nghĩa là "cuối cùng thì không" hoặc nhầm với "possibly"',
    correctMeaning: 'Cuối cùng thì, rốt cuộc (sau một khoảng thời gian dài)',
    wrongUsage:
      'Using "eventually" to mean "possibly" or "maybe" — e.g., "Eventually it will rain" meaning "Maybe it will rain".',
    examples: [
      {
        en: 'After years of hard work, she eventually became a doctor.',
        vi: 'Sau nhiều năm nỗ lực, cuối cùng cô ấy đã trở thành bác sĩ.',
      },
      {
        en: 'The bus eventually arrived 30 minutes late.',
        vi: 'Cuối cùng xe buýt cũng đến, trễ 30 phút.',
      },
    ],
    tip: '"Eventually" = cuối cùng thì (chắc chắn xảy ra). "Có lẽ" = maybe, perhaps, possibly.',
    level: 'B1',
  },
  {
    id: 'sympathetic',
    word: 'sympathetic',
    commonMistake: 'Tưởng "sympathetic" nghĩa là "dễ thương, đáng mến" (sympathique trong tiếng Pháp)',
    correctMeaning: 'Thông cảm, cảm thông, đồng cảm',
    wrongUsage:
      'Using "sympathetic" to describe a likeable, nice person — e.g., "She is very sympathetic" meaning "She is very nice".',
    examples: [
      {
        en: 'She was very sympathetic when I told her about my problems.',
        vi: 'Cô ấy rất thông cảm khi tôi kể về vấn đề của mình.',
      },
      {
        en: 'The teacher was sympathetic to the student\'s situation.',
        vi: 'Giáo viên đã cảm thông với hoàn cảnh của học sinh.',
      },
    ],
    tip: '"Sympathetic" = cảm thông. "Dễ thương/đáng mến" = nice, likeable, friendly.',
    level: 'B1',
  },
  {
    id: 'sensible',
    word: 'sensible',
    commonMistake: 'Nhầm "sensible" với "sensitive" — tưởng nghĩa là "nhạy cảm"',
    correctMeaning: 'Khôn ngoan, hợp lý, thực tế',
    wrongUsage:
      'Using "sensible" to mean "sensitive" — e.g., "She is very sensible, she cries easily" meaning "She is very sensitive".',
    examples: [
      {
        en: 'That\'s a very sensible decision.',
        vi: 'Đó là một quyết định rất khôn ngoan.',
      },
      {
        en: 'Be sensible — don\'t spend all your money.',
        vi: 'Hãy thực tế — đừng tiêu hết tiền.',
      },
    ],
    tip: '"Sensible" = khôn ngoan, hợp lý. "Sensitive" = nhạy cảm.',
    level: 'B1',
  },
  {
    id: 'library',
    word: 'library',
    commonMistake: 'Nhầm "library" với "bookstore" (hiệu sách) do ảnh hưởng từ "librairie" tiếng Pháp',
    correctMeaning: 'Thư viện (nơi mượn sách, không phải nơi mua sách)',
    wrongUsage:
      'Using "library" when meaning a place to buy books — e.g., "I went to the library to buy a novel".',
    examples: [
      {
        en: 'I borrowed this book from the library.',
        vi: 'Tôi mượn cuốn sách này từ thư viện.',
      },
      {
        en: 'The city library has over 100,000 books.',
        vi: 'Thư viện thành phố có hơn 100.000 cuốn sách.',
      },
    ],
    tip: '"Library" = thư viện (mượn sách). "Bookstore/bookshop" = hiệu sách (mua sách).',
    level: 'A2',
  },
  {
    id: 'comprehensive',
    word: 'comprehensive',
    commonMistake: 'Nhầm "comprehensive" với "understanding" hoặc "comprehensible" (dễ hiểu)',
    correctMeaning: 'Toàn diện, bao quát, đầy đủ',
    wrongUsage:
      'Using "comprehensive" to mean "understandable" — e.g., "The instructions are very comprehensive" meaning "easy to understand".',
    examples: [
      {
        en: 'The report provides a comprehensive analysis of the problem.',
        vi: 'Báo cáo cung cấp một phân tích toàn diện về vấn đề.',
      },
      {
        en: 'We need a comprehensive plan.',
        vi: 'Chúng ta cần một kế hoạch toàn diện.',
      },
    ],
    tip: '"Comprehensive" = toàn diện. "Dễ hiểu" = comprehensible, understandable.',
    level: 'B2',
  },
  {
    id: 'argument',
    word: 'argument',
    commonMistake: 'Tưởng "argument" chỉ nghĩa là "lý lẽ, luận điểm", bỏ qua nghĩa "cuộc cãi nhau"',
    correctMeaning: 'Cuộc tranh cãi, cuộc cãi nhau; cũng có nghĩa là luận điểm, lý lẽ',
    wrongUsage:
      'Not realizing "argument" commonly means a heated disagreement, not just a logical point.',
    examples: [
      {
        en: 'They had a big argument about money.',
        vi: 'Họ đã cãi nhau to về tiền bạc.',
      },
      {
        en: 'Her argument was very convincing.',
        vi: 'Luận điểm của cô ấy rất thuyết phục.',
      },
    ],
    tip: '"Argument" = cuộc cãi nhau HOẶC luận điểm. Phân biệt theo ngữ cảnh.',
    level: 'B1',
  },
  {
    id: 'assist',
    word: 'assist',
    commonMistake: 'Nhầm "assist" với "attend" — tưởng "assist" nghĩa là "tham dự"',
    correctMeaning: 'Hỗ trợ, giúp đỡ',
    wrongUsage:
      'Using "assist" to mean "attend" — e.g., "I will assist the meeting" meaning "I will attend the meeting".',
    examples: [
      {
        en: 'Can you assist me with this task?',
        vi: 'Bạn có thể hỗ trợ tôi với nhiệm vụ này không?',
      },
      {
        en: 'The nurse assisted the doctor during the surgery.',
        vi: 'Y tá đã hỗ trợ bác sĩ trong ca phẫu thuật.',
      },
    ],
    tip: '"Assist" = giúp đỡ. "Tham dự" = attend.',
    level: 'A2',
  },
  {
    id: 'attend',
    word: 'attend',
    commonMistake: 'Nhầm "attend" với "wait" (chờ đợi) do ảnh hưởng "attendre" tiếng Pháp',
    correctMeaning: 'Tham dự, có mặt tại',
    wrongUsage:
      'Using "attend" to mean "wait" — e.g., "Please attend for me" meaning "Please wait for me".',
    examples: [
      {
        en: 'Over 500 people attended the conference.',
        vi: 'Hơn 500 người đã tham dự hội nghị.',
      },
      {
        en: 'Will you attend the wedding?',
        vi: 'Bạn sẽ tham dự đám cưới chứ?',
      },
    ],
    tip: '"Attend" = tham dự. "Chờ đợi" = wait. "Chú ý" = pay attention.',
    level: 'A2',
  },
  {
    id: 'biscuit',
    word: 'biscuit',
    commonMistake: 'Nhầm "biscuit" Anh-Anh và "biscuit" Anh-Mỹ — nghĩa khác nhau',
    correctMeaning: 'Bánh quy (Anh-Anh); bánh mì mềm (Anh-Mỹ)',
    wrongUsage:
      'Confusing British "biscuit" (cookie/cracker) with American "biscuit" (soft bread roll).',
    examples: [
      {
        en: 'Would you like a biscuit with your tea? (British)',
        vi: 'Bạn muốn ăn bánh quy với trà không? (Anh-Anh)',
      },
      {
        en: 'The biscuits and gravy are delicious. (American)',
        vi: 'Bánh mì mềm với nước sốt rất ngon. (Anh-Mỹ)',
      },
    ],
    tip: 'Anh-Anh: biscuit = bánh quy. Anh-Mỹ: biscuit = bánh mì mềm, cookie = bánh quy.',
    level: 'A2',
  },
  {
    id: 'chef',
    word: 'chef',
    commonMistake: 'Nhầm "chef" với "chief" (lãnh đạo, trưởng nhóm)',
    correctMeaning: 'Đầu bếp (trưởng)',
    wrongUsage:
      'Using "chef" to mean "boss" or "leader" — influenced by "chef" in French meaning "boss".',
    examples: [
      {
        en: 'The chef prepared a wonderful meal.',
        vi: 'Đầu bếp đã chuẩn bị một bữa ăn tuyệt vời.',
      },
      {
        en: 'She works as a chef at a French restaurant.',
        vi: 'Cô ấy làm đầu bếp tại một nhà hàng Pháp.',
      },
    ],
    tip: '"Chef" = đầu bếp. "Sếp/lãnh đạo" = chief, boss, leader.',
    level: 'A2',
  },
  {
    id: 'college',
    word: 'college',
    commonMistake: 'Nhầm "college" với "high school" (trường trung học)',
    correctMeaning: 'Trường cao đẳng / đại học (tùy quốc gia)',
    wrongUsage:
      'Using "college" to refer to secondary school / high school — e.g., "My son is in college" meaning "My son is in high school".',
    examples: [
      {
        en: 'She went to college to study business.',
        vi: 'Cô ấy vào đại học để học kinh doanh.',
      },
      {
        en: 'He graduated from college last year.',
        vi: 'Anh ấy tốt nghiệp đại học năm ngoái.',
      },
    ],
    tip: '"College" = trường cao đẳng/đại học. "Trường trung học" = high school / secondary school.',
    level: 'A2',
  },
  {
    id: 'conductor',
    word: 'conductor',
    commonMistake: 'Chỉ biết nghĩa "người soát vé", bỏ qua nghĩa "nhạc trưởng"',
    correctMeaning: 'Nhạc trưởng; người soát vé (xe buýt/tàu); vật dẫn (điện/nhiệt)',
    wrongUsage:
      'Not recognizing that "conductor" commonly means "orchestra conductor" in music context.',
    examples: [
      {
        en: 'The conductor raised his baton to begin the symphony.',
        vi: 'Nhạc trưởng nâng đũa chỉ huy để bắt đầu bản giao hưởng.',
      },
      {
        en: 'Copper is a good conductor of electricity.',
        vi: 'Đồng là chất dẫn điện tốt.',
      },
    ],
    tip: '"Conductor" = nhạc trưởng (âm nhạc), người soát vé (giao thông), vật dẫn (vật lý). Phân biệt theo ngữ cảnh.',
    level: 'B1',
  },
  {
    id: 'confident',
    word: 'confident',
    commonMistake: 'Nhầm "confident" với "confidential" (bí mật)',
    correctMeaning: 'Tự tin',
    wrongUsage:
      'Confusing "confident" (self-assured) with "confidential" (secret/private).',
    examples: [
      {
        en: 'She is a confident speaker.',
        vi: 'Cô ấy là một diễn giả tự tin.',
      },
      {
        en: 'I\'m confident that we will succeed.',
        vi: 'Tôi tự tin rằng chúng ta sẽ thành công.',
      },
    ],
    tip: '"Confident" = tự tin. "Confidential" = bí mật, mật.',
    level: 'A2',
  },
  {
    id: 'decade',
    word: 'decade',
    commonMistake: 'Nhầm "decade" với "decayed" hoặc tưởng nó liên quan đến "10 tháng"',
    correctMeaning: 'Thập kỷ (10 năm)',
    wrongUsage:
      'Not realizing a decade means exactly 10 years, or confusing it with other time periods.',
    examples: [
      {
        en: 'The company has been growing for the past decade.',
        vi: 'Công ty đã phát triển trong suốt thập kỷ qua.',
      },
      {
        en: 'Fashion changes every decade.',
        vi: 'Thời trang thay đổi mỗi thập kỷ.',
      },
    ],
    tip: '"Decade" = 10 năm. "Century" = 100 năm. "Millennium" = 1000 năm.',
    level: 'A2',
  },
  {
    id: 'demand',
    word: 'demand',
    commonMistake: 'Nhầm "demand" với "ask" hoặc "request" — không biết "demand" mạnh hơn nhiều',
    correctMeaning: 'Yêu cầu (một cách mạnh mẽ, quyết liệt); nhu cầu',
    wrongUsage:
      'Using "demand" in polite situations where "ask" or "request" would be appropriate.',
    examples: [
      {
        en: 'The workers demanded higher wages.',
        vi: 'Công nhân yêu cầu lương cao hơn.',
      },
      {
        en: 'There is a high demand for teachers.',
        vi: 'Nhu cầu giáo viên rất cao.',
      },
    ],
    tip: '"Demand" rất mạnh, gần như ra lệnh. Lịch sự hơn: ask, request. Nhu cầu thị trường cũng dùng "demand".',
    level: 'B1',
  },
  {
    id: 'embarrassed',
    word: 'embarrassed',
    commonMistake: 'Nhầm "embarrassed" với "ashamed" — dùng quá mạnh hoặc nhầm sắc thái',
    correctMeaning: 'Xấu hổ, ngượng ngùng (nhẹ hơn "ashamed")',
    wrongUsage:
      'Confusing "embarrassed" (awkward/uncomfortable) with "ashamed" (deep shame), or using it too strongly.',
    examples: [
      {
        en: 'I was so embarrassed when I forgot her name.',
        vi: 'Tôi rất ngượng khi quên tên cô ấy.',
      },
      {
        en: 'Don\'t be embarrassed — everyone makes mistakes.',
        vi: 'Đừng ngại — ai cũng mắc lỗi.',
      },
    ],
    tip: '"Embarrassed" = ngượng, xấu hổ (nhẹ). "Ashamed" = xấu hổ (nặng, về đạo đức).',
    level: 'B1',
  },
  {
    id: 'fabric',
    word: 'fabric',
    commonMistake: 'Nhầm "fabric" với "factory" (nhà máy) do phát âm gần giống',
    correctMeaning: 'Vải, chất liệu vải',
    wrongUsage:
      'Using "fabric" to mean "factory" — e.g., "He works in a fabric" meaning "He works in a factory".',
    examples: [
      {
        en: 'This fabric is very soft.',
        vi: 'Loại vải này rất mềm.',
      },
      {
        en: 'The dress is made from a beautiful silk fabric.',
        vi: 'Chiếc váy được làm từ loại vải lụa đẹp.',
      },
    ],
    tip: '"Fabric" = vải. "Nhà máy" = factory.',
    level: 'B1',
  },
  {
    id: 'introduce',
    word: 'introduce',
    commonMistake: 'Người Việt hay dùng "introduce" khi muốn nói "giới thiệu sản phẩm/nội dung" thay vì "giới thiệu người"',
    correctMeaning: 'Giới thiệu (người với người); đưa ra, trình bày (ý tưởng, sản phẩm mới)',
    wrongUsage:
      'Using "introduce" for presenting content — e.g., "Let me introduce about our company" instead of "Let me tell you about our company".',
    examples: [
      {
        en: 'Let me introduce you to my colleague.',
        vi: 'Để tôi giới thiệu bạn với đồng nghiệp của tôi.',
      },
      {
        en: 'The company introduced a new product last month.',
        vi: 'Công ty đã giới thiệu sản phẩm mới tháng trước.',
      },
    ],
    tip: '"Introduce" + người: giới thiệu ai. Không nói "introduce about" — dùng "tell about" hoặc "present".',
    level: 'A2',
  },
  {
    id: 'magazine',
    word: 'magazine',
    commonMistake: 'Nhầm "magazine" với "store/warehouse" (cửa hàng/kho) do ảnh hưởng "magasin" tiếng Pháp',
    correctMeaning: 'Tạp chí',
    wrongUsage:
      'Using "magazine" to mean "shop" or "store" — e.g., "I went to the magazine to buy clothes".',
    examples: [
      {
        en: 'She reads fashion magazines every week.',
        vi: 'Cô ấy đọc tạp chí thời trang mỗi tuần.',
      },
      {
        en: 'The magazine published an article about Vietnam.',
        vi: 'Tạp chí đã đăng một bài viết về Việt Nam.',
      },
    ],
    tip: '"Magazine" = tạp chí. "Cửa hàng" = store, shop.',
    level: 'A2',
  },
  {
    id: 'novel',
    word: 'novel',
    commonMistake: 'Nhầm "novel" (danh từ) với "new" (mới) vì "novel" cũng có nghĩa tính từ là "mới lạ"',
    correctMeaning: 'Tiểu thuyết (danh từ); mới lạ, độc đáo (tính từ)',
    wrongUsage:
      'Using "novel" as a simple adjective meaning "new" instead of "innovative/original".',
    examples: [
      {
        en: 'She wrote a bestselling novel.',
        vi: 'Cô ấy viết một cuốn tiểu thuyết bán chạy nhất.',
      },
      {
        en: 'That\'s a novel approach to the problem.',
        vi: 'Đó là một cách tiếp cận mới lạ cho vấn đề.',
      },
    ],
    tip: '"Novel" (n.) = tiểu thuyết. "Novel" (adj.) = mới lạ, sáng tạo (KHÔNG phải "new" thông thường).',
    level: 'B1',
  },
  {
    id: 'parents',
    word: 'parents',
    commonMistake: 'Nhầm "parents" với "relatives" (họ hàng)',
    correctMeaning: 'Bố mẹ, cha mẹ (chỉ 2 người: bố và mẹ)',
    wrongUsage:
      'Using "parents" to mean "relatives" or "extended family" — e.g., "All my parents came to the party" meaning all relatives.',
    examples: [
      {
        en: 'My parents live in Ho Chi Minh City.',
        vi: 'Bố mẹ tôi sống ở Thành phố Hồ Chí Minh.',
      },
      {
        en: 'Her parents are both teachers.',
        vi: 'Bố mẹ cô ấy đều là giáo viên.',
      },
    ],
    tip: '"Parents" = chỉ bố mẹ. "Họ hàng" = relatives. "Gia đình" = family.',
    level: 'A1',
  },
  {
    id: 'physician',
    word: 'physician',
    commonMistake: 'Nhầm "physician" với "physicist" (nhà vật lý)',
    correctMeaning: 'Bác sĩ (nội khoa)',
    wrongUsage:
      'Confusing "physician" (medical doctor) with "physicist" (scientist studying physics).',
    examples: [
      {
        en: 'You should see a physician if the pain continues.',
        vi: 'Bạn nên gặp bác sĩ nếu cơn đau tiếp tục.',
      },
      {
        en: 'She is a physician at the local hospital.',
        vi: 'Cô ấy là bác sĩ tại bệnh viện địa phương.',
      },
    ],
    tip: '"Physician" = bác sĩ. "Physicist" = nhà vật lý. "Pharmacist" = dược sĩ.',
    level: 'B1',
  },
  {
    id: 'economic-economical',
    word: 'economic / economical',
    commonMistake: 'Người Việt thường nhầm "economic" (thuộc kinh tế) với "economical" (tiết kiệm)',
    correctMeaning: '"Economic" = thuộc về kinh tế. "Economical" = tiết kiệm, không lãng phí',
    wrongUsage:
      'Using "economic" when meaning "cheap/saving money" — e.g., "This car is very economic" instead of "This car is very economical".',
    examples: [
      {
        en: 'The country is facing an economic crisis.',
        vi: 'Đất nước đang đối mặt với khủng hoảng kinh tế.',
      },
      {
        en: 'This car is very economical — it uses little fuel.',
        vi: 'Xe này rất tiết kiệm — tốn ít xăng.',
      },
    ],
    tip: '"Economic" = thuộc kinh tế (economic growth). "Economical" = tiết kiệm (economical car).',
    level: 'B1',
  },
  {
    id: 'professor',
    word: 'professor',
    commonMistake: 'Dùng "professor" cho mọi giáo viên — không biết đây là chức danh cao',
    correctMeaning: 'Giáo sư (chức danh học thuật cao nhất ở đại học)',
    wrongUsage:
      'Calling any teacher "professor" — e.g., "My English professor" when referring to a regular school teacher.',
    examples: [
      {
        en: 'Professor Nguyen teaches biology at the university.',
        vi: 'Giáo sư Nguyễn dạy sinh học tại đại học.',
      },
      {
        en: 'She became a full professor at age 40.',
        vi: 'Bà ấy trở thành giáo sư chính thức năm 40 tuổi.',
      },
    ],
    tip: '"Professor" = giáo sư đại học (chức danh cao). "Giáo viên" = teacher. "Giảng viên" = lecturer, instructor.',
    level: 'B1',
  },
  {
    id: 'realize',
    word: 'realize',
    commonMistake: 'Nhầm "realize" với "carry out / make real" (thực hiện) — chỉ nghĩ đến nghĩa "thực hiện hóa"',
    correctMeaning: 'Nhận ra, ý thức được; cũng có nghĩa hiện thực hóa (ít dùng hơn)',
    wrongUsage:
      'Using "realize" mainly to mean "make something real" instead of the more common meaning "become aware of".',
    examples: [
      {
        en: 'I didn\'t realize you were waiting for me.',
        vi: 'Tôi không nhận ra bạn đang chờ tôi.',
      },
      {
        en: 'She suddenly realized that she had left her phone at home.',
        vi: 'Cô ấy đột nhiên nhận ra rằng mình đã để quên điện thoại ở nhà.',
      },
    ],
    tip: '"Realize" thường = nhận ra, ý thức được. "Thực hiện" = carry out, implement, fulfill.',
    level: 'B1',
  },
  {
    id: 'resume',
    word: 'resume',
    commonMistake: 'Nhầm "resume" (tiếp tục) với "résumé" (sơ yếu lý lịch) — cùng cách viết nhưng nghĩa khác',
    correctMeaning: 'Tiếp tục (lại) sau khi gián đoạn; résumé = sơ yếu lý lịch',
    wrongUsage:
      'Confusing "resume" (to continue) with "résumé" (CV). Also, pronouncing them the same way.',
    examples: [
      {
        en: 'The meeting will resume after lunch.',
        vi: 'Cuộc họp sẽ tiếp tục sau bữa trưa.',
      },
      {
        en: 'Please send your résumé to the HR department.',
        vi: 'Vui lòng gửi sơ yếu lý lịch đến phòng nhân sự.',
      },
    ],
    tip: '"Resume" /rɪˈzjuːm/ = tiếp tục. "Résumé" /ˈrezjumeɪ/ = CV, sơ yếu lý lịch. Chú ý dấu accent và cách phát âm.',
    level: 'B2',
  },
  {
    id: 'camp',
    word: 'camp',
    commonMistake: 'Nhầm "camp" chỉ có nghĩa "trại" (military camp), không biết nghĩa "cắm trại" và các nghĩa mở rộng',
    correctMeaning: 'Trại (quân sự, hè...); cắm trại; phe, nhóm',
    wrongUsage:
      'Only knowing "camp" as a military camp, not realizing it means camping, summer camp, or figuratively a group/faction.',
    examples: [
      {
        en: 'We went camping in the mountains last summer.',
        vi: 'Chúng tôi đi cắm trại ở núi mùa hè năm ngoái.',
      },
      {
        en: 'The children had a great time at summer camp.',
        vi: 'Bọn trẻ đã có khoảng thời gian tuyệt vời ở trại hè.',
      },
    ],
    tip: '"Camp" = trại (summer camp, refugee camp), cắm trại (go camping). Cũng có nghĩa bóng: phe, nhóm.',
    level: 'A2',
  },
  {
    id: 'scholar',
    word: 'scholar',
    commonMistake: 'Nhầm "scholar" với "student" (học sinh/sinh viên)',
    correctMeaning: 'Học giả, nhà nghiên cứu (người có kiến thức sâu rộng)',
    wrongUsage:
      'Using "scholar" to mean any student — e.g., "There are 30 scholars in my class" meaning "30 students".',
    examples: [
      {
        en: 'He is a respected scholar in the field of linguistics.',
        vi: 'Ông ấy là một học giả được kính trọng trong lĩnh vực ngôn ngữ học.',
      },
      {
        en: 'The scholar published many research papers.',
        vi: 'Nhà nghiên cứu đã xuất bản nhiều bài báo khoa học.',
      },
    ],
    tip: '"Scholar" = học giả, nhà nghiên cứu. "Học sinh" = student, pupil. "Scholarship" = học bổng.',
    level: 'B2',
  },
  {
    id: 'information',
    word: 'information',
    commonMistake: 'Người Việt hay nói "informations" (thêm s) — nhưng đây là danh từ không đếm được',
    correctMeaning: 'Thông tin (danh từ không đếm được, không có dạng số nhiều)',
    wrongUsage:
      'Adding "s" to make it plural — e.g., "I need some informations" instead of "I need some information".',
    examples: [
      {
        en: 'Can you give me some information about the course?',
        vi: 'Bạn có thể cho tôi thông tin về khóa học không?',
      },
      {
        en: 'This is a useful piece of information.',
        vi: 'Đây là một thông tin hữu ích.',
      },
    ],
    tip: '"Information" KHÔNG bao giờ thêm "s". Dùng "a piece of information" cho 1 thông tin. Tương tự: advice, furniture, luggage.',
    level: 'A1',
  },
];
