export type Stone = 'black' | 'white' | null;

export interface TutorialStep {
  title: string;
  description: string;
  boardState: Stone[][];
  highlightCells?: [number, number][];
  requiredMove?: [number, number];
  nextStepDelay?: number;
  autoProgress?: boolean;
}

export type GameMode = 'play' | 'tutorial';