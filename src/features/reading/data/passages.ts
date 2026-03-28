import type { CEFRLevel } from '../../../lib/types';

export type { CEFRLevel } from '../../../lib/types';

export interface ReadingQuestion {
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  question: string;
  options?: string[];
  answer: number | boolean | string;
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  level: CEFRLevel;
  topic: string;
  text: string;
  wordCount: number;
  highlightedWords: string[];
  questions: ReadingQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  // ── A1 PASSAGES (80-120 words, 4 questions: 2 MC + 1 TF + 1 fill-blank) ──

  {
    id: 'a1-daily-life',
    title: 'My Morning Routine',
    level: 'A1',
    topic: 'daily-life',
    text: `Every morning I wake up at seven o'clock. I go to the bathroom and take a shower. Then I go to the kitchen and have breakfast. I usually eat bread and drink coffee.

After breakfast, I walk to the bus stop. I take the bus to work every morning. My friend Tom also takes the same bus. We talk on the phone in the evening.

At night, I watch television and then go to sleep. I like my morning routine. It is simple and nice.`,
    wordCount: 82,
    highlightedWords: ['morning', 'wake up', 'bathroom', 'shower', 'kitchen', 'breakfast', 'bus', 'work'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What time does the person wake up?',
        options: ['Six o\'clock', 'Seven o\'clock', 'Eight o\'clock', 'Nine o\'clock'],
        answer: 1,
        explanation: 'The text says "Every morning I wake up at seven o\'clock."',
      },
      {
        type: 'multiple_choice',
        question: 'How does the person go to work?',
        options: ['By car', 'By train', 'By bus', 'On foot'],
        answer: 2,
        explanation: 'The text says "I take the bus to work every morning."',
      },
      {
        type: 'true_false',
        question: 'The person drinks tea for breakfast.',
        answer: false,
        explanation: 'The text says the person drinks coffee, not tea.',
      },
      {
        type: 'fill_blank',
        question: 'At night, the person watches _____ before going to sleep.',
        answer: 'television',
        explanation: 'The text says "At night, I watch television and then go to sleep."',
      },
    ],
  },

  {
    id: 'a1-family',
    title: 'My Family',
    level: 'A1',
    topic: 'family',
    text: `I have a big family. My father is a teacher and my mother works at a hospital. I have one brother and one sister. My brother is a teenager. He is fifteen years old. My sister is a baby. She is only one year old.

My grandmother and grandfather live near our house. We visit them every weekend. My uncle and aunt also come to visit. We are a happy family. I love my family very much.`,
    wordCount: 80,
    highlightedWords: ['father', 'mother', 'brother', 'sister', 'teenager', 'baby', 'grandmother', 'grandfather'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the father do?',
        options: ['He is a doctor', 'He is a teacher', 'He is a driver', 'He is a cook'],
        answer: 1,
        explanation: 'The text says "My father is a teacher."',
      },
      {
        type: 'multiple_choice',
        question: 'How old is the brother?',
        options: ['Ten years old', 'Twelve years old', 'Fifteen years old', 'Twenty years old'],
        answer: 2,
        explanation: 'The text says "He is fifteen years old."',
      },
      {
        type: 'true_false',
        question: 'The grandparents live far from the family.',
        answer: false,
        explanation: 'The text says "My grandmother and grandfather live near our house."',
      },
      {
        type: 'fill_blank',
        question: 'The family visits the grandparents every _____.',
        answer: 'weekend',
        explanation: 'The text says "We visit them every weekend."',
      },
    ],
  },

  {
    id: 'a1-food-drink',
    title: 'Lunch at School',
    level: 'A1',
    topic: 'food-drink',
    text: `Today is Monday. I have lunch at school. The school has a small restaurant. I eat rice and chicken for lunch. My friend Sarah eats a salad and bread. She drinks juice.

I always drink water with my lunch. After lunch, we eat fruit. I have an apple and Sarah has a banana. Sometimes we have ice cream for dessert. The food at school is good. I like the soup very much.`,
    wordCount: 80,
    highlightedWords: ['rice', 'chicken', 'salad', 'bread', 'juice', 'water', 'apple', 'banana'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'Where does the person eat lunch?',
        options: ['At home', 'At school', 'At a park', 'At a cafe'],
        answer: 1,
        explanation: 'The text says "I have lunch at school."',
      },
      {
        type: 'multiple_choice',
        question: 'What does the person always drink with lunch?',
        options: ['Juice', 'Milk', 'Coffee', 'Water'],
        answer: 3,
        explanation: 'The text says "I always drink water with my lunch."',
      },
      {
        type: 'true_false',
        question: 'Sarah eats chicken for lunch.',
        answer: false,
        explanation: 'The text says Sarah eats a salad and bread, not chicken.',
      },
      {
        type: 'fill_blank',
        question: 'The person likes the _____ at school very much.',
        answer: 'soup',
        explanation: 'The text says "I like the soup very much."',
      },
    ],
  },

  {
    id: 'a1-shopping',
    title: 'Going to the Shop',
    level: 'A1',
    topic: 'shopping',
    text: `On Saturday, I go to the mall with my mother. We need to buy some things. First, we go to a shop for clothes. I try on a new shirt. The price is good so we buy it. The cashier gives us a receipt.

Then we go to the grocery store. We buy fruit, bread, and milk. My mother pays with cash from her wallet. I push the cart. Shopping with my mother is fun. We go home by bus.`,
    wordCount: 82,
    highlightedWords: ['mall', 'shop', 'try on', 'price', 'cashier', 'receipt', 'grocery', 'wallet'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'When do they go shopping?',
        options: ['On Monday', 'On Friday', 'On Saturday', 'On Sunday'],
        answer: 2,
        explanation: 'The text says "On Saturday, I go to the mall with my mother."',
      },
      {
        type: 'multiple_choice',
        question: 'How does the mother pay at the grocery store?',
        options: ['By card', 'With cash', 'By phone', 'With a check'],
        answer: 1,
        explanation: 'The text says "My mother pays with cash from her wallet."',
      },
      {
        type: 'true_false',
        question: 'They buy a new dress at the clothes shop.',
        answer: false,
        explanation: 'The text says they buy a new shirt, not a dress.',
      },
      {
        type: 'fill_blank',
        question: 'The person pushes the _____ at the grocery store.',
        answer: 'cart',
        explanation: 'The text says "I push the cart."',
      },
    ],
  },

  {
    id: 'a1-home',
    title: 'Our New Home',
    level: 'A1',
    topic: 'home',
    text: `We have a new home. It has three bedrooms, a kitchen, a bathroom, and a big living room. My bedroom has a bed, a lamp, and a shelf for my books. There is a mirror on the wall.

The kitchen has a fridge and an oven. My mother cooks there every day. The living room has a big sofa and a carpet on the floor. We have a small balcony too. I can see the street from the balcony. I love our new home.`,
    wordCount: 90,
    highlightedWords: ['bedroom', 'kitchen', 'bathroom', 'living room', 'lamp', 'shelf', 'mirror', 'sofa'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'How many bedrooms does the home have?',
        options: ['One', 'Two', 'Three', 'Four'],
        answer: 2,
        explanation: 'The text says "It has three bedrooms."',
      },
      {
        type: 'multiple_choice',
        question: 'What is on the wall in the bedroom?',
        options: ['A picture', 'A clock', 'A mirror', 'A poster'],
        answer: 2,
        explanation: 'The text says "There is a mirror on the wall."',
      },
      {
        type: 'true_false',
        question: 'The living room has a small sofa.',
        answer: false,
        explanation: 'The text says the living room has a "big sofa."',
      },
      {
        type: 'fill_blank',
        question: 'The person can see the _____ from the balcony.',
        answer: 'street',
        explanation: 'The text says "I can see the street from the balcony."',
      },
    ],
  },

  {
    id: 'a1-clothing',
    title: 'Getting Dressed',
    level: 'A1',
    topic: 'clothing',
    text: `Today is cold outside. I need to wear warm clothes. I put on a sweater and jeans. I also wear warm socks and boots. My mother says I should wear a coat and a scarf too.

My sister wears a dress and a jacket. She also wears gloves because her hands are cold. My father wears a shirt and a tie for work. He puts on his belt and shoes. We all look nice. Fashion is important to my sister. She loves shopping for clothes.`,
    wordCount: 88,
    highlightedWords: ['sweater', 'jeans', 'socks', 'boots', 'coat', 'scarf', 'jacket', 'gloves'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'Why does the person wear warm clothes?',
        options: ['It is raining', 'It is cold', 'It is windy', 'It is snowing'],
        answer: 1,
        explanation: 'The text says "Today is cold outside."',
      },
      {
        type: 'multiple_choice',
        question: 'Why does the sister wear gloves?',
        options: ['She likes gloves', 'For fashion', 'Her hands are cold', 'Her mother told her'],
        answer: 2,
        explanation: 'The text says "She also wears gloves because her hands are cold."',
      },
      {
        type: 'true_false',
        question: 'The father wears a sweater to work.',
        answer: false,
        explanation: 'The text says the father wears "a shirt and a tie for work."',
      },
      {
        type: 'fill_blank',
        question: '_____ is important to the sister.',
        answer: 'fashion',
        explanation: 'The text says "Fashion is important to my sister."',
      },
    ],
  },

  // ── A2 PASSAGES (120-180 words, 4 questions: 2 MC + 1 TF + 1 fill-blank) ──

  {
    id: 'a2-travel',
    title: 'A Trip to the Beach',
    level: 'A2',
    topic: 'travel',
    text: `Last summer, my family took a trip to the beach. We bought tickets for the train and packed our luggage the night before. My mother checked our passports even though we were traveling inside the country. She always worries!

We arrived at a nice hotel near the beach. The hotel had a restaurant and a swimming pool. Every morning, we went to the beach and took many photos with our camera. My sister bought a souvenir for her friend.

One day, we visited a famous museum in the city. There were many tourists there. We also went to a local market and tried different food. A friendly guide told us about the history of the city.

I loved this trip. The beach was beautiful and the people were very kind. I want to go back next year. Traveling is my favorite thing to do.`,
    wordCount: 145,
    highlightedWords: ['train', 'luggage', 'hotel', 'beach', 'camera', 'souvenir', 'museum', 'tourist'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'How did the family travel to the beach?',
        options: ['By car', 'By plane', 'By train', 'By bus'],
        answer: 2,
        explanation: 'The text says "We bought tickets for the train."',
      },
      {
        type: 'multiple_choice',
        question: 'What did the sister buy?',
        options: ['A camera', 'A book', 'A souvenir', 'A dress'],
        answer: 2,
        explanation: 'The text says "My sister bought a souvenir for her friend."',
      },
      {
        type: 'true_false',
        question: 'The family traveled to another country.',
        answer: false,
        explanation: 'The text says they were "traveling inside the country."',
      },
      {
        type: 'fill_blank',
        question: 'A friendly _____ told them about the history of the city.',
        answer: 'guide',
        explanation: 'The text says "A friendly guide told us about the history of the city."',
      },
    ],
  },

  {
    id: 'a2-education',
    title: 'My School Life',
    level: 'A2',
    topic: 'education',
    text: `I am a student at a big school in the city. Every day, I go to the classroom at eight o'clock. My favorite subject is science because the teacher explains things very well. She gives us interesting homework every week.

The school has a large library where I study for exams. I always use the dictionary when I read English books. Last semester, I got a good grade in math. My parents were very happy.

Next year, I want to get a scholarship to study at a university. I need to practice more and do my assignments on time. My tutor helps me with difficult subjects. Knowledge is very important for my future.

I enjoy going to school. I learn new things every day and my classmates are very friendly. Education is the key to a better life.`,
    wordCount: 142,
    highlightedWords: ['student', 'classroom', 'subject', 'teacher', 'homework', 'library', 'exam', 'scholarship'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What is the person\'s favorite subject?',
        options: ['Math', 'English', 'Science', 'History'],
        answer: 2,
        explanation: 'The text says "My favorite subject is science."',
      },
      {
        type: 'multiple_choice',
        question: 'What does the person want to get next year?',
        options: ['A job', 'A certificate', 'A scholarship', 'A prize'],
        answer: 2,
        explanation: 'The text says "I want to get a scholarship to study at a university."',
      },
      {
        type: 'true_false',
        question: 'The person got a bad grade in math last semester.',
        answer: false,
        explanation: 'The text says "I got a good grade in math."',
      },
      {
        type: 'fill_blank',
        question: 'The person always uses the _____ when reading English books.',
        answer: 'dictionary',
        explanation: 'The text says "I always use the dictionary when I read English books."',
      },
    ],
  },

  {
    id: 'a2-sports',
    title: 'The Big Match',
    level: 'A2',
    topic: 'sports',
    text: `Last Saturday, our school football team played in a big match at the stadium. Our coach told us to practice hard before the match. We did warm-up exercises and stretching every day.

The match started at three o'clock. There were many people in the audience. Both teams played very well. The score was 1-1 at half time. In the second half, our team scored again. The final score was 2-1.

Our team won! We were so happy. The coach gave a medal to the best player. He was a great athlete. After the match, we went to the gym to relax. Some players did yoga to help their muscles.

Next month, there is a big tournament. We need a lot of fitness training. Our opponent will be very strong, but we are ready. We want to be champions!`,
    wordCount: 140,
    highlightedWords: ['football', 'stadium', 'coach', 'practice', 'score', 'medal', 'athlete', 'tournament'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What was the final score of the match?',
        options: ['1-0', '1-1', '2-1', '3-1'],
        answer: 2,
        explanation: 'The text says "The final score was 2-1."',
      },
      {
        type: 'multiple_choice',
        question: 'What did the coach give to the best player?',
        options: ['A trophy', 'A medal', 'A certificate', 'Money'],
        answer: 1,
        explanation: 'The text says "The coach gave a medal to the best player."',
      },
      {
        type: 'true_false',
        question: 'The team lost the match.',
        answer: false,
        explanation: 'The text says "Our team won!"',
      },
      {
        type: 'fill_blank',
        question: 'Next month, there is a big _____.',
        answer: 'tournament',
        explanation: 'The text says "Next month, there is a big tournament."',
      },
    ],
  },

  {
    id: 'a2-entertainment',
    title: 'Movie Night',
    level: 'A2',
    topic: 'entertainment',
    text: `Every Friday, my family has a movie night. We choose a movie to watch together. My father likes drama, but my mother prefers comedy. I enjoy watching documentaries about animals and nature.

Last Friday, we watched a new movie. It was a famous movie with great reviews. The movie had subtitles in Vietnamese, which helped my grandmother understand. The audience in the cinema loved it.

Sometimes we stay at home and watch episodes of our favorite TV channel. My sister likes cartoons. I prefer streaming movies on the internet. We also listen to music and talk about the performances of our favorite celebrities.

My hobby is photography. I take photos of interesting things. My father says I should try painting too. Entertainment is an important part of our family life. It brings us together.`,
    wordCount: 135,
    highlightedWords: ['movie', 'drama', 'comedy', 'documentary', 'subtitle', 'channel', 'streaming', 'hobby'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What kind of movies does the person enjoy?',
        options: ['Comedy', 'Drama', 'Documentaries', 'Cartoons'],
        answer: 2,
        explanation: 'The text says "I enjoy watching documentaries about animals and nature."',
      },
      {
        type: 'multiple_choice',
        question: 'What is the person\'s hobby?',
        options: ['Painting', 'Photography', 'Singing', 'Dancing'],
        answer: 1,
        explanation: 'The text says "My hobby is photography."',
      },
      {
        type: 'true_false',
        question: 'The family watches movies every Saturday.',
        answer: false,
        explanation: 'The text says "Every Friday, my family has a movie night."',
      },
      {
        type: 'fill_blank',
        question: 'The movie had _____ in Vietnamese for the grandmother.',
        answer: 'subtitles',
        explanation: 'The text says "The movie had subtitles in Vietnamese."',
      },
    ],
  },

  {
    id: 'a2-transportation',
    title: 'Getting Around the City',
    level: 'A2',
    topic: 'transportation',
    text: `In my city, there are many ways to get around. Most people take the bus or the subway to work. You need to buy a ticket at the station. The bus stops at every crosswalk along the route.

My father is a driver. He drives a taxi. He knows every highway and intersection in the city. He always tells passengers to wear their seatbelt. Safety is very important.

I usually ride my bicycle to school. It is good for my health and the environment. My brother rides a motorcycle. He always wears a helmet.

Sometimes we take a boat or ferry across the river. The departure time is at nine in the morning. The arrival time is about thirty minutes later. I think public transportation is very useful. It helps reduce traffic in the city.`,
    wordCount: 138,
    highlightedWords: ['bus', 'subway', 'ticket', 'station', 'taxi', 'bicycle', 'motorcycle', 'helmet'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the father do for work?',
        options: ['Bus driver', 'Taxi driver', 'Train driver', 'Boat captain'],
        answer: 1,
        explanation: 'The text says "My father is a driver. He drives a taxi."',
      },
      {
        type: 'multiple_choice',
        question: 'How does the person usually go to school?',
        options: ['By bus', 'By subway', 'By bicycle', 'By motorcycle'],
        answer: 2,
        explanation: 'The text says "I usually ride my bicycle to school."',
      },
      {
        type: 'true_false',
        question: 'The brother rides a bicycle to school.',
        answer: false,
        explanation: 'The text says "My brother rides a motorcycle."',
      },
      {
        type: 'fill_blank',
        question: 'The brother always wears a _____ when riding.',
        answer: 'helmet',
        explanation: 'The text says "He always wears a helmet."',
      },
    ],
  },

  {
    id: 'a2-communication',
    title: 'Staying in Touch',
    level: 'A2',
    topic: 'communication',
    text: `Communication is very important in our daily life. I have a conversation with my friends every day. We send messages and emails to each other. Sometimes we make a phone call when we need to talk about something important.

My English teacher says I should practice how to pronounce words correctly. She wants me to explain my ideas clearly. In class, we have discussions about many topics. We learn to agree and disagree politely.

I also use social media to stay in touch with friends from other countries. They greet me in their language and I introduce myself in English. I try not to interrupt when someone is speaking.

My grandmother likes to listen to speech on the radio. She says the language is beautiful. I think good communication helps us understand each other better. It is an important skill for everyone.`,
    wordCount: 140,
    highlightedWords: ['conversation', 'message', 'email', 'phone call', 'pronounce', 'explain', 'discussion', 'social media'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'How does the person stay in touch with friends from other countries?',
        options: ['By letter', 'By phone', 'Through social media', 'By email only'],
        answer: 2,
        explanation: 'The text says "I also use social media to stay in touch with friends from other countries."',
      },
      {
        type: 'multiple_choice',
        question: 'What does the English teacher want the person to practice?',
        options: ['Writing', 'Reading', 'Pronunciation', 'Grammar'],
        answer: 2,
        explanation: 'The text says the teacher wants the person to "practice how to pronounce words correctly."',
      },
      {
        type: 'true_false',
        question: 'The grandmother likes to watch TV.',
        answer: false,
        explanation: 'The text says "My grandmother likes to listen to speech on the radio."',
      },
      {
        type: 'fill_blank',
        question: 'The person tries not to _____ when someone is speaking.',
        answer: 'interrupt',
        explanation: 'The text says "I try not to interrupt when someone is speaking."',
      },
    ],
  },

  // ── B1 PASSAGES (180-250 words, 5 questions: 2 MC + 2 TF + 1 fill-blank) ──

  {
    id: 'b1-technology',
    title: 'Living in the Digital Age',
    level: 'B1',
    topic: 'technology',
    text: `Technology has changed the way we live, work, and communicate. Almost everyone now uses a computer or a digital device every day. The internet connects people around the world, allowing them to share information instantly. Software applications help us do everything from managing our finances to ordering food.

One of the biggest changes in recent years is the way we store information. Instead of keeping files on paper, we now use digital storage and cloud services. Companies invest heavily in their network infrastructure and server security. Many people use strong passwords and encrypt their data to stay safe online.

However, technology also brings challenges. Some people spend too much time looking at their screen instead of talking to friends and family. Software updates can sometimes cause problems, and it is important to backup your data regularly. Learning to debug simple computer problems is a useful skill that everyone should have.

Despite these challenges, the benefits of technology are clear. From wireless communication to advanced algorithms that power search engines, technology makes our lives easier and more efficient. As we move forward, it is important to use technology wisely and stay informed about how it works.`,
    wordCount: 185,
    highlightedWords: ['computer', 'internet', 'software', 'digital', 'network', 'server', 'password', 'encrypt'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What do many people do to stay safe online?',
        options: [
          'Avoid using the internet',
          'Use strong passwords and encrypt their data',
          'Only use public computers',
          'Turn off their devices at night',
        ],
        answer: 1,
        explanation: 'The text says "Many people use strong passwords and encrypt their data to stay safe online."',
      },
      {
        type: 'multiple_choice',
        question: 'What skill does the text say everyone should have?',
        options: [
          'Programming',
          'Building computers',
          'Debugging simple computer problems',
          'Creating websites',
        ],
        answer: 2,
        explanation: 'The text says "Learning to debug simple computer problems is a useful skill that everyone should have."',
      },
      {
        type: 'true_false',
        question: 'The text suggests that technology has only positive effects.',
        answer: false,
        explanation: 'The text mentions challenges like spending too much screen time and software updates causing problems.',
      },
      {
        type: 'true_false',
        question: 'Cloud services are used to store information digitally.',
        answer: true,
        explanation: 'The text says "we now use digital storage and cloud services."',
      },
      {
        type: 'fill_blank',
        question: 'Advanced _____ power search engines and make our lives easier.',
        answer: 'algorithms',
        explanation: 'The text says "advanced algorithms that power search engines."',
      },
    ],
  },

  {
    id: 'b1-health',
    title: 'Staying Healthy in a Busy World',
    level: 'B1',
    topic: 'health',
    text: `Staying healthy is one of the most important things we can do for ourselves. Many people visit the doctor only when they feel sick, but prevention is much better than cure. Regular exercise helps keep our muscles strong and our heart healthy. Even a short walk every day can make a big difference.

A balanced diet is also essential. We should eat plenty of vegetables and fruit, and reduce our intake of sugar and processed food. Taking vitamins can help if your diet is not perfect. If you have an allergy to certain foods, it is important to avoid them and read food labels carefully.

Mental health is equally important. When we feel stressed or anxious, it can cause physical symptoms like headaches and stomach pain. Getting enough rest and learning to breathe deeply can help us relax. If you experience a fever or a persistent cough, you should visit the pharmacy or see a doctor for a prescription.

Some people are afraid of going to the hospital or the dentist, but regular check-ups can prevent serious problems. The key to good health is a combination of exercise, good food, and taking care of our mental well-being.`,
    wordCount: 190,
    highlightedWords: ['doctor', 'exercise', 'healthy', 'muscle', 'vitamin', 'allergy', 'symptom', 'prescription'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'According to the text, what is better than cure?',
        options: ['Medicine', 'Surgery', 'Prevention', 'Rest'],
        answer: 2,
        explanation: 'The text says "prevention is much better than cure."',
      },
      {
        type: 'multiple_choice',
        question: 'What can stress cause?',
        options: [
          'Better sleep',
          'Physical symptoms like headaches',
          'Weight loss',
          'Improved memory',
        ],
        answer: 1,
        explanation: 'The text says stress "can cause physical symptoms like headaches and stomach pain."',
      },
      {
        type: 'true_false',
        question: 'The text says you should only visit the doctor when you feel sick.',
        answer: false,
        explanation: 'The text says regular check-ups can prevent serious problems, implying you should visit even when feeling well.',
      },
      {
        type: 'true_false',
        question: 'A balanced diet should include plenty of vegetables and fruit.',
        answer: true,
        explanation: 'The text says "We should eat plenty of vegetables and fruit."',
      },
      {
        type: 'fill_blank',
        question: 'If you have an _____ to certain foods, you should avoid them.',
        answer: 'allergy',
        explanation: 'The text says "If you have an allergy to certain foods, it is important to avoid them."',
      },
    ],
  },

  {
    id: 'b1-work',
    title: 'Choosing a Career',
    level: 'B1',
    topic: 'work',
    text: `Choosing a career is one of the most important decisions a person can make. Some people know from a young age what job they want, while others take many years to decide. There are hundreds of different careers to choose from, including becoming an engineer, a nurse, a pilot, or a chef.

When choosing a career, it is important to consider what you enjoy doing and what skills you have. A lawyer needs to be good at arguing and writing, while a photographer needs a creative eye. An architect designs buildings and needs strong math skills. Some people choose to become a scientist because they love research and discovery.

The job market is always changing. Many people now commute long distances to work or even work overtime to meet deadlines. Some people decide to retire early and enjoy their free time, while others continue working because they love what they do. Writing a good resume is essential when looking for a new job.

Volunteering is also a great way to gain experience and explore different fields. Whatever career you choose, it is important to find something that makes you happy and gives you a sense of purpose. A good career should not just pay well but also bring fulfillment.`,
    wordCount: 198,
    highlightedWords: ['career', 'engineer', 'nurse', 'pilot', 'chef', 'lawyer', 'architect', 'resume'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the text say an architect needs?',
        options: ['Creative writing skills', 'Strong math skills', 'Medical knowledge', 'Computer programming'],
        answer: 1,
        explanation: 'The text says "An architect designs buildings and needs strong math skills."',
      },
      {
        type: 'multiple_choice',
        question: 'What is described as a great way to gain experience?',
        options: ['Traveling', 'Reading', 'Volunteering', 'Watching videos'],
        answer: 2,
        explanation: 'The text says "Volunteering is also a great way to gain experience."',
      },
      {
        type: 'true_false',
        question: 'Everyone knows what career they want from a young age.',
        answer: false,
        explanation: 'The text says "others take many years to decide."',
      },
      {
        type: 'true_false',
        question: 'A good resume is important when looking for a new job.',
        answer: true,
        explanation: 'The text says "Writing a good resume is essential when looking for a new job."',
      },
      {
        type: 'fill_blank',
        question: 'Many people now _____ long distances to work.',
        answer: 'commute',
        explanation: 'The text says "Many people now commute long distances to work."',
      },
    ],
  },

  {
    id: 'b1-nature',
    title: 'The Beauty of Nature',
    level: 'B1',
    topic: 'nature',
    text: `Nature is one of the most beautiful and powerful forces on our planet. From tall mountains to deep oceans, the natural world is full of wonder. Every season brings something different — spring brings flowers, summer brings sunshine, autumn brings colorful leaves, and winter brings snow.

The weather plays an important role in our daily lives. A sudden storm can cause problems for travelers, while a beautiful sunset can brighten anyone's day. Rivers flow through valleys and forests, providing water for animals and people. Many lakes and islands attract tourists from around the world.

Unfortunately, climate change is affecting nature in many ways. The temperature is rising in many parts of the world, leading to droughts in some areas and floods in others. Pollution from factories and cars damages the environment and harms wildlife. Earthquakes and other natural disasters remind us how powerful nature can be.

It is our responsibility to protect the natural world. We can start by reducing pollution, saving water, and planting trees. Even small actions like picking up litter can make a difference. A beautiful rainbow after the rain reminds us that nature is worth protecting.`,
    wordCount: 185,
    highlightedWords: ['mountain', 'ocean', 'weather', 'storm', 'sunset', 'river', 'climate', 'pollution'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the text say summer brings?',
        options: ['Flowers', 'Snow', 'Sunshine', 'Colorful leaves'],
        answer: 2,
        explanation: 'The text says "summer brings sunshine."',
      },
      {
        type: 'multiple_choice',
        question: 'What is causing droughts in some areas?',
        options: ['Earthquakes', 'Pollution', 'Rising temperatures', 'Storms'],
        answer: 2,
        explanation: 'The text says "The temperature is rising...leading to droughts in some areas."',
      },
      {
        type: 'true_false',
        question: 'Climate change only causes floods.',
        answer: false,
        explanation: 'The text mentions both droughts and floods as effects of climate change.',
      },
      {
        type: 'true_false',
        question: 'Rivers provide water for animals and people.',
        answer: true,
        explanation: 'The text says "Rivers flow through valleys and forests, providing water for animals and people."',
      },
      {
        type: 'fill_blank',
        question: '_____ from factories and cars damages the environment.',
        answer: 'pollution',
        explanation: 'The text says "Pollution from factories and cars damages the environment."',
      },
    ],
  },

  {
    id: 'b1-time-numbers',
    title: 'Managing Your Time',
    level: 'B1',
    topic: 'time-numbers',
    text: `Time management is a skill that everyone needs to learn. Whether you are a student or a working professional, knowing how to organize your schedule can make a huge difference in your life. Many people waste hours every week because they do not plan their time well.

A good way to start is by creating a weekly calendar. Write down all your important tasks and deadlines. Decide which tasks are urgent and which can wait. Try to complete the most important tasks in the morning when your energy is highest. Some people work better in the afternoon or evening — find what works best for you.

It is also important to know your limits. On average, a person can focus well for about forty-five minutes before needing a break. Taking short breaks throughout the day can actually help you be more productive. The total number of hours you work matters less than how effectively you use them.

Experts say that about half of the people they surveyed felt they wasted at least a quarter of their working day. By setting clear goals and tracking your progress with a schedule, you can make every minute count and reach your deadlines on time.`,
    wordCount: 196,
    highlightedWords: ['morning', 'afternoon', 'evening', 'hour', 'minute', 'week', 'schedule', 'deadline'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'How long can a person typically focus well before needing a break?',
        options: ['About 20 minutes', 'About 30 minutes', 'About 45 minutes', 'About 60 minutes'],
        answer: 2,
        explanation: 'The text says "a person can focus well for about forty-five minutes before needing a break."',
      },
      {
        type: 'multiple_choice',
        question: 'When does the text suggest completing important tasks?',
        options: ['In the evening', 'In the morning', 'At midnight', 'On weekends'],
        answer: 1,
        explanation: 'The text says "Try to complete the most important tasks in the morning when your energy is highest."',
      },
      {
        type: 'true_false',
        question: 'Working more hours always means being more productive.',
        answer: false,
        explanation: 'The text says "The total number of hours you work matters less than how effectively you use them."',
      },
      {
        type: 'true_false',
        question: 'Taking short breaks can help you be more productive.',
        answer: true,
        explanation: 'The text says "Taking short breaks throughout the day can actually help you be more productive."',
      },
      {
        type: 'fill_blank',
        question: 'A good way to start managing time is by creating a weekly _____.',
        answer: 'calendar',
        explanation: 'The text says "A good way to start is by creating a weekly calendar."',
      },
    ],
  },

  {
    id: 'b1-emotions',
    title: 'Understanding Our Emotions',
    level: 'B1',
    topic: 'emotions',
    text: `Emotions are a natural part of being human. We all feel happy, sad, angry, and excited at different times. Understanding our emotions is important because they affect how we think, behave, and interact with others.

When something good happens, we feel happy and grateful. We might feel proud when we achieve something important. These positive emotions give us energy and motivation. However, not all emotions feel pleasant. Sometimes we feel nervous before a big exam or anxious about the future. Feeling scared or lonely is completely normal.

The key is learning how to manage our emotions. When we feel frustrated or angry, it is important to stay calm and think before we react. Taking deep breaths and talking to someone we trust can help us feel relieved. Being curious about why we feel a certain way can lead to better self-understanding.

Some people feel embarrassed when they make mistakes, but mistakes are a natural part of learning. Others feel jealous when they see someone else succeed, but it is better to feel hopeful and motivated by others' success. Being confused about your emotions is also normal — the important thing is to be honest with yourself.`,
    wordCount: 192,
    highlightedWords: ['happy', 'sad', 'angry', 'nervous', 'anxious', 'frustrated', 'embarrassed', 'jealous'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the text recommend when feeling angry?',
        options: [
          'Express your anger loudly',
          'Ignore the feeling',
          'Stay calm and think before reacting',
          'Avoid talking to anyone',
        ],
        answer: 2,
        explanation: 'The text says "When we feel frustrated or angry, it is important to stay calm and think before we react."',
      },
      {
        type: 'multiple_choice',
        question: 'What do positive emotions give us?',
        options: ['Problems', 'Energy and motivation', 'Confusion', 'Fear'],
        answer: 1,
        explanation: 'The text says "These positive emotions give us energy and motivation."',
      },
      {
        type: 'true_false',
        question: 'Feeling scared or lonely is not normal.',
        answer: false,
        explanation: 'The text says "Feeling scared or lonely is completely normal."',
      },
      {
        type: 'true_false',
        question: 'Mistakes are a natural part of learning.',
        answer: true,
        explanation: 'The text says "mistakes are a natural part of learning."',
      },
      {
        type: 'fill_blank',
        question: 'Being _____ about why we feel a certain way can lead to better self-understanding.',
        answer: 'curious',
        explanation: 'The text says "Being curious about why we feel a certain way can lead to better self-understanding."',
      },
    ],
  },

  // ── B2 PASSAGES (250-350 words, 5 questions: 2 MC + 2 TF + 1 fill-blank) ──

  {
    id: 'b2-business',
    title: 'The Art of Negotiation',
    level: 'B2',
    topic: 'business',
    text: `Negotiation is a fundamental skill in the business world. Whether you are discussing a contract with a client, requesting a salary increase during a meeting, or trying to close a deal with an investor, the ability to negotiate effectively can determine the success or failure of a project.

Successful negotiation starts with thorough preparation. Before any meeting, you should research the other party's needs and interests. Understanding their perspective allows you to craft a proposal that benefits both sides. A good strategy is to identify areas of common ground before addressing points of disagreement. This approach builds trust and creates a positive atmosphere for discussion.

One common mistake in negotiations is focusing solely on profit and revenue. While financial outcomes are important, neglecting the relationship with your colleague or client can have long-term consequences. The best negotiators understand that a good deal is one where both parties feel satisfied. This is why many successful managers emphasize the importance of listening as much as speaking during a conference or budget discussion.

The business environment is constantly changing, and what worked in the past may not work today. Companies must adapt their negotiation strategies to new markets and cultural differences. For example, in some cultures, building a personal relationship before discussing business is essential, while in others, people prefer to get straight to the point.

Developing strong negotiation skills takes time and practice. Young employees should seek opportunities to observe experienced colleagues in action and learn from real-world situations. Role-playing exercises during department training sessions can also be valuable. Investment in these skills pays dividends throughout one's career, regardless of the industry.`,
    wordCount: 250,
    highlightedWords: ['contract', 'client', 'meeting', 'salary', 'proposal', 'strategy', 'profit', 'negotiate'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the text say successful negotiation starts with?',
        options: ['Making demands', 'Thorough preparation', 'Offering concessions', 'Building personal friendships'],
        answer: 1,
        explanation: 'The text says "Successful negotiation starts with thorough preparation."',
      },
      {
        type: 'multiple_choice',
        question: 'What is a common mistake in negotiations?',
        options: [
          'Listening too much',
          'Being too friendly',
          'Focusing solely on profit and revenue',
          'Taking too much time',
        ],
        answer: 2,
        explanation: 'The text says "One common mistake in negotiations is focusing solely on profit and revenue."',
      },
      {
        type: 'true_false',
        question: 'The text suggests that the best deals leave one party unsatisfied.',
        answer: false,
        explanation: 'The text says "a good deal is one where both parties feel satisfied."',
      },
      {
        type: 'true_false',
        question: 'Cultural differences can affect negotiation approaches.',
        answer: true,
        explanation: 'The text says "Companies must adapt their negotiation strategies to new markets and cultural differences."',
      },
      {
        type: 'fill_blank',
        question: 'A good _____ is to identify areas of common ground before addressing disagreements.',
        answer: 'strategy',
        explanation: 'The text says "A good strategy is to identify areas of common ground before addressing points of disagreement."',
      },
    ],
  },

  {
    id: 'b2-environment',
    title: 'The Future of Renewable Energy',
    level: 'B2',
    topic: 'environment',
    text: `As the world faces the growing threat of climate change, the transition to renewable energy has become one of the most pressing challenges of our time. Traditional sources of energy, such as coal and oil, release large amounts of carbon into the atmosphere, contributing to global warming and the greenhouse effect.

Solar energy is one of the most promising alternatives. The technology behind solar panels has improved dramatically in recent years, making them more efficient and affordable. Many countries are now investing in large solar farms that can power entire cities. Wind energy is another popular option, with massive wind turbines being installed in both onshore and offshore locations.

However, the transition to renewable energy is not without its challenges. One major issue is energy storage — solar panels only generate electricity during the day, and wind turbines depend on weather conditions. Scientists are working on developing better batteries and storage solutions to address this problem. Additionally, building new renewable energy infrastructure requires significant investment and can impact local ecosystems.

The concept of sustainability extends beyond just energy production. Reducing waste, recycling materials, and promoting organic farming practices all contribute to a healthier planet. Conservation efforts to protect endangered species and prevent deforestation are equally important. Every individual can make a difference by reducing their plastic consumption and choosing sustainable products.

The path to a sustainable future requires cooperation between governments, businesses, and individuals. While the challenges are significant, the potential rewards — cleaner air, healthier ecosystems, and a stable climate — make the effort worthwhile. The discovery of new technologies and innovative approaches gives us reason to be optimistic about what lies ahead.`,
    wordCount: 256,
    highlightedWords: ['renewable', 'carbon', 'solar', 'greenhouse', 'sustainable', 'conservation', 'endangered', 'deforestation'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What is described as one major challenge of renewable energy?',
        options: ['Cost of solar panels', 'Energy storage', 'Lack of sunlight', 'Public opposition'],
        answer: 1,
        explanation: 'The text says "One major issue is energy storage."',
      },
      {
        type: 'multiple_choice',
        question: 'What does sustainability extend beyond?',
        options: ['Politics', 'Energy production', 'Education', 'Technology'],
        answer: 1,
        explanation: 'The text says "The concept of sustainability extends beyond just energy production."',
      },
      {
        type: 'true_false',
        question: 'Solar panel technology has become less efficient in recent years.',
        answer: false,
        explanation: 'The text says solar panel technology "has improved dramatically," becoming "more efficient and affordable."',
      },
      {
        type: 'true_false',
        question: 'Reducing plastic consumption is mentioned as something individuals can do.',
        answer: true,
        explanation: 'The text says "Every individual can make a difference by reducing their plastic consumption."',
      },
      {
        type: 'fill_blank',
        question: 'Traditional energy sources release large amounts of _____ into the atmosphere.',
        answer: 'carbon',
        explanation: 'The text says they "release large amounts of carbon into the atmosphere."',
      },
    ],
  },

  {
    id: 'b2-education-advanced',
    title: 'The Evolution of Education',
    level: 'B2',
    topic: 'education',
    text: `Education has undergone remarkable changes over the past few decades. Traditional classrooms with a teacher standing at the front giving a lecture are no longer the only model for learning. Technology has opened up new possibilities, from online courses to interactive learning platforms that allow students to study at their own pace.

One of the most significant developments has been the rise of distance learning. Universities now offer complete degree programs online, making education accessible to people who might not be able to attend a physical classroom. This has been particularly beneficial for working professionals who want to continue their studies while maintaining their careers. Many students find that online research tools and digital textbooks enhance their learning experience.

However, not everyone agrees that technology-based education is superior. Critics argue that students miss out on important social interactions when they learn remotely. The relationship between a student and their teacher or tutor is difficult to replicate through a screen. Group projects and face-to-face discussions develop important communication and teamwork skills that are valued by employers.

The debate about the best approach to education continues. Some experts suggest a hybrid model that combines the flexibility of online learning with the benefits of in-person instruction. This approach allows students to access a wider range of subjects while still benefiting from direct interaction with professors and classmates. A scholarship program that supports students regardless of their chosen learning format could help make education more equitable.

The key to improving education lies in understanding that different students have different needs. A one-size-fits-all approach rarely works. By offering diverse learning options and supporting individual knowledge development, educational institutions can prepare students for success in an increasingly complex world.`,
    wordCount: 267,
    highlightedWords: ['classroom', 'lecture', 'student', 'university', 'research', 'textbook', 'scholarship', 'knowledge'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'Who has particularly benefited from distance learning?',
        options: ['Young children', 'Working professionals', 'Retired people', 'Athletes'],
        answer: 1,
        explanation: 'The text says it "has been particularly beneficial for working professionals."',
      },
      {
        type: 'multiple_choice',
        question: 'What do critics say students miss in remote learning?',
        options: [
          'Better grades',
          'Free textbooks',
          'Important social interactions',
          'Cheaper tuition',
        ],
        answer: 2,
        explanation: 'The text says "students miss out on important social interactions when they learn remotely."',
      },
      {
        type: 'true_false',
        question: 'The text says a one-size-fits-all approach to education works well.',
        answer: false,
        explanation: 'The text says "A one-size-fits-all approach rarely works."',
      },
      {
        type: 'true_false',
        question: 'Some experts suggest combining online and in-person learning.',
        answer: true,
        explanation: 'The text says "Some experts suggest a hybrid model that combines the flexibility of online learning with the benefits of in-person instruction."',
      },
      {
        type: 'fill_blank',
        question: 'Online _____ tools and digital textbooks enhance the learning experience.',
        answer: 'research',
        explanation: 'The text says "online research tools and digital textbooks enhance their learning experience."',
      },
    ],
  },

  {
    id: 'b2-technology-advanced',
    title: 'Artificial Intelligence and Society',
    level: 'B2',
    topic: 'technology',
    text: `Artificial intelligence has rapidly moved from the realm of science fiction into our everyday lives. From virtual assistants that respond to voice commands to sophisticated algorithms that recommend what we should watch or buy, AI is reshaping how we interact with technology. The development of advanced software and hardware has made it possible to process vast amounts of data at unprecedented speeds.

One of the most promising applications of AI is in healthcare. Machine learning algorithms can analyze medical images more quickly and sometimes more accurately than human doctors. AI-powered systems can help predict disease outbreaks and assist in drug development. However, these systems rely heavily on the quality of their database and the data they are trained on, which raises concerns about bias and accuracy.

In the business world, AI is transforming everything from customer service to supply chain management. Companies use AI to automate repetitive tasks, allowing employees to focus on more creative and strategic work. Natural language processing enables computers to understand and respond to human communication, making browser-based chatbots increasingly sophisticated.

Despite its many benefits, artificial intelligence also raises serious ethical questions. As AI systems become more capable, concerns about privacy, job displacement, and the concentration of power in the hands of a few technology companies have grown. Many experts argue that we need clear regulations and guidelines for AI development to ensure that these powerful tools serve humanity rather than harm it.

The future of AI depends on how we choose to develop and deploy it. By investing in research, promoting transparency, and ensuring diverse perspectives are included in AI development, we can harness this technology for the greater good while minimizing its risks.`,
    wordCount: 263,
    highlightedWords: ['artificial', 'algorithm', 'software', 'hardware', 'database', 'network', 'browser', 'digital'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What concern does the text raise about AI in healthcare?',
        options: [
          'It is too expensive',
          'Bias and accuracy due to data quality',
          'Doctors refuse to use it',
          'It cannot process images',
        ],
        answer: 1,
        explanation: 'The text says AI systems "rely heavily on the quality of their database and the data they are trained on, which raises concerns about bias and accuracy."',
      },
      {
        type: 'multiple_choice',
        question: 'How is AI changing the business world?',
        options: [
          'By replacing all employees',
          'By automating repetitive tasks',
          'By eliminating customer service',
          'By reducing product quality',
        ],
        answer: 1,
        explanation: 'The text says "Companies use AI to automate repetitive tasks, allowing employees to focus on more creative and strategic work."',
      },
      {
        type: 'true_false',
        question: 'AI-powered chatbots use natural language processing.',
        answer: true,
        explanation: 'The text says "Natural language processing enables computers to understand and respond to human communication, making browser-based chatbots increasingly sophisticated."',
      },
      {
        type: 'true_false',
        question: 'The text suggests that AI development does not need any regulations.',
        answer: false,
        explanation: 'The text says "we need clear regulations and guidelines for AI development."',
      },
      {
        type: 'fill_blank',
        question: 'Machine learning _____ can analyze medical images more quickly than human doctors.',
        answer: 'algorithms',
        explanation: 'The text says "Machine learning algorithms can analyze medical images more quickly...than human doctors."',
      },
    ],
  },

  {
    id: 'b2-health-advanced',
    title: 'Mental Health in the Modern World',
    level: 'B2',
    topic: 'health',
    text: `Mental health has become one of the most discussed topics in modern society. For decades, mental health issues were stigmatized and often ignored, but there is now growing recognition that psychological well-being is just as important as physical health. Doctors and healthcare professionals are increasingly emphasizing the need for comprehensive mental health support in hospitals and clinics.

The modern world presents unique challenges to our mental health. The constant pressure to perform at work, maintain social connections, and keep up with technology can lead to chronic stress and anxiety. Many people experience symptoms such as difficulty sleeping, persistent headaches, and changes in appetite. If left untreated, these issues can develop into more serious conditions that may require prescription medication or even surgery in extreme cases.

Exercise has been shown to be one of the most effective ways to improve mental health. Physical activity releases chemicals in the brain that help reduce stress and improve mood. Even moderate exercise, such as walking or swimming, can have significant benefits. Maintaining a healthy diet rich in vitamins and minerals also supports brain function and emotional well-being. Regular rest and learning to breathe mindfully are simple but powerful tools.

The role of social connections should not be underestimated. Having strong relationships with family and friends provides emotional support during difficult times. Support groups and therapy sessions offer safe spaces for people to share their experiences. Some people benefit from visiting a dentist to address pain issues that contribute to overall stress levels.

Moving forward, it is essential that society continues to break down the stigma surrounding mental health. Educational programs, workplace initiatives, and accessible healthcare services can all contribute to a world where seeking help for mental health is as natural as visiting a doctor for a fever or an injury.`,
    wordCount: 272,
    highlightedWords: ['doctor', 'hospital', 'medicine', 'symptom', 'prescription', 'exercise', 'healthy', 'diet'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the text say exercise releases in the brain?',
        options: [
          'Vitamins',
          'Chemicals that reduce stress',
          'Hormones that cause anxiety',
          'Sugar',
        ],
        answer: 1,
        explanation: 'The text says "Physical activity releases chemicals in the brain that help reduce stress and improve mood."',
      },
      {
        type: 'multiple_choice',
        question: 'What unique challenges does the modern world present to mental health?',
        options: [
          'Lack of food',
          'Constant pressure from work, social life, and technology',
          'Too much sleep',
          'Physical injuries',
        ],
        answer: 1,
        explanation: 'The text says "The constant pressure to perform at work, maintain social connections, and keep up with technology can lead to chronic stress."',
      },
      {
        type: 'true_false',
        question: 'Mental health issues were always well understood and treated.',
        answer: false,
        explanation: 'The text says "mental health issues were stigmatized and often ignored" for decades.',
      },
      {
        type: 'true_false',
        question: 'Strong social relationships provide emotional support during difficult times.',
        answer: true,
        explanation: 'The text says "Having strong relationships with family and friends provides emotional support during difficult times."',
      },
      {
        type: 'fill_blank',
        question: 'If left untreated, mental health issues can develop into conditions requiring _____ medication.',
        answer: 'prescription',
        explanation: 'The text says issues "can develop into more serious conditions that may require prescription medication."',
      },
    ],
  },

  {
    id: 'b2-communication-advanced',
    title: 'The Power of Effective Communication',
    level: 'B2',
    topic: 'communication',
    text: `Effective communication is the foundation of all successful human relationships, whether personal or professional. The ability to clearly express ideas, listen actively, and respond thoughtfully is essential in virtually every aspect of life. Yet despite its importance, many people struggle with communication, often leading to misunderstandings and conflicts.

One of the most common barriers to effective communication is the failure to listen. In any conversation, there is a natural tendency to focus on what we want to say next rather than truly hearing what the other person is expressing. Learning to listen without interrupting and asking clarifying questions can dramatically improve the quality of our discussions. When we explain our ideas clearly and invite others to share their opinions, we create an environment of mutual respect.

Language itself can be both a bridge and a barrier. The way we pronounce words, the tone of our voice, and even our body language all convey messages beyond the literal meaning of our words. In cross-cultural communication, these non-verbal cues can lead to confusion if they are interpreted differently. Social media has added another layer of complexity, as written messages lack the emotional nuance of face-to-face interaction.

The art of persuasion is another crucial aspect of communication. Whether you are trying to suggest a new idea at work, announce a change in policy, or invite support for a cause, the ability to present your arguments convincingly matters. Good communicators know how to translate complex information into simple, accessible language and when to use different communication strategies.

Public speaking, or giving a speech, remains one of the most feared activities for many people. However, with practice and proper preparation, anyone can become a more confident and effective speaker. The key is to focus on your message rather than your nervousness and to remember that communication is ultimately about connection.`,
    wordCount: 280,
    highlightedWords: ['conversation', 'explain', 'discussion', 'opinion', 'pronounce', 'social media', 'suggest', 'speech'],
    questions: [
      {
        type: 'multiple_choice',
        question: 'What does the text identify as the most common barrier to effective communication?',
        options: [
          'Language differences',
          'Technology problems',
          'Failure to listen',
          'Lack of vocabulary',
        ],
        answer: 2,
        explanation: 'The text says "One of the most common barriers to effective communication is the failure to listen."',
      },
      {
        type: 'multiple_choice',
        question: 'Why does social media add complexity to communication?',
        options: [
          'It is too expensive',
          'Written messages lack emotional nuance',
          'It is too slow',
          'Not enough people use it',
        ],
        answer: 1,
        explanation: 'The text says "written messages lack the emotional nuance of face-to-face interaction."',
      },
      {
        type: 'true_false',
        question: 'Body language does not affect communication.',
        answer: false,
        explanation: 'The text says "body language" conveys "messages beyond the literal meaning of our words."',
      },
      {
        type: 'true_false',
        question: 'With practice, anyone can become a more confident speaker.',
        answer: true,
        explanation: 'The text says "with practice and proper preparation, anyone can become a more confident and effective speaker."',
      },
      {
        type: 'fill_blank',
        question: 'Good communicators know how to _____ complex information into simple language.',
        answer: 'translate',
        explanation: 'The text says "Good communicators know how to translate complex information into simple, accessible language."',
      },
    ],
  },
];
