export interface IDeleteTechnicalTaskUseCase {
  execute(data: {
    taskId: string;
    performedBy: string;
    performedByName: string;
  }): Promise<void>;
}

