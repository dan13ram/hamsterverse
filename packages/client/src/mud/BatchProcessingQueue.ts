/**
 * BatchProcessingQueue allows adding items to a queue and processing them in batches
 * at specified time intervals with strong type safety
 * @template T Type of items in the queue
 */
class BatchProcessingQueue<T> {
  /** Internal queue to store items */
  private queue: T[] = [];

  /** Timer for batch processing */
  private processingTimer: NodeJS.Timeout | null = null;

  /**
   * Create a BatchProcessingQueue
   * @param batchInterval Time interval between batch processing (in milliseconds)
   * @param processBatch Function to process the batch of items
   * @param maxBatchSize Maximum number of items to process in a single batch (default 10)
   */
  constructor(
    private batchInterval: number,
    private processBatch: (batch: T[]) => Promise<void> | void,
    private maxBatchSize: number = 10
  ) { }

  /**
   * Add a single item to the queue
   * @param item Item to be added to the queue
   */
  public addItem(item: T): void {
    this.queue.push(item);
    this.scheduleBatchProcessing();
  }

  /**
   * Add multiple items to the queue
   * @param items Array of items to be added
   */
  public addItems(items: T[]): void {
    this.queue.push(...items);
    this.scheduleBatchProcessing();
  }

  /**
   * Schedule batch processing if not already scheduled
   * @private
   */
  private scheduleBatchProcessing(): void {
    if (!this.processingTimer) {
      this.processingTimer = setInterval(async () => {
        const batch = this.getBatch();
        if (batch.length > 0) {
          try {
            await this.processBatch(batch);
          } catch (error) {
            console.error('Batch processing error:', error);
            // Optionally re-add failed batch items or implement error handling strategy
            // this.addItems(batch);
          }
        }
      }, this.batchInterval);
    }
  }

  /**
   * Get a batch of items to process and remove them from the queue
   * @returns Batch of items
   * @private
   */
  private getBatch(): T[] {
    const batch = this.queue.splice(0, this.maxBatchSize);

    // Stop the timer if no more items in the queue
    if (this.queue.length === 0 && this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }

    return batch;
  }

  /**
   * Get current queue length
   * @returns Number of items in the queue
   */
  public getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Clear the entire queue and stop processing
   */
  public clear(): void {
    this.queue = [];
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }
  }

  /**
   * Check if the queue is currently processing
   * @returns Whether batch processing is active
   */
  public isProcessing(): boolean {
    return this.processingTimer !== null;
  }

}

/*
// Example Usage Scenarios

// Scenario 1: Processing simple strings
const stringBatchQueue = new BatchProcessingQueue<string>(
  5000, // Process every 5 seconds
  (batch) => {
    console.log(`Processing string batch of ${batch.length} items:`, batch);
    // Simulate some async processing
    batch.forEach(item => {
      console.log(`Processing string: ${item}`);
    });
  },
  3 // Max 3 items per batch
);

// Scenario 2: Processing complex objects
interface User {
  id: number;
  name: string;
}

const userBatchQueue = new BatchProcessingQueue<User>(
  5000, // Process every 5 seconds
  async (batch) => {
    console.log(`Processing user batch of ${batch.length} items`);
    // Simulating an async database or API call
    for (const user of batch) {
      await simulateUserProcessing(user);
    }
  },
  2 // Max 2 users per batch
);

// Simulated async user processing function
async function simulateUserProcessing(user: User): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Processed user: ${user.name}`);
      resolve();
    }, 1000);
  });
}

*/

// Demonstration of usage
export { BatchProcessingQueue };
