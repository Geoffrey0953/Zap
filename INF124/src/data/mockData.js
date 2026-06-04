export const BUILDINGS = [
 
  // ── ICS / Computer Science ──
  { id: 'ics', name: 'Donald Bren Hall', abbr: 'DBH', category: 'Academic', lat: 33.6432551, lng: -117.8420085, hours: 'Mon–Fri 7am–10pm', description: 'Home of the Donald Bren School of Information and Computer Sciences.', departments: ['Computer Science', 'Informatics', 'Statistics'], image: null },
  { id: 'ics1', name: 'Information & Computer Science I', abbr: 'ICS1', category: 'Academic', lat: 33.6443154, lng: -117.8417851, hours: 'Mon–Fri 7am–10pm', description: 'ICS Building I housing classrooms and faculty offices for the Bren School of ICS.', departments: ['Computer Science', 'Informatics'], image: null },
  { id: 'ics2', name: 'Information & Computer Science II', abbr: 'ICS2', category: 'Academic', lat: 33.64316, lng: -117.841988, hours: 'Mon–Fri 7am–10pm', description: 'ICS Building II with additional classrooms and research labs for the Bren School.', departments: ['Computer Science', 'Statistics'], image: null },
  { id: 'airb', name: 'Anteater Instruction & Research Building', abbr: 'AIRB', category: 'Academic', lat: 33.6429032, lng: -117.8381931, hours: 'Mon–Fri 7am–10pm', description: 'Large instructional and research facility supporting multiple departments.', departments: [], image: null },
 
  // ── Engineering ──
  { id: 'engineering', name: 'Engineering Hall', abbr: 'EH', category: 'Academic', lat: 33.6435829, lng: -117.8414218, hours: 'Mon–Fri 7am–9pm', description: 'Home of the Samueli School of Engineering with labs and lecture halls.', departments: ['Electrical Engineering', 'Computer Engineering', 'Mechanical Engineering'], image: null },
  { id: 'eg', name: 'Engineering Gateway', abbr: 'EG', category: 'Academic', lat: 33.6429448, lng: -117.8396292, hours: 'Mon–Fri 7am–9pm', description: 'Engineering Gateway building featuring interdisciplinary research and classrooms.', departments: ['Engineering'], image: null },
  { id: 'elh', name: 'Engineering Lecture Hall', abbr: 'ELH', category: 'Academic', lat: 33.6444347, lng: -117.8406768, hours: 'Mon–Fri 7am–9pm', description: 'Large lecture hall facility for the Samueli School of Engineering.', departments: ['Engineering'], image: null },
  { id: 'et', name: 'Engineering Tower', abbr: 'ET', category: 'Academic', lat: 33.6447167, lng: -117.8410434, hours: 'Mon–Fri 7am–9pm', description: 'Multi-story tower housing engineering faculty offices and research labs.', departments: ['Engineering'], image: null },
  { id: 'elf', name: 'Engineering Laboratory Facility', abbr: 'ELF', category: 'Academic', lat: 33.6437291, lng: -117.8399003, hours: 'Mon–Fri 7am–9pm', description: 'Specialized laboratory facility for engineering research and teaching.', departments: ['Engineering'], image: null },
  { id: 'mde', name: 'McDonnell Douglas Engineering Auditorium', abbr: 'MDE', category: 'Academic', lat: 33.6438236, lng: -117.8406378, hours: 'Mon–Fri 7am–9pm', description: 'Large auditorium used for engineering lectures and events.', departments: ['Engineering'], image: null },
  { id: 'rec', name: 'Rockwell Engineering Center', abbr: 'REC', category: 'Academic', lat: 33.6439326, lng: -117.8405678, hours: 'Mon–Fri 7am–9pm', description: 'Research center supporting engineering disciplines and collaborative projects.', departments: ['Engineering'], image: null },
 
  // ── Physical / Natural Sciences ──
  { id: 'rh', name: 'Rowland Hall', abbr: 'RH', category: 'Academic', lat: 33.6441328, lng: -117.8441306, hours: 'Mon–Fri 8am–8pm', description: 'Department of Chemistry and Biochemistry research and teaching facility.', departments: ['Chemistry', 'Biochemistry'], image: null },
  { id: 'frh', name: 'Frederick Reines Hall', abbr: 'FRH', category: 'Academic', lat: 33.6440861, lng: -117.8434693, hours: 'Mon–Fri 8am–6pm', description: 'Home of the Physics and Astronomy department at UCI.', departments: ['Physics', 'Astronomy'], image: null },
  { id: 'mstb', name: 'Multipurpose Science & Technology Building', abbr: 'MSTB', category: 'Academic', lat: 33.6420416, lng: -117.8444257, hours: 'Mon–Fri 7am–10pm', description: 'Large multipurpose building supporting science and technology courses.', departments: [], image: null },
  { id: 'ns1', name: 'Natural Sciences I', abbr: 'NS1', category: 'Academic', lat: 33.6443948, lng: -117.8457307, hours: 'Mon–Fri 7am–9pm', description: 'Natural Sciences Building I with labs and classrooms for life sciences.', departments: ['Biology', 'Ecology'], image: null },
  { id: 'ns2', name: 'Natural Sciences II', abbr: 'NS2', category: 'Academic', lat: 33.6438379, lng: -117.8457111, hours: 'Mon–Fri 7am–9pm', description: 'Natural Sciences Building II housing additional science research facilities.', departments: ['Biology', 'Chemistry'], image: null },
  { id: 'pscb', name: 'Physical Sciences Classroom Building', abbr: 'PSCB', category: 'Academic', lat: 33.6433755, lng: -117.8434604, hours: 'Mon–Fri 7am–9pm', description: 'Classroom building dedicated to physical sciences courses and labs.', departments: ['Physics', 'Chemistry'], image: null },
  { id: 'pslh', name: 'Physical Sciences Lecture Hall', abbr: 'PSLH', category: 'Academic', lat: 33.6434951, lng: -117.8439857, hours: 'Mon–Fri 7am–9pm', description: 'Large lecture hall for undergraduate physical sciences courses.', departments: ['Physics', 'Chemistry', 'Math'], image: null },
  { id: 'crh', name: 'Croul Hall', abbr: 'CRH', category: 'Academic', lat: 33.6437602, lng: -117.8443878, hours: 'Mon–Fri 8am–6pm', description: 'Home of the Department of Earth System Science at UCI.', departments: ['Earth System Science'], image: null },
 
  // ── Biological Sciences ──
  { id: 'bio-sci-3', name: 'Biological Sciences III', abbr: 'BS3', category: 'Academic', lat: 33.6452428, lng: -117.8457894, hours: 'Mon–Fri 7am–10pm', description: 'Research and teaching facility for the School of Biological Sciences.', departments: ['Biological Sciences', 'Neurobiology'], image: null },
  { id: 'mh', name: 'McGaugh Hall', abbr: 'MH', category: 'Academic', lat: 33.6451745, lng: -117.8447686, hours: 'Mon–Fri 8am–6pm', description: 'Houses the Department of Neurobiology and Behavior and psychology research.', departments: ['Neurobiology', 'Psychology'], image: null },
 
  // ── Social Sciences ──
  { id: 'sspa', name: 'Social Science Plaza A', abbr: 'SSPA', category: 'Academic', lat: 33.646973, lng: -117.8395717, hours: 'Mon–Fri 8am–6pm', description: 'Houses Economics, Political Science, Sociology, and other social science departments.', departments: ['Economics', 'Political Science', 'Sociology'], image: null },
  { id: 'sspb', name: 'Social Science Plaza B', abbr: 'SSPB', category: 'Academic', lat: 33.6469459, lng: -117.8390389, hours: 'Mon–Fri 8am–6pm', description: 'Social Science Plaza B with additional faculty offices and research spaces.', departments: ['Sociology', 'Anthropology'], image: null },
  { id: 'sst', name: 'Social Science Tower', abbr: 'SST', category: 'Academic', lat: 33.6464851, lng: -117.8401031, hours: 'Mon–Fri 8am–6pm', description: 'Tower housing various social science department offices and research labs.', departments: ['Sociology', 'Political Science'], image: null },
  { id: 'ssh', name: 'Social Science Hall', abbr: 'SSH', category: 'Academic', lat: 33.6462269, lng: -117.840059, hours: 'Mon–Fri 8am–6pm', description: 'Social Science Hall with classrooms and faculty offices.', departments: ['Social Sciences'], image: null },
  { id: 'ssl', name: 'Social Science Laboratory', abbr: 'SSL', category: 'Academic', lat: 33.6459033, lng: -117.8400608, hours: 'Mon–Fri 8am–6pm', description: 'Geology and social science laboratory building.', departments: ['Geology', 'Social Sciences'], image: null },
  { id: 'sslh', name: 'Social Science Lecture Hall', abbr: 'SSLH', category: 'Academic', lat: 33.6472674, lng: -117.8397575, hours: 'Mon–Fri 7am–9pm', description: 'Large lecture hall for social science undergraduate courses.', departments: ['Social Sciences'], image: null },
  { id: 'se', name: 'Social Ecology I', abbr: 'SE', category: 'Academic', lat: 33.6462124, lng: -117.8389272, hours: 'Mon–Fri 8am–6pm', description: 'Home of the School of Social Ecology at UCI.', departments: ['Criminology', 'Urban Planning', 'Psychology'], image: null },
  { id: 'se2', name: 'Social Ecology II', abbr: 'SE2', category: 'Academic', lat: 33.6465864, lng: -117.8391543, hours: 'Mon–Fri 8am–6pm', description: 'Social Ecology Building II with additional offices and classrooms.', departments: ['Criminology', 'Urban Planning'], image: null },
  { id: 'pcb', name: 'Parkview Classroom Building', abbr: 'PCB', category: 'Academic', lat: 33.6445009, lng: -117.8427511, hours: 'Mon–Fri 7am–9pm', description: 'General classroom building with lecture halls and seminar rooms.', departments: [], image: null },
 
  // ── Humanities ──
  { id: 'humanities', name: 'Humanities Hall', abbr: 'HH', category: 'Academic', lat: 33.6473121, lng: -117.8440227, hours: 'Mon–Fri 8am–6pm', description: 'Houses the School of Humanities including English, History, and Philosophy.', departments: ['English', 'History', 'Philosophy'], image: null },
  { id: 'hg', name: 'Humanities Gateway', abbr: 'HG', category: 'Academic', lat: 33.6481494, lng: -117.84434, hours: 'Mon–Fri 8am–6pm', description: 'Humanities Gateway building with classrooms and faculty offices.', departments: ['Humanities'], image: null },
  { id: 'hib', name: 'Humanities Instructional Building', abbr: 'HIB', category: 'Academic', lat: 33.648362, lng: -117.8439152, hours: 'Mon–Fri 7am–9pm', description: 'Instructional building for the School of Humanities with seminar rooms.', departments: ['Humanities'], image: null },
  { id: 'kh', name: 'Murray Krieger Hall', abbr: 'KH', category: 'Academic', lat: 33.6476211, lng: -117.843514, hours: 'Mon–Fri 8am–6pm', description: 'Named after literary critic Murray Krieger, houses humanities research and offices.', departments: ['Comparative Literature', 'Humanities'], image: null },
 
  // ── Arts ──
  { id: 'aitr', name: 'Arts Instruction & Technology Resource Center', abbr: 'AITR', category: 'Academic', lat: 33.6498446, lng: -117.8439451, hours: 'Mon–Fri 8am–6pm', description: 'Arts instruction facility with technology resources for creative programs.', departments: ['Art', 'Music', 'Drama'], image: null },
  { id: 'art-studio', name: 'Studio Art', abbr: 'ART', category: 'Academic', lat: 33.6505351, lng: -117.844834, hours: 'Mon–Fri 8am–6pm', description: 'UCI Studio Art building for painting, drawing, and visual arts courses.', departments: ['Art'], image: null },
  { id: 'claire-trevor', name: 'Claire Trevor School of the Arts', abbr: 'CTT', category: 'Academic', lat: 33.6507421, lng: -117.8463353, hours: 'Mon–Fri 8am–6pm', description: 'Home of UCI\'s Claire Trevor School of the Arts including drama and music.', departments: ['Drama', 'Music', 'Dance'], image: null },
  { id: 'mab', name: 'Mesa Arts Building', abbr: 'MAB', category: 'Academic', lat: 33.6502003, lng: -117.8463164, hours: 'Mon–Fri 8am–6pm', description: 'Arts building near Mesa Court housing studio and gallery spaces.', departments: ['Art', 'Design'], image: null },
 
  // ── Business / Law / Education ──
  { id: 'merage', name: 'Paul Merage School of Business', abbr: 'SB', category: 'Academic', lat: 33.646922, lng: -117.837808, hours: 'Mon–Fri 8am–6pm', description: 'UCI\'s business school offering MBA and undergraduate business programs.', departments: ['Business Administration', 'Finance', 'Marketing'], image: null },
  { id: 'law', name: 'UCI Law', abbr: 'LAW', category: 'Academic', lat: 33.64682, lng: -117.835938, hours: 'Mon–Fri 8am–6pm', description: 'UCI School of Law offering JD and graduate law programs.', departments: ['Law'], image: null },
  { id: 'education', name: 'Education Building', abbr: 'EDUC', category: 'Academic', lat: 33.647132, lng: -117.8358135, hours: 'Mon–Fri 8am–5pm', description: 'UCI School of Education building for teacher preparation and education research.', departments: ['Education'], image: null },
 
  // ── Libraries / Study ──
  { id: 'library', name: 'Langson Library', abbr: 'LLIB', category: 'Study', lat: 33.6471628, lng: -117.8411294, hours: 'Mon–Thu 7:30am–2am, Fri 7:30am–10pm, Sat 10am–10pm, Sun 10am–2am', description: 'The main undergraduate and graduate research library at UCI.', departments: [], image: null },
  { id: 'science-library', name: 'Science Library', abbr: 'SLIB', category: 'Study', lat: 33.6456791, lng: -117.846574, hours: 'Mon–Thu 8am–10pm, Fri 8am–6pm, Sat–Sun 12pm–6pm', description: 'Science and engineering research library with study rooms and 3D printing resources.', departments: [], image: null },
  { id: 'gateway-study', name: 'Gateway Study Center', abbr: 'GSC', category: 'Study', lat: 33.6474301, lng: -117.8416826, hours: 'Mon–Fri 8am–10pm', description: 'UCI Libraries Gateway Study Center for group and individual study.', departments: [], image: null },
 
  // ── Dining ──
  { id: 'anteatery', name: 'The Anteatery', abbr: 'ANT', category: 'Dining', lat: 33.6510884, lng: -117.8449358, hours: 'Mon–Fri 7am–8pm, Sat–Sun 10am–4pm', description: "UCI's flagship all-you-can-eat dining hall with a wide variety of options.", departments: [], image: null },
  { id: 'phoenix', name: 'Phoenix Food Court', abbr: 'PHX', category: 'Dining', lat: 33.6456039, lng: -117.8407073, hours: 'Mon–Fri 7:30am–8pm, Sat–Sun 10am–4pm', description: 'Food court near the Engineering and ICS buildings with multiple dining options.', departments: [], image: null },
  { id: 'brandywine', name: 'Brandywine Commons', abbr: 'BWC', category: 'Dining', lat: 33.6453928, lng: -117.8393075, hours: 'Mon–Fri 7am–8pm, Sat–Sun 9am–5pm', description: 'Brandywine Commons dining facility serving a variety of meals for students and staff.', departments: [], image: null },
 
  // ── Recreation ──
  { id: 'arc', name: 'Anteater Recreation Center', abbr: 'ARC', category: 'Recreation', lat: 33.6434101, lng: -117.8279401, hours: 'Mon–Fri 6am–11pm, Sat–Sun 8am–9pm', description: 'State-of-the-art fitness and recreation facility for students, faculty, and staff.', departments: [], image: null },
  { id: 'bren-events', name: 'Bren Events Center', abbr: 'BEC', category: 'Recreation', lat: 33.6493863, lng: -117.8470627, hours: 'Event hours vary', description: "UCI's main arena for concerts, graduation ceremonies, and athletic events.", departments: [], image: null },
  { id: 'iab', name: 'Intercollegiate Athletics Building', abbr: 'IAB', category: 'Recreation', lat: 33.6482032, lng: -117.8454751, hours: 'Mon–Fri 8am–5pm', description: 'Administrative and support building for UCI intercollegiate athletics programs.', departments: [], image: null },
 
  // ── Services / Admin ──
  { id: 'stu', name: 'Student Center', abbr: 'STU', category: 'Services', lat: 33.6488889, lng: -117.8422222, hours: 'Mon–Fri 7:30am–10pm, Sat–Sun 9am–6pm', description: 'Hub for student life, featuring dining options, meeting rooms, and student services.', departments: [], image: null },
  { id: 'alp', name: 'Anteater Learning Pavilion', abbr: 'ALP', category: 'Academic', lat: 33.6470375, lng: -117.8447153, hours: 'Mon–Fri 7am–10pm', description: 'Large lecture hall facility for undergraduate courses.', departments: [], image: null },
  { id: 'hslh', name: 'Schneiderman Lecture Hall', abbr: 'HSLH', category: 'Academic', lat: 33.6455328, lng: -117.8447278, hours: 'Mon–Fri 7am–10pm', description: 'Howard Schneiderman Lecture Hall, a large undergraduate lecture facility.', departments: [], image: null },
  { id: 'steinhaus', name: 'Steinhaus Hall', abbr: 'SH', category: 'Academic', lat: 33.6462425, lng: -117.8449331, hours: 'Mon–Fri 8am–6pm', description: 'Home to the Mathematics department at UCI.', departments: ['Mathematics'], image: null },
  { id: 'health-center', name: 'Student Health Center', abbr: 'SHC', category: 'Services', lat: 33.6456187, lng: -117.8358987, hours: 'Mon–Fri 8am–5pm', description: 'Student health and wellness center offering medical and counseling services.', departments: [], image: null },
  { id: 'ss2', name: 'Student Services II', abbr: 'SS2', category: 'Services', lat: 33.6480548, lng: -117.8425517, hours: 'Mon–Fri 8am–5pm', description: 'Student services building offering administrative and academic support.', departments: [], image: null },
 
  // ── Housing ──
  { id: 'mesa-court', name: 'Mesa Court Housing', abbr: 'MC', category: 'Services', lat: 33.6521107, lng: -117.8446509, hours: '24/7', description: 'Freshman residential housing community on the north side of campus.', departments: [], image: null },
  { id: 'campus-village', name: 'Campus Village', abbr: 'CV', category: 'Services', lat: 33.6452026, lng: -117.8469422, hours: '24/7', description: 'Upperclassman and graduate housing community near the science buildings.', departments: [], image: null },
  { id: 'verano', name: 'Verano Place Housing', abbr: 'VP', category: 'Services', lat: 33.646864, lng: -117.8335292, hours: '24/7', description: 'Family and graduate student housing community.', departments: [], image: null },
 
  // ── Parking ──
  { id: 'parking-student-center', name: 'Student Center Parking Structure', abbr: 'SCPS', category: 'Parking', lat: 33.6498706, lng: -117.8418979, hours: '24/7', description: 'Multi-level parking structure adjacent to the Student Center.', departments: [], image: null },
  { id: 'parking-mesa', name: 'Mesa Parking Structure', abbr: 'MPS', category: 'Parking', lat: 33.6505679, lng: -117.8466317, hours: '24/7', description: 'Parking structure serving the Mesa Court and north campus area.', departments: [], image: null },
  { id: 'parking-anteater', name: 'Anteater Parking Structure', abbr: 'APS', category: 'Parking', lat: 33.643151, lng: -117.837539, hours: '24/7', description: 'Parking structure on East Peltason Dr near the ARC.', departments: [], image: null },
  { id: 'parking-social-science', name: 'Social Science Parking Structure', abbr: 'SSPS', category: 'Parking', lat: 33.6474644, lng: -117.8370956, hours: '24/7', description: 'Parking structure serving the social science and law areas.', departments: [], image: null },
 
  // ── Outdoor / Landmarks ──
  { id: 'aldrich', name: 'Aldrich Park', abbr: 'APK', category: 'Outdoor', lat: 33.6460519, lng: -117.8427446, hours: 'Always Open', description: 'Central park at the heart of UCI campus, perfect for studying or relaxing outdoors.', departments: [], image: null },
  { id: 'infinity-fountain', name: 'Infinity Fountain', abbr: 'INF', category: 'Outdoor', lat: 33.644646, lng: -117.8435786, hours: 'Always Open', description: 'Iconic landmark fountain at the heart of UCI campus near the engineering buildings.', departments: [], image: null },
];
 
export const DEPARTMENTS = [
  { id: 'cs', name: 'Computer Science', school: 'Donald Bren School of ICS', building: 'Donald Bren Hall', phone: '(949) 824-7174', email: 'cs@uci.edu', website: 'https://www.cs.uci.edu' },
  { id: 'informatics', name: 'Informatics', school: 'Donald Bren School of ICS', building: 'Donald Bren Hall', phone: '(949) 824-5086', email: 'informatics@uci.edu', website: 'https://www.informatics.uci.edu' },
  { id: 'stats', name: 'Statistics', school: 'Donald Bren School of ICS', building: 'Donald Bren Hall', phone: '(949) 824-5503', email: 'stats@uci.edu', website: 'https://www.stats.uci.edu' },
  { id: 'econ', name: 'Economics', school: 'School of Social Sciences', building: 'Social Science Plaza A', phone: '(949) 824-5788', email: 'economics@uci.edu', website: 'https://www.economics.uci.edu' },
  { id: 'bio', name: 'Biological Sciences', school: 'School of Biological Sciences', building: 'Biological Sciences III', phone: '(949) 824-5564', email: 'biosci@uci.edu', website: 'https://www.bio.uci.edu' },
  { id: 'chem', name: 'Chemistry', school: 'School of Physical Sciences', building: 'Rowland Hall', phone: '(949) 824-6012', email: 'chemistry@uci.edu', website: 'https://www.chem.uci.edu' },
  { id: 'physics', name: 'Physics & Astronomy', school: 'School of Physical Sciences', building: 'Frederick Reines Hall', phone: '(949) 824-5149', email: 'physics@uci.edu', website: 'https://www.physics.uci.edu' },
  { id: 'math', name: 'Mathematics', school: 'School of Physical Sciences', building: 'Steinhaus Hall', phone: '(949) 824-5503', email: 'math@uci.edu', website: 'https://www.math.uci.edu' },
  { id: 'psych', name: 'Psychological Science', school: 'School of Social Sciences', building: 'Social & Behavioral Sciences Gateway', phone: '(949) 824-5574', email: 'psych@uci.edu', website: 'https://www.socsci.uci.edu/psych' },
  { id: 'english', name: 'English', school: 'School of Humanities', building: 'Humanities Hall', phone: '(949) 824-6712', email: 'english@uci.edu', website: 'https://www.humanities.uci.edu/english' },
  { id: 'business', name: 'Business Administration', school: 'Paul Merage School of Business', building: 'Paul Merage School of Business', phone: '(949) 824-4565', email: 'mba@uci.edu', website: 'https://merage.uci.edu' },
  { id: 'law', name: 'Law', school: 'UCI School of Law', building: 'UCI Law', phone: '(949) 824-9060', email: 'lawadmissions@uci.edu', website: 'https://law.uci.edu' },
  { id: 'education', name: 'Education', school: 'School of Education', building: 'Education Building', phone: '(949) 824-8073', email: 'education@uci.edu', website: 'https://education.uci.edu' },
  { id: 'earth', name: 'Earth System Science', school: 'School of Physical Sciences', building: 'Croul Hall', phone: '(949) 824-5838', email: 'ess@uci.edu', website: 'https://www.ess.uci.edu' },
  { id: 'drama', name: 'Drama', school: 'Claire Trevor School of the Arts', building: 'Claire Trevor School of the Arts', phone: '(949) 824-6614', email: 'drama@uci.edu', website: 'https://www.arts.uci.edu/drama' },
  { id: 'criminology', name: 'Criminology, Law & Society', school: 'School of Social Ecology', building: 'Social Ecology I', phone: '(949) 824-7277', email: 'cls@uci.edu', website: 'https://cls.soceco.uci.edu' },
];
 
export const SHUTTLE_ROUTES = [
  { id: 'anteater-express', name: 'Anteater Express', color: '#4ecda4', stops: ['Gateway Transit Center', 'Student Center', 'Aldrich Park', 'ARC', 'Verano Place', 'Gateway Transit Center'], frequency: '10 min', nextArrival: '3 min', status: 'On Time' },
  { id: 'campus-loop', name: 'Campus Loop', color: '#5b9cf6', stops: ['Main Entrance', 'Langson Library', 'Mesa Court', 'Verano Place', 'Engineering', 'Main Entrance'], frequency: '15 min', nextArrival: '8 min', status: 'On Time' },
  { id: 'irvine-connect', name: 'Irvine Connect', color: '#f5c842', stops: ['UCI Medical Center', 'Irvine Valley College', 'Campus', 'Irvine Train Station'], frequency: '30 min', nextArrival: '22 min', status: 'Delayed 5 min' },
];
 
export const PARKING_LOTS = [
  { id: 'parking-student-center', name: 'Student Center Parking Structure', type: 'Structure', available: 84, total: 400, permit: 'A, B', lat: 33.6498706, lng: -117.8418979 },
  { id: 'parking-mesa', name: 'Mesa Parking Structure', type: 'Structure', available: 12, total: 500, permit: 'A, B, S', lat: 33.6505679, lng: -117.8466317 },
  { id: 'parking-anteater', name: 'Anteater Parking Structure', type: 'Structure', available: 200, total: 250, permit: 'A, P', lat: 33.643151, lng: -117.837539 },
  { id: 'parking-social-science', name: 'Social Science Parking Structure', type: 'Structure', available: 95, total: 300, permit: 'A, B', lat: 33.6474644, lng: -117.8370956 },
];
 
export const CATEGORIES = ['All', 'Academic', 'Dining', 'Study', 'Recreation', 'Services', 'Parking', 'Outdoor'];
 
export const QUICK_FILTERS = ['Food', 'Study spots', 'Open now', 'Nearby'];
 
export const TRENDING = [
  { id: 'anteatery', name: 'The Anteatery', category: 'Dining', subtext: 'All-you-can-eat', distance: '0.2 mi', status: 'Open', rating: 4.2 },
  { id: 'library', name: 'Langson Library', category: 'Study', subtext: 'Study', distance: '0.5 mi', status: 'Open', rating: 4.7 },
  { id: 'arc', name: 'Anteater Recreation Center', category: 'Recreation', subtext: 'Gym & Recreation', distance: '0.3 mi', status: 'Open', rating: 4.5 },
];
 
export const ALERTS = [
  { id: '1', type: 'info', title: 'Shuttle Delay', message: 'Irvine Connect route is running 5 minutes behind schedule.', time: '10 min ago', active: true },
  { id: '2', type: 'warning', title: 'Mesa Parking Nearly Full', message: 'Mesa Parking Structure has fewer than 15 spaces remaining.', time: '25 min ago', active: true },
  { id: '3', type: 'success', title: 'Library Hours Extended', message: 'Langson Library will remain open until 3am during finals week.', time: '2h ago', active: false },
];
 
export const UCI_CENTER = [33.6461, -117.8426];
 