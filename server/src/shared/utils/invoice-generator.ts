/**
 * Generate a modern invoice ID in format: INV-YYYY-NNNNN
 * Example: INV-2025-00001, INV-2025-00002
 */
export class InvoiceGenerator {
  /**
   * Generate invoice ID based on current year and a counter
   * @param counter - Sequential counter for invoices in the current year
   * @returns Invoice ID in format INV-YYYY-NNNNN
   */
  static generate(counter: number): string {
    const year = new Date().getFullYear();
    const paddedCounter = counter.toString().padStart(5, '0');
    return `INV-${year}-${paddedCounter}`;
  }

  /**
   * Generate a unique invoice ID using timestamp and random component
   * This ensures uniqueness even without a database counter
   * Format: INV-YYYY-TIMESTAMP-RAND
   */
  static generateUnique(): string {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random chars
    return `INV-${year}-${timestamp}${random}`;
  }
}
