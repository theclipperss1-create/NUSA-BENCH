// Rich database of highly challenging and abstract trivia questions about Indonesia
// Categories: Geografi, Sejarah, Budaya & Seni, Kuliner Nusantara, and Tokoh Indonesia

export const WAWASAN_QUESTIONS = [
  // --- GEOGRAFI ---
  {
    id: 'geo_01',
    category: 'Geografi',
    question: 'Garis Wallace memisahkan fauna tipe Asia dengan tipe peralihan di Indonesia. Selat manakah yang secara geografis dilalui garis ini?',
    options: ['Selat Sunda', 'Selat Makassar dan Selat Lombok', 'Selat Bali', 'Selat Karimata'],
    answer: 'Selat Makassar dan Selat Lombok',
    type: 'multiple-choice'
  },
  {
    id: 'geo_02',
    category: 'Geografi',
    question: 'Pulau manakah di Kepulauan Riau yang menjadi salah satu titik terluar Indonesia dan berbatasan langsung dengan Selat Malaka serta Laut China Selatan?',
    options: ['Pulau Bintan', 'Pulau Nipa', 'Pulau Natuna Besar', 'Pulau Karimun'],
    answer: 'Pulau Nipa',
    type: 'multiple-choice'
  },
  {
    id: 'geo_03',
    category: 'Geografi',
    question: 'Di manakah letak titik terdalam (palung laut) di seluruh wilayah perairan kedaulatan Indonesia?',
    options: ['Palung Jawa', 'Palung Weber (Banda)', 'Palung Sangihe', 'Palung Sunda'],
    answer: 'Palung Weber (Banda)',
    type: 'multiple-choice'
  },
  {
    id: 'geo_04',
    category: 'Geografi',
    question: 'Titik koordinat astronomis paling utara wilayah Republik Indonesia terletak di Pulau Rondo, bukan Pulau Weh.',
    options: ['Benar', 'Salah'],
    answer: 'Benar',
    type: 'boolean'
  },
  {
    id: 'geo_05',
    category: 'Geografi',
    question: 'Manakah formasi pegunungan di Indonesia yang terbentuk dari tabrakan Lempeng Indo-Australia dan Eurasia yang memiliki satu-satunya gletser es tropis?',
    options: ['Pegunungan Barisan', 'Pegunungan Jayawijaya', 'Pegunungan Muller', 'Pegunungan Sewu'],
    answer: 'Pegunungan Jayawijaya',
    type: 'multiple-choice'
  },

  // --- SEJARAH ---
  {
    id: 'sej_01',
    category: 'Sejarah',
    question: 'Siapakah tokoh pemuda yang mengetik naskah Proklamasi Kemerdekaan Indonesia dengan merubah kata "tempoh" menjadi "tempo"?',
    options: ['Sayuti Melik', 'Sukarni', 'B.M. Diah', 'Wikana'],
    answer: 'Sayuti Melik',
    type: 'multiple-choice'
  },
  {
    id: 'sej_02',
    category: 'Sejarah',
    question: 'Dalam Perundingan Linggarjati tahun 1946, siapakah tokoh yang memimpin delegasi diplomatik Republik Indonesia?',
    options: ['Mohammad Hatta', 'Sutan Sjahrir', 'Amir Sjarifuddin', 'Soekarno'],
    answer: 'Sutan Sjahrir',
    type: 'multiple-choice'
  },
  {
    id: 'sej_03',
    category: 'Sejarah',
    question: 'Prasasti peninggalan Kerajaan Sriwijaya yang memuat kutipan sumpah kesetiaan serta ancaman kutukan ngeri bagi pembangkang adalah...',
    options: ['Prasasti Kedukan Bukit', 'Prasasti Talang Tuwo', 'Prasasti Kota Kapur', 'Prasasti Telaga Batu'],
    answer: 'Prasasti Telaga Batu',
    type: 'multiple-choice'
  },
  {
    id: 'sej_04',
    category: 'Sejarah',
    question: 'Sumpah Palapa yang diucapkan oleh Patih Gajah Mada untuk menyatukan Nusantara tercatat di dalam Kitab Pararaton.',
    options: ['Benar', 'Salah'],
    answer: 'Benar',
    type: 'boolean'
  },
  {
    id: 'sej_05',
    category: 'Sejarah',
    question: 'Siapakah pencipta lagu kebangsaan Indonesia Raya yang mempublikasikan partitur lagunya pertama kali pada surat kabar mingguan "Sin Po" di tahun 1928?',
    options: ['Ismail Marzuki', 'W.R. Soepratman', 'Kusbini', 'C. Simanjuntak'],
    answer: 'W.R. Soepratman',
    type: 'multiple-choice'
  },

  // --- BUDAYA & SENI ---
  {
    id: 'bud_01',
    category: 'Budaya & Seni',
    question: 'Batik motif "Parang Rusak" pada zaman Mataram Islam melambangkan perjuangan manusia melawan hawa nafsu dan ombak samudera yang tidak pernah surut.',
    options: ['Benar', 'Salah'],
    answer: 'Benar',
    type: 'boolean'
  },
  {
    id: 'bud_02',
    category: 'Budaya & Seni',
    question: 'Alat musik tradisional petik Sasando khas Pulau Rote (NTT) menggunakan daun pohon kelapa sebagai resonatornya.',
    options: ['Benar', 'Salah'],
    answer: 'Salah',
    type: 'boolean'
  },
  {
    id: 'bud_03',
    category: 'Budaya & Seni',
    question: 'Tari Kecak khas Bali yang mengadopsi kisah Ramayana diciptakan bersama oleh seniman Wayan Limbak dan pelukis asal Jerman yaitu...',
    options: ['Walter Spies', 'Rudolf Bonnet', 'Arie Smit', 'Antonio Blanco'],
    answer: 'Walter Spies',
    type: 'multiple-choice'
  },
  {
    id: 'bud_04',
    category: 'Budaya & Seni',
    question: 'Falsafah hidup masyarakat adat Bali tentang menjaga keharmonisan tiga hubungan (Tuhan, manusia, alam) disebut sebagai...',
    options: ['Tri Hita Karana', 'Tat Twam Asi', 'Tri Kaya Parisudha', 'Karma Phala'],
    answer: 'Tri Hita Karana',
    type: 'multiple-choice'
  },
  {
    id: 'bud_05',
    category: 'Budaya & Seni',
    question: 'Rumah adat "Lamin" yang berbentuk panggung sangat panjang untuk dihuni puluhan keluarga merupakan warisan dari suku...',
    options: ['Suku Dayak Kenyah', 'Suku Banjar', 'Suku Kutai', 'Suku Minahasa'],
    answer: 'Suku Dayak Kenyah',
    type: 'multiple-choice'
  },

  // --- KULINER ---
  {
    id: 'kul_01',
    category: 'Kuliner Nusantara',
    question: 'Kuliner Batak "Dali ni Horbo" yang bertekstur mirip keju tradisional dibuat dari proses pembekuan...',
    options: ['Susu kerbau liar', 'Susu kambing etawa', 'Santan kelapa fermentasi', 'Air kelapa murni'],
    answer: 'Susu kerbau liar',
    type: 'multiple-choice'
  },
  {
    id: 'kul_02',
    category: 'Kuliner Nusantara',
    question: 'Bumbu dapur khas Batak Toba yang memberikan sensasi getir pedas menggigit (mati rasa) di lidah adalah...',
    options: ['Andaliman', 'Kecombrang', 'Asam Gelugur', 'Kencur'],
    answer: 'Andaliman',
    type: 'multiple-choice'
  },
  {
    id: 'kul_03',
    category: 'Kuliner Nusantara',
    question: 'Bubur sagu kental khas Papua dan Maluku yang dimakan dengan lauk ikan kuah kuning bertekstur lengket menyerupai lem dinamakan...',
    options: ['Kapurung', 'Papeda', 'Sagu Lempeng', 'Sinonggi'],
    answer: 'Papeda',
    type: 'multiple-choice'
  },
  {
    id: 'kul_04',
    category: 'Kuliner Nusantara',
    question: 'Bahan dasar pembuatan bumbu masakan "Tempoyak" khas Palembang dan Jambi adalah fermentasi dari buah...',
    options: ['Durian', 'Cempedak', 'Nangka Muda', 'Salak Pondoh'],
    answer: 'Durian',
    type: 'multiple-choice'
  },
  {
    id: 'kul_05',
    category: 'Kuliner Nusantara',
    question: 'Minuman tradisional Jawa Barat pendamping makanan berat yang terbuat dari santan hangat, gula merah cair, dan rebusan jahe dinamakan Bajigur.',
    options: ['Benar', 'Salah'],
    answer: 'Benar',
    type: 'boolean'
  },

  // --- TOKOH INDONESIA ---
  {
    id: 'tok_01',
    category: 'Tokoh Indonesia',
    question: 'Siapakah bapak pergerakan nasional pendiri Sarekat Islam yang dijuluki Belanda sebagai "De Ongekroonde Koning van Java" (Raja Jawa Tanpa Mahkota)?',
    options: ['H.O.S. Tjokroaminoto', 'Haji Samanhudi', 'Ki Hajar Dewantara', 'Dr. Cipto Mangunkusumo'],
    answer: 'H.O.S. Tjokroaminoto',
    type: 'multiple-choice'
  },
  {
    id: 'tok_02',
    category: 'Tokoh Indonesia',
    question: 'Pahlawan nasional yang menulis esai satir tajam "Als ik eens Nederlander was" (Seandainya Aku Seorang Belanda) pada tahun 1913 adalah...',
    options: ['Suwardi Suryaningrat (Ki Hajar Dewantara)', 'Dr. Tjipto Mangoenkoesoemo', 'Danudirja Setiabudi (Douwes Dekker)', 'Tan Malaka'],
    answer: 'Suwardi Suryaningrat (Ki Hajar Dewantara)',
    type: 'multiple-choice'
  },
  {
    id: 'tok_03',
    category: 'Tokoh Indonesia',
    question: 'Siapakah laksamana laut wanita pertama di dunia modern asal Kesultanan Aceh yang memimpin armada laut pasukan Inong Balee?',
    options: ['Malahayati', 'Cut Nyak Dhien', 'Cut Meutia', 'Pocut Baren'],
    answer: 'Malahayati',
    type: 'multiple-choice'
  },
  {
    id: 'tok_04',
    category: 'Tokoh Indonesia',
    question: 'Tokoh kiri revolusioner Indonesia yang menulis buku filsafat monumental "Madilog" (Materialisme, Dialektika, dan Logika) adalah Tan Malaka.',
    options: ['Benar', 'Salah'],
    answer: 'Benar',
    type: 'boolean'
  },
  {
    id: 'tok_05',
    category: 'Tokoh Indonesia',
    question: 'Dalam penerbangan internasional, B.J. Habibie mematenkan teori propagasi keretakan bodi pesawat terbang yang kemudian dikenal dengan sebutan...',
    options: ['Habibie Factor (Progression Theory)', 'Habibie Point (Propagation Theory)', 'Habibie Theorem (Aerospace Design)', 'Habibie Crack Formula'],
    answer: 'Habibie Factor (Progression Theory)',
    type: 'multiple-choice'
  }
];

export const getRandomQuestions = (count = 10) => {
  const shuffled = [...WAWASAN_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
