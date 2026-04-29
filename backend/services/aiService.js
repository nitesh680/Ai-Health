// AI Service - Emotion Detection, Sentiment Analysis, Crisis Detection
// Hybrid approach: Rule-based + NLP pattern matching
const translate = require('translate-google');

const CRISIS_PHRASES = [
  'i want to die', 'kill myself', 'end my life', 'suicide', 'self harm',
  'i feel hopeless', 'no reason to live', 'better off dead', 'want to disappear',
  'can\'t go on', 'ending it all', 'hurt myself', 'not worth living',
  'nobody would care if i was gone', 'i give up on life', 'i don\'t want to exist'
];

const EMOTION_KEYWORDS = {
  anxiety: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'scared', 'tense', 'restless', 'uneasy', 'dread', 'overthinking', 'racing thoughts'],
  depression: ['depressed', 'sad', 'empty', 'hopeless', 'worthless', 'tired', 'exhausted', 'numb', 'lonely', 'isolated', 'meaningless', 'unmotivated'],
  anger: ['angry', 'furious', 'irritated', 'frustrated', 'mad', 'rage', 'annoyed', 'hostile', 'resentful', 'bitter'],
  happiness: ['happy', 'joyful', 'grateful', 'excited', 'content', 'peaceful', 'blessed', 'wonderful', 'amazing', 'great', 'good', 'fantastic'],
  stress: ['stressed', 'overwhelmed', 'pressure', 'burden', 'overworked', 'burnout', 'swamped', 'deadline', 'too much'],
  loneliness: ['lonely', 'alone', 'isolated', 'no friends', 'nobody cares', 'disconnected', 'abandoned'],
  physical: ['fever', 'headache', 'headaches', 'pain', 'hurt', 'hurting', 'sick', 'illness', 'nausea', 'dizzy', 'tired', 'exhausted', 'body ache', 'muscle pain', 'cough', 'cold', 'flu']
};

const POSITIVE_WORDS = ['good', 'great', 'happy', 'better', 'wonderful', 'amazing', 'love', 'enjoy', 'grateful', 'excited', 'peaceful', 'calm', 'hopeful', 'strong', 'confident', 'proud', 'optimistic'];
const NEGATIVE_WORDS = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'angry', 'sad', 'depressed', 'anxious', 'worried', 'scared', 'lonely', 'hopeless', 'worthless', 'empty', 'tired', 'exhausted', 'frustrated', 'overwhelmed', 'pain', 'hurt', 'suffer', 'cry', 'crying'];

const COPING_SUGGESTIONS = {
  anxiety: [
    "Try the 4-7-8 breathing technique: Breathe in for 4 seconds, hold for 7, exhale for 8.",
    "Ground yourself using the 5-4-3-2-1 technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
    "Progressive muscle relaxation can help reduce tension. Start from your toes and work up.",
    "Write down your worries. Sometimes putting them on paper makes them feel more manageable."
  ],
  depression: [
    "Even a short 10-minute walk can boost your mood. Movement releases endorphins.",
    "Try to maintain a routine, even a simple one. Structure can provide comfort.",
    "Reach out to someone you trust. Connection is powerful medicine.",
    "Practice self-compassion. Speak to yourself as you would a dear friend."
  ],
  anger: [
    "Take a timeout. Step away from the situation for at least 10 minutes.",
    "Physical exercise is one of the best outlets for anger. Try a brisk walk or run.",
    "Try expressing your feelings using 'I' statements rather than 'you' accusations.",
    "Deep breathing can help activate your parasympathetic nervous system."
  ],
  stress: [
    "Break overwhelming tasks into smaller, manageable steps.",
    "Practice mindfulness meditation, even just 5 minutes can help center you.",
    "Identify what you can and cannot control. Focus energy on what you can change.",
    "Make sure you're getting adequate sleep. Rest is essential for stress management."
  ],
  loneliness: [
    "Consider joining a support group or community activity.",
    "Volunteering can create meaningful connections and a sense of purpose.",
    "Reach out to an old friend or family member. A simple message can reconnect bonds.",
    "Remember that feeling lonely is temporary. You are worthy of connection."
  ],
  happiness: [
    "Keep a gratitude journal to maintain this positive energy!",
    "Share your joy with others — positivity is contagious.",
    "Savor this moment. Mindfully appreciate what's going well.",
    "Use this energy to build positive habits that support your wellbeing."
  ],
  physical: [
    "Make sure to rest and stay hydrated. Your body needs time to heal.",
    "Consider consulting a healthcare professional if symptoms persist.",
    "Gentle movement or stretching might help, but don't overexert yourself.",
    "Physical symptoms can sometimes be connected to stress. Notice how you're feeling emotionally too."
  ]
};

const EMPATHETIC_RESPONSES = {
  anxiety: [
    "I can sense that you're feeling anxious right now. That must be really tough. Let's work through this together.",
    "Anxiety can feel overwhelming, but please know that these feelings are temporary. You're stronger than you think.",
    "I hear you. Feeling anxious is completely valid. Would you like to try a breathing exercise together?",
    "It takes courage to share these feelings. Know that anxiety doesn't define you."
  ],
  depression: [
    "I'm sorry you're going through this. Your feelings matter, and I'm here to listen without judgment.",
    "It sounds like you're carrying a heavy weight. You don't have to face this alone.",
    "I appreciate your honesty in sharing how you feel. Even on the darkest days, help is available.",
    "Depression can make everything feel impossible. But reaching out, like you just did, is a brave step."
  ],
  anger: [
    "I can tell you're really frustrated right now. It's okay to feel angry — it's a natural emotion.",
    "Your feelings are valid. Let's explore what might be underneath this anger together.",
    "It sounds like something has really upset you. I'm here to listen whenever you're ready.",
    "Anger often signals that something important to us has been crossed. Let's talk about it."
  ],
  stress: [
    "It sounds like you have a lot on your plate right now. Let's take a moment to breathe together.",
    "Feeling overwhelmed is understandable. You're doing the best you can, and that's enough.",
    "Stress can be exhausting. What's one small thing we could take off your worry list right now?",
    "I hear how stressed you are. Remember, it's okay to ask for help and take breaks."
  ],
  loneliness: [
    "Feeling lonely can be painful. I want you to know that you matter, and I'm here for you right now.",
    "Loneliness doesn't mean you're unworthy of connection. Sometimes we just need to reach out.",
    "I'm sorry you're feeling alone. This conversation is a step toward connection, and I'm glad you're here.",
    "You're not truly alone, even when it feels that way. There are people who care about you."
  ],
  happiness: [
    "That's wonderful to hear! I'm so glad you're feeling good. What's bringing you joy today?",
    "Your positive energy is beautiful! Keep nurturing these things that make you happy.",
    "I love hearing this! Moments of happiness are precious. Let's celebrate them!",
    "That's great! What a wonderful headspace to be in. Keep it up!"
  ],
  physical: [
    "I'm sorry to hear you're not feeling well physically. Physical discomfort can be really challenging. How long have you been experiencing this?",
    "It sounds like you're dealing with some physical symptoms right now. Taking care of your body is important - make sure you rest and consider reaching out to a healthcare provider.",
    "Physical symptoms can be really draining, both physically and emotionally. I'm here to listen if you want to talk about how this is affecting you.",
    "I'm sorry you're going through this. Physical health issues can be stressful. Remember to be patient with yourself as you recover."
  ],
  neutral: [
    "Thank you for sharing that with me. How are you feeling about it?",
    "I appreciate you opening up. Would you like to explore your feelings further?",
    "I'm here to listen. Tell me more about what's on your mind.",
    "Thank you for talking with me. Is there anything specific weighing on you today?"
  ]
};

const MULTILINGUAL = {
  hi: {
    greeting: "नमस्ते! मैं आपका मानसिक स्वास्थ्य सहायक हूँ। आज आप कैसा महसूस कर रहे हैं?",
    crisis: "कृपया तुरंत किसी विश्वसनीय व्यक्ति से बात करें। हेल्पलाइन: iCALL - 9152987821",
    support: "आप अकेले नहीं हैं। मैं आपकी मदद के लिए यहाँ हूँ।"
  },
  te: {
    greeting: "నమస్కారం! నేను మీ మానసిక ఆరోగ్య సహాయకుడిని. మీరు ఈరోజు ఎలా ఫీల్ అవుతున్నారు?",
    crisis: "దయచేసి వెంటనే నమ్మకమైన వ్యక్తితో మాట్లాడండి. హెల్ప్‌లైన్: iCALL - 9152987821",
    support: "మీరు ఒంటరిగా లేరు. నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను."
  },
  en: {
    greeting: "Hello! I'm your mental health companion. How are you feeling today?",
    crisis: "Please reach out to someone you trust immediately. Crisis Helpline: 988 (US) | iCALL: 9152987821 (India)",
    support: "You are not alone. I'm here to help and support you."
  }
};

class AIService {
  detectEmotion(text) {
    const lowerText = text.toLowerCase();
    const scores = {};

    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
      let score = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          score += 1;
        }
      }
      if (score > 0) scores[emotion] = score;
    }

    if (Object.keys(scores).length === 0) return 'neutral';
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  }

  analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of words) {
      if (POSITIVE_WORDS.includes(word)) positiveCount++;
      if (NEGATIVE_WORDS.includes(word)) negativeCount++;
    }

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > 0 && negativeCount > 0) return 'mixed';
    return 'neutral';
  }

  calculateRiskScore(text, emotion, sentiment) {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Crisis phrase check (highest weight)
    for (const phrase of CRISIS_PHRASES) {
      if (lowerText.includes(phrase)) {
        score += 40;
        break;
      }
    }

    // Emotion-based scoring
    const emotionWeights = { depression: 25, anxiety: 15, loneliness: 20, anger: 10, stress: 10 };
    score += emotionWeights[emotion] || 0;

    // Sentiment-based scoring
    if (sentiment === 'negative') score += 15;
    if (sentiment === 'mixed') score += 5;

    // Negative word density
    const words = lowerText.split(/\s+/);
    const negCount = words.filter(w => NEGATIVE_WORDS.includes(w)).length;
    const negDensity = negCount / words.length;
    if (negDensity > 0.3) score += 15;
    else if (negDensity > 0.15) score += 8;

    return Math.min(score, 100);
  }

  calculateStressLevel(riskScore, emotion) {
    if (riskScore >= 60 || emotion === 'panic' || emotion === 'crisis') return 'High';
    if (riskScore >= 30 || emotion === 'anxiety' || emotion === 'stress' || emotion === 'anger') return 'Medium';
    return 'Low';
  }

  detectCrisis(text) {
    const lowerText = text.toLowerCase();
    for (const phrase of CRISIS_PHRASES) {
      if (lowerText.includes(phrase)) {
        return { detected: true, phrase, severity: 'critical' };
      }
    }
    return { detected: false, phrase: null, severity: 'none' };
  }

  async generateResponse(text, emotion, sentiment, riskScore, language = 'en', conversationHistory = []) {
    // Crisis response takes priority
    if (riskScore >= 70) {
      const langData = MULTILINGUAL[language] || MULTILINGUAL.en;
      return {
        message: `I'm really concerned about what you've shared. ${langData.crisis}\n\n${langData.support}\n\nPlease remember: You matter, and help is available right now. Would you like me to connect you with a mental health professional?`,
        type: 'crisis',
        suggestions: ['Contact a helpline', 'Talk to your doctor', 'Emergency services']
      };
    }

    const lowerText = text.toLowerCase();
    const words = text.split(/\s+/);
    const messageHash = words.reduce((acc, w) => acc + w.charCodeAt(0), 0);
    
    // Generate dynamic response based on specific content
    let response = this.generateDynamicResponse(lowerText, emotion, words, messageHash);
    
    // Add contextual follow-up based on conversation history
    const hasHistory = conversationHistory && conversationHistory.length > 0;
    if (hasHistory) {
      const uniqueIntros = [
        "",
        "I appreciate you sharing that with me. ",
        "Thank you for trusting me with that. ",
        "I'm here with you. ",
        "I hear what you're saying. "
      ];
      const introIndex = (messageHash + conversationHistory.length) % uniqueIntros.length;
      if (uniqueIntros[introIndex]) {
        response = uniqueIntros[introIndex] + response;
      }
    }

    // Add contextual suggestion
    const suggestion = this.generateContextualSuggestion(lowerText, emotion, messageHash);
    if (suggestion) {
      response += `\n\n💡 **Try this:** ${suggestion}`;
    }

    // Add conversation continuity marker for ongoing chats
    if (hasHistory && conversationHistory.length > 2) {
      const markers = [
        "\n\n_What would you like to explore next?_",
        "\n\n_I'm here to continue whenever you're ready._",
        "\n\n_Tell me more when you feel comfortable._"
      ];
      const markerIndex = messageHash % markers.length;
      response += markers[markerIndex];
    }

    if (language !== 'en') {
      try {
        response = await translate(response, { to: language });
      } catch (error) {
        console.error('Translation failed, falling back to English', error);
      }
    }

    return {
      message: response,
      type: riskScore >= 40 ? 'warning' : 'normal',
      suggestions: this.getSuggestionsForEmotion(emotion)
    };
  }

  generateDynamicResponse(text, emotion, words, hash) {
    // Content-specific response generation
    const specificResponses = {
      fever: [
        "Having a fever can be really uncomfortable. Your body is fighting something off - make sure you rest and stay hydrated. Have you taken your temperature?",
        "Fevers are tough. Your immune system is working hard right now. Rest, drink plenty of fluids, and monitor your temperature. Is anyone there to help you?",
        "I understand you're dealing with a fever right now. That can make everything feel worse. Please make sure you're resting and consider reaching out to a healthcare provider if it's high or persistent."
      ],
      headache: [
        "Headaches can be so draining. Is it a tension headache or more like a migraine? Sometimes stress, dehydration, or screen time can trigger them.",
        "I'm sorry you're dealing with a headache. That can make it hard to focus on anything else. Try resting in a quiet, dark room and make sure you're drinking water.",
        "Headaches are really debilitating. Take a moment to rest if you can. Sometimes a cool compress on the forehead or gentle neck stretches can provide some relief."
      ],
      pain: [
        "Physical pain can be exhausting both physically and mentally. Where are you experiencing the pain? Remember it's okay to ask for help.",
        "I'm sorry you're in pain. Whether it's sharp or dull, acute or chronic, it deserves attention. Have you been able to rest the affected area?",
        "Dealing with pain is challenging. It can affect your mood and energy too. Make sure you're being gentle with yourself while you heal."
      ],
      sick: [
        "Being sick can leave you feeling helpless and frustrated. Your body needs time and rest to recover. What symptoms are bothering you most?",
        "I hear that you're not feeling well. Illness can be isolating too. Do you have someone who can check in on you or help with daily tasks?",
        "When we're sick, it's important to be patient with our bodies. Rest isn't laziness - it's medicine. Make sure you're giving yourself permission to recover."
      ],
      anxious: [
        "That anxiety sounds overwhelming. The physical sensations - racing heart, tight chest - can feel scary. Remember these feelings will pass.",
        "Anxiety has a way of making everything feel urgent and threatening. What you're experiencing is your body's alarm system working overtime. You are safe right now.",
        "I can hear the worry in your words. Anxiety can make it hard to think clearly. Try grounding yourself in this present moment - what do you see, hear, feel right now?"
      ],
      worried: [
        "Worrying can feel like carrying a heavy weight around. What specifically is on your mind? Sometimes naming it helps make it more manageable.",
        "It's exhausting to worry constantly. Your mind is trying to protect you by preparing for worst-case scenarios, but it's taking a toll on you right now.",
        "I understand that worry. It can spiral and grow when we keep it inside. Is there something specific triggering these thoughts, or does it feel more general?"
      ],
      sad: [
        "Sadness is a natural response to difficult situations, though that doesn't make it easier to carry. What you're feeling matters.",
        "Feeling sad can make everything look gray and heavy. It's okay to sit with those feelings rather than push them away - they have something to tell you.",
        "I hear that you're feeling down. Sometimes sadness comes in waves. Be gentle with yourself during this time, just as you would be with a friend."
      ],
      tired: [
        "Exhaustion affects everything - our patience, our outlook, even our ability to cope. What has your sleep been like lately?",
        "Being tired all the time is draining. It can make problems feel bigger and solutions feel harder. Is this physical tiredness, emotional, or both?",
        "I understand that fatigue. When we're depleted, everything requires more effort. Your body and mind might be asking for rest and restoration."
      ],
      happy: [
        "That's wonderful! Positive moments deserve to be noticed and savored. What's contributing to this good feeling?",
        "I'm so glad you're feeling good! These moments of lightness are precious. What's going well for you right now?",
        "Your happiness comes through in your words! It's beautiful to acknowledge and celebrate these feelings when they arise."
      ],
      stressed: [
        "Stress can feel like you're carrying the weight of everything at once. What demands are feeling most pressing right now?",
        "Being overwhelmed is exhausting. Sometimes we take on too much without realizing it. What's one thing you could set down, even temporarily?",
        "I hear the pressure you're under. Stress affects both body and mind. Have you had any moments of pause or rest today?"
      ],
      lonely: [
        "Loneliness can feel heavy, even when we're surrounded by people. It's about connection quality, not just quantity.",
        "Feeling alone is painful. Humans are wired for connection, so when we lack it, we suffer. What kind of connection are you missing most?",
        "I understand that lonely feeling. It can make us feel invisible or forgotten. But reaching out like this shows courage and hope."
      ],
      angry: [
        "Anger is a signal that something matters to you - a boundary crossed, a value violated. What triggered this feeling?",
        "I hear your frustration. Anger carries energy and information. Sometimes it helps to channel it constructively or express it safely.",
        "That anger sounds intense. It's a valid emotion, even if uncomfortable. What's underneath it - hurt, fear, disappointment?"
      ]
    };

    // Check for specific keyword matches
    for (const [keyword, responses] of Object.entries(specificResponses)) {
      if (text.includes(keyword)) {
        return responses[hash % responses.length];
      }
    }

    // Default emotion-based responses with more variety
    const dynamicEmotionResponses = {
      anxiety: [
        "Anxiety can feel like your mind is racing ahead while your body tries to catch up. The what-ifs can spiral endlessly.",
        "When anxiety hits, it can feel like you're bracing for something bad to happen even when things are okay in this moment.",
        "I notice you're feeling anxious. Sometimes naming it out loud helps create a little distance from the feeling itself."
      ],
      depression: [
        "Depression has a way of making everything feel heavy and distant - even things that used to bring joy.",
        "I hear that emptiness. Depression isn't sadness exactly; it's more like a fog that makes everything harder to feel and do.",
        "That hopelessness is painful to carry. Depression lies to us about our future and our worth, even when it feels true."
      ],
      anger: [
        "Anger is fiery and demanding. It wants something to change, to be acknowledged, to be made right.",
        "That frustration comes through clearly. Anger often masks other feelings underneath - hurt, fear, helplessness.",
        "I hear the intensity in your words. Anger can feel empowering but also exhausting. What needs protecting or changing?"
      ],
      happiness: [
        "Your positive energy is a gift - both to yourself and those around you. What do you attribute this good feeling to?",
        "That's wonderful to hear! These moments of genuine contentment are worth noticing and remembering.",
        "I'm smiling reading your message! Joy, even when brief, reminds us that life holds lightness too."
      ],
      stress: [
        "Stress piles up - responsibilities, expectations, demands - until it feels like you can't breathe.",
        "I hear the overwhelm. Stress makes everything feel urgent and important, when actually some things can wait.",
        "That pressure sounds intense. Sometimes we carry stress so long we forget what relaxation even feels like."
      ],
      loneliness: [
        "Loneliness can feel like you're on an island while everyone else is connected on the mainland.",
        "That isolation is heavy. Humans need belonging - to be seen, heard, and accepted. It's not weakness to need others.",
        "I understand that disconnected feeling. Sometimes we can be in a room full of people and still feel utterly alone."
      ],
      physical: [
        "Physical symptoms affect more than just our bodies - they drain our emotional reserves too.",
        "I'm sorry you're dealing with physical discomfort. It can be frustrating when our bodies don't cooperate with our plans.",
        "Health issues demand our attention and patience. Sometimes the hardest part is accepting we need to slow down."
      ],
      neutral: [
        "Thank you for sharing that with me. What else is on your mind today?",
        "I appreciate you reaching out. Is there something specific you'd like to talk about or explore?",
        "I'm here and listening. Tell me more about what you're experiencing or feeling."
      ]
    };

    const responses = dynamicEmotionResponses[emotion] || dynamicEmotionResponses.neutral;
    return responses[hash % responses.length];
  }

  generateContextualSuggestion(text, emotion, hash) {
    const contextualSuggestions = {
      fever: [
        "Drink plenty of water and get rest. Monitor your temperature.",
        "Try a lukewarm bath or cool compress to help with discomfort.",
        "Consider taking fever-reducing medication if appropriate for you."
      ],
      headache: [
        "Try drinking a full glass of water - dehydration often causes headaches.",
        "Gently massage your temples and neck muscles to relieve tension.",
        "Rest your eyes in a dark, quiet room for 15 minutes."
      ],
      anxious: [
        "Try box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4.",
        "Name 5 things you can see right now to ground yourself in the present.",
        "Place one hand on your chest and breathe slowly, feeling your heartbeat steady."
      ],
      sad: [
        "Write down three small things you're grateful for, even if they seem minor.",
        "Get outside for fresh air, even just for 5 minutes.",
        "Text or call one person who cares about you - connection helps."
      ],
      tired: [
        "Set a timer for a 20-minute power nap if possible.",
        "Step away from screens and close your eyes for just 2 minutes.",
        "Drink water and have a small healthy snack - energy levels dip when dehydrated or hungry."
      ],
      stressed: [
        "Write down everything on your mind, then circle only what must be done today.",
        "Take 5 deep breaths, making your exhale longer than your inhale.",
        "Step outside for fresh air - nature and movement both reduce stress hormones."
      ],
      angry: [
        "Write down your thoughts without censoring, then tear up the paper.",
        "Go for a brisk walk or do jumping jacks to release that energy physically.",
        "Ask yourself: what boundary was crossed, and how can you reinforce it?"
      ],
      lonely: [
        "Send one message to someone you care about - reaching out creates connection.",
        "Join an online community or forum around an interest you have.",
        "Practice self-care as you would care for a friend who's lonely."
      ],
      happy: [
        "Savor this moment - take a photo or write a note to remember it.",
        "Share your good mood by doing something kind for someone else.",
        "Notice what contributed to this feeling so you can create more of it."
      ],
      physical: [
        "Prioritize rest - your body is asking for recovery time.",
        "Consider reaching out to a healthcare provider if symptoms persist.",
        "Be gentle with yourself - lower your expectations while healing."
      ]
    };

    // Check for specific keywords first
    for (const [keyword, suggestions] of Object.entries(contextualSuggestions)) {
      if (text.includes(keyword)) {
        return suggestions[hash % suggestions.length];
      }
    }

    // Default emotion-based suggestions
    const defaultSuggestions = {
      anxiety: ["Practice deep breathing for 2 minutes.", "Write down your worries and set them aside.", "Take a warm shower or bath."],
      depression: ["Move your body gently - even stretching helps.", "Reach out to one trusted person today.", "Get outside for natural light, even briefly."],
      anger: ["Count to 10 slowly before responding to anything.", "Channel the energy into physical movement.", "Write out your feelings, then take a break."],
      stress: ["Identify one thing you can delegate or postpone.", "Practice progressive muscle relaxation.", "Take a complete break from screens for 15 minutes."],
      loneliness: ["Join an online group around a hobby you enjoy.", "Practice self-compassion like you would for a friend.", "Reach out to someone from your past."],
      happiness: ["Share your joy with someone who will celebrate with you.", "Do something creative while you're feeling good.", "Take note of what's working well in your life."],
      neutral: ["Try a 5-minute meditation or breathing exercise.", "Journal about your day and how you're feeling.", "Take a walk and observe your surroundings mindfully."]
    };

    const suggestions = defaultSuggestions[emotion] || defaultSuggestions.neutral;
    return suggestions[hash % suggestions.length];
  }

  getSuggestionsForEmotion(emotion) {
    const suggestions = {
      anxiety: ['Try deep breathing', 'Grounding techniques', 'Progressive muscle relaxation'],
      depression: ['Gentle movement', 'Reach out to someone', 'Get fresh air'],
      anger: ['Physical exercise', 'Write it out', 'Take a timeout'],
      stress: ['Prioritize tasks', 'Take breaks', 'Practice mindfulness'],
      loneliness: ['Join a community', 'Volunteer', 'Reconnect with old friends'],
      happiness: ['Share your joy', 'Practice gratitude', 'Savor the moment'],
      physical: ['Rest and hydrate', 'Consult a doctor', 'Gentle stretching'],
      neutral: ['Mindfulness practice', 'Journaling', 'Take a walk']
    };
    return suggestions[emotion] || suggestions.neutral;
  }

  generateSessionSummary(messages) {
    if (!messages || messages.length === 0) return 'No messages in this session.';

    const emotions = messages.map(m => m.emotion).filter(e => e && e !== 'neutral');
    const avgRisk = messages.reduce((sum, m) => sum + (m.riskScore || 0), 0) / messages.length;
    const sentiments = messages.map(m => m.sentiment).filter(Boolean);
    
    const emotionCounts = {};
    emotions.forEach(e => { emotionCounts[e] = (emotionCounts[e] || 0) + 1; });
    const topEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    
    const negativeSentCount = sentiments.filter(s => s === 'negative').length;
    const overallMood = negativeSentCount > sentiments.length / 2 ? 'predominantly negative' : 
                        negativeSentCount > sentiments.length / 4 ? 'mixed' : 'generally positive';

    let summary = `Session Summary (${messages.length} messages):\n`;
    summary += `• Overall mood: ${overallMood}\n`;
    summary += `• Average risk score: ${Math.round(avgRisk)}/100\n`;
    if (topEmotions.length > 0) {
      summary += `• Primary emotions detected: ${topEmotions.map(([e]) => e).join(', ')}\n`;
    }
    if (avgRisk >= 50) {
      summary += `• ⚠️ Elevated risk level detected - professional follow-up recommended\n`;
    }

    return summary;
  }

  getJournalPrompts() {
    return [
      "What are three things you're grateful for today?",
      "Describe a moment today that made you smile.",
      "What's one challenge you faced today and how did you handle it?",
      "Write about someone who positively impacts your life.",
      "What would you tell your younger self right now?",
      "Describe your ideal peaceful place in detail.",
      "What emotion are you feeling most strongly right now? Why?",
      "List five things that bring you comfort.",
      "What's one small step you can take today toward a goal?",
      "Write a letter of appreciation to yourself."
    ];
  }

  getGreeting(language = 'en') {
    return (MULTILINGUAL[language] || MULTILINGUAL.en).greeting;
  }
}

module.exports = new AIService();
