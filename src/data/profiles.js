// All cities grouped by province/region, so the UI can render them as
// <optgroup> blocks. `cities` below is still exported as a flat list for
// anywhere that just needs plain city names (search filters, etc).
export const citiesByProvince = {
  Punjab: [
    "Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Sialkot",
    "Bahawalpur", "Sargodha", "Sheikhupura", "Gujrat", "Kasur", "Rahim Yar Khan",
    "Sahiwal", "Okara", "Wah Cantt", "Dera Ghazi Khan", "Jhang", "Chiniot",
    "Kamoke", "Mandi Bahauddin", "Jhelum", "Sadiqabad", "Khanewal", "Hafizabad",
    "Muzaffargarh", "Vehari", "Bahawalnagar", "Attock", "Chakwal", "Pakpattan",
    "Toba Tek Singh", "Narowal", "Layyah", "Mianwali", "Nankana Sahib",
    "Khushab", "Bhakkar", "Rajanpur", "Lodhran",
  ],
  Sindh: [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas",
    "Jacobabad", "Shikarpur", "Khairpur", "Dadu", "Thatta", "Badin",
    "Tando Adam", "Tando Allahyar", "Ghotki", "Umerkot", "Sanghar",
    "Naushahro Feroze", "Kashmore", "Jamshoro",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Abbottabad", "Mingora (Swat)", "Kohat", "Dera Ismail Khan",
    "Bannu", "Charsadda", "Nowshera", "Swabi", "Haripur", "Mansehra",
    "Chitral", "Batagram", "Karak", "Hangu", "Tank", "Lakki Marwat",
    "Malakand", "Buner", "Shangla", "Torghar", "Upper Dir", "Lower Dir",
  ],
  Balochistan: [
    "Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi", "Chaman", "Zhob",
    "Hub", "Loralai", "Dera Murad Jamali", "Dera Allah Yar", "Nushki",
    "Mastung", "Kalat", "Panjgur", "Kharan", "Pishin", "Ziarat", "Usta Muhammad",
  ],
  "Islamabad Capital Territory": ["Islamabad"],
  "Azad Jammu & Kashmir": [
    "Muzaffarabad", "Mirpur", "Rawalakot", "Kotli", "Bhimber", "Bagh",
    "Hattian Bala", "Neelum",
  ],
  "Gilgit-Baltistan": [
    "Gilgit", "Skardu", "Hunza", "Ghanche", "Ghizer", "Astore", "Diamer", "Shigar",
  ],
  Overseas: ["London", "Dubai", "Toronto", "New York", "Riyadh", "Jeddah", "Manchester", "Sydney"],
};

export const provinces = Object.keys(citiesByProvince);

export const cities = Object.values(citiesByProvince).flat();

export const castes = [
  "Abbasi", "Ansari", "Arain", "Awan", "Baloch", "Bhatti", "Bohra", "Bugti",
  "Butt", "Chaudhry", "Cheema", "Chishti", "Dogar", "Durrani", "Gakhar",
  "Ghakhar", "Gujjar", "Jaat", "Jutt", "Kakar", "Kashmiri", "Khan", "Khattak",
  "Khokhar", "Khoja", "Lodhi", "Lohar", "Malik", "Mangal", "Marwat", "Memon",
  "Mengal", "Minhas", "Mirza", "Mughal", "Naich", "Niazi", "Pathan / Pashtun",
  "Qureshi", "Rajput", "Rana", "Rind", "Sandhu", "Shah", "Sheikh", "Sial",
  "Syed", "Tarkhan", "Tiwana", "Virk", "Warraich", "Wattoo", "Yousafzai",
  "Zaildar", "Other",
];

export const educationLevels = [
  "Bachelors",
  "Masters",
  "MBBS",
  "PhD",
  "Intermediate",
  "Diploma",
];

const maleNames = [
  "Ahmed Raza", "Bilal Hussain", "Usman Tariq", "Hamza Sheikh", "Ali Hassan",
  "Faizan Malik", "Zeeshan Ahmed", "Owais Khan", "Sami Ullah", "Kamran Butt",
  "Adeel Anwar", "Waqas Javed",
];
const femaleNames = [
  "Ayesha Siddiqui", "Fatima Noor", "Sana Malik", "Hina Aslam", "Mahnoor Khan",
  "Zainab Rizvi", "Iqra Farooq", "Amna Sheikh", "Komal Butt", "Sadia Iqbal",
  "Rabia Aziz", "Nimra Yousaf",
];

const maleImgs = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=60",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=60",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=60",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=60",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=60",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&q=60",
];
const femaleImgs = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=60",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=60",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=600&q=60",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=60",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=60",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=60",
];

const professions = ["Software Engineer", "Doctor", "Teacher", "Business Owner", "Architect", "Accountant", "Civil Engineer", "Pharmacist"];
const educations = ["BS Computer Science", "MBBS", "MBA", "BSc Engineering", "MSc Economics", "BS Accounting & Finance", "PharmD", "BArch"];

function buildProfile(i, gender) {
  const isMale = gender === "male";
  const name = isMale ? maleNames[i % maleNames.length] : femaleNames[i % femaleNames.length];
  const photo = isMale ? maleImgs[i % maleImgs.length] : femaleImgs[i % femaleImgs.length];
  const city = cities[i % cities.length];
  const caste = castes[i % castes.length];
  const education = educations[i % educations.length];
  const profession = professions[i % professions.length];
  const age = isMale ? 26 + (i % 10) : 22 + (i % 9);

  return {
    id: `MAT-${10001 + i}`,
    name,
    gender,
    age,
    city,
    country: city === "London" || city === "Dubai" || city === "Toronto" ? city : "Pakistan",
    caste,
    sect: "Sunni",
    religion: "Islam",
    education,
    profession,
    income: isMale ? `PKR ${80 + (i % 6) * 20},000 - ${140 + (i % 6) * 20},000` : "Prefer not to say",
    height: isMale ? `5'${8 + (i % 4)}"` : `5'${2 + (i % 4)}"`,
    maritalStatus: "Never Married",
    photo,
    coverPhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=60",
    gallery: [photo, isMale ? maleImgs[(i + 1) % maleImgs.length] : femaleImgs[(i + 1) % femaleImgs.length]],
    hiddenPhotos: 2,
    verified: i % 4 !== 3,
    about: `${name.split(" ")[0]} is a ${age}-year-old ${profession.toLowerCase()} based in ${city}, from a respected ${caste} family. Known for a calm, family-oriented nature and a strong sense of values, currently looking for a serious, marriage-minded proposal through the family.`,
    expectations: "Looking for a well-mannered, family-oriented partner from a respectable background, someone caring, understanding and committed to building a peaceful home together.",
    fatherOccupation: ["Retired Government Officer", "Businessman", "Retired Army Officer", "Farmer / Landowner"][i % 4],
    motherOccupation: "Homemaker",
    siblings: { brothers: 1 + (i % 3), sisters: 1 + ((i + 1) % 3) },
  };
}

// Manually added profile (real submission)
const aliRazaProfile = {
  id: "MAT-90001",
  name: "Ali Raza",
  gender: "male",
  age: 30,
  city: "Mianchannu",
  country: "Pakistan",
  caste: "Sial",
  sect: "Shia",
  religion: "Islam",
  education: "F.Sc (Govt. School)",
  profession: "Supervisor",
  jobDetail: "Job in Factory",
  income: "PKR 50,000+",
  height: "5'7\"",
  maritalStatus: "Single",
  home: "Own",
  homeSize: "10 Marla",
  nationality: "Pakistani",
  photo: maleImgs[0],
  coverPhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=60",
  gallery: [maleImgs[0], maleImgs[1]],
  hiddenPhotos: 2,
  verified: true,
  about: "Ali Raza is a 30-year-old Supervisor working in a factory, based in Mianchannu, from a respected Sial family. Known for a calm, family-oriented nature, currently looking for a serious, marriage-minded proposal through the family.",
  expectations: "Looking for a good-looking, well-mannered partner aged 20-25, with a height less than 5'7\", based in Mianchannu, from any good caste and any qualification.",
  fatherOccupation: "Late (Deceased)",
  motherOccupation: "House Wife",
  siblings: { brothers: 4, sisters: 1 },
  requirements: {
    ageLimit: "20-25",
    height: "Less than 5'7\"",
    city: "Mianchannu",
    caste: "Any Good Caste",
    qualification: "Any",
    others: "Good Looking",
  },
};

export const profiles = [
  ...Array.from({ length: 12 }).map((_, i) => buildProfile(i, "male")),
  ...Array.from({ length: 12 }).map((_, i) => buildProfile(i + 12, "female")),
  aliRazaProfile,
];

export function getProfileById(id) {
  return profiles.find((p) => p.id === id);
}