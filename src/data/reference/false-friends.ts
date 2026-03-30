export interface FalseFriend {
  word: string;
  commonMistake: string;
  correctMeaning: string;
  wrongUsage: string;
  examples: { en: string; vi: string }[];
  tip: string;
}

export const FALSE_FRIENDS: FalseFriend[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    word: 'embarrassed',
    commonMistake: 'Nhầm "embarrassed" với "pregnant" (mang thai) do ảnh hưởng "embarazada" tiếng Tây Ban Nha; hoặc nhầm với "ashamed"',
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
  },
  {
    word: 'fabric',
    commonMistake: 'Nhầm "fabric" với "factory" (nhà máy) do ảnh hưởng "fábrica" tiếng Tây Ban Nha / "fabrique" tiếng Pháp',
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
  },
  {
    word: 'gift',
    commonMistake: 'Nhầm "gift" với "poison" (thuốc độc) — do trong tiếng Đức "Gift" nghĩa là thuốc độc',
    correctMeaning: 'Quà tặng; tài năng bẩm sinh',
    wrongUsage:
      'This is mainly a German false friend. Vietnamese learners may confuse "gift" with "talented" usage only.',
    examples: [
      {
        en: 'She gave me a lovely gift for my birthday.',
        vi: 'Cô ấy tặng tôi một món quà đẹp nhân sinh nhật.',
      },
      {
        en: 'He has a gift for music.',
        vi: 'Anh ấy có năng khiếu âm nhạc.',
      },
    ],
    tip: '"Gift" = quà tặng hoặc tài năng bẩm sinh. "A gifted child" = đứa trẻ tài năng.',
  },
  {
    word: 'gymnasium',
    commonMistake: 'Ở một số nước châu Âu "Gymnasium" nghĩa là trường trung học, nhưng trong tiếng Anh nghĩa khác',
    correctMeaning: 'Phòng tập thể dục, nhà thi đấu',
    wrongUsage:
      'Using "gymnasium" to mean a type of school (as in German/Nordic usage).',
    examples: [
      {
        en: 'The school has a large gymnasium.',
        vi: 'Trường có một phòng tập thể dục lớn.',
      },
      {
        en: 'We played basketball in the gymnasium.',
        vi: 'Chúng tôi chơi bóng rổ trong nhà thi đấu.',
      },
    ],
    tip: '"Gymnasium" (viết tắt: gym) = phòng tập thể dục. KHÔNG phải trường trung học.',
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    word: 'preservative',
    commonMistake: 'Nhầm "preservative" với "condom" (bao cao su) do ảnh hưởng "préservatif" tiếng Pháp',
    correctMeaning: 'Chất bảo quản (trong thực phẩm)',
    wrongUsage:
      'Confusing "preservative" (food additive) with contraceptive device (French false friend).',
    examples: [
      {
        en: 'This food contains no artificial preservatives.',
        vi: 'Thực phẩm này không chứa chất bảo quản nhân tạo.',
      },
      {
        en: 'Preservatives help food last longer.',
        vi: 'Chất bảo quản giúp thực phẩm giữ được lâu hơn.',
      },
    ],
    tip: '"Preservative" = chất bảo quản thực phẩm. Không liên quan đến nghĩa tiếng Pháp.',
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];
