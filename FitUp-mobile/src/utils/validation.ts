export type FormErrors = {
  name?: string;
  email?: string;
  weight?: string;
  height?: string;
  dob?: string;
};

const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;

export function validateName(v: string): string | undefined {
  if (!v.trim()) return 'Nome é obrigatório';
  if (!nameRegex.test(v.trim())) return 'Nome deve ter 2–50 letras, sem números';
}

export function validateWeight(v: string): string | undefined {
  const n = parseFloat(v.replace(',', '.'));
  if (!v.trim()) return 'Peso é obrigatório';
  if (isNaN(n) || n < 30 || n > 300) return 'Peso deve ser entre 30 e 300 kg';
}

export function validateHeight(v: string): string | undefined {
  const n = parseInt(v, 10);
  if (!v.trim()) return 'Altura é obrigatória';
  if (isNaN(n) || n < 100 || n > 250) return 'Altura deve ser entre 100 e 250 cm';
}

export function validateDob(v: string): string | undefined {
  if (!v.trim()) return 'Data de nascimento é obrigatória';
  const parts = v.split('/');
  if (parts.length !== 3) return 'Use o formato DD/MM/AAAA';
  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime()) || date.getMonth() !== month - 1) return 'Data inválida';
  if (date > new Date()) return 'Data não pode ser no futuro';
  const age = new Date().getFullYear() - year;
  if (age < 10) return 'Idade mínima: 10 anos';
  if (age > 100) return 'Data de nascimento inválida';
}

export function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function validateEmail(v: string): string | undefined {
  if (!v.trim()) return 'E-mail é obrigatório';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'E-mail inválido';
}

export function validateAll(name: string, weight: string, height: string, dob: string, email?: string): FormErrors {
  return {
    name: validateName(name),
    ...(email !== undefined ? { email: validateEmail(email) } : {}),
    weight: validateWeight(weight),
    height: validateHeight(height),
    dob: validateDob(dob),
  };
}
