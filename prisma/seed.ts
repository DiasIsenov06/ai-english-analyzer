import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Дерекқорды деректермен толтыру басталды...');

  // --- 1. Тестілік пайдаланушылар ---
  const hashedPassword = await bcrypt.hash('Test1234!', 12);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@example.com' },
      update: {},
      create: {
        email: 'student1@example.com',
        password: hashedPassword,
        level: 'B1',
        goal: 'IELTS 6.5',
        hasCompletedOnboarding: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'student2@example.com' },
      update: {},
      create: {
        email: 'student2@example.com',
        password: hashedPassword,
        level: 'A2',
        goal: 'General English',
        hasCompletedOnboarding: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'demo@aienglish.kz' },
      update: {},
      create: {
        email: 'demo@aienglish.kz',
        password: hashedPassword,
        level: 'B2',
        goal: 'Business English',
        hasCompletedOnboarding: true,
      },
    }),
  ]);

  console.log(`✓ ${users.length} пайдаланушы жасалды`);

  // --- 2. Тест нәтижелері ---
  const testResults = [
    {
      userId: users[0].id,
      score: 9,
      total: 15,
      level: 'B1',
      grammarScore: 3,
      vocabularyScore: 4,
      correctionScore: 2,
      strengths: JSON.stringify(['vocabulary', 'reading']),
      weaknesses: JSON.stringify(['grammar', 'correction']),
    },
    {
      userId: users[0].id,
      score: 11,
      total: 15,
      level: 'B2',
      grammarScore: 4,
      vocabularyScore: 4,
      correctionScore: 3,
      strengths: JSON.stringify(['vocabulary', 'grammar']),
      weaknesses: JSON.stringify(['speaking', 'writing']),
    },
    {
      userId: users[1].id,
      score: 5,
      total: 15,
      level: 'A2',
      grammarScore: 1,
      vocabularyScore: 2,
      correctionScore: 2,
      strengths: JSON.stringify(['listening']),
      weaknesses: JSON.stringify(['grammar', 'vocabulary', 'correction']),
    },
    {
      userId: users[2].id,
      score: 13,
      total: 15,
      level: 'C1',
      grammarScore: 5,
      vocabularyScore: 4,
      correctionScore: 4,
      strengths: JSON.stringify(['grammar', 'vocabulary', 'correction']),
      weaknesses: JSON.stringify(['speaking']),
    },
  ];

  for (const result of testResults) {
    await prisma.testResult.create({ data: result });
  }
  console.log(`✓ ${testResults.length} тест нәтижесі жасалды`);

  // --- 3. Сөздік банк (VocabularyWord) ---
  const vocabWords = [
    { word: 'analyze', translation: 'талдау', example: 'We need to analyze the data carefully.', level: 'B1', topic: 'Academic' },
    { word: 'significant', translation: 'маңызды, елеулі', example: 'There has been a significant improvement.', level: 'B1', topic: 'Academic' },
    { word: 'implement', translation: 'іске асыру', example: 'We will implement the new policy next month.', level: 'B2', topic: 'Business' },
    { word: 'facilitate', translation: 'жеңілдету', example: 'Technology facilitates communication.', level: 'B2', topic: 'Academic' },
    { word: 'comprehensive', translation: 'жан-жақты', example: 'A comprehensive study was conducted.', level: 'C1', topic: 'Academic' },
    { word: 'elaborate', translation: 'егжей-тегжейлі баяндау', example: 'Could you elaborate on that point?', level: 'C1', topic: 'Speaking' },
    { word: 'ambiguous', translation: 'екіұшты', example: 'The instructions were ambiguous.', level: 'B2', topic: 'General' },
    { word: 'collaborate', translation: 'бірлесіп жұмыс істеу', example: 'We collaborate with international partners.', level: 'B1', topic: 'Business' },
    { word: 'constraint', translation: 'шектеу', example: 'Budget constraints affect the project.', level: 'B2', topic: 'Business' },
    { word: 'coherent', translation: 'бірізді, логикалы', example: 'Write a coherent paragraph.', level: 'C1', topic: 'Writing' },
    { word: 'prevalent', translation: 'кең таралған', example: 'Social media is prevalent among teenagers.', level: 'B2', topic: 'General' },
    { word: 'imply', translation: 'білдіру, астарлап айту', example: 'What does this sentence imply?', level: 'B2', topic: 'Academic' },
    { word: 'assess', translation: 'бағалау', example: 'Teachers assess students every term.', level: 'B1', topic: 'Education' },
    { word: 'phenomenon', translation: 'құбылыс', example: 'Climate change is a global phenomenon.', level: 'C1', topic: 'Academic' },
    { word: 'supplement', translation: 'толықтыру', example: 'These exercises supplement your learning.', level: 'B1', topic: 'Education' },
  ];

  for (const word of vocabWords) {
    await prisma.vocabularyWord.upsert({
      where: { word: word.word },
      update: {},
      create: word,
    });
  }
  console.log(`✓ ${vocabWords.length} сөздік сөз жасалды`);

  // --- 4. Грамматика сабақтары (GrammarLesson) ---
  const grammarLessons = [
    {
      title: 'Present Perfect vs Past Simple',
      explanation: 'Present Perfect uses "have/has + past participle" for past actions with present relevance. Past Simple uses the past tense for finished actions at a specific time.',
      examplesJson: JSON.stringify([
        { sentence: 'I have lived here for 5 years.', note: 'Still living here → Present Perfect' },
        { sentence: 'I lived in London in 2019.', note: 'Finished, specific time → Past Simple' },
      ]),
      level: 'B1',
      topic: 'Tenses',
    },
    {
      title: 'Conditional Sentences (Type 1, 2, 3)',
      explanation: 'Type 1: Real condition (If + present, will + verb). Type 2: Unreal present (If + past, would + verb). Type 3: Unreal past (If + past perfect, would have + past participle).',
      examplesJson: JSON.stringify([
        { sentence: 'If it rains, I will stay home.', note: 'Type 1 — real possibility' },
        { sentence: 'If I were rich, I would travel.', note: 'Type 2 — hypothetical present' },
        { sentence: 'If she had studied, she would have passed.', note: 'Type 3 — hypothetical past' },
      ]),
      level: 'B2',
      topic: 'Conditionals',
    },
    {
      title: 'Passive Voice',
      explanation: 'Use passive voice when the action is more important than the doer. Structure: be + past participle.',
      examplesJson: JSON.stringify([
        { sentence: 'The report was written by the team.', note: 'Past passive' },
        { sentence: 'The data is being analyzed now.', note: 'Present continuous passive' },
        { sentence: 'The results will be published soon.', note: 'Future passive' },
      ]),
      level: 'B1',
      topic: 'Voice',
    },
  ];

  for (const lesson of grammarLessons) {
    await prisma.grammarLesson.create({ data: lesson });
  }
  console.log(`✓ ${grammarLessons.length} грамматика сабағы жасалды`);

  console.log('\n✅ Дерекқор деректермен толтырылды!');
  console.log('   Demo пайдаланушы: demo@aienglish.kz / Test1234!');
}

main()
  .catch((e) => {
    console.error('Seed қатесі:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
