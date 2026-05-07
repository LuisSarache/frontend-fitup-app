export type BMICategory = {
  label: string;
  color: string;
  description: string;
};

export function calculateBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return parseFloat((weightKg / (h * h)).toFixed(1));
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5)
    return {
      label: 'Abaixo do peso',
      color: '#60A5FA',
      description: 'Considere aumentar a ingestão calórica',
    };
  if (bmi < 25.0)
    return {
      label: 'Peso normal',
      color: '#22C55E',
      description: 'Continue assim! Seu peso está saudável',
    };
  if (bmi < 30.0)
    return {
      label: 'Sobrepeso',
      color: '#FBBF24',
      description: 'Exercícios regulares vão te ajudar',
    };
  return { label: 'Obesidade', color: '#EF4444', description: 'Consulte um profissional de saúde' };
}

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female',
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'male' ? base + 5 : base - 161);
}

export function calculateIdealWeight(heightCm: number, sex: 'male' | 'female'): number {
  const inches = heightCm / 2.54;
  const base = sex === 'male' ? 50 : 45.5;
  return parseFloat((base + 2.3 * (inches - 60)).toFixed(1));
}
