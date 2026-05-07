import { WorkoutLevel } from '../types';

export type Exercise = {
  id: string;
  name: string;
  sets: string;
  tip: string;
  restSeconds: number;
};

export type Workout = {
  key: string;
  label: string;
  focus: string;
  emoji: string;
  level: WorkoutLevel;
  durationMinutes: number;
  exercises: Exercise[];
};

export const WORKOUTS: Workout[] = [
  // ─── BEGINNER ───────────────────────────────────────────────
  {
    key: 'BegA',
    label: 'Treino A',
    focus: 'Peito & Tríceps',
    emoji: '💪',
    level: 'Beginner',
    durationMinutes: 25,
    exercises: [
      {
        id: '1',
        name: 'Flexão de Braço',
        sets: '3x10',
        tip: 'Mantenha o core contraído',
        restSeconds: 60,
      },
      {
        id: '2',
        name: 'Tríceps no Banco',
        sets: '3x12',
        tip: 'Desça até 90° no cotovelo',
        restSeconds: 60,
      },
      {
        id: '3',
        name: 'Flexão Diamante',
        sets: '3x8',
        tip: 'Mãos formando um triângulo',
        restSeconds: 60,
      },
      {
        id: '4',
        name: 'Flexão Inclinada',
        sets: '3x10',
        tip: 'Mãos em superfície elevada',
        restSeconds: 60,
      },
      {
        id: '5',
        name: 'Mergulho entre Cadeiras',
        sets: '3x10',
        tip: 'Cotovelos apontados para trás',
        restSeconds: 60,
      },
    ],
  },
  {
    key: 'BegB',
    label: 'Treino B',
    focus: 'Costas & Bíceps',
    emoji: '🏋️',
    level: 'Beginner',
    durationMinutes: 25,
    exercises: [
      {
        id: '1',
        name: 'Remada com Mochila',
        sets: '3x10',
        tip: 'Puxe o cotovelo para trás',
        restSeconds: 60,
      },
      { id: '2', name: 'Flexão Inversa', sets: '3x8', tip: 'Palmas para cima', restSeconds: 60 },
      {
        id: '3',
        name: 'Rosca com Garrafa',
        sets: '3x12',
        tip: 'Mantenha o cotovelo fixo',
        restSeconds: 60,
      },
      {
        id: '4',
        name: 'Superman',
        sets: '3x12',
        tip: 'Eleve braços e pernas juntos',
        restSeconds: 45,
      },
      {
        id: '5',
        name: 'Prancha',
        sets: '3x30s',
        tip: 'Core contraído, quadril neutro',
        restSeconds: 45,
      },
    ],
  },
  {
    key: 'BegC',
    label: 'Treino C',
    focus: 'Pernas & Core',
    emoji: '🦵',
    level: 'Beginner',
    durationMinutes: 25,
    exercises: [
      {
        id: '1',
        name: 'Agachamento Livre',
        sets: '3x15',
        tip: 'Joelhos alinhados com os pés',
        restSeconds: 60,
      },
      {
        id: '2',
        name: 'Avanço',
        sets: '3x10 cada',
        tip: 'Tronco ereto, passo largo',
        restSeconds: 60,
      },
      {
        id: '3',
        name: 'Elevação de Panturrilha',
        sets: '3x20',
        tip: 'Suba na ponta dos pés',
        restSeconds: 30,
      },
      {
        id: '4',
        name: 'Abdominal Crunch',
        sets: '3x15',
        tip: 'Não puxe o pescoço',
        restSeconds: 45,
      },
      {
        id: '5',
        name: 'Prancha Lateral',
        sets: '3x20s cada',
        tip: 'Quadril elevado, corpo reto',
        restSeconds: 45,
      },
    ],
  },

  // ─── INTERMEDIATE ────────────────────────────────────────────
  {
    key: 'IntA',
    label: 'Treino A',
    focus: 'Peito & Tríceps',
    emoji: '💪',
    level: 'Intermediate',
    durationMinutes: 35,
    exercises: [
      {
        id: '1',
        name: 'Flexão com Palmas Fechadas',
        sets: '4x12',
        tip: 'Mãos próximas ao centro',
        restSeconds: 75,
      },
      {
        id: '2',
        name: 'Dips entre Cadeiras',
        sets: '4x10',
        tip: 'Desça até 90° no cotovelo',
        restSeconds: 75,
      },
      {
        id: '3',
        name: 'Flexão Pike',
        sets: '3x10',
        tip: 'Quadril elevado, cabeça para baixo',
        restSeconds: 60,
      },
      {
        id: '4',
        name: 'Flexão Archer',
        sets: '3x8 cada',
        tip: 'Estenda um braço lateralmente',
        restSeconds: 75,
      },
      {
        id: '5',
        name: 'Tríceps Testa no Chão',
        sets: '3x12',
        tip: 'Cotovelos apontados para frente',
        restSeconds: 60,
      },
    ],
  },
  {
    key: 'IntB',
    label: 'Treino B',
    focus: 'Costas & Bíceps',
    emoji: '🏋️',
    level: 'Intermediate',
    durationMinutes: 35,
    exercises: [
      {
        id: '1',
        name: 'Remada Australiana',
        sets: '4x10',
        tip: 'Corpo reto, puxe o peito à barra',
        restSeconds: 75,
      },
      {
        id: '2',
        name: 'Flexão Invertida Elevada',
        sets: '3x8',
        tip: 'Pés em superfície elevada',
        restSeconds: 75,
      },
      {
        id: '3',
        name: 'Isométrico de Bíceps',
        sets: '3x30s',
        tip: 'Pressione contra superfície fixa',
        restSeconds: 45,
      },
      {
        id: '4',
        name: 'Superman com Rotação',
        sets: '3x12',
        tip: 'Gire o tronco no topo',
        restSeconds: 45,
      },
      {
        id: '5',
        name: 'Prancha com Toque no Ombro',
        sets: '3x20',
        tip: 'Minimize o balanço do quadril',
        restSeconds: 45,
      },
    ],
  },
  {
    key: 'IntC',
    label: 'Treino C',
    focus: 'Pernas & Core',
    emoji: '🦵',
    level: 'Intermediate',
    durationMinutes: 35,
    exercises: [
      {
        id: '1',
        name: 'Agachamento Búlgaro',
        sets: '3x10 cada',
        tip: 'Pé traseiro elevado',
        restSeconds: 90,
      },
      {
        id: '2',
        name: 'Avanço com Salto',
        sets: '3x8 cada',
        tip: 'Troque as pernas no ar',
        restSeconds: 75,
      },
      {
        id: '3',
        name: 'Agachamento Sumô',
        sets: '3x15',
        tip: 'Pés afastados, pontas para fora',
        restSeconds: 60,
      },
      {
        id: '4',
        name: 'Prancha com Toque no Ombro',
        sets: '3x20',
        tip: 'Minimize o balanço',
        restSeconds: 45,
      },
      {
        id: '5',
        name: 'Mountain Climber',
        sets: '3x30s',
        tip: 'Joelhos ao peito alternados',
        restSeconds: 45,
      },
    ],
  },
  {
    key: 'IntD',
    label: 'Treino D',
    focus: 'Full Body',
    emoji: '🔥',
    level: 'Intermediate',
    durationMinutes: 30,
    exercises: [
      { id: '1', name: 'Burpee', sets: '3x10', tip: 'Explosão na subida', restSeconds: 90 },
      {
        id: '2',
        name: 'Mountain Climber',
        sets: '3x30s',
        tip: 'Joelhos ao peito alternados',
        restSeconds: 60,
      },
      {
        id: '3',
        name: 'Agachamento com Salto',
        sets: '3x12',
        tip: 'Aterrisse suavemente',
        restSeconds: 75,
      },
      {
        id: '4',
        name: 'Flexão Explosiva',
        sets: '3x8',
        tip: 'Mãos saem do chão no topo',
        restSeconds: 75,
      },
      {
        id: '5',
        name: 'Prancha Dinâmica',
        sets: '3x30s',
        tip: 'Alterne cotovelo e mão',
        restSeconds: 45,
      },
    ],
  },

  // ─── ADVANCED ────────────────────────────────────────────────
  {
    key: 'AdvA',
    label: 'Treino A',
    focus: 'Peito & Tríceps',
    emoji: '💪',
    level: 'Advanced',
    durationMinutes: 45,
    exercises: [
      {
        id: '1',
        name: 'Flexão com Aplauso',
        sets: '4x10',
        tip: 'Explosão máxima na subida',
        restSeconds: 90,
      },
      {
        id: '2',
        name: 'Pseudo Planche',
        sets: '4x8',
        tip: 'Incline o corpo para frente',
        restSeconds: 90,
      },
      { id: '3', name: 'Dips Profundo', sets: '4x12', tip: 'Desça abaixo de 90°', restSeconds: 90 },
      {
        id: '4',
        name: 'Flexão Archer',
        sets: '3x8 cada',
        tip: 'Braço estendido ao lado',
        restSeconds: 90,
      },
      {
        id: '5',
        name: 'Pike Push-up',
        sets: '3x10',
        tip: 'Simula o press militar',
        restSeconds: 75,
      },
    ],
  },
  {
    key: 'AdvB',
    label: 'Treino B',
    focus: 'Costas & Bíceps',
    emoji: '🏋️',
    level: 'Advanced',
    durationMinutes: 45,
    exercises: [
      {
        id: '1',
        name: 'Remada Australiana Elevada',
        sets: '4x12',
        tip: 'Pés em superfície elevada',
        restSeconds: 90,
      },
      {
        id: '2',
        name: 'Flexão Invertida Vertical',
        sets: '4x8',
        tip: 'Pés na parede, cabeça abaixo',
        restSeconds: 90,
      },
      {
        id: '3',
        name: 'Chin-up Assistido',
        sets: '3x8',
        tip: 'Use elástico para assistência',
        restSeconds: 90,
      },
      {
        id: '4',
        name: 'Remada com Toalha',
        sets: '3x10',
        tip: 'Enrole toalha em porta',
        restSeconds: 75,
      },
      {
        id: '5',
        name: 'Superman Isométrico',
        sets: '3x30s',
        tip: 'Segure no topo',
        restSeconds: 45,
      },
    ],
  },
  {
    key: 'AdvC',
    label: 'Treino C',
    focus: 'Pernas & Core',
    emoji: '🦵',
    level: 'Advanced',
    durationMinutes: 45,
    exercises: [
      {
        id: '1',
        name: 'Pistol Squat Assistido',
        sets: '3x6 cada',
        tip: 'Segure em superfície para equilíbrio',
        restSeconds: 90,
      },
      {
        id: '2',
        name: 'Nordic Curl',
        sets: '3x5',
        tip: 'Desça lentamente, use mãos no fim',
        restSeconds: 90,
      },
      {
        id: '3',
        name: 'Dragon Flag',
        sets: '3x5',
        tip: 'Corpo reto, desça controlado',
        restSeconds: 90,
      },
      { id: '4', name: 'L-sit', sets: '3x15s', tip: 'Pernas paralelas ao chão', restSeconds: 60 },
      {
        id: '5',
        name: 'Prancha com Elevação',
        sets: '3x10 cada',
        tip: 'Eleve braço e perna opostos',
        restSeconds: 60,
      },
    ],
  },
  {
    key: 'AdvD',
    label: 'Treino D',
    focus: 'Full Body',
    emoji: '🔥',
    level: 'Advanced',
    durationMinutes: 40,
    exercises: [
      {
        id: '1',
        name: 'Burpee com Flexão',
        sets: '4x10',
        tip: 'Flexão completa no chão',
        restSeconds: 90,
      },
      {
        id: '2',
        name: 'Muscle-up Assistido',
        sets: '3x5',
        tip: 'Use elástico, explosão na transição',
        restSeconds: 120,
      },
      {
        id: '3',
        name: 'Handstand Wall Hold',
        sets: '3x20s',
        tip: 'Pés na parede, core contraído',
        restSeconds: 90,
      },
      {
        id: '4',
        name: 'Agachamento com Salto',
        sets: '4x12',
        tip: 'Aterrisse suavemente',
        restSeconds: 75,
      },
      { id: '5', name: 'Flexão com Aplauso', sets: '3x8', tip: 'Máxima explosão', restSeconds: 90 },
    ],
  },
  {
    key: 'AdvE',
    label: 'Treino E',
    focus: 'Mobilidade',
    emoji: '🧘',
    level: 'Advanced',
    durationMinutes: 30,
    exercises: [
      {
        id: '1',
        name: 'Hip Flexor Stretch',
        sets: '3x30s cada',
        tip: 'Joelho no chão, avance o quadril',
        restSeconds: 30,
      },
      {
        id: '2',
        name: 'Thoracic Rotation',
        sets: '3x10 cada',
        tip: 'Rotação torácica controlada',
        restSeconds: 30,
      },
      { id: '3', name: 'Pigeon Pose', sets: '3x30s cada', tip: 'Quadril no chão', restSeconds: 30 },
      {
        id: '4',
        name: 'Shoulder Dislocates',
        sets: '3x10',
        tip: 'Use bastão ou toalha',
        restSeconds: 30,
      },
      {
        id: '5',
        name: 'Deep Squat Hold',
        sets: '3x30s',
        tip: 'Calcanhares no chão',
        restSeconds: 30,
      },
    ],
  },
];

export const WORKOUT_MAP = Object.fromEntries(WORKOUTS.map((w) => [w.key, w])) as Record<
  string,
  Workout
>;

export function getWorkoutsByLevel(level: WorkoutLevel): Workout[] {
  return WORKOUTS.filter((w) => w.level === level);
}

export function getNextWorkout(history: { workoutKey: string }[], level: WorkoutLevel): Workout {
  const levelWorkouts = getWorkoutsByLevel(level);
  if (history.length === 0) return levelWorkouts[0];
  const lastKey = history[history.length - 1].workoutKey;
  const lastIndex = levelWorkouts.findIndex((w) => w.key === lastKey);
  return levelWorkouts[(lastIndex + 1) % levelWorkouts.length];
}
