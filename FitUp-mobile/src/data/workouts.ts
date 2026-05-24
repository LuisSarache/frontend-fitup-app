
import { WorkoutLevel } from '../types';

export type Exercise = {
  id: string;
  name: string;
  sets: string;
  tip: string;
  restSeconds: number;
  instructions?: string[];
  targetMuscles?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
};

export type Workout = {
  key: string;
  label: string;
  focus: string;
  emoji: string;
  level: WorkoutLevel;
  durationMinutes: number;
  color: string;
  exercises: Exercise[];
};

// 🎨 Cores modernas
const workoutColors = {
  Beginner: '#22C55E',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444',
} as const;

// 🛠 Helper exercício
const ex = (
  id: string,
  name: string,
  sets: string,
  tip: string,
  restSeconds: number,
  instructions?: string[],
  targetMuscles?: string[],
  difficulty?: 'easy' | 'medium' | 'hard'
): Exercise => ({
  id,
  name,
  sets,
  tip,
  restSeconds,
  instructions,
  targetMuscles,
  difficulty,
});

// 🛠 Helper treino
const createWorkout = (
  key: string,
  label: string,
  focus: string,
  emoji: string,
  level: WorkoutLevel,
  durationMinutes: number,
  exercises: Exercise[]
): Workout => ({
  key,
  label,
  focus,
  emoji,
  level,
  durationMinutes,
  color: workoutColors[level],
  exercises,
});

export const WORKOUTS: Workout[] = [
  // ───────── BEGINNER ─────────
  createWorkout(
    'BegA',
    'Treino A',
    'Peito & Tríceps',
    '💪',
    'Beginner',
    25,
    [
      ex(
        '1',
        'Flexão de Braço',
        '3x10',
        'Core contraído',
        60,
        [
          'Posicione as mãos na largura dos ombros',
          'Mantenha o corpo reto da cabeça aos pés',
          'Desça até o peito quase tocar o chão',
          'Empurre com força para subir',
          'Expire ao subir, inspire ao descer',
        ],
        ['Peitoral', 'Tríceps', 'Ombros'],
        'medium'
      ),
      ex(
        '2',
        'Tríceps no Banco',
        '3x12',
        'Controle na descida',
        60,
        [
          'Sente na borda de uma cadeira ou banco',
          'Apoie as mãos na borda ao lado do quadril',
          'Deslize o quadril para frente, fora do banco',
          'Dobre os cotovelos para descer o corpo',
          'Empurre para cima até estender os braços',
        ],
        ['Tríceps', 'Ombros'],
        'easy'
      ),
      ex(
        '3',
        'Flexão Diamante',
        '3x8',
        'Mãos próximas',
        60,
        [
          'Posicione as mãos próximas formando um diamante',
          'Polegares e indicadores se tocando',
          'Mantenha os cotovelos próximos ao corpo',
          'Desça controladamente',
          'Foco total no tríceps',
        ],
        ['Tríceps', 'Peitoral'],
        'hard'
      ),
      ex(
        '4',
        'Flexão Inclinada',
        '3x10',
        'Superfície elevada',
        60,
        [
          'Apoie as mãos em uma superfície elevada (mesa, sofá)',
          'Corpo inclinado, pés no chão',
          'Desça o peito em direção à superfície',
          'Empurre para voltar à posição inicial',
          'Ótimo para iniciantes',
        ],
        ['Peitoral', 'Tríceps'],
        'easy'
      ),
      ex(
        '5',
        'Mergulho entre Cadeiras',
        '3x10',
        'Cotovelos para trás',
        60,
        [
          'Posicione duas cadeiras paralelas',
          'Apoie uma mão em cada cadeira',
          'Pés no chão ou elevados',
          'Desça dobrando os cotovelos',
          'Empurre para subir',
        ],
        ['Tríceps', 'Peitoral', 'Ombros'],
        'medium'
      ),
    ]
  ),

  createWorkout(
    'BegB',
    'Treino B',
    'Costas & Bíceps',
    '🏋️',
    'Beginner',
    25,
    [
      ex('1', 'Remada com Mochila', '3x10', 'Puxe os cotovelos', 60),
      ex('2', 'Flexão Inversa', '3x8', 'Palmas para cima', 60),
      ex('3', 'Rosca com Garrafa', '3x12', 'Cotovelos fixos', 60),
      ex('4', 'Superman', '3x12', 'Eleve braços e pernas', 45),
      ex('5', 'Prancha', '3x30s', 'Quadril neutro', 45),
    ]
  ),

  createWorkout(
    'BegC',
    'Treino C',
    'Pernas & Core',
    '🦵',
    'Beginner',
    25,
    [
      ex('1', 'Agachamento Livre', '3x15', 'Joelhos alinhados', 60),
      ex('2', 'Avanço', '3x10 cada', 'Tronco reto', 60),
      ex('3', 'Panturrilha', '3x20', 'Suba lentamente', 30),
      ex('4', 'Abdominal Crunch', '3x15', 'Não force o pescoço', 45),
      ex('5', 'Prancha Lateral', '3x20s', 'Quadril elevado', 45),
    ]
  ),

  // ───────── INTERMEDIATE ─────────
  createWorkout(
    'IntA',
    'Treino A',
    'Peito & Tríceps',
    '🔥',
    'Intermediate',
    35,
    [
      ex('1', 'Flexão Pike', '4x10', 'Quadril elevado', 75),
      ex('2', 'Dips entre Cadeiras', '4x10', 'Desça controlado', 75),
      ex('3', 'Flexão Archer', '3x8', 'Braço lateral', 75),
      ex('4', 'Flexão Explosiva', '3x8', 'Subida explosiva', 75),
      ex('5', 'Prancha Dinâmica', '3x30s', 'Alterne os apoios', 45),
    ]
  ),

  createWorkout(
    'IntB',
    'Treino B',
    'Costas & Bíceps',
    '⚡',
    'Intermediate',
    35,
    [
      ex('1', 'Remada Australiana', '4x10', 'Peito na barra', 75),
      ex('2', 'Flexão Invertida', '3x8', 'Controle total', 75),
      ex('3', 'Isométrico Bíceps', '3x30s', 'Segure forte', 45),
      ex('4', 'Superman Rotação', '3x12', 'Rotação controlada', 45),
      ex('5', 'Prancha Ombro', '3x20', 'Evite balanço', 45),
    ]
  ),

  createWorkout(
    'IntC',
    'Treino C',
    'Pernas & Core',
    '🦵',
    'Intermediate',
    35,
    [
      ex('1', 'Agachamento Búlgaro', '3x10 cada', 'Pé elevado', 90),
      ex('2', 'Avanço com Salto', '3x8 cada', 'Troca no ar', 75),
      ex('3', 'Agachamento Sumô', '3x15', 'Pés afastados', 60),
      ex('4', 'Mountain Climber', '3x30s', 'Ritmo constante', 45),
      ex('5', 'Prancha Dinâmica', '3x30s', 'Core firme', 45),
    ]
  ),

  // ───────── ADVANCED ─────────
  createWorkout(
    'AdvA',
    'Treino A',
    'Peito & Tríceps',
    '🚀',
    'Advanced',
    45,
    [
      ex('1', 'Flexão com Aplauso', '4x10', 'Explosão máxima', 90),
      ex('2', 'Pseudo Planche', '4x8', 'Incline o corpo', 90),
      ex('3', 'Dips Profundo', '4x12', 'Amplitude máxima', 90),
      ex('4', 'Flexão Archer', '3x8', 'Braço lateral estendido', 90),
      ex('5', 'Pike Push-up', '3x10', 'Simule press militar', 75),
    ]
  ),

  createWorkout(
    'AdvB',
    'Treino B',
    'Costas & Bíceps',
    '🏆',
    'Advanced',
    45,
    [
      ex('1', 'Remada Elevada', '4x12', 'Pés elevados', 90),
      ex('2', 'Chin-up Assistido', '3x8', 'Use elástico', 90),
      ex('3', 'Remada Toalha', '3x10', 'Controle total', 75),
      ex('4', 'Superman Isométrico', '3x30s', 'Segure no topo', 45),
      ex('5', 'Prancha Avançada', '3x30s', 'Core rígido', 60),
    ]
  ),

  createWorkout(
    'AdvC',
    'Treino C',
    'Pernas & Core',
    '🧠',
    'Advanced',
    45,
    [
      ex('1', 'Pistol Squat', '3x6 cada', 'Equilíbrio total', 90),
      ex('2', 'Nordic Curl', '3x5', 'Desça lentamente', 90),
      ex('3', 'Dragon Flag', '3x5', 'Corpo reto', 90),
      ex('4', 'L-Sit', '3x15s', 'Pernas paralelas', 60),
      ex('5', 'Prancha Elevação', '3x10', 'Braço e perna opostos', 60),
    ]
  ),
];

// ⚡ Busca rápida
export const WORKOUT_MAP = Object.fromEntries(
  WORKOUTS.map((workout) => [workout.key, workout])
) as Record<string, Workout>;

// 🔎 Filtrar por nível
export function getWorkoutsByLevel(level: WorkoutLevel): Workout[] {
  return WORKOUTS.filter((workout) => workout.level === level);
}

// 🔁 Próximo treino automático
export function getNextWorkout(
  history: { workoutKey: string }[],
  level: WorkoutLevel
): Workout {
  const workouts = getWorkoutsByLevel(level);

  if (!history.length) {
    return workouts[0];
  }

  const lastWorkoutKey = history.at(-1)?.workoutKey;

  const currentIndex = workouts.findIndex(
    (workout) => workout.key === lastWorkoutKey
  );

  return workouts[(currentIndex + 1) % workouts.length];
}

