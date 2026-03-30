import type { MultiMeaningWord } from '../features/word-usage/models';

export const MULTI_MEANING_SEEDS: MultiMeaningWord[] = [
  {
    word: 'run',
    ipa: '/rʌn/',
    totalSenses: 6,
    senses: [
      {
        id: 'run-v-1', partOfSpeech: 'verb', meaning: 'chạy, di chuyển nhanh', meaningEn: 'to move quickly on foot',
        frequency: 1, examples: [
          { sentence: 'She runs every morning before work.', translation: 'Cô ấy chạy bộ mỗi sáng trước khi đi làm.', highlight: 'runs' },
          { sentence: 'The children ran across the field.', translation: 'Bọn trẻ chạy qua cánh đồng.', highlight: 'ran' },
        ],
        collocations: ['run fast', 'run a marathon', 'run away'],
      },
      {
        id: 'run-v-2', partOfSpeech: 'verb', meaning: 'điều hành, quản lý', meaningEn: 'to manage or operate',
        frequency: 1, register: 'formal', examples: [
          { sentence: 'He runs a small restaurant downtown.', translation: 'Anh ấy điều hành một nhà hàng nhỏ ở trung tâm.', highlight: 'runs' },
        ],
        collocations: ['run a business', 'run a company', 'run a team'],
      },
      {
        id: 'run-v-3', partOfSpeech: 'verb', meaning: 'chạy, vận hành (máy móc)', meaningEn: 'to function or operate (machine/software)',
        frequency: 2, register: 'technical', examples: [
          { sentence: 'This app runs smoothly on my phone.', translation: 'App này chạy mượt trên điện thoại tôi.', highlight: 'runs' },
        ],
        collocations: ['run a program', 'run smoothly'],
      },
      {
        id: 'run-n-1', partOfSpeech: 'noun', meaning: 'cuộc chạy, đợt chạy', meaningEn: 'an act of running',
        frequency: 2, examples: [
          { sentence: 'I went for a run this morning.', translation: 'Tôi đi chạy bộ sáng nay.', highlight: 'run' },
        ],
      },
      {
        id: 'run-n-2', partOfSpeech: 'noun', meaning: 'chuỗi liên tiếp, đợt', meaningEn: 'a continuous series or sequence',
        frequency: 3, examples: [
          { sentence: 'The team is on a winning run.', translation: 'Đội đang trong chuỗi chiến thắng.', highlight: 'run' },
        ],
      },
      {
        id: 'run-v-4', partOfSpeech: 'verb', meaning: 'chảy (nước, chất lỏng)', meaningEn: 'to flow (liquid)',
        frequency: 2, examples: [
          { sentence: 'Tears ran down her face.', translation: 'Nước mắt chảy dài trên mặt cô ấy.', highlight: 'ran' },
        ],
      },
    ],
    tips: '💡 "run" làm verb phổ biến nhất = chạy. "run a business" = điều hành (không phải chạy!). Làm noun = cuộc chạy/đợt.',
  },
  {
    word: 'break',
    ipa: '/breɪk/',
    totalSenses: 5,
    senses: [
      {
        id: 'break-v-1', partOfSpeech: 'verb', meaning: 'làm vỡ, phá hỏng', meaningEn: 'to separate into pieces by force',
        frequency: 1, examples: [
          { sentence: 'Be careful not to break the glass.', translation: 'Cẩn thận đừng làm vỡ ly.', highlight: 'break' },
        ],
        collocations: ['break a window', 'break a record'],
      },
      {
        id: 'break-n-1', partOfSpeech: 'noun', meaning: 'giờ nghỉ, khoảng nghỉ', meaningEn: 'a pause or rest',
        frequency: 1, examples: [
          { sentence: "Let's take a short break.", translation: 'Nghỉ giải lao một chút nhé.', highlight: 'break' },
        ],
        collocations: ['take a break', 'lunch break', 'coffee break'],
      },
      {
        id: 'break-v-2', partOfSpeech: 'verb', meaning: 'vi phạm, phá vỡ (quy tắc)', meaningEn: 'to fail to observe a rule or agreement',
        frequency: 2, register: 'formal', examples: [
          { sentence: 'He broke the law and was arrested.', translation: 'Anh ta vi phạm pháp luật và bị bắt.', highlight: 'broke' },
        ],
        collocations: ['break the law', 'break a promise', 'break the rules'],
      },
      {
        id: 'break-v-3', partOfSpeech: 'verb', meaning: 'bẻ gãy, đứt (xương)', meaningEn: 'to fracture a bone',
        frequency: 2, examples: [
          { sentence: 'She broke her arm while skiing.', translation: 'Cô ấy gãy tay khi trượt tuyết.', highlight: 'broke' },
        ],
      },
      {
        id: 'break-n-2', partOfSpeech: 'noun', meaning: 'cơ hội lớn, bước ngoặt', meaningEn: 'a lucky opportunity',
        frequency: 3, register: 'informal', examples: [
          { sentence: 'This job could be his big break.', translation: 'Công việc này có thể là bước ngoặt lớn của anh ấy.', highlight: 'break' },
        ],
      },
    ],
    tips: '💡 "break" = vỡ/gãy là nghĩa gốc. "take a break" = nghỉ ngơi. "break a rule" = vi phạm.',
  },
  {
    word: 'set',
    ipa: '/set/',
    totalSenses: 5,
    senses: [
      {
        id: 'set-v-1', partOfSpeech: 'verb', meaning: 'đặt, để', meaningEn: 'to put something in a specified place',
        frequency: 1, examples: [
          { sentence: 'She set the book on the table.', translation: 'Cô ấy đặt cuốn sách lên bàn.', highlight: 'set' },
        ],
      },
      {
        id: 'set-v-2', partOfSpeech: 'verb', meaning: 'cài đặt, thiết lập', meaningEn: 'to adjust or establish',
        frequency: 1, examples: [
          { sentence: 'Please set the alarm for 7 AM.', translation: 'Hãy cài báo thức lúc 7 giờ sáng.', highlight: 'set' },
        ],
        collocations: ['set a goal', 'set a timer', 'set a date'],
      },
      {
        id: 'set-n-1', partOfSpeech: 'noun', meaning: 'bộ, tập hợp', meaningEn: 'a group of related things',
        frequency: 1, examples: [
          { sentence: 'I bought a new set of tools.', translation: 'Tôi mua một bộ dụng cụ mới.', highlight: 'set' },
        ],
        collocations: ['a set of', 'data set', 'skill set'],
      },
      {
        id: 'set-v-3', partOfSpeech: 'verb', meaning: 'lặn (mặt trời)', meaningEn: 'to go below the horizon (sun)',
        frequency: 2, examples: [
          { sentence: 'The sun sets at 6 PM today.', translation: 'Mặt trời lặn lúc 6 giờ chiều hôm nay.', highlight: 'sets' },
        ],
      },
      {
        id: 'set-adj-1', partOfSpeech: 'adjective', meaning: 'cố định, đã sắp xếp', meaningEn: 'fixed or arranged in advance',
        frequency: 2, examples: [
          { sentence: 'The meeting is at a set time.', translation: 'Cuộc họp vào giờ cố định.', highlight: 'set' },
        ],
      },
    ],
    tips: '💡 "set" rất đa nghĩa! Verb = đặt/cài đặt/lặn. Noun = bộ/tập hợp. Adj = cố định.',
  },
  {
    word: 'light',
    ipa: '/laɪt/',
    totalSenses: 5,
    senses: [
      {
        id: 'light-n-1', partOfSpeech: 'noun', meaning: 'ánh sáng', meaningEn: 'the natural brightness from the sun or lamps',
        frequency: 1, examples: [
          { sentence: 'The room was filled with natural light.', translation: 'Căn phòng tràn ngập ánh sáng tự nhiên.', highlight: 'light' },
        ],
        collocations: ['natural light', 'sunlight', 'traffic light'],
      },
      {
        id: 'light-adj-1', partOfSpeech: 'adjective', meaning: 'nhẹ (trọng lượng)', meaningEn: 'not heavy in weight',
        frequency: 1, examples: [
          { sentence: 'This bag is very light.', translation: 'Cái túi này rất nhẹ.', highlight: 'light' },
        ],
      },
      {
        id: 'light-adj-2', partOfSpeech: 'adjective', meaning: 'sáng, nhạt (màu)', meaningEn: 'pale in color',
        frequency: 2, examples: [
          { sentence: 'She wore a light blue dress.', translation: 'Cô ấy mặc váy xanh nhạt.', highlight: 'light' },
        ],
        collocations: ['light blue', 'light green'],
      },
      {
        id: 'light-v-1', partOfSpeech: 'verb', meaning: 'thắp, bật sáng', meaningEn: 'to make something start burning or shining',
        frequency: 2, examples: [
          { sentence: 'He lit a candle in the dark room.', translation: 'Anh ấy thắp nến trong phòng tối.', highlight: 'lit' },
        ],
      },
      {
        id: 'light-adj-3', partOfSpeech: 'adjective', meaning: 'nhẹ nhàng, không nghiêm trọng', meaningEn: 'not serious or intense',
        frequency: 2, examples: [
          { sentence: 'We had a light conversation over coffee.', translation: 'Chúng tôi trò chuyện nhẹ nhàng bên cà phê.', highlight: 'light' },
        ],
      },
    ],
    tips: '💡 "light" noun = ánh sáng. Adj = nhẹ/sáng/nhạt. Verb = thắp sáng. "light conversation" = chuyện phiếm.',
  },
  {
    word: 'point',
    ipa: '/pɔɪnt/',
    totalSenses: 5,
    senses: [
      {
        id: 'point-n-1', partOfSpeech: 'noun', meaning: 'điểm, ý chính', meaningEn: 'the main idea or purpose',
        frequency: 1, examples: [
          { sentence: "What's the point of this meeting?", translation: 'Mục đích cuộc họp này là gì?', highlight: 'point' },
        ],
        collocations: ['the point is', 'make a point', 'good point'],
      },
      {
        id: 'point-n-2', partOfSpeech: 'noun', meaning: 'điểm số', meaningEn: 'a unit of scoring',
        frequency: 1, examples: [
          { sentence: 'Our team scored 3 points.', translation: 'Đội chúng tôi ghi được 3 điểm.', highlight: 'points' },
        ],
      },
      {
        id: 'point-v-1', partOfSpeech: 'verb', meaning: 'chỉ, trỏ', meaningEn: 'to direct attention by extending a finger',
        frequency: 1, examples: [
          { sentence: 'She pointed at the map.', translation: 'Cô ấy chỉ vào bản đồ.', highlight: 'pointed' },
        ],
        collocations: ['point at', 'point out', 'point to'],
      },
      {
        id: 'point-n-3', partOfSpeech: 'noun', meaning: 'đầu nhọn, mũi', meaningEn: 'the sharp end of something',
        frequency: 2, examples: [
          { sentence: 'The point of the needle was very sharp.', translation: 'Đầu kim rất nhọn.', highlight: 'point' },
        ],
      },
      {
        id: 'point-n-4', partOfSpeech: 'noun', meaning: 'thời điểm', meaningEn: 'a particular moment in time',
        frequency: 2, examples: [
          { sentence: 'At that point, I decided to leave.', translation: 'Vào lúc đó, tôi quyết định rời đi.', highlight: 'point' },
        ],
      },
    ],
    tips: '💡 "point" = ý chính/mục đích (phổ biến nhất). "point at" = chỉ tay. "at this point" = vào lúc này.',
  },
  {
    word: 'play',
    ipa: '/pleɪ/',
    totalSenses: 4,
    senses: [
      {
        id: 'play-v-1', partOfSpeech: 'verb', meaning: 'chơi, vui chơi', meaningEn: 'to engage in games or fun activities',
        frequency: 1, examples: [
          { sentence: 'The kids are playing in the garden.', translation: 'Bọn trẻ đang chơi trong vườn.', highlight: 'playing' },
        ],
        collocations: ['play a game', 'play with friends'],
      },
      {
        id: 'play-v-2', partOfSpeech: 'verb', meaning: 'chơi (nhạc cụ), phát (nhạc)', meaningEn: 'to perform music or produce sound',
        frequency: 1, examples: [
          { sentence: 'She plays the piano beautifully.', translation: 'Cô ấy chơi piano rất hay.', highlight: 'plays' },
        ],
        collocations: ['play the guitar', 'play music', 'play a song'],
      },
      {
        id: 'play-n-1', partOfSpeech: 'noun', meaning: 'vở kịch', meaningEn: 'a dramatic work for the theater',
        frequency: 2, examples: [
          { sentence: 'We saw a play at the theater last night.', translation: 'Tối qua chúng tôi xem vở kịch ở nhà hát.', highlight: 'play' },
        ],
      },
      {
        id: 'play-v-3', partOfSpeech: 'verb', meaning: 'đóng vai', meaningEn: 'to act a role in a movie or play',
        frequency: 2, examples: [
          { sentence: 'He played the villain in the movie.', translation: 'Anh ấy đóng vai phản diện trong phim.', highlight: 'played' },
        ],
        collocations: ['play a role', 'play a part'],
      },
    ],
    tips: '💡 "play" + game/sport = chơi. "play" + nhạc cụ = chơi đàn. "play" noun = vở kịch.',
  },
  {
    word: 'match',
    ipa: '/mætʃ/',
    totalSenses: 4,
    senses: [
      {
        id: 'match-n-1', partOfSpeech: 'noun', meaning: 'trận đấu', meaningEn: 'a sports contest',
        frequency: 1, examples: [
          { sentence: 'Did you watch the football match?', translation: 'Bạn có xem trận bóng đá không?', highlight: 'match' },
        ],
        collocations: ['football match', 'tennis match'],
      },
      {
        id: 'match-v-1', partOfSpeech: 'verb', meaning: 'phù hợp, khớp', meaningEn: 'to be equal or similar to',
        frequency: 1, examples: [
          { sentence: 'Your shirt matches your shoes.', translation: 'Áo bạn hợp với giày.', highlight: 'matches' },
        ],
        collocations: ['match perfectly', 'match with'],
      },
      {
        id: 'match-n-2', partOfSpeech: 'noun', meaning: 'que diêm', meaningEn: 'a small stick used to light fire',
        frequency: 2, examples: [
          { sentence: 'He struck a match to light the fire.', translation: 'Anh ấy quẹt que diêm để nhóm lửa.', highlight: 'match' },
        ],
      },
      {
        id: 'match-n-3', partOfSpeech: 'noun', meaning: 'đối thủ ngang tầm', meaningEn: 'a person equal in ability',
        frequency: 3, examples: [
          { sentence: "She's met her match in this competition.", translation: 'Cô ấy đã gặp đối thủ xứng tầm ở cuộc thi này.', highlight: 'match' },
        ],
      },
    ],
    tips: '💡 "match" = trận đấu hoặc phù hợp (2 nghĩa phổ biến nhất). "match" = que diêm ít dùng hơn.',
  },
  {
    word: 'bank',
    ipa: '/bæŋk/',
    totalSenses: 3,
    senses: [
      {
        id: 'bank-n-1', partOfSpeech: 'noun', meaning: 'ngân hàng', meaningEn: 'a financial institution',
        frequency: 1, examples: [
          { sentence: 'I need to go to the bank.', translation: 'Tôi cần đi ngân hàng.', highlight: 'bank' },
        ],
        collocations: ['bank account', 'bank transfer', 'investment bank'],
      },
      {
        id: 'bank-n-2', partOfSpeech: 'noun', meaning: 'bờ sông', meaningEn: 'the land alongside a river',
        frequency: 2, examples: [
          { sentence: 'We sat on the river bank.', translation: 'Chúng tôi ngồi trên bờ sông.', highlight: 'bank' },
        ],
      },
      {
        id: 'bank-v-1', partOfSpeech: 'verb', meaning: 'gửi tiền ngân hàng', meaningEn: 'to deposit money in a bank',
        frequency: 2, examples: [
          { sentence: 'She banks with HSBC.', translation: 'Cô ấy dùng ngân hàng HSBC.', highlight: 'banks' },
        ],
      },
    ],
    tips: '💡 "bank" = ngân hàng (phổ biến nhất). "river bank" = bờ sông — ngữ cảnh giúp phân biệt.',
  },
  {
    word: 'fair',
    ipa: '/feər/',
    totalSenses: 4,
    senses: [
      {
        id: 'fair-adj-1', partOfSpeech: 'adjective', meaning: 'công bằng', meaningEn: 'treating people equally',
        frequency: 1, examples: [
          { sentence: "That's not fair!", translation: 'Thế không công bằng!', highlight: 'fair' },
        ],
        collocations: ['fair play', 'fair deal', 'fair enough'],
      },
      {
        id: 'fair-adj-2', partOfSpeech: 'adjective', meaning: 'khá, tạm được', meaningEn: 'moderately good',
        frequency: 2, examples: [
          { sentence: 'Her English is fair.', translation: 'Tiếng Anh cô ấy khá.', highlight: 'fair' },
        ],
      },
      {
        id: 'fair-n-1', partOfSpeech: 'noun', meaning: 'hội chợ', meaningEn: 'a large public event with entertainment',
        frequency: 2, examples: [
          { sentence: 'We visited the county fair.', translation: 'Chúng tôi đi hội chợ.', highlight: 'fair' },
        ],
        collocations: ['job fair', 'book fair', 'trade fair'],
      },
      {
        id: 'fair-adj-3', partOfSpeech: 'adjective', meaning: 'trắng, sáng (da/tóc)', meaningEn: 'light in color (skin/hair)',
        frequency: 3, examples: [
          { sentence: 'She has fair skin and blue eyes.', translation: 'Cô ấy có da trắng và mắt xanh.', highlight: 'fair' },
        ],
      },
    ],
    tips: '💡 "fair" = công bằng (phổ biến nhất). "fair" noun = hội chợ. "fair skin" = da trắng.',
  },
  {
    word: 'right',
    ipa: '/raɪt/',
    totalSenses: 5,
    senses: [
      {
        id: 'right-adj-1', partOfSpeech: 'adjective', meaning: 'đúng, chính xác', meaningEn: 'correct or true',
        frequency: 1, examples: [
          { sentence: 'You are absolutely right.', translation: 'Bạn hoàn toàn đúng.', highlight: 'right' },
        ],
        collocations: ['that\'s right', 'the right answer'],
      },
      {
        id: 'right-adj-2', partOfSpeech: 'adjective', meaning: 'bên phải', meaningEn: 'on the side opposite to left',
        frequency: 1, examples: [
          { sentence: 'Turn right at the corner.', translation: 'Rẽ phải ở góc đường.', highlight: 'right' },
        ],
      },
      {
        id: 'right-n-1', partOfSpeech: 'noun', meaning: 'quyền', meaningEn: 'a moral or legal entitlement',
        frequency: 1, register: 'formal', examples: [
          { sentence: 'Everyone has the right to education.', translation: 'Mọi người đều có quyền được giáo dục.', highlight: 'right' },
        ],
        collocations: ['human rights', 'the right to', 'civil rights'],
      },
      {
        id: 'right-adv-1', partOfSpeech: 'adverb', meaning: 'ngay, chính xác', meaningEn: 'exactly, directly',
        frequency: 2, examples: [
          { sentence: "I'll be right there.", translation: 'Tôi sẽ đến ngay.', highlight: 'right' },
        ],
      },
      {
        id: 'right-adj-3', partOfSpeech: 'adjective', meaning: 'phù hợp, đúng đắn', meaningEn: 'appropriate or suitable',
        frequency: 2, examples: [
          { sentence: 'Is this the right time to talk?', translation: 'Bây giờ có phải lúc thích hợp để nói chuyện không?', highlight: 'right' },
        ],
      },
    ],
    tips: '💡 "right" = đúng + bên phải + quyền — 3 nghĩa chính cần nhớ. "right" adverb = ngay ("right now").',
  },
  {
    word: 'present',
    ipa: '/ˈprezənt/ (n, adj) — /prɪˈzent/ (v)',
    totalSenses: 4,
    senses: [
      {
        id: 'present-n-1', partOfSpeech: 'noun', meaning: 'quà tặng', meaningEn: 'a gift',
        frequency: 1, examples: [
          { sentence: 'I bought a birthday present for her.', translation: 'Tôi mua quà sinh nhật cho cô ấy.', highlight: 'present' },
        ],
        collocations: ['birthday present', 'Christmas present'],
      },
      {
        id: 'present-adj-1', partOfSpeech: 'adjective', meaning: 'hiện tại, có mặt', meaningEn: 'existing or happening now; being in a place',
        frequency: 1, register: 'formal', examples: [
          { sentence: 'All students must be present.', translation: 'Tất cả học sinh phải có mặt.', highlight: 'present' },
        ],
        collocations: ['present tense', 'at present', 'the present moment'],
      },
      {
        id: 'present-v-1', partOfSpeech: 'verb', meaning: 'trình bày, giới thiệu', meaningEn: 'to show or introduce formally',
        frequency: 2, register: 'formal', examples: [
          { sentence: 'She presented her research to the team.', translation: 'Cô ấy trình bày nghiên cứu cho nhóm.', highlight: 'presented' },
        ],
        collocations: ['present an idea', 'present a report'],
      },
      {
        id: 'present-v-2', partOfSpeech: 'verb', meaning: 'tặng, trao', meaningEn: 'to give something formally',
        frequency: 2, register: 'formal', examples: [
          { sentence: 'The award was presented by the principal.', translation: 'Giải thưởng được hiệu trưởng trao tặng.', highlight: 'presented' },
        ],
      },
    ],
    tips: '💡 Phát âm khác nhau! Noun/adj: /ˈprezənt/ (nhấn đầu). Verb: /prɪˈzent/ (nhấn cuối).',
  },
  {
    word: 'change',
    ipa: '/tʃeɪndʒ/',
    totalSenses: 4,
    senses: [
      {
        id: 'change-v-1', partOfSpeech: 'verb', meaning: 'thay đổi', meaningEn: 'to make or become different',
        frequency: 1, examples: [
          { sentence: 'You need to change your password.', translation: 'Bạn cần đổi mật khẩu.', highlight: 'change' },
        ],
        collocations: ['change your mind', 'change direction'],
      },
      {
        id: 'change-n-1', partOfSpeech: 'noun', meaning: 'sự thay đổi', meaningEn: 'the act of becoming different',
        frequency: 1, examples: [
          { sentence: 'Climate change is a serious problem.', translation: 'Biến đổi khí hậu là vấn đề nghiêm trọng.', highlight: 'change' },
        ],
        collocations: ['climate change', 'make a change'],
      },
      {
        id: 'change-n-2', partOfSpeech: 'noun', meaning: 'tiền thối, tiền lẻ', meaningEn: 'coins or money returned',
        frequency: 2, examples: [
          { sentence: 'Keep the change.', translation: 'Giữ tiền thối đi.', highlight: 'change' },
        ],
      },
      {
        id: 'change-v-2', partOfSpeech: 'verb', meaning: 'thay đồ, chuyển (xe)', meaningEn: 'to put on different clothes or switch transport',
        frequency: 2, examples: [
          { sentence: 'I need to change clothes before dinner.', translation: 'Tôi cần thay đồ trước bữa tối.', highlight: 'change' },
        ],
        collocations: ['change clothes', 'change trains'],
      },
    ],
    tips: '💡 "change" verb = thay đổi. Noun = sự thay đổi hoặc tiền thối. "Keep the change" = giữ tiền thừa.',
  },
  {
    word: 'check',
    ipa: '/tʃek/',
    totalSenses: 4,
    senses: [
      {
        id: 'check-v-1', partOfSpeech: 'verb', meaning: 'kiểm tra, xác minh', meaningEn: 'to examine or verify',
        frequency: 1, examples: [
          { sentence: 'Check your email for updates.', translation: 'Kiểm tra email để xem cập nhật.', highlight: 'Check' },
        ],
        collocations: ['check in', 'check out', 'double-check'],
      },
      {
        id: 'check-n-1', partOfSpeech: 'noun', meaning: 'hóa đơn (nhà hàng)', meaningEn: 'a bill at a restaurant',
        frequency: 2, examples: [
          { sentence: 'Can I have the check, please?', translation: 'Cho tôi hóa đơn.', highlight: 'check' },
        ],
      },
      {
        id: 'check-n-2', partOfSpeech: 'noun', meaning: 'séc (ngân hàng)', meaningEn: 'a written order to pay money',
        frequency: 2, examples: [
          { sentence: 'She wrote a check for $500.', translation: 'Cô ấy viết séc 500 đô.', highlight: 'check' },
        ],
      },
      {
        id: 'check-n-3', partOfSpeech: 'noun', meaning: 'dấu tích (✓)', meaningEn: 'a mark indicating verification',
        frequency: 2, examples: [
          { sentence: 'Put a check next to each item.', translation: 'Đánh dấu tích bên cạnh mỗi mục.', highlight: 'check' },
        ],
      },
    ],
    tips: '💡 "check" verb = kiểm tra. Noun AmE = hóa đơn/séc. "check in/out" = nhận/trả phòng.',
  },
  {
    word: 'kind',
    ipa: '/kaɪnd/',
    totalSenses: 3,
    senses: [
      {
        id: 'kind-adj-1', partOfSpeech: 'adjective', meaning: 'tốt bụng, tử tế', meaningEn: 'friendly, generous, considerate',
        frequency: 1, examples: [
          { sentence: "She's very kind to everyone.", translation: 'Cô ấy rất tốt bụng với mọi người.', highlight: 'kind' },
        ],
        collocations: ['kind of you', 'kind words', 'kind-hearted'],
      },
      {
        id: 'kind-n-1', partOfSpeech: 'noun', meaning: 'loại, kiểu', meaningEn: 'a type or category',
        frequency: 1, examples: [
          { sentence: 'What kind of music do you like?', translation: 'Bạn thích loại nhạc gì?', highlight: 'kind' },
        ],
        collocations: ['what kind of', 'this kind of', 'all kinds of'],
      },
      {
        id: 'kind-adv-1', partOfSpeech: 'adverb', meaning: 'hơi, kiểu như', meaningEn: 'somewhat, rather (informal)',
        frequency: 2, register: 'informal', examples: [
          { sentence: "I'm kind of tired.", translation: 'Tôi hơi mệt.', highlight: 'kind of' },
        ],
      },
    ],
    tips: '💡 "kind" adj = tốt bụng. "kind" noun = loại. "kind of" = hơi/kiểu (informal rất phổ biến!).',
  },
  {
    word: 'case',
    ipa: '/keɪs/',
    totalSenses: 4,
    senses: [
      {
        id: 'case-n-1', partOfSpeech: 'noun', meaning: 'trường hợp, tình huống', meaningEn: 'an instance or situation',
        frequency: 1, examples: [
          { sentence: 'In that case, we should wait.', translation: 'Trong trường hợp đó, chúng ta nên chờ.', highlight: 'case' },
        ],
        collocations: ['in case', 'in any case', 'just in case'],
      },
      {
        id: 'case-n-2', partOfSpeech: 'noun', meaning: 'vụ án, vụ việc', meaningEn: 'a legal action or investigation',
        frequency: 1, register: 'formal', examples: [
          { sentence: 'The police are working on the case.', translation: 'Cảnh sát đang điều tra vụ án.', highlight: 'case' },
        ],
        collocations: ['court case', 'murder case', 'case study'],
      },
      {
        id: 'case-n-3', partOfSpeech: 'noun', meaning: 'hộp, vỏ', meaningEn: 'a container or protective cover',
        frequency: 2, examples: [
          { sentence: 'I need a new phone case.', translation: 'Tôi cần ốp điện thoại mới.', highlight: 'case' },
        ],
        collocations: ['phone case', 'suitcase', 'pencil case'],
      },
      {
        id: 'case-n-4', partOfSpeech: 'noun', meaning: 'chữ hoa/thường', meaningEn: 'uppercase or lowercase letters',
        frequency: 3, register: 'technical', examples: [
          { sentence: 'Passwords are case-sensitive.', translation: 'Mật khẩu phân biệt chữ hoa chữ thường.', highlight: 'case' },
        ],
      },
    ],
    tips: '💡 "case" = trường hợp/vụ án (phổ biến). "in case" = phòng khi. "phone case" = ốp ĐT.',
  },
  {
    word: 'spring',
    ipa: '/sprɪŋ/',
    totalSenses: 4,
    senses: [
      {
        id: 'spring-n-1', partOfSpeech: 'noun', meaning: 'mùa xuân', meaningEn: 'the season between winter and summer',
        frequency: 1, examples: [
          { sentence: 'Flowers bloom in spring.', translation: 'Hoa nở vào mùa xuân.', highlight: 'spring' },
        ],
      },
      {
        id: 'spring-n-2', partOfSpeech: 'noun', meaning: 'lò xo', meaningEn: 'a coiled piece of metal that returns to shape',
        frequency: 2, examples: [
          { sentence: 'The mattress has good springs.', translation: 'Nệm có lò xo tốt.', highlight: 'springs' },
        ],
      },
      {
        id: 'spring-n-3', partOfSpeech: 'noun', meaning: 'suối, nguồn nước', meaningEn: 'a place where water flows naturally from the ground',
        frequency: 2, examples: [
          { sentence: 'There is a natural spring in the mountains.', translation: 'Có một con suối tự nhiên trên núi.', highlight: 'spring' },
        ],
        collocations: ['hot spring', 'natural spring'],
      },
      {
        id: 'spring-v-1', partOfSpeech: 'verb', meaning: 'nhảy, bật dậy', meaningEn: 'to move suddenly upward or forward',
        frequency: 2, examples: [
          { sentence: 'The cat sprang onto the table.', translation: 'Con mèo nhảy lên bàn.', highlight: 'sprang' },
        ],
      },
    ],
    tips: '💡 "spring" = mùa xuân (phổ biến nhất). Cũng = lò xo, suối, và nhảy. "hot spring" = suối nước nóng.',
  },
  {
    word: 'drop',
    ipa: '/drɒp/',
    totalSenses: 4,
    senses: [
      {
        id: 'drop-v-1', partOfSpeech: 'verb', meaning: 'thả, làm rơi', meaningEn: 'to let something fall',
        frequency: 1, examples: [
          { sentence: 'I accidentally dropped my phone.', translation: 'Tôi vô tình đánh rơi điện thoại.', highlight: 'dropped' },
        ],
        collocations: ['drop off', 'drop by', 'drop out'],
      },
      {
        id: 'drop-v-2', partOfSpeech: 'verb', meaning: 'giảm, hạ', meaningEn: 'to decrease or fall in level',
        frequency: 1, examples: [
          { sentence: 'Prices dropped by 20%.', translation: 'Giá giảm 20%.', highlight: 'dropped' },
        ],
      },
      {
        id: 'drop-n-1', partOfSpeech: 'noun', meaning: 'giọt (nước)', meaningEn: 'a small amount of liquid',
        frequency: 2, examples: [
          { sentence: 'A drop of rain fell on my hand.', translation: 'Một giọt mưa rơi lên tay tôi.', highlight: 'drop' },
        ],
        collocations: ['a drop of', 'eye drops', 'rain drops'],
      },
      {
        id: 'drop-n-2', partOfSpeech: 'noun', meaning: 'sự sụt giảm', meaningEn: 'a decrease or fall',
        frequency: 2, examples: [
          { sentence: 'There was a sharp drop in temperature.', translation: 'Nhiệt độ giảm mạnh.', highlight: 'drop' },
        ],
      },
    ],
    tips: '💡 "drop" verb = thả/rơi + giảm. Noun = giọt nước + sự giảm. "drop by" = ghé qua.',
  },
  {
    word: 'draw',
    ipa: '/drɔː/',
    totalSenses: 4,
    senses: [
      {
        id: 'draw-v-1', partOfSpeech: 'verb', meaning: 'vẽ', meaningEn: 'to make a picture with a pencil or pen',
        frequency: 1, examples: [
          { sentence: 'She loves to draw animals.', translation: 'Cô ấy thích vẽ động vật.', highlight: 'draw' },
        ],
        collocations: ['draw a picture', 'draw a line'],
      },
      {
        id: 'draw-v-2', partOfSpeech: 'verb', meaning: 'kéo, rút', meaningEn: 'to pull or move something towards oneself',
        frequency: 2, examples: [
          { sentence: 'He drew his sword from its sheath.', translation: 'Anh ấy rút kiếm ra khỏi vỏ.', highlight: 'drew' },
        ],
        collocations: ['draw attention', 'draw a conclusion'],
      },
      {
        id: 'draw-n-1', partOfSpeech: 'noun', meaning: 'trận hòa', meaningEn: 'a game that ends with equal scores',
        frequency: 2, examples: [
          { sentence: 'The match ended in a draw.', translation: 'Trận đấu kết thúc hòa.', highlight: 'draw' },
        ],
      },
      {
        id: 'draw-v-3', partOfSpeech: 'verb', meaning: 'thu hút', meaningEn: 'to attract interest or attention',
        frequency: 2, examples: [
          { sentence: 'The event drew a large crowd.', translation: 'Sự kiện thu hút đông đảo khán giả.', highlight: 'drew' },
        ],
        collocations: ['draw attention', 'draw a crowd'],
      },
    ],
    tips: '💡 "draw" = vẽ (phổ biến nhất). "draw attention" = thu hút chú ý. "draw" noun = trận hòa.',
  },
  {
    word: 'order',
    ipa: '/ˈɔːrdər/',
    totalSenses: 4,
    senses: [
      {
        id: 'order-n-1', partOfSpeech: 'noun', meaning: 'thứ tự, trật tự', meaningEn: 'the arrangement or sequence',
        frequency: 1, examples: [
          { sentence: 'List them in alphabetical order.', translation: 'Liệt kê theo thứ tự bảng chữ cái.', highlight: 'order' },
        ],
        collocations: ['in order', 'out of order', 'in order to'],
      },
      {
        id: 'order-v-1', partOfSpeech: 'verb', meaning: 'gọi (đồ ăn), đặt hàng', meaningEn: 'to request food or goods',
        frequency: 1, examples: [
          { sentence: "I'd like to order a coffee.", translation: 'Tôi muốn gọi một ly cà phê.', highlight: 'order' },
        ],
        collocations: ['order food', 'order online'],
      },
      {
        id: 'order-n-2', partOfSpeech: 'noun', meaning: 'mệnh lệnh', meaningEn: 'an authoritative command',
        frequency: 2, register: 'formal', examples: [
          { sentence: 'The general gave the order to advance.', translation: 'Tướng ra lệnh tiến quân.', highlight: 'order' },
        ],
        collocations: ['give an order', 'follow orders'],
      },
      {
        id: 'order-n-3', partOfSpeech: 'noun', meaning: 'đơn hàng', meaningEn: 'a request for goods',
        frequency: 1, examples: [
          { sentence: 'Your order has been shipped.', translation: 'Đơn hàng của bạn đã được gửi.', highlight: 'order' },
        ],
      },
    ],
    tips: '💡 "order" = thứ tự + đặt hàng + mệnh lệnh. "in order to" = để (mục đích).',
  },
];
