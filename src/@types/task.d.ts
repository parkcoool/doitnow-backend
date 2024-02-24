declare module "task" {
  /**
   * @description 할 일 형식입니다.
   */
  interface Task {
    id: number;
    title: string;
    description: string;
    done: boolean;
    date: string;
    creatorId: number;
  }
}
