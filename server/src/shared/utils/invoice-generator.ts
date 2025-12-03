export class InvoiceGenerator {
  static generate(counter: number): string {
    const year = new Date().getFullYear();
    const paddedCounter = counter.toString().padStart(5, '0');
    return `INV-${year}-${paddedCounter}`;
  }


  static generateUnique(): string {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-8); 
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${year}-${timestamp}${random}`;
  }
}
