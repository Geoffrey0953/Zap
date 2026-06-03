/**
 * Seed script for development.
 * Clears the users, buildings, alerts, and saved locations collections and inserts demo data:
 *
 * Users:
 *   - admin@uci.edu / admin123  (admin)
 *   - student@uci.edu / password (student)
 *
 * Buildings:
 *   35 UCI campus POIs across categories: Academic, Dining, Study, Recreation,
 *   Services, Parking, Outdoor
 *
 * Alerts:
 *   3 non-shuttle campus alerts
 *
 * Saved Locations:
 *   3 entries for student user referencing seeded buildings
 *
 * Usage: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Building = require('../models/Building');
const Alert = require('../models/Alert');
const SavedLocation = require('../models/SavedLocation');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

const seedUsers = [
  {
    email: 'admin@uci.edu',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    year: '',
  },
  {
    email: 'student@uci.edu',
    password: 'password',
    name: 'Student User',
    role: 'student',
    year: 'Junior',
  },
];

const seedBuildings = [
  // ---- Academic (10) ----
  { id: 'ics', name: 'Donald Bren Hall', abbr: 'DBH', category: 'Academic', lat: 33.6430, lng: -117.8418, hours: 'Mon–Fri 7am–10pm', description: 'Home of the Donald Bren School of Information and Computer Sciences.', departments: ['Computer Science', 'Informatics', 'Statistics'], image: null },
  { id: 'sspa', name: 'Social Science Plaza A', abbr: 'SSPA', category: 'Academic', lat: 33.6456, lng: -117.8413, hours: 'Mon–Fri 8am–6pm', description: 'Houses Economics, Political Science, Sociology, and other social science departments.', departments: ['Economics', 'Political Science', 'Sociology'], image: null },
  { id: 'rh', name: 'Rowland Hall', abbr: 'RH', category: 'Academic', lat: 33.6443, lng: -117.8445, hours: 'Mon–Fri 8am–8pm', description: 'Department of Chemistry and Biochemistry research and teaching facility.', departments: ['Chemistry', 'Biochemistry'], image: null },
  { id: 'engineering-hall', name: 'Engineering Hall', abbr: 'EH', category: 'Academic', lat: 33.6436, lng: -117.8403, hours: 'Mon–Fri 7am–9pm', description: 'Home to the Henry Samueli School of Engineering administration and labs.', departments: ['Engineering'], image: null },
  { id: 'ics-3', name: 'Computer Science III', abbr: 'CS3', category: 'Academic', lat: 33.6438, lng: -117.8420, hours: 'Mon–Fri 7am–10pm', description: 'Research and teaching facility for computer science and informatics.', departments: ['Computer Science'], image: null },
  { id: 'bs3', name: 'Biological Sciences III', abbr: 'BS3', category: 'Academic', lat: 33.6453, lng: -117.8437, hours: 'Mon–Fri 7am–6pm', description: 'Biology lecture halls and faculty offices for the School of Biological Sciences.', departments: ['Biological Sciences'], image: null },
  { id: 'humanities-hall', name: 'Humanities Hall', abbr: 'HH', category: 'Academic', lat: 33.6469, lng: -117.8408, hours: 'Mon–Fri 8am–8pm', description: 'Houses English, History, Philosophy, and other humanities departments.', departments: ['English', 'History'], image: null },
  { id: 'physical-sciences', name: 'Physical Sciences Building', abbr: 'PS', category: 'Academic', lat: 33.6445, lng: -117.8452, hours: 'Mon–Fri 8am–6pm', description: 'Home to Physics and Astronomy departments with research labs.', departments: ['Physics', 'Astronomy'], image: null },
  { id: 'sspb', name: 'Social Science Plaza B', abbr: 'SSPB', category: 'Academic', lat: 33.6452, lng: -117.8411, hours: 'Mon–Fri 8am–6pm', description: 'Anthropology, Cognitive Sciences, and related social science departments.', departments: ['Anthropology', 'Cognitive Science'], image: null },
  { id: 'education', name: 'Education Building', abbr: 'EDU', category: 'Academic', lat: 33.6465, lng: -117.8403, hours: 'Mon–Fri 8am–5pm', description: 'UCI School of Education, including teacher training and research programs.', departments: ['Education'], image: null },

  // ---- Dining (6) ----
  { id: 'mesa', name: 'Mesa Court Dining', abbr: 'MCD', category: 'Dining', lat: 33.6510, lng: -117.8455, hours: 'Mon–Fri 7am–9pm, Sat–Sun 9am–8pm', description: 'All-you-can-eat dining hall serving breakfast, lunch, and dinner.', departments: [], image: null },
  { id: 'anteatery', name: 'The Anteatery', abbr: 'ANT', category: 'Dining', lat: 33.6461, lng: -117.8427, hours: 'Mon–Fri 7am–8pm, Sat–Sun 10am–4pm', description: "UCI's flagship all-you-can-eat dining hall with a wide variety of options.", departments: [], image: null },
  { id: 'brandywine', name: 'Brandywine Dining Commons', abbr: 'BDC', category: 'Dining', lat: 33.6440, lng: -117.8475, hours: 'Mon–Fri 7am–8pm, Sat–Sun 10am–4pm', description: 'Residential dining hall serving Middle Earth housing community with diverse menu.', departments: [], image: null },
  { id: 'phoenix-food', name: 'Phoenix Food Court', abbr: 'PFC', category: 'Dining', lat: 33.6468, lng: -117.8445, hours: 'Mon–Fri 8am–8pm, Sat 10am–4pm', description: 'Food court inside the Student Center with Panda Express, Subway, and more.', departments: [], image: null },
  { id: 'zot-n-go-main', name: 'Zot N Go', abbr: 'ZNG', category: 'Dining', lat: 33.6467, lng: -117.8440, hours: 'Mon–Fri 7:30am–11pm, Sat–Sun 9am–8pm', description: 'Convenience store in the Student Center offering grab-and-go meals and snacks.', departments: [], image: null },
  { id: 'starbucks-uci', name: 'Starbucks @ UCI', abbr: 'SBUX', category: 'Dining', lat: 33.6466, lng: -117.8443, hours: 'Mon–Fri 6am–8pm, Sat–Sun 7am–5pm', description: 'Campus Starbucks located in the Student Center with indoor and outdoor seating.', departments: [], image: null },

  // ---- Study (3) ----
  { id: 'library', name: 'Langson Library', abbr: 'LIB', category: 'Study', lat: 33.6472, lng: -117.8398, hours: 'Mon–Thu 7:30am–2am, Fri 7:30am–10pm, Sat 10am–10pm, Sun 10am–2am', description: 'The main undergraduate and graduate research library at UCI.', departments: [], image: null },
  { id: 'science-library', name: 'Science Library', abbr: 'SL', category: 'Study', lat: 33.6456, lng: -117.8418, hours: 'Mon–Thu 7:30am–2am, Fri 7:30am–10pm, Sat 10am–10pm, Sun 10am–2am', description: 'Specialized library for science, engineering, and health sciences with group study rooms.', departments: [], image: null },
  { id: 'gateway-study', name: 'Gateway Study Center', abbr: 'GSC', category: 'Study', lat: 33.6470, lng: -117.8395, hours: 'Mon–Thu 7am–12am, Fri 7am–9pm, Sat–Sun 9am–6pm', description: '24/7 quiet study space adjacent to Langson Library with group rooms and computers.', departments: [], image: null },

  // ---- Recreation (4) ----
  { id: 'arc', name: 'Anteater Recreation Center', abbr: 'ARC', category: 'Recreation', lat: 33.6470, lng: -117.8430, hours: 'Mon–Fri 6am–11pm, Sat–Sun 8am–9pm', description: 'State-of-the-art fitness and recreation facility for students, faculty, and staff.', departments: [], image: null },
  { id: 'mesa-pool', name: 'Mesa Pool', abbr: 'MPL', category: 'Recreation', lat: 33.6505, lng: -117.8458, hours: 'Mon–Fri 10am–7pm, Sat–Sun 11am–5pm', description: 'Outdoor swimming pool at Mesa Court with lap lanes and recreational area.', departments: [], image: null },
  { id: 'arc-fields', name: 'ARC Fields', abbr: 'ARCF', category: 'Recreation', lat: 33.6475, lng: -117.8438, hours: '6am–11pm daily', description: 'Outdoor multi-purpose fields for soccer, flag football, and intramural sports.', departments: [], image: null },
  { id: 'bren-events', name: 'Bren Events Center', abbr: 'BEC', category: 'Recreation', lat: 33.6482, lng: -117.8426, hours: 'Hours vary by event', description: 'UCI arena hosting basketball games, concerts, commencement, and campus events.', departments: [], image: null },

  // ---- Services (5) ----
  { id: 'stu', name: 'Student Center', abbr: 'STU', category: 'Services', lat: 33.6467, lng: -117.8441, hours: 'Mon–Fri 7:30am–10pm, Sat–Sun 9am–6pm', description: 'Hub for student life, featuring dining options, meeting rooms, and student services.', departments: [], image: null },
  { id: 'bookstore', name: 'UCI Bookstore', abbr: 'BKS', category: 'Services', lat: 33.6464, lng: -117.8450, hours: 'Mon–Fri 9am–6pm, Sat 10am–3pm', description: 'Official campus bookstore offering textbooks, UCI merchandise, and tech products.', departments: [], image: null },
  { id: 'student-health', name: 'Student Health Center', abbr: 'SHC', category: 'Services', lat: 33.6495, lng: -117.8433, hours: 'Mon–Fri 8am–5pm', description: 'On-campus medical clinic providing primary care, immunizations, and mental health services.', departments: [], image: null },
  { id: 'alumni-center', name: 'Newkirk Alumni Center', abbr: 'NAC', category: 'Services', lat: 33.6495, lng: -117.8420, hours: 'Mon–Fri 9am–5pm', description: 'Home of the UCI Alumni Association with event spaces and career services.', departments: [], image: null },
  { id: 'cross-cultural', name: 'Cross-Cultural Center', abbr: 'CCC', category: 'Services', lat: 33.6488, lng: -117.8442, hours: 'Mon–Fri 9am–6pm', description: 'Center promoting diversity, equity, and inclusion with student programs and events.', departments: [], image: null },

  // ---- Parking (3) ----
  { id: 'parking1', name: 'Parking Structure 1', abbr: 'PS1', category: 'Parking', lat: 33.6480, lng: -117.8420, hours: '24/7', description: 'Multi-level parking structure near the Engineering zone.', departments: [], image: null },
  { id: 'parking2', name: 'Parking Structure 2', abbr: 'PS2', category: 'Parking', lat: 33.6465, lng: -117.8395, hours: '24/7', description: 'Parking structure near Langson Library and the Science Library.', departments: [], image: null },
  { id: 'scps', name: 'Student Center Parking Structure', abbr: 'SCPS', category: 'Parking', lat: 33.6475, lng: -117.8455, hours: '24/7', description: 'Convenient parking for the Student Center, Bookstore, and nearby campus services.', departments: [], image: null },

  // ---- Outdoor (4) ----
  { id: 'aldrich', name: 'Aldrich Park', abbr: 'APK', category: 'Outdoor', lat: 33.6459, lng: -117.8424, hours: 'Always Open', description: 'Central park at the heart of UCI campus, perfect for studying or relaxing outdoors.', departments: [], image: null },
  { id: 'mason-park', name: 'Mason Park', abbr: 'MSP', category: 'Outdoor', lat: 33.6537, lng: -117.8380, hours: '7am–Sunset', description: 'Large park south of campus with lake, walking trails, and picnic areas.', departments: [], image: null },
  { id: 'alumni-grove', name: 'Alumni Grove', abbr: 'AGV', category: 'Outdoor', lat: 33.6448, lng: -117.8415, hours: 'Always Open', description: 'Shaded grove near Social Science Plaza with benches and pathways.', departments: [], image: null },
  { id: 'rose-garden', name: 'UCI Rose Garden', abbr: 'RGD', category: 'Outdoor', lat: 33.6485, lng: -117.8415, hours: 'Always Open', description: 'Tranquil rose garden adjacent to the ARC with walking paths and benches.', departments: [], image: null },
];

const seedAlerts = [
  { type: 'success', title: 'Library Extended Hours', message: 'Langson Library and Science Library open until 3am during finals week (June 9–13).', active: true },
  { type: 'warning', title: 'Parking Notice — Special Event', message: 'Portions of Parking Structure 2 reserved for Bren Events Center commencement on June 14. Allow extra time for parking.', active: true },
  { type: 'info', title: 'Construction Notice', message: 'Sidewalk closure near Engineering Hall through June 20. Use alternate routes via Ring Road.', active: true },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // ------- Users -------
    await User.deleteMany({});
    console.log('Cleared existing users');

    for (const u of seedUsers) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);

      await User.create({
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        year: u.year,
      });

      console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
    }

    // ------- Buildings -------
    await Building.deleteMany({});
    console.log('Cleared existing buildings');

    for (const b of seedBuildings) {
      await Building.create(b);
      console.log(`Created building: ${b.name} (${b.id})`);
    }

    // ------- Alerts -------
    await Alert.deleteMany({});
    console.log('Cleared existing alerts');

    for (const a of seedAlerts) {
      await Alert.create(a);
      console.log(`Created alert: ${a.title} (${a.type})`);
    }

    // ------- Saved Locations -------
    await SavedLocation.deleteMany({});
    console.log('Cleared existing saved locations');

    // Find the student user
    const studentUser = await User.findOne({ email: 'student@uci.edu' });
    if (studentUser) {
      const savedLocations = [
        { buildingId: 'library', list: 'Study' },
        { buildingId: 'anteatery', list: 'Food' },
        { buildingId: 'aldrich', list: 'Outdoor' },
      ];

      for (const s of savedLocations) {
        const saved = await SavedLocation.create({
          userId: studentUser._id,
          buildingId: s.buildingId,
          list: s.list,
        });
        console.log(`Created saved location: ${s.buildingId} → ${s.list} (${saved._id})`);
      }
    } else {
      console.log('Student user not found — skipping saved locations seed');
    }

    console.log(`Seed complete. Inserted ${seedBuildings.length} buildings.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();