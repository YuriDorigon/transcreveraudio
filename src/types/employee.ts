
export interface Employee {
  id: string; // Firestore document ID
  name: string;
  role: string;
  description: string;
  photoUrl: string; // Now an external URL or a placeholder URL
  order: number;
  createdAt?: any; // To store Firestore Timestamp
}
