export type VocabWord = {
  id: number;
  word: string;
  transcription: string;
  kz: string;       // қазақша
  ru: string;       // русский
  example: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  topic: string;
};

export const VOCAB_WORDS: VocabWord[] = [
  // ─── A1 — Beginner ───────────────────────────────────────────────────────
  { id: 1,  word: "hello",      transcription: "/həˈloʊ/",    kz: "сәлем",           ru: "привет",           example: "Hello! How are you?",                         level: "A1", topic: "Greetings" },
  { id: 2,  word: "thank you",  transcription: "/θæŋk juː/",  kz: "рахмет",          ru: "спасибо",          example: "Thank you for your help.",                    level: "A1", topic: "Greetings" },
  { id: 3,  word: "water",      transcription: "/ˈwɔːtər/",   kz: "су",              ru: "вода",             example: "Can I have a glass of water?",                level: "A1", topic: "Food" },
  { id: 4,  word: "eat",        transcription: "/iːt/",       kz: "жеу",             ru: "есть / кушать",    example: "I eat breakfast every morning.",              level: "A1", topic: "Food" },
  { id: 5,  word: "house",      transcription: "/haʊs/",      kz: "үй",              ru: "дом",              example: "This is my house.",                           level: "A1", topic: "Home" },
  { id: 6,  word: "family",     transcription: "/ˈfæməli/",   kz: "отбасы",          ru: "семья",            example: "My family has four people.",                  level: "A1", topic: "Family" },
  { id: 7,  word: "school",     transcription: "/skuːl/",     kz: "мектеп",          ru: "школа",            example: "I go to school every day.",                   level: "A1", topic: "Education" },
  { id: 8,  word: "book",       transcription: "/bʊk/",       kz: "кітап",           ru: "книга",            example: "I love reading this book.",                   level: "A1", topic: "Education" },
  { id: 9,  word: "friend",     transcription: "/frend/",     kz: "дос",             ru: "друг",             example: "She is my best friend.",                      level: "A1", topic: "People" },
  { id: 10, word: "good",       transcription: "/ɡʊd/",       kz: "жақсы",           ru: "хороший",          example: "You did a good job!",                         level: "A1", topic: "Adjectives" },
  { id: 11, word: "big",        transcription: "/bɪɡ/",       kz: "үлкен",           ru: "большой",          example: "That is a big dog.",                          level: "A1", topic: "Adjectives" },
  { id: 12, word: "small",      transcription: "/smɔːl/",     kz: "кішкентай",       ru: "маленький",        example: "She lives in a small town.",                  level: "A1", topic: "Adjectives" },
  { id: 13, word: "go",         transcription: "/ɡoʊ/",       kz: "бару",            ru: "идти / ехать",     example: "I go to the park on weekends.",               level: "A1", topic: "Verbs" },
  { id: 14, word: "work",       transcription: "/wɜːrk/",     kz: "жұмыс",           ru: "работать / работа",example: "She works in a hospital.",                    level: "A1", topic: "Work" },
  { id: 15, word: "time",       transcription: "/taɪm/",      kz: "уақыт",           ru: "время",            example: "What time is it?",                            level: "A1", topic: "Time" },
  { id: 16, word: "day",        transcription: "/deɪ/",       kz: "күн",             ru: "день",             example: "Have a great day!",                           level: "A1", topic: "Time" },
  { id: 17, word: "name",       transcription: "/neɪm/",      kz: "ат / есім",       ru: "имя",              example: "My name is Alex.",                            level: "A1", topic: "People" },
  { id: 18, word: "city",       transcription: "/ˈsɪti/",     kz: "қала",            ru: "город",            example: "I live in a big city.",                       level: "A1", topic: "Places" },
  { id: 19, word: "money",      transcription: "/ˈmʌni/",     kz: "ақша",            ru: "деньги",           example: "Do you have any money?",                      level: "A1", topic: "Daily life" },
  { id: 20, word: "happy",      transcription: "/ˈhæpi/",     kz: "бақытты, қуанышты",ru: "счастливый",      example: "She feels happy today.",                      level: "A1", topic: "Feelings" },

  // ─── A2 — Elementary ─────────────────────────────────────────────────────
  { id: 21, word: "travel",     transcription: "/ˈtrævəl/",   kz: "саяхат ету",      ru: "путешествовать",   example: "I love to travel to new countries.",           level: "A2", topic: "Travel" },
  { id: 22, word: "weather",    transcription: "/ˈweðər/",    kz: "ауа райы",        ru: "погода",           example: "The weather is sunny today.",                 level: "A2", topic: "Nature" },
  { id: 23, word: "shopping",   transcription: "/ˈʃɒpɪŋ/",   kz: "сауда жасау",     ru: "шопинг",           example: "She enjoys shopping on weekends.",            level: "A2", topic: "Daily life" },
  { id: 24, word: "health",     transcription: "/helθ/",      kz: "денсаулық",       ru: "здоровье",         example: "Health is the most important thing.",         level: "A2", topic: "Health" },
  { id: 25, word: "exercise",   transcription: "/ˈeksərsaɪz/",kz: "жаттығу",        ru: "упражнение",       example: "I exercise every morning.",                   level: "A2", topic: "Health" },
  { id: 26, word: "hobby",      transcription: "/ˈhɒbi/",     kz: "хобби",           ru: "хобби",            example: "My hobby is playing guitar.",                 level: "A2", topic: "Hobbies" },
  { id: 27, word: "music",      transcription: "/ˈmjuːzɪk/",  kz: "музыка",          ru: "музыка",           example: "She listens to music every night.",           level: "A2", topic: "Hobbies" },
  { id: 28, word: "job",        transcription: "/dʒɒb/",      kz: "жұмыс, мамандық", ru: "работа, должность",example: "He got a new job last week.",                  level: "A2", topic: "Work" },
  { id: 29, word: "tired",      transcription: "/taɪərd/",    kz: "шаршаған",        ru: "уставший",         example: "I am very tired after work.",                 level: "A2", topic: "Feelings" },
  { id: 30, word: "answer",     transcription: "/ˈænsər/",    kz: "жауап беру / жауап",ru: "отвечать / ответ",example: "Please answer the question.",                 level: "A2", topic: "Education" },
  { id: 31, word: "problem",    transcription: "/ˈprɒbləm/",  kz: "мәселе",          ru: "проблема",         example: "We need to solve this problem.",               level: "A2", topic: "General" },
  { id: 32, word: "together",   transcription: "/təˈɡeðər/",  kz: "бірге",           ru: "вместе",           example: "Let's do it together.",                       level: "A2", topic: "General" },
  { id: 33, word: "begin",      transcription: "/bɪˈɡɪn/",    kz: "бастау",          ru: "начинать",         example: "Class will begin at 9 o'clock.",              level: "A2", topic: "Verbs" },
  { id: 34, word: "already",    transcription: "/ɔːlˈredi/",  kz: "қазірдің өзінде", ru: "уже",              example: "I have already eaten lunch.",                 level: "A2", topic: "Adverbs" },
  { id: 35, word: "often",      transcription: "/ˈɒfən/",     kz: "жиі",             ru: "часто",            example: "She often reads books in the evenings.",      level: "A2", topic: "Adverbs" },
  { id: 36, word: "difficult",  transcription: "/ˈdɪfɪkəlt/", kz: "қиын",            ru: "трудный",          example: "This exam is very difficult.",                level: "A2", topic: "Adjectives" },
  { id: 37, word: "clean",      transcription: "/kliːn/",     kz: "таза",            ru: "чистый / чистить", example: "Please clean your room.",                     level: "A2", topic: "Adjectives" },
  { id: 38, word: "language",   transcription: "/ˈlæŋɡwɪdʒ/",kz: "тіл",             ru: "язык",             example: "English is a global language.",               level: "A2", topic: "Education" },
  { id: 39, word: "country",    transcription: "/ˈkʌntri/",   kz: "ел, мемлекет",    ru: "страна",           example: "Kazakhstan is a beautiful country.",          level: "A2", topic: "Places" },
  { id: 40, word: "between",    transcription: "/bɪˈtwiːn/",  kz: "арасында",        ru: "между",            example: "The park is between the school and the shop.", level: "A2", topic: "Prepositions" },

  // ─── B1 — Intermediate ───────────────────────────────────────────────────
  { id: 41, word: "achieve",    transcription: "/əˈtʃiːv/",   kz: "қол жеткізу",     ru: "достигать",        example: "She worked hard to achieve her goals.",       level: "B1", topic: "Goals" },
  { id: 42, word: "environment",transcription: "/ɪnˈvaɪrənmənt/",kz: "қоршаған орта",ru: "окружающая среда", example: "We must protect the environment.",            level: "B1", topic: "Nature" },
  { id: 43, word: "experience", transcription: "/ɪkˈspɪəriəns/",kz: "тәжірибе",      ru: "опыт",             example: "She has a lot of experience in teaching.",   level: "B1", topic: "Work" },
  { id: 44, word: "improve",    transcription: "/ɪmˈpruːv/",  kz: "жақсарту",        ru: "улучшать",         example: "I want to improve my English skills.",        level: "B1", topic: "Verbs" },
  { id: 45, word: "suggest",    transcription: "/səˈdʒest/",   kz: "ұсыну",           ru: "предлагать",       example: "Can you suggest a good restaurant?",         level: "B1", topic: "Verbs" },
  { id: 46, word: "describe",   transcription: "/dɪˈskraɪb/",  kz: "сипаттау",        ru: "описывать",        example: "Please describe what you see.",               level: "B1", topic: "Verbs" },
  { id: 47, word: "decision",   transcription: "/dɪˈsɪʒən/",  kz: "шешім",           ru: "решение",          example: "Making a decision is not always easy.",       level: "B1", topic: "General" },
  { id: 48, word: "discuss",    transcription: "/dɪˈskʌs/",   kz: "талқылау",        ru: "обсуждать",        example: "Let's discuss the main points.",              level: "B1", topic: "Verbs" },
  { id: 49, word: "manage",     transcription: "/ˈmænɪdʒ/",   kz: "басқару",         ru: "управлять",        example: "She manages a team of 10 people.",            level: "B1", topic: "Work" },
  { id: 50, word: "opportunity",transcription: "/ˌɒpəˈtjuːnɪti/",kz: "мүмкіндік",   ru: "возможность",      example: "This is a great opportunity for growth.",    level: "B1", topic: "General" },
  { id: 51, word: "responsibility",transcription: "/rɪˌspɒnsəˈbɪlɪti/",kz: "жауапкершілік",ru: "ответственность",example: "It is your responsibility to be on time.", level: "B1", topic: "General" },
  { id: 52, word: "research",   transcription: "/rɪˈsɜːrtʃ/", kz: "зерттеу",         ru: "исследование",     example: "We need more research on this topic.",        level: "B1", topic: "Academic" },
  { id: 53, word: "society",    transcription: "/səˈsaɪəti/", kz: "қоғам",           ru: "общество",         example: "Technology changes our society.",             level: "B1", topic: "Social" },
  { id: 54, word: "increase",   transcription: "/ɪnˈkriːs/",  kz: "өсу, арту",       ru: "увеличиваться",    example: "Prices continue to increase every year.",    level: "B1", topic: "Economy" },
  { id: 55, word: "compare",    transcription: "/kəmˈpeər/",  kz: "салыстыру",       ru: "сравнивать",       example: "Let's compare the two options.",              level: "B1", topic: "Academic" },
  { id: 56, word: "opinion",    transcription: "/əˈpɪnjən/",  kz: "пікір",           ru: "мнение",           example: "In my opinion, this is the best choice.",    level: "B1", topic: "Academic" },
  { id: 57, word: "purpose",    transcription: "/ˈpɜːrpəs/",  kz: "мақсат",          ru: "цель / назначение",example: "What is the purpose of this meeting?",        level: "B1", topic: "General" },
  { id: 58, word: "although",   transcription: "/ɔːlˈðoʊ/",   kz: "дегенмен, бірақ", ru: "хотя",             example: "Although it rained, we went outside.",       level: "B1", topic: "Connectors" },
  { id: 59, word: "therefore",  transcription: "/ˈðeərfɔːr/", kz: "сондықтан",       ru: "поэтому",          example: "He was late; therefore, he missed the bus.", level: "B1", topic: "Connectors" },
  { id: 60, word: "consider",   transcription: "/kənˈsɪdər/", kz: "ойластыру",       ru: "рассматривать",    example: "You should consider all the options.",        level: "B1", topic: "Verbs" },

  // ─── B2 — Upper-Intermediate ─────────────────────────────────────────────
  { id: 61, word: "analyze",    transcription: "/ˈænəlaɪz/",  kz: "талдау",          ru: "анализировать",    example: "We need to analyze the data carefully.",      level: "B2", topic: "Academic" },
  { id: 62, word: "significant",transcription: "/sɪɡˈnɪfɪkənt/",kz: "маңызды",      ru: "значимый",         example: "There has been a significant improvement.",   level: "B2", topic: "Academic" },
  { id: 63, word: "implement",  transcription: "/ˈɪmplɪment/",kz: "іске асыру",      ru: "внедрять",         example: "We will implement the new policy next month.",level: "B2", topic: "Business" },
  { id: 64, word: "collaborate",transcription: "/kəˈlæbəreɪt/",kz: "бірлесіп жұмыс істеу",ru: "сотрудничать",example: "We collaborate with international partners.", level: "B2", topic: "Business" },
  { id: 65, word: "ambiguous",  transcription: "/æmˈbɪɡjuəs/",kz: "екіұшты",         ru: "неоднозначный",    example: "The instructions were ambiguous.",            level: "B2", topic: "Academic" },
  { id: 66, word: "constraint", transcription: "/kənˈstreɪnt/",kz: "шектеу",         ru: "ограничение",      example: "Budget constraints affect the project.",      level: "B2", topic: "Business" },
  { id: 67, word: "imply",      transcription: "/ɪmˈplaɪ/",   kz: "астарлап айту",   ru: "подразумевать",    example: "What does this sentence imply?",              level: "B2", topic: "Academic" },
  { id: 68, word: "assess",     transcription: "/əˈses/",     kz: "бағалау",         ru: "оценивать",        example: "Teachers assess students every term.",        level: "B2", topic: "Education" },
  { id: 69, word: "prevalent",  transcription: "/ˈprevələnt/",kz: "кең таралған",    ru: "распространённый", example: "Social media is prevalent among teenagers.",  level: "B2", topic: "Society" },
  { id: 70, word: "furthermore",transcription: "/ˌfɜːrðərˈmɔːr/",kz: "одан басқа",  ru: "кроме того",       example: "Furthermore, the results were unexpected.",   level: "B2", topic: "Connectors" },
  { id: 71, word: "nevertheless",transcription: "/ˌnevərðəˈles/",kz: "соған қарамастан",ru: "тем не менее",  example: "Nevertheless, we continued with the plan.",   level: "B2", topic: "Connectors" },
  { id: 72, word: "perspective",transcription: "/pərˈspektɪv/",kz: "көзқарас",       ru: "перспектива",      example: "Try to see it from a different perspective.", level: "B2", topic: "Academic" },
  { id: 73, word: "consequence",transcription: "/ˈkɒnsɪkwəns/",kz: "салдар",         ru: "последствие",      example: "Think about the consequences of your choice.",level: "B2", topic: "Academic" },
  { id: 74, word: "influence",  transcription: "/ˈɪnfluəns/", kz: "ықпал ету",       ru: "влиять",           example: "Music can influence your mood.",              level: "B2", topic: "General" },
  { id: 75, word: "demonstrate",transcription: "/ˈdemənstreɪt/",kz: "дәлелдеу, көрсету",ru: "демонстрировать",example: "Please demonstrate how it works.",           level: "B2", topic: "Verbs" },
  { id: 76, word: "fundamental",transcription: "/ˌfʌndəˈmentəl/",kz: "негізгі",      ru: "фундаментальный",  example: "This is a fundamental concept in science.",  level: "B2", topic: "Academic" },
  { id: 77, word: "adequate",   transcription: "/ˈædɪkwɪt/",  kz: "жеткілікті",      ru: "достаточный",      example: "The training was adequate for the role.",     level: "B2", topic: "Academic" },
  { id: 78, word: "acknowledge",transcription: "/əkˈnɒlɪdʒ/", kz: "мойындау",        ru: "признавать",       example: "She acknowledged her mistake.",               level: "B2", topic: "Verbs" },
  { id: 79, word: "assume",     transcription: "/əˈsjuːm/",   kz: "болжау",          ru: "предполагать",     example: "Don't assume you know the answer.",           level: "B2", topic: "Verbs" },
  { id: 80, word: "despite",    transcription: "/dɪˈspaɪt/",  kz: "қарамастан",      ru: "несмотря на",      example: "Despite the rain, the match continued.",     level: "B2", topic: "Prepositions" },

  // ─── C1 — Advanced ───────────────────────────────────────────────────────
  { id: 81, word: "comprehensive",transcription: "/ˌkɒmprɪˈhensɪv/",kz: "жан-жақты",ru: "всесторонний",     example: "A comprehensive study was conducted.",        level: "C1", topic: "Academic" },
  { id: 82, word: "elaborate",  transcription: "/ɪˈlæbəreɪt/",kz: "егжей-тегжейлі",  ru: "подробный",        example: "Could you elaborate on that point?",          level: "C1", topic: "Academic" },
  { id: 83, word: "phenomenon", transcription: "/fɪˈnɒmɪnən/",kz: "құбылыс",         ru: "явление",          example: "Climate change is a global phenomenon.",      level: "C1", topic: "Academic" },
  { id: 84, word: "coherent",   transcription: "/koʊˈhɪərənt/",kz: "бірізді, логикалы",ru: "связный",        example: "Please write a coherent argument.",           level: "C1", topic: "Writing" },
  { id: 85, word: "facilitate", transcription: "/fəˈsɪlɪteɪt/",kz: "жеңілдету",      ru: "способствовать",   example: "Technology facilitates communication.",       level: "C1", topic: "Academic" },
  { id: 86, word: "implication",transcription: "/ˌɪmplɪˈkeɪʃən/",kz: "салдар, нәтиже",ru: "подтекст",       example: "What are the implications of this research?", level: "C1", topic: "Academic" },
  { id: 87, word: "scrutinize", transcription: "/ˈskruːtɪnaɪz/",kz: "мұқият тексеру",ru: "тщательно изучать",example: "Journalists scrutinize political decisions.", level: "C1", topic: "Verbs" },
  { id: 88, word: "subtle",     transcription: "/ˈsʌtəl/",    kz: "нәзік, байқалмайтын",ru: "тонкий",        example: "There is a subtle difference between them.",  level: "C1", topic: "Adjectives" },
  { id: 89, word: "alleviate",  transcription: "/əˈliːvieɪt/",kz: "жеңілдету",       ru: "облегчать",        example: "This medicine alleviates the pain.",          level: "C1", topic: "Medical" },
  { id: 90, word: "inherent",   transcription: "/ɪnˈhɪərənt/",kz: "тума, туа біткен", ru: "присущий",        example: "There are inherent risks in every investment.",level: "C1", topic: "Academic" },
  { id: 91, word: "undermine",  transcription: "/ˌʌndərˈmaɪn/",kz: "әлсірету",       ru: "подрывать",        example: "This could undermine the peace process.",     level: "C1", topic: "Verbs" },
  { id: 92, word: "inevitable", transcription: "/ɪnˈevɪtəbəl/",kz: "сөзсіз, болмай қоймайтын",ru: "неизбежный",example: "Change is inevitable in life.",             level: "C1", topic: "Adjectives" },
  { id: 93, word: "paradox",    transcription: "/ˈpærədɒks/",  kz: "парадокс",        ru: "парадокс",         example: "It is a paradox that speed causes accidents.",level: "C1", topic: "Academic" },
  { id: 94, word: "eloquent",   transcription: "/ˈeləkwənt/",  kz: "шешен",           ru: "красноречивый",    example: "She gave an eloquent speech.",                level: "C1", topic: "Speaking" },
  { id: 95, word: "hierarchy",  transcription: "/ˈhaɪərɑːrki/",kz: "иерархия",        ru: "иерархия",         example: "There is a strict hierarchy in the company.", level: "C1", topic: "Business" },
  { id: 96, word: "pragmatic",  transcription: "/præɡˈmætɪk/", kz: "прагматикалық",   ru: "прагматичный",     example: "We need a pragmatic approach to this issue.", level: "C1", topic: "Adjectives" },
  { id: 97, word: "speculation",transcription: "/ˌspekjʊˈleɪʃən/",kz: "болжам",      ru: "спекуляция",       example: "There is much speculation about the future.", level: "C1", topic: "Academic" },
  { id: 98, word: "consensus",  transcription: "/kənˈsensəs/", kz: "келісім",         ru: "консенсус",        example: "We reached a consensus on the decision.",     level: "C1", topic: "Business" },
  { id: 99, word: "contemporary",transcription: "/kənˈtempərəri/",kz: "заманауи",     ru: "современный",      example: "She is a contemporary artist.",               level: "C1", topic: "Adjectives" },
  { id: 100,word: "articulate", transcription: "/ɑːrˈtɪkjʊlɪt/",kz: "нақты жеткізу",  ru: "внятно излагать",  example: "He can articulate his ideas clearly.",        level: "C1", topic: "Speaking" },

  // ─── C2 — Proficiency ────────────────────────────────────────────────────
  { id: 101,word: "esoteric",   transcription: "/ˌesəˈterɪk/", kz: "таңдаулылар ғана білетін",ru: "эзотерический",example: "This is an esoteric branch of philosophy.", level: "C2", topic: "Academic" },
  { id: 102,word: "ubiquitous", transcription: "/juːˈbɪkwɪtəs/",kz: "барлық жерде кездесетін",ru: "вездесущий",  example: "Smartphones are now ubiquitous.",             level: "C2", topic: "Academic" },
  { id: 103,word: "ephemeral",  transcription: "/ɪˈfemərəl/",  kz: "өткінші, уақытша",ru: "мимолётный",       example: "Fame can be ephemeral.",                      level: "C2", topic: "Adjectives" },
  { id: 104,word: "convoluted", transcription: "/ˈkɒnvəluːtɪd/",kz: "күрделі, шытырман",ru: "запутанный",    example: "The plot was convoluted and hard to follow.", level: "C2", topic: "Adjectives" },
  { id: 105,word: "meticulous", transcription: "/məˈtɪkjʊləs/",kz: "ұқыпты, мұқият", ru: "тщательный",       example: "She is meticulous in her research.",          level: "C2", topic: "Adjectives" },
  { id: 106,word: "juxtapose",  transcription: "/ˈdʒʌkstəpəʊz/",kz: "қатар қою",     ru: "сопоставлять",     example: "The film juxtaposes beauty and brutality.",   level: "C2", topic: "Verbs" },
  { id: 107,word: "ostensibly", transcription: "/ɒˈstensɪbli/",kz: "сырт қарағанда", ru: "по видимости",     example: "Ostensibly, he agreed but did nothing.",      level: "C2", topic: "Adverbs" },
  { id: 108,word: "equivocal",  transcription: "/ɪˈkwɪvəkəl/", kz: "түсінігі бұлдыр",ru: "двусмысленный",    example: "His answer was deliberately equivocal.",      level: "C2", topic: "Adjectives" },
  { id: 109,word: "perspicacious",transcription: "/ˌpɜːspɪˈkeɪʃəs/",kz: "зерек, тез ұғатын",ru: "проницательный",example: "A perspicacious reader will notice the irony.",level: "C2", topic: "Adjectives" },
  { id: 110,word: "circumvent", transcription: "/ˌsɜːkəmˈvent/",kz: "айналып өту",   ru: "обходить",         example: "He tried to circumvent the law.",             level: "C2", topic: "Verbs" },
  { id: 111,word: "supercilious",transcription: "/ˌsuːpərˈsɪliəs/",kz: "менсінбеушілік",ru: "высокомерный",  example: "His supercilious attitude annoyed everyone.", level: "C2", topic: "Adjectives" },
  { id: 112,word: "tenacious",  transcription: "/tɪˈneɪʃəs/",  kz: "табандылықпен",   ru: "настойчивый",      example: "She is tenacious in pursuing her goals.",     level: "C2", topic: "Adjectives" },
  { id: 113,word: "verisimilitude",transcription: "/ˌverɪsɪˈmɪlɪtjuːd/",kz: "шындыққа ұқсастық",ru: "правдоподобие",example: "The novel has great verisimilitude.",     level: "C2", topic: "Literature" },
  { id: 114,word: "obfuscate",  transcription: "/ˈɒbfʌskeɪt/", kz: "шатастыру",       ru: "запутывать",       example: "Politicians often obfuscate the truth.",     level: "C2", topic: "Verbs" },
  { id: 115,word: "inexorable", transcription: "/ɪnˈeksərəbəl/",kz: "тоқтатуға болмайтын",ru: "неотвратимый",  example: "The inexorable march of time continues.",    level: "C2", topic: "Adjectives" },
];

export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = typeof LEVELS[number];

export const LEVEL_COLORS: Record<Level, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-teal-100 text-teal-700 border-teal-200",
  B1: "bg-blue-100 text-blue-700 border-blue-200",
  B2: "bg-indigo-100 text-indigo-700 border-indigo-200",
  C1: "bg-violet-100 text-violet-700 border-violet-200",
  C2: "bg-rose-100 text-rose-700 border-rose-200",
};

export const LEVEL_DESCRIPTIONS: Record<Level, { en: string; kz: string; ru: string }> = {
  A1: { en: "Beginner",          kz: "Бастауыш деңгей",     ru: "Начальный уровень" },
  A2: { en: "Elementary",        kz: "Бастамашы деңгей",    ru: "Элементарный уровень" },
  B1: { en: "Intermediate",      kz: "Орташа деңгей",       ru: "Средний уровень" },
  B2: { en: "Upper-Intermediate",kz: "Орташадан жоғары",    ru: "Выше среднего" },
  C1: { en: "Advanced",          kz: "Жоғары деңгей",       ru: "Продвинутый уровень" },
  C2: { en: "Proficiency",       kz: "Шебер деңгей",        ru: "Уровень мастерства" },
};
