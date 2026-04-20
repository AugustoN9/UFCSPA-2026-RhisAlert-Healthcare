export interface UserProfile {
  name: string;
  email: string;
  dob: string;
  // Foco em doenças do trato respiratório superior e bem-estar
  respiratoryConditions: string[]; // Ex: ['rinite', 'sinusite', 'asma']
  interests: string[];             // Ex: ['saude-mental', 'exercicios']
  lastMood?: string;               // Para prevenção de quadros negativos
  registrationDate: Date;
}