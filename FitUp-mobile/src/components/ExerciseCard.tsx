import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Info, Clock, Zap } from 'lucide-react-native';
import { Exercise } from '../data/workouts';
import { colors } from '../theme';

type Props = {
  exercise: Exercise;
  index: number;
  total: number;
  isActive: boolean;
  onPress?: () => void;
};

const { width } = Dimensions.get('window');

export default function ExerciseCard({ exercise, index, total, isActive, onPress }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Animated.View style={[s.container, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!onPress}
        >
          <LinearGradient
            colors={
              isActive
                ? ['#22C55E', '#16A34A']
                : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']
            }
            style={s.card}
          >
            {/* Header */}
            <View style={s.header}>
              <View style={s.badge}>
                <Text style={s.badgeText}>
                  {index + 1}/{total}
                </Text>
              </View>
              <TouchableOpacity
                style={s.infoBtn}
                onPress={() => setShowDetails(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Info color={isActive ? '#fff' : colors.muted} size={20} />
              </TouchableOpacity>
            </View>

            {/* Exercise Name */}
            <Text style={[s.name, isActive && s.nameActive]}>{exercise.name}</Text>

            {/* Stats */}
            <View style={s.stats}>
              <View style={s.statItem}>
                <Zap color={isActive ? '#fff' : colors.green} size={16} />
                <Text style={[s.statText, isActive && s.statTextActive]}>{exercise.sets}</Text>
              </View>
              <View style={s.statItem}>
                <Clock color={isActive ? '#fff' : colors.green} size={16} />
                <Text style={[s.statText, isActive && s.statTextActive]}>
                  {exercise.restSeconds}s descanso
                </Text>
              </View>
            </View>

            {/* Tip Preview */}
            <View style={[s.tipPreview, isActive && s.tipPreviewActive]}>
              <Text style={[s.tipText, isActive && s.tipTextActive]} numberOfLines={1}>
                💡 {exercise.tip}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Details Modal */}
      <Modal
        visible={showDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <LinearGradient colors={['#111827', '#1F2937']} style={s.modalGradient}>
              {/* Close Button */}
              <TouchableOpacity style={s.closeBtn} onPress={() => setShowDetails(false)}>
                <X color="#fff" size={24} />
              </TouchableOpacity>

              {/* Exercise Number */}
              <View style={s.modalBadge}>
                <Text style={s.modalBadgeText}>
                  Exercício {index + 1} de {total}
                </Text>
              </View>

              {/* Exercise Name */}
              <Text style={s.modalTitle}>{exercise.name}</Text>

              {/* Details Grid */}
              <View style={s.detailsGrid}>
                <View style={s.detailCard}>
                  <Zap color={colors.green} size={28} />
                  <Text style={s.detailLabel}>Séries</Text>
                  <Text style={s.detailValue}>{exercise.sets}</Text>
                </View>
                <View style={s.detailCard}>
                  <Clock color={colors.green} size={28} />
                  <Text style={s.detailLabel}>Descanso</Text>
                  <Text style={s.detailValue}>{exercise.restSeconds}s</Text>
                </View>
              </View>

              {/* Tip Section */}
              <View style={s.tipSection}>
                <Text style={s.tipTitle}>💡 Dica Importante</Text>
                <Text style={s.tipDescription}>{exercise.tip}</Text>
              </View>

              {/* Instructions */}
              <View style={s.instructionsSection}>
                <Text style={s.instructionsTitle}>📝 Como Executar</Text>
                {exercise.instructions && exercise.instructions.length > 0 ? (
                  exercise.instructions.map((instruction, idx) => (
                    <View key={idx} style={s.instructionItem}>
                      <View style={s.instructionNumber}>
                        <Text style={s.instructionNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={s.instructionText}>{instruction}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={s.instructionItem}>
                      <View style={s.instructionNumber}>
                        <Text style={s.instructionNumberText}>1</Text>
                      </View>
                      <Text style={s.instructionText}>
                        Mantenha a postura correta durante todo o movimento
                      </Text>
                    </View>
                    <View style={s.instructionItem}>
                      <View style={s.instructionNumber}>
                        <Text style={s.instructionNumberText}>2</Text>
                      </View>
                      <Text style={s.instructionText}>
                        Respire de forma controlada (expire no esforço)
                      </Text>
                    </View>
                    <View style={s.instructionItem}>
                      <View style={s.instructionNumber}>
                        <Text style={s.instructionNumberText}>3</Text>
                      </View>
                      <Text style={s.instructionText}>
                        Descanse {exercise.restSeconds} segundos entre as séries
                      </Text>
                    </View>
                    <View style={s.instructionItem}>
                      <View style={s.instructionNumber}>
                        <Text style={s.instructionNumberText}>4</Text>
                      </View>
                      <Text style={s.instructionText}>
                        Se sentir dor, pare imediatamente e ajuste a execução
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* Target Muscles */}
              {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                <View style={s.musclesSection}>
                  <Text style={s.musclesTitle}>🎯 Músculos Trabalhados</Text>
                  <View style={s.musclesList}>
                    {exercise.targetMuscles.map((muscle, idx) => (
                      <View key={idx} style={s.muscleTag}>
                        <Text style={s.muscleText}>{muscle}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Difficulty */}
              {exercise.difficulty && (
                <View style={s.difficultySection}>
                  <Text style={s.difficultyLabel}>Dificuldade:</Text>
                  <View
                    style={[
                      s.difficultyBadge,
                      exercise.difficulty === 'easy' && s.difficultyEasy,
                      exercise.difficulty === 'medium' && s.difficultyMedium,
                      exercise.difficulty === 'hard' && s.difficultyHard,
                    ]}
                  >
                    <Text style={s.difficultyText}>
                      {exercise.difficulty === 'easy'
                        ? '🟢 Fácil'
                        : exercise.difficulty === 'medium'
                          ? '🟡 Médio'
                          : '🔴 Difícil'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Close Button */}
              <TouchableOpacity
                style={s.modalCloseBtn}
                onPress={() => setShowDetails(false)}
                activeOpacity={0.8}
              >
                <Text style={s.modalCloseBtnText}>Entendi</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  infoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 12,
  },
  nameActive: {
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
  },
  statTextActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  tipPreview: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tipPreviewActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tipText: {
    fontSize: 13,
    color: colors.muted,
    fontStyle: 'italic',
  },
  tipTextActive: {
    color: 'rgba(255,255,255,0.85)',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: width - 40,
    maxHeight: '85%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.green + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalBadgeText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  detailCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  tipSection: {
    backgroundColor: colors.green + '15',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.green + '30',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 15,
    color: colors.white,
    lineHeight: 22,
  },
  instructionsSection: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 10,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  instructionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginTop: 7,
    marginRight: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  musclesSection: {
    marginBottom: 20,
  },
  musclesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    backgroundColor: colors.green + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.green + '40',
  },
  muscleText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '600',
  },
  difficultySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  difficultyLabel: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyEasy: {
    backgroundColor: '#22C55E20',
    borderColor: '#22C55E40',
  },
  difficultyMedium: {
    backgroundColor: '#F59E0B20',
    borderColor: '#F59E0B40',
  },
  difficultyHard: {
    backgroundColor: '#EF444420',
    borderColor: '#EF444440',
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  modalCloseBtn: {
    backgroundColor: colors.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
