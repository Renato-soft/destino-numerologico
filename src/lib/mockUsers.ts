/**
 * NumFlame — Mock user pool for matching demo (50 users)
 * Used as stand-in for a real Supabase users table.
 */

import { UserProfile } from './auth';
import { calculateFullProfile } from './numerology';

interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'M' | 'F' | 'N';
  age: number;
  city: string;
  bio: string;
  avatarSeed: string; // used for deterministic avatar URL
}

const RAW: MockUser[] = [
  { id: 'm1',  firstName: 'Sofia',    lastName: 'Marchetti', birthDate: '1994-03-14', gender: 'F', age: 31, city: 'Milan',    bio: 'Yoga teacher, lover of silence and sunsets.', avatarSeed: 'Sofia' },
  { id: 'm2',  firstName: 'Giulia',   lastName: 'Rossi',     birthDate: '1990-11-22', gender: 'F', age: 35, city: 'Rome',     bio: 'Art historian and weekend baker.', avatarSeed: 'Giulia' },
  { id: 'm3',  firstName: 'Valentina',lastName: 'Conti',     birthDate: '1996-07-07', gender: 'F', age: 28, city: 'Florence', bio: 'Freelance illustrator, caffeine dependent.', avatarSeed: 'Valentina' },
  { id: 'm4',  firstName: 'Aurora',   lastName: 'Ferrari',   birthDate: '1992-01-01', gender: 'F', age: 33, city: 'Turin',    bio: 'Poet and amateur astronomer.', avatarSeed: 'Aurora' },
  { id: 'm5',  firstName: 'Elena',    lastName: 'Bianchi',   birthDate: '1988-05-29', gender: 'F', age: 37, city: 'Naples',   bio: 'Chef who believes food is love.', avatarSeed: 'Elena' },
  { id: 'm6',  firstName: 'Chiara',   lastName: 'Romano',    birthDate: '1997-09-18', gender: 'F', age: 27, city: 'Bologna',  bio: 'Neuroscience PhD student.', avatarSeed: 'Chiara' },
  { id: 'm7',  firstName: 'Beatrice', lastName: 'Lombardi',  birthDate: '1993-02-11', gender: 'F', age: 32, city: 'Venice',   bio: 'Pianist and sea swimmer.', avatarSeed: 'Beatrice' },
  { id: 'm8',  firstName: 'Serena',   lastName: 'Gallo',     birthDate: '1991-08-04', gender: 'F', age: 34, city: 'Palermo',  bio: 'Theatre director with a love for Japanese cuisine.', avatarSeed: 'Serena' },
  { id: 'm9',  firstName: 'Mia',      lastName: 'Costa',     birthDate: '1999-12-21', gender: 'F', age: 25, city: 'Genoa',    bio: 'Marine biologist and fiction writer.', avatarSeed: 'Mia' },
  { id: 'm10', firstName: 'Laura',    lastName: 'Esposito',  birthDate: '1986-06-06', gender: 'F', age: 39, city: 'Bari',     bio: 'Landscape architect and trail runner.', avatarSeed: 'Laura' },
  { id: 'm11', firstName: 'Alice',    lastName: 'Fontana',   birthDate: '1995-04-22', gender: 'F', age: 30, city: 'Verona',   bio: 'Sommelier who reads tarot on weekends.', avatarSeed: 'Alice' },
  { id: 'm12', firstName: 'Isabella', lastName: 'Moretti',   birthDate: '1989-10-10', gender: 'F', age: 36, city: 'Catania',  bio: 'Fashion designer, collector of vintage maps.', avatarSeed: 'Isabella' },
  { id: 'm13', firstName: 'Camilla',  lastName: 'Barbieri',  birthDate: '1998-03-03', gender: 'F', age: 27, city: 'Trieste',  bio: 'Violinist and mountain hiker.', avatarSeed: 'Camilla' },
  { id: 'm14', firstName: 'Matilda',  lastName: 'Russo',     birthDate: '1987-07-16', gender: 'F', age: 38, city: 'Bergamo',  bio: 'Psychologist, bookshop volunteer.', avatarSeed: 'Matilda' },
  { id: 'm15', firstName: 'Noemi',    lastName: 'Vitale',    birthDate: '2000-01-27', gender: 'F', age: 25, city: 'Brescia',  bio: 'Digital artist obsessed with symmetry.', avatarSeed: 'Noemi' },
  { id: 'm16', firstName: 'Francesca',lastName: 'Leone',     birthDate: '1994-09-09', gender: 'F', age: 31, city: 'Padua',    bio: 'Journalist and salsa dancer.', avatarSeed: 'Francesca' },
  { id: 'm17', firstName: 'Martina',  lastName: 'Greco',     birthDate: '1993-05-14', gender: 'F', age: 32, city: 'Livorno',  bio: 'Veterinarian, wildlife photographer.', avatarSeed: 'Martina' },
  { id: 'm18', firstName: 'Elisa',    lastName: 'Serra',     birthDate: '1990-11-11', gender: 'F', age: 35, city: 'Cagliari', bio: 'Architect who loves silence.', avatarSeed: 'Elisa' },
  { id: 'm19', firstName: 'Ilaria',   lastName: 'Ricci',     birthDate: '1996-02-22', gender: 'F', age: 29, city: 'Siena',    bio: 'Restorer of ancient frescoes.', avatarSeed: 'Ilaria' },
  { id: 'm20', firstName: 'Sara',     lastName: 'Longo',     birthDate: '1985-06-17', gender: 'F', age: 40, city: 'Torino',   bio: 'Startup founder, world traveller.', avatarSeed: 'Sara' },
  { id: 'm21', firstName: 'Luca',     lastName: 'Martinelli',birthDate: '1991-04-05', gender: 'M', age: 34, city: 'Milan',    bio: 'Architect with a passion for astronomy.', avatarSeed: 'Luca' },
  { id: 'm22', firstName: 'Marco',    lastName: 'Colombo',   birthDate: '1989-08-18', gender: 'M', age: 36, city: 'Rome',     bio: 'Jazz musician and slow traveller.', avatarSeed: 'Marco' },
  { id: 'm23', firstName: 'Davide',   lastName: 'Greco',     birthDate: '1993-12-12', gender: 'M', age: 32, city: 'Florence', bio: 'UX designer who meditates daily.', avatarSeed: 'Davide' },
  { id: 'm24', firstName: 'Andrea',   lastName: 'Neri',      birthDate: '1987-03-27', gender: 'M', age: 38, city: 'Turin',    bio: 'Documentary filmmaker, vegan cook.', avatarSeed: 'Andrea' },
  { id: 'm25', firstName: 'Matteo',   lastName: 'Ferrara',   birthDate: '1995-07-07', gender: 'M', age: 30, city: 'Naples',   bio: 'Marine biologist and surfer.', avatarSeed: 'Matteo' },
  { id: 'm26', firstName: 'Alessandro',lastName: 'Rizzo',   birthDate: '1992-01-15', gender: 'M', age: 33, city: 'Bologna',  bio: 'Software engineer who loves philosophy.', avatarSeed: 'Alessandro' },
  { id: 'm27', firstName: 'Federico', lastName: 'Monti',     birthDate: '1998-05-22', gender: 'M', age: 27, city: 'Venice',   bio: 'Poet and beekeeper.', avatarSeed: 'Federico' },
  { id: 'm28', firstName: 'Giacomo',  lastName: 'Pappalardo',birthDate: '1986-09-30', gender: 'M', age: 39, city: 'Palermo',  bio: 'Chef and street art enthusiast.', avatarSeed: 'Giacomo' },
  { id: 'm29', firstName: 'Simone',   lastName: 'Caruso',    birthDate: '1999-02-14', gender: 'M', age: 26, city: 'Genoa',    bio: 'Environmental activist and rock climber.', avatarSeed: 'Simone' },
  { id: 'm30', firstName: 'Roberto',  lastName: 'Amato',     birthDate: '1984-06-11', gender: 'M', age: 41, city: 'Bari',     bio: 'Historian of religions, amateur boxer.', avatarSeed: 'Roberto' },
  { id: 'm31', firstName: 'Emanuele', lastName: 'Testa',     birthDate: '1997-04-04', gender: 'M', age: 28, city: 'Verona',   bio: 'Sculptor who makes music at night.', avatarSeed: 'Emanuele' },
  { id: 'm32', firstName: 'Nicola',   lastName: 'Marini',    birthDate: '1990-10-17', gender: 'M', age: 35, city: 'Catania',  bio: 'Neurologist, marathon runner.', avatarSeed: 'Nicola' },
  { id: 'm33', firstName: 'Fabrizio', lastName: 'Cattaneo',  birthDate: '1988-07-22', gender: 'M', age: 37, city: 'Trieste',  bio: 'Sailor and amateur astronomer.', avatarSeed: 'Fabrizio' },
  { id: 'm34', firstName: 'Lorenzo',  lastName: 'Silvestri', birthDate: '1994-11-08', gender: 'M', age: 31, city: 'Bergamo',  bio: 'Book editor and trail runner.', avatarSeed: 'Lorenzo' },
  { id: 'm35', firstName: 'Daniele',  lastName: 'Sanna',     birthDate: '2001-01-01', gender: 'M', age: 24, city: 'Brescia',  bio: 'Young entrepreneur, chess player.', avatarSeed: 'Daniele' },
  { id: 'm36', firstName: 'Alessio',  lastName: 'Fiore',     birthDate: '1992-06-30', gender: 'M', age: 33, city: 'Padua',    bio: 'Psychotherapist and tango dancer.', avatarSeed: 'Alessio' },
  { id: 'm37', firstName: 'Stefano',  lastName: 'Rinaldi',   birthDate: '1985-03-19', gender: 'M', age: 40, city: 'Livorno',  bio: 'Cartoonist, volunteer firefighter.', avatarSeed: 'Stefano' },
  { id: 'm38', firstName: 'Vincenzo', lastName: 'Palumbo',   birthDate: '1996-09-09', gender: 'M', age: 29, city: 'Cagliari', bio: 'Marine engineer, philosophy reader.', avatarSeed: 'Vincenzo' },
  { id: 'm39', firstName: 'Dario',    lastName: 'Mancini',   birthDate: '1991-11-11', gender: 'M', age: 34, city: 'Siena',    bio: 'Sommelier and meditation guide.', avatarSeed: 'Dario' },
  { id: 'm40', firstName: 'Paolo',    lastName: 'Gatti',     birthDate: '1983-08-08', gender: 'M', age: 42, city: 'Torino',   bio: 'Film director and avid reader.', avatarSeed: 'Paolo' },
  { id: 'm41', firstName: 'Marie',    lastName: 'Dupont',    birthDate: '1993-05-05', gender: 'F', age: 32, city: 'Paris',    bio: 'Journalist passionnée par les chiffres.', avatarSeed: 'Marie' },
  { id: 'm42', firstName: 'Lucie',    lastName: 'Bernard',   birthDate: '1997-11-22', gender: 'F', age: 28, city: 'Lyon',     bio: 'Choreographer and amateur sailor.', avatarSeed: 'Lucie' },
  { id: 'm43', firstName: 'Elena',    lastName: 'García',    birthDate: '1990-02-28', gender: 'F', age: 35, city: 'Madrid',   bio: 'Flamenco dancer and writer.', avatarSeed: 'ElenaG' },
  { id: 'm44', firstName: 'Carlos',   lastName: 'Pérez',     birthDate: '1988-07-14', gender: 'M', age: 37, city: 'Barcelona',bio: 'Architect obsessed with sacred geometry.', avatarSeed: 'Carlos' },
  { id: 'm45', firstName: 'Ana',      lastName: 'Silva',     birthDate: '1995-09-09', gender: 'F', age: 30, city: 'Lisbon',   bio: 'Marine biologist and fado singer.', avatarSeed: 'Ana' },
  { id: 'm46', firstName: 'João',     lastName: 'Santos',    birthDate: '1992-03-22', gender: 'M', age: 33, city: 'Porto',    bio: 'Graphic novelist and surfer.', avatarSeed: 'Joao' },
  { id: 'm47', firstName: 'Ingrid',   lastName: 'Müller',    birthDate: '1994-01-11', gender: 'F', age: 31, city: 'Berlin',   bio: 'Environmental scientist and yogi.', avatarSeed: 'Ingrid' },
  { id: 'm48', firstName: 'Chloe',    lastName: 'Martin',    birthDate: '1998-04-04', gender: 'F', age: 27, city: 'London',   bio: 'Fashion photographer and poet.', avatarSeed: 'Chloe' },
  { id: 'm49', firstName: 'Arjun',    lastName: 'Sharma',    birthDate: '1990-08-08', gender: 'M', age: 35, city: 'Mumbai',   bio: 'Yoga philosopher and tech entrepreneur.', avatarSeed: 'Arjun' },
  { id: 'm50', firstName: 'Yuki',     lastName: 'Tanaka',    birthDate: '1996-06-06', gender: 'F', age: 29, city: 'Tokyo',    bio: 'Illustrator and tea ceremony practitioner.', avatarSeed: 'Yuki' },
];

export interface MockUserWithProfile extends MockUser {
  numerology: ReturnType<typeof calculateFullProfile>;
}

let _cached: MockUserWithProfile[] | null = null;

export function getMockUsers(): MockUserWithProfile[] {
  if (_cached) return _cached;
  _cached = RAW.map(u => ({
    ...u,
    numerology: calculateFullProfile(u.firstName, u.lastName, u.birthDate),
  }));
  return _cached;
}

/** Avatar URL using DiceBear (deterministic, no network key required) */
export function getAvatarUrl(seed: string, gender: 'M' | 'F' | 'N' = 'N'): string {
  const style = gender === 'M' ? 'adventurer' : gender === 'F' ? 'avataaars' : 'bottts';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export function toUserProfile(m: MockUserWithProfile): Omit<UserProfile, 'email' | 'lookingFor' | 'photos' | 'onboardingComplete' | 'createdAt'> & {
  bio: string;
  city: string;
  age: number;
  avatarUrl: string;
} {
  return {
    id: m.id,
    firstName: m.firstName,
    lastName: m.lastName,
    birthDate: m.birthDate,
    gender: m.gender,
    numerology: m.numerology,
    bio: m.bio,
    city: m.city,
    age: m.age,
    avatarUrl: getAvatarUrl(m.avatarSeed, m.gender),
  };
}
