
export const validatePhone = (phone: string): boolean => {
  // Simple phone: digits, spaces, dashes, + allowed; min length 10
  return /^[\d\+\-\s]{10,20}$/.test(phone.trim());
};

export const validateAddress = (address: string): boolean => {
  return address.length > 5 && address.length < 256;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (age: string): { isValid: boolean; parsedAge?: number } => {
  const parsedAge = parseInt(age);
  const isValid = !isNaN(parsedAge) && parsedAge >= 18 && parsedAge <= 65;
  return { isValid, parsedAge: isValid ? parsedAge : undefined };
};

export const validateWeight = (weight: string): { isValid: boolean; parsedWeight?: number } => {
  // Weight is now optional - if empty string, return valid with undefined
  if (!weight || weight.trim() === '') {
    return { isValid: true, parsedWeight: undefined };
  }
  
  const parsedWeight = parseInt(weight);
  const isValid = !isNaN(parsedWeight) && parsedWeight >= 50;
  return { isValid, parsedWeight: isValid ? parsedWeight : undefined };
};
