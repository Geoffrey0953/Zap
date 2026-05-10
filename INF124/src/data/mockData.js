// ============================================================
// ZAP Mock Data — replace with real API calls as needed
// ============================================================

export const BUILDINGS = [
  { id: 'ics', name: 'Donald Bren Hall', abbr: 'DBH', category: 'Academic', lat: 33.6430, lng: -117.8418, hours: 'Mon–Fri 7am–10pm', description: 'Home of the Donald Bren School of Information and Computer Sciences.', departments: ['Computer Science', 'Informatics', 'Statistics'], image: null },
  { id: 'arc', name: 'Anteater Recreation Center', abbr: 'ARC', category: 'Recreation', lat: 33.6470, lng: -117.8430, hours: 'Mon–Fri 6am–11pm, Sat–Sun 8am–9pm', description: 'State-of-the-art fitness and recreation facility for students, faculty, and staff.', departments: [], image: null },
  { id: 'library', name: 'Langson Library', abbr: 'LIB', category: 'Study', lat: 33.6472, lng: -117.8398, hours: 'Mon–Thu 7:30am–2am, Fri 7:30am–10pm, Sat 10am–10pm, Sun 10am–2am', description: 'The main undergraduate and graduate research library at UCI.', departments: [], image: null },
  { id: 'mesa', name: 'Mesa Court Dining', abbr: 'MCD', category: 'Dining', lat: 33.6510, lng: -117.8455, hours: 'Mon–Fri 7am–9pm, Sat–Sun 9am–8pm', description: 'All-you-can-eat dining hall serving breakfast, lunch, and dinner.', departments: [], image: null },
  { id: 'anteatery', name: 'The Anteatery', abbr: 'ANT', category: 'Dining', lat: 33.6461, lng: -117.8427, hours: 'Mon–Fri 7am–8pm, Sat–Sun 10am–4pm', description: 'UCI\'s flagship all-you-can-eat dining hall with a wide variety of options.', departments: [], image: null },
  { id: 'sspa', name: 'Social Science Plaza A', abbr: 'SSPA', category: 'Academic', lat: 33.6456, lng: -117.8413, hours: 'Mon–Fri 8am–6pm', description: 'Houses Economics, Political Science, Sociology, and other social science departments.', departments: ['Economics', 'Political Science', 'Sociology'], image: null },
  { id: 'rh', name: 'Rowland Hall', abbr: 'RH', category: 'Academic', lat: 33.6443, lng: -117.8445, hours: 'Mon–Fri 8am–8pm', description: 'Department of Chemistry and Biochemistry research and teaching facility.', departments: ['Chemistry', 'Biochemistry'], image: null },
  { id: 'stu', name: 'Student Center', abbr: 'STU', category: 'Services', lat: 33.6467, lng: -117.8441, hours: 'Mon–Fri 7:30am–10pm, Sat–Sun 9am–6pm', description: 'Hub for student life, featuring dining options, meeting rooms, and student services.', departments: [], image: null },
  { id: 'parking1', name: 'Parking Structure 1', abbr: 'PS1', category: 'Parking', lat: 33.6480, lng: -117.8420, hours: '24/7', description: 'Multi-level parking structure near the Engineering zone.', departments: [], image: null },
  { id: 'aldrich', name: 'Aldrich Park', abbr: 'APK', category: 'Outdoor', lat: 33.6459, lng: -117.8424, hours: 'Always Open', description: 'Central park at the heart of UCI campus, perfect for studying or relaxing outdoors.', departments: [], image: null },
];

export const DEPARTMENTS = [
  { id: 'cs', name: 'Computer Science', school: 'Donald Bren School of ICS', building: 'Donald Bren Hall', phone: '(949) 824-7174', email: 'cs@uci.edu', website: 'https://www.cs.uci.edu' },
  { id: 'informatics', name: 'Informatics', school: 'Donald Bren School of ICS', building: 'Donald Bren Hall', phone: '(949) 824-5086', email: 'informatics@uci.edu', website: 'https://www.informatics.uci.edu' },
  { id: 'stats', name: 'Statistics', school: 'Donald Bren School of ICS', building: 'Donald Bren Hall', phone: '(949) 824-5503', email: 'stats@uci.edu', website: 'https://www.stats.uci.edu' },
  { id: 'econ', name: 'Economics', school: 'School of Social Sciences', building: 'Social Science Plaza A', phone: '(949) 824-5788', email: 'economics@uci.edu', website: 'https://www.economics.uci.edu' },
  { id: 'bio', name: 'Biological Sciences', school: 'School of Biological Sciences', building: 'Biological Sciences III', phone: '(949) 824-5564', email: 'biosci@uci.edu', website: 'https://www.bio.uci.edu' },
  { id: 'chem', name: 'Chemistry', school: 'School of Physical Sciences', building: 'Rowland Hall', phone: '(949) 824-6012', email: 'chemistry@uci.edu', website: 'https://www.chem.uci.edu' },
  { id: 'psych', name: 'Psychological Science', school: 'School of Social Sciences', building: 'Social & Behavioral Sciences Gateway', phone: '(949) 824-5574', email: 'psych@uci.edu', website: 'https://www.socsci.uci.edu/psych' },
  { id: 'english', name: 'English', school: 'School of Humanities', building: 'Humanities Hall', phone: '(949) 824-6712', email: 'english@uci.edu', website: 'https://www.humanities.uci.edu/english' },
];

export const SHUTTLE_ROUTES = [
  {
    id: 'anteater-express',
    name: 'Anteater Express',
    color: '#4ecda4',
    stops: ['Gateway Transit Center', 'Student Center', 'Aldrich Park', 'ARC', 'Verano Place', 'Gateway Transit Center'],
    frequency: '10 min',
    nextArrival: '3 min',
    status: 'On Time',
  },
  {
    id: 'campus-loop',
    name: 'Campus Loop',
    color: '#5b9cf6',
    stops: ['Main Entrance', 'Langson Library', 'Mesa Court', 'Verano Place', 'Engineering', 'Main Entrance'],
    frequency: '15 min',
    nextArrival: '8 min',
    status: 'On Time',
  },
  {
    id: 'irvine-connect',
    name: 'Irvine Connect',
    color: '#f5c842',
    stops: ['UCI Medical Center', 'Irvine Valley College', 'Campus', 'Irvine Train Station'],
    frequency: '30 min',
    nextArrival: '22 min',
    status: 'Delayed 5 min',
  },
];

export const PARKING_LOTS = [
  { id: 'ps1', name: 'Parking Structure 1', type: 'Structure', available: 84, total: 400, permit: 'A, B', lat: 33.6480, lng: -117.8420 },
  { id: 'ps4', name: 'Parking Structure 4', type: 'Structure', available: 12, total: 500, permit: 'A, B, S', lat: 33.6452, lng: -117.8388 },
  { id: 'mesa-lot', name: 'Mesa Court Lot', type: 'Surface', available: 200, total: 250, permit: 'P', lat: 33.6512, lng: -117.8450 },
  { id: 'anteater-lot', name: 'Anteater Parking Lot', type: 'Surface', available: 0, total: 180, permit: 'A', lat: 33.6495, lng: -117.8435 },
];

export const CATEGORIES = ['All', 'Academic', 'Dining', 'Study', 'Recreation', 'Services', 'Parking', 'Outdoor'];

export const QUICK_FILTERS = ['Food', 'Study spots', 'Open now', 'Nearby'];

export const TRENDING = [
  { id: 'anteatery', name: 'Anteatery', category: 'Dining', subtext: 'All-you-can-eat', distance: '0.2 mi', status: 'Open', rating: 4.2 },
  { id: 'library', name: 'Science Library', category: 'Study', subtext: 'Study', distance: '0.5 mi', status: 'Open', rating: 4.7 },
  { id: 'arc', name: 'Starbucks @ ARC', category: 'Dining', subtext: 'Coffee', distance: '0.3 mi', status: 'Closes 8pm', rating: 3.9 },
];

export const ALERTS = [
  { id: '1', type: 'info', title: 'Shuttle Delay', message: 'Irvine Connect route is running 5 minutes behind schedule.', time: '10 min ago', active: true },
  { id: '2', type: 'warning', title: 'Parking Structure 4 Nearly Full', message: 'PS4 has fewer than 15 spaces remaining.', time: '25 min ago', active: true },
  { id: '3', type: 'success', title: 'Library Hours Extended', message: 'Langson Library will remain open until 3am during finals week.', time: '2h ago', active: false },
];

export const UCI_CENTER = [33.6461, -117.8427];
