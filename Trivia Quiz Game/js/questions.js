(function () {
  "use strict";

  function question(text, correct, wrongA, wrongB, wrongC) {
    return { question: text, options: [correct, wrongA, wrongB, wrongC], correctIndex: 0 };
  }

  var bank = {
    "Elementary": {
      "Maths": [
        question("What is 7 + 5?", "12", "10", "13", "11"),
        question("What is half of 18?", "9", "8", "6", "12"),
        question("Which number is even?", "24", "17", "31", "45"),
        question("How many sides does a hexagon have?", "6", "5", "7", "8"),
        question("What is 4 times 6?", "24", "20", "26", "18"),
        question("Which fraction is equal to one half?", "2/4", "1/3", "3/5", "2/3"),
        question("What is 100 minus 37?", "63", "67", "73", "53"),
        question("How many minutes are in one hour?", "60", "30", "100", "90"),
        question("What is the perimeter of a square with sides of 3 cm?", "12 cm", "9 cm", "6 cm", "15 cm"),
        question("Which number comes next: 5, 10, 15, ...?", "20", "18", "25", "16")
      ],
      "Science": [
        question("Which planet do we live on?", "Earth", "Mars", "Venus", "Jupiter"),
        question("What do bees collect from flowers to make honey?", "Nectar", "Sand", "Bark", "Seeds"),
        question("What is water called when it freezes?", "Ice", "Steam", "Rain", "Fog"),
        question("Which organ pumps blood around your body?", "Heart", "Lungs", "Stomach", "Brain"),
        question("What is the star at the center of our solar system?", "The Sun", "Polaris", "The Moon", "Sirius"),
        question("Which part of a plant usually grows underground?", "Root", "Flower", "Leaf", "Fruit"),
        question("What gas do people need to breathe?", "Oxygen", "Helium", "Hydrogen", "Neon"),
        question("Which animal is a mammal?", "Dolphin", "Trout", "Frog", "Eagle"),
        question("What force pulls objects toward Earth?", "Gravity", "Magnetism", "Friction", "Electricity"),
        question("Which material is attracted to a magnet?", "Iron", "Glass", "Paper", "Wood")
      ],
      "History": [
        question("Which ancient civilization built the pyramids at Giza?", "Ancient Egyptians", "Vikings", "Aztecs", "Romans"),
        question("Who was the first president of the United States?", "George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"),
        question("What do we call a person who studies the past?", "Historian", "Astronomer", "Botanist", "Geologist"),
        question("Which invention helped people print books quickly?", "The printing press", "The telescope", "The compass", "The steam engine"),
        question("Which city was buried after Mount Vesuvius erupted?", "Pompeii", "Athens", "Carthage", "Sparta"),
        question("What was the name of the ship that carried the Pilgrims to North America in 1620?", "Mayflower", "Endeavour", "Beagle", "Santa Maria"),
        question("Which ancient people are famous for building the Colosseum?", "Romans", "Maya", "Persians", "Phoenicians"),
        question("What was the Silk Road mainly used for?", "Trade between regions", "Ocean fishing", "Building castles", "Training horses"),
        question("Which wall was built to help protect northern China?", "The Great Wall", "Hadrian's Wall", "Berlin Wall", "Western Wall"),
        question("What do archaeologists study?", "Human history through objects and sites", "Weather patterns", "Ocean currents", "Living languages only")
      ],
      "Sports": [
        question("How many players from one soccer team are on the field at a time?", "11", "9", "10", "12"),
        question("Which sport uses a racket and a shuttlecock?", "Badminton", "Tennis", "Squash", "Table tennis"),
        question("How many rings are on the Olympic symbol?", "5", "4", "6", "7"),
        question("In basketball, how many points is a free throw worth?", "1", "2", "3", "4"),
        question("Which sport is played at Wimbledon?", "Tennis", "Cricket", "Golf", "Rugby"),
        question("What do swimmers wear to protect their eyes underwater?", "Goggles", "Shin guards", "A helmet", "A visor"),
        question("Which sport uses a puck?", "Ice hockey", "Baseball", "Volleyball", "Handball"),
        question("How many bases are on a baseball field?", "4", "3", "5", "6"),
        question("In which sport might you score a touchdown?", "American football", "Basketball", "Hockey", "Tennis"),
        question("What is the name for a race run over 26.2 miles?", "Marathon", "Sprint", "Triathlon", "Relay")
      ],
      "English": [
        question("Which word is a noun?", "Garden", "Quickly", "Blue", "Under"),
        question("What is the plural of 'child'?", "Children", "Childs", "Childes", "Childrens"),
        question("Which word means the opposite of 'ancient'?", "Modern", "Old", "Historic", "Early"),
        question("What punctuation mark ends a question?", "Question mark", "Comma", "Colon", "Semicolon"),
        question("Which word is an adjective in 'the bright moon'?", "Bright", "The", "Moon", "None"),
        question("What is the past tense of 'go'?", "Went", "Goed", "Gone", "Going"),
        question("Which pair of words rhyme?", "Light and kite", "Book and boot", "Tree and tray", "Rain and run"),
        question("Which word is a pronoun?", "They", "Table", "Green", "Jump"),
        question("What is a synonym for 'happy'?", "Joyful", "Tired", "Angry", "Quiet"),
        question("Which sentence is written as a command?", "Please close the door.", "The door is blue.", "Is the door open?", "What a lovely door!")
      ]
    },
    "High School": {
      "Maths": [
        question("Solve for x: 3x + 5 = 20.", "5", "3", "8", "15"),
        question("What is the slope of the line y = 4x - 2?", "4", "-2", "2", "-4"),
        question("What is the area of a circle with radius 3?", "9π", "6π", "3π", "12π"),
        question("What is the square root of 196?", "14", "12", "13", "16"),
        question("What is the median of 2, 4, 8, 10, 16?", "8", "6", "7", "10"),
        question("A right triangle has legs 6 and 8. What is its hypotenuse?", "10", "12", "14", "9"),
        question("What is 15% of 200?", "30", "15", "20", "35"),
        question("Which expression factors x² - 9?", "(x - 3)(x + 3)", "(x - 9)(x + 1)", "(x - 3)²", "(x + 9)(x - 1)"),
        question("What is the sum of the interior angles of a triangle?", "180°", "90°", "270°", "360°"),
        question("What is the probability of rolling an even number on a fair six-sided die?", "1/2", "1/3", "2/3", "1/6")
      ],
      "Science": [
        question("What is the atomic number of carbon?", "6", "8", "12", "14"),
        question("Which organelle is the main site of cellular respiration?", "Mitochondrion", "Ribosome", "Nucleus", "Golgi apparatus"),
        question("What is the chemical formula for table salt?", "NaCl", "KCl", "NaOH", "HCl"),
        question("What type of bond involves sharing electron pairs?", "Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"),
        question("What is the approximate acceleration due to gravity near Earth's surface?", "9.8 m/s²", "4.9 m/s²", "12.5 m/s²", "1.6 m/s²"),
        question("Which blood cells primarily carry oxygen?", "Red blood cells", "Platelets", "White blood cells", "Stem cells"),
        question("What is the pH of a neutral solution at room temperature?", "7", "0", "1", "14"),
        question("Which process converts liquid water into water vapor?", "Evaporation", "Condensation", "Freezing", "Deposition"),
        question("Which molecule carries genetic instructions in most organisms?", "DNA", "ATP", "Glucose", "Hemoglobin"),
        question("What is the SI unit of electric current?", "Ampere", "Volt", "Ohm", "Watt")
      ],
      "History": [
        question("In which year did the French Revolution begin?", "1789", "1776", "1815", "1848"),
        question("Which trade route connected Europe and Asia across many centuries?", "The Silk Road", "The Amber Route", "The Oregon Trail", "The Incense Trail"),
        question("Which document limited the power of the English king in 1215?", "Magna Carta", "Bill of Rights", "Petition of Right", "Act of Union"),
        question("Who was the first person to walk on the Moon?", "Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "Michael Collins"),
        question("Which empire was ruled from Constantinople after the Western Roman Empire fell?", "Byzantine Empire", "Mongol Empire", "Mali Empire", "Mughal Empire"),
        question("What event began in 1914 after the assassination of Archduke Franz Ferdinand?", "World War I", "World War II", "The Crimean War", "The Cold War"),
        question("Which civilization developed a writing system using cuneiform?", "Sumerians", "Incas", "Phoenicians", "Etruscans"),
        question("Which movement emphasized reason and scientific inquiry in 17th–18th century Europe?", "The Enlightenment", "The Reformation", "Romanticism", "The Renaissance"),
        question("Which U.S. amendment abolished slavery?", "The 13th Amendment", "The 10th Amendment", "The 15th Amendment", "The 19th Amendment"),
        question("What was the main purpose of the Marshall Plan?", "Rebuilding Europe after World War II", "Creating the United Nations", "Ending the Vietnam War", "Unifying Germany in 1871")
      ],
      "Sports": [
        question("How long is a standard outdoor soccer match, excluding added time?", "90 minutes", "80 minutes", "100 minutes", "60 minutes"),
        question("In tennis, what score comes after deuce when a player wins one point?", "Advantage", "Love", "Break point", "Set point"),
        question("How many events are in a decathlon?", "10", "8", "12", "7"),
        question("Which swimming stroke is usually the fastest?", "Freestyle", "Breaststroke", "Backstroke", "Butterfly"),
        question("What is the maximum score with one dart in standard darts?", "60", "50", "triple 20", "100"),
        question("In volleyball, how many touches may a team make before returning the ball?", "3", "2", "4", "5"),
        question("Which Grand Slam tennis tournament is played on clay?", "French Open", "Wimbledon", "US Open", "Australian Open"),
        question("How many points is a field goal worth in American football?", "3", "2", "6", "1"),
        question("Which sport uses the terms 'birdie' and 'eagle'?", "Golf", "Cricket", "Rowing", "Rugby"),
        question("What is the standard distance of an Olympic marathon?", "42.195 km", "40 km", "45 km", "26 km")
      ],
      "English": [
        question("Which sentence uses a semicolon correctly?", "I packed a map; the trail was unfamiliar.", "I packed; a map the trail was unfamiliar.", "I; packed a map, the trail was unfamiliar.", "I packed a map the; trail was unfamiliar."),
        question("What is the term for a comparison using 'like' or 'as'?", "Simile", "Metaphor", "Hyperbole", "Alliteration"),
        question("Which word is the adverb in 'She spoke remarkably clearly'?", "Clearly", "Spoke", "She", "Remarkably"),
        question("Who wrote the play 'Romeo and Juliet'?", "William Shakespeare", "Charles Dickens", "Jane Austen", "Oscar Wilde"),
        question("What is the main purpose of a thesis statement?", "State the central claim", "List every source", "Introduce a character", "Summarize the conclusion"),
        question("Which point of view uses 'I' and 'we'?", "First person", "Second person", "Third-person limited", "Third-person omniscient"),
        question("What is an antonym of 'scarce'?", "Abundant", "Rare", "Limited", "Meager"),
        question("Which literary device gives human qualities to something nonhuman?", "Personification", "Onomatopoeia", "Irony", "Foreshadowing"),
        question("What is the plural possessive form of 'students'?", "Students'", "Student's", "Students's", "Student"),
        question("Which type of clause can stand alone as a complete sentence?", "Independent clause", "Subordinate clause", "Relative clause", "Participial phrase")
      ]
    },
    "University": {
      "Maths": [
        question("What is the derivative of sin(x)?", "cos(x)", "-cos(x)", "sin(x)", "-sin(x)"),
        question("What is the determinant of [[2, 1], [3, 4]]?", "5", "8", "11", "2"),
        question("What is the limit of (1 + 1/n)^n as n approaches infinity?", "e", "0", "1", "π"),
        question("For a square matrix A, what does an eigenvector v satisfy?", "Av = λv", "A + v = λ", "A²v = 0 always", "det(A) = v"),
        question("What is the integral of 2x with respect to x?", "x² + C", "2 + C", "2x² + C", "x + C"),
        question("What is the dimension of the vector space R³?", "3", "2", "4", "Infinite"),
        question("If two events are independent, what is P(A and B)?", "P(A)P(B)", "P(A) + P(B)", "P(A) / P(B)", "P(A) - P(B)"),
        question("Which series converges to 1 for |x| < 1?", "1 + x + x² + ... = 1/(1-x)", "1 + x + x² + ... = 1+x", "1 + x + x² + ... = x/(1-x)", "1 + x + x² + ... = 1/(1+x)"),
        question("What is the value of i² in the complex numbers?", "-1", "1", "i", "0"),
        question("What condition must hold for a function to be continuous at x = a?", "Its limit equals its value at a", "Its derivative is zero", "It is periodic", "Its graph is linear")
      ],
      "Science": [
        question("Which law states that energy cannot be created or destroyed in an isolated system?", "First law of thermodynamics", "Second law of thermodynamics", "Newton's first law", "The law of mass action"),
        question("What is the main role of RNA polymerase?", "Synthesizing RNA from a DNA template", "Translating RNA into protein", "Replicating lipids", "Repairing cell membranes"),
        question("Which subatomic particle determines an element's atomic number?", "Proton", "Neutron", "Electron", "Photon"),
        question("In ecology, what is a group of interacting populations in an area?", "Community", "Biome", "Organism", "Biosphere"),
        question("What is the SI unit for amount of substance?", "Mole", "Candela", "Kelvin", "Joule"),
        question("Which enzyme unwinds DNA during replication?", "Helicase", "Ligase", "Amylase", "Pepsin"),
        question("What does a catalyst do to a reaction's activation energy?", "Lowers it", "Raises it", "Makes it infinite", "Changes the products only"),
        question("Which type of galaxy is the Milky Way?", "Barred spiral", "Elliptical", "Irregular", "Lenticular"),
        question("What is the primary function of a mitochondrion?", "ATP production through cellular respiration", "Protein packaging", "DNA transcription only", "Photosynthesis"),
        question("Which particles mediate the electromagnetic force in quantum electrodynamics?", "Photons", "Gluons", "W bosons", "Neutrinos")
      ],
      "History": [
        question("Which treaty formally ended World War I between Germany and the Allied Powers?", "Treaty of Versailles", "Treaty of Utrecht", "Treaty of Tordesillas", "Treaty of Paris (1783)"),
        question("Which 1494 agreement divided newly claimed lands outside Europe between Spain and Portugal?", "Treaty of Tordesillas", "Treaty of Westphalia", "Treaty of Ghent", "Treaty of Versailles"),
        question("What was the primary political purpose of the Congress of Vienna (1814–1815)?", "Restore a balance of power in Europe", "Unify the Italian states", "End the Crimean War", "Establish the League of Nations"),
        question("Which Abbasid-era city became a major center of scholarship and translation?", "Baghdad", "Cordoba", "Cairo", "Samarkand"),
        question("The Meiji Restoration began in which country?", "Japan", "China", "Korea", "Thailand"),
        question("Which 1648 settlement is often associated with the modern state system in Europe?", "Peace of Westphalia", "Congress of Vienna", "Treaty of Rome", "Edict of Nantes"),
        question("Who wrote 'The History of the Peloponnesian War'?", "Thucydides", "Herodotus", "Xenophon", "Polybius"),
        question("Which empire built the road network connecting Cusco to distant regions of the Andes?", "Inca Empire", "Maya civilization", "Aztec Empire", "Olmec civilization"),
        question("What was the 1917 Russian Revolution that brought the Bolsheviks to power commonly called?", "October Revolution", "February Revolution", "Glorious Revolution", "Young Turk Revolution"),
        question("Which 1955 conference helped launch the Non-Aligned Movement?", "Bandung Conference", "Yalta Conference", "Potsdam Conference", "Bretton Woods Conference")
      ],
      "Sports": [
        question("In rugby union, how many points is a try worth under current standard scoring?", "5", "3", "4", "6"),
        question("Which biomechanical principle describes the conservation of angular momentum in a diver's tuck?", "Angular momentum conservation", "Bernoulli's principle", "Archimedes' principle", "The Doppler effect"),
        question("What is the regulation height of a basketball hoop above the floor?", "10 feet", "9 feet", "11 feet", "12 feet"),
        question("In baseball statistics, what does WHIP measure?", "Walks plus hits per inning pitched", "Wins in high-pressure innings", "Weighted hitting impact percentage", "Wild pitches per game"),
        question("How many points does a touchdown score before any conversion attempt?", "6", "3", "7", "2"),
        question("Which cycling race is traditionally held over three weeks in July?", "Tour de France", "Giro di Lombardia", "Paris-Roubaix", "Vuelta a Portugal"),
        question("In Olympic fencing, which weapon uses a valid target covering the entire body?", "Epee", "Foil", "Sabre", "Rapier"),
        question("What does VO₂ max estimate?", "Maximum rate of oxygen use during exercise", "Maximum heart rate at rest", "Lung volume after exhalation", "Blood glucose after training"),
        question("In cricket, what is a score of zero called when a batter is dismissed?", "Duck", "Maiden", "Bye", "Yorker"),
        question("How many players per team are on the court in indoor volleyball?", "6", "5", "7", "8")
      ],
      "English": [
        question("Which term describes a narrator whose account is not fully reliable?", "Unreliable narrator", "Omniscient narrator", "Objective narrator", "Chorus"),
        question("What is the term for a word that imitates a sound, such as 'buzz'?", "Onomatopoeia", "Metonymy", "Chiasmus", "Euphemism"),
        question("Which meter is commonly associated with Shakespearean blank verse?", "Iambic pentameter", "Trochaic tetrameter", "Anapestic trimeter", "Dactylic hexameter"),
        question("What does 'deus ex machina' describe in a narrative?", "An abrupt, unlikely resolution", "A story told backward", "A repeated opening phrase", "A narrator speaking to themself"),
        question("Which grammatical case marks a noun as the direct object in English pronouns?", "Objective case", "Nominative case", "Possessive case", "Vocative case"),
        question("What is a word formed from the initial letters of a phrase and pronounced as a word?", "Acronym", "Back-formation", "Portmanteau", "Eponym"),
        question("Which figure of speech places contrasting ideas in balanced clauses?", "Antithesis", "Assonance", "Synecdoche", "Litotes"),
        question("What is the term for a narrative that frames another story?", "Frame narrative", "Stream of consciousness", "Epistolary form", "Pastoral"),
        question("Which pair illustrates a minimal pair in phonology?", "Ship and sheep", "Cat and dog", "Walk and walked", "Write and writer"),
        question("What does an em dash most commonly signal in prose?", "A strong break or interruption", "A plural noun", "A quoted title", "A footnote reference")
      ]
    }
  };

  Object.keys(bank).forEach(function (level) {
    var mixed = [];
    ["Maths", "Science", "History", "Sports", "English"].forEach(function (subject) {
      bank[level][subject].slice(0, 2).forEach(function (item) {
        mixed.push(Object.assign({}, item, { subject: subject }));
      });
    });
    bank[level].Mixed = mixed;
  });

  window.QUESTION_BANK = bank;
}());
