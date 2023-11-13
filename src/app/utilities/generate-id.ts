
// In a utility file or directly in your component
export function generateUniqueId(): string {
    const timestamp = new Date().getTime().toString();
    const random = Math.floor(Math.random() * 1000).toString(); // Add randomness for extra uniqueness
    return timestamp + random;
  }
  