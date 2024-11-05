import { Stone } from '../types';

type Position = [number, number];
type Score = number;

interface MoveEvaluation {
  position: Position;
  score: Score;
}

export class GoAI {
  private size: number;
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(size: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.size = size;
    this.difficulty = difficulty;
  }

  findBestMove(board: Stone[][]): Position | null {
    const moves = this.getValidMoves(board);
    
    // Return null if no valid moves are available
    if (moves.length === 0) {
      return null;
    }

    const evaluations = moves.map(pos => ({
      position: pos,
      score: this.evaluatePosition(board, pos)
    }));

    // Add randomness based on difficulty
    const randomFactor = this.getRandomFactor();
    evaluations.forEach(evaluation => {
      evaluation.score += (Math.random() - 0.5) * randomFactor;
    });

    evaluations.sort((a, b) => b.score - a.score);
    return evaluations[0].position;
  }

  private getValidMoves(board: Stone[][]): Position[] {
    const moves: Position[] = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (!board[i][j]) {
          moves.push([i, j]);
        }
      }
    }
    return moves;
  }

  private evaluatePosition(board: Stone[][], [row, col]: Position): Score {
    let score = 0;

    // Center control bonus
    const centerDistance = Math.abs(row - this.size/2) + Math.abs(col - this.size/2);
    score += (this.size - centerDistance) * 2;

    // Adjacent stones analysis
    const adjacentPositions = this.getAdjacentPositions([row, col]);
    const friendlyStones = adjacentPositions.filter(([r, c]) => 
      board[r]?.[c] === 'white'
    ).length;
    const enemyStones = adjacentPositions.filter(([r, c]) => 
      board[r]?.[c] === 'black'
    ).length;

    // Connection bonus
    score += friendlyStones * 10;

    // Capture potential
    if (enemyStones === 3) {
      score += 30; // High priority for potential captures
    }

    // Territory potential
    score += this.evaluateTerritory(board, [row, col]);

    return score;
  }

  private evaluateTerritory(board: Stone[][], [row, col]: Position): Score {
    let score = 0;
    const radius = 2;

    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const r = row + i;
        const c = col + j;
        if (r >= 0 && r < this.size && c >= 0 && c < this.size) {
          if (!board[r][c]) {
            score += 2; // Empty spaces are good for territory
          }
        }
      }
    }

    return score;
  }

  private getAdjacentPositions([row, col]: Position): Position[] {
    return [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1]
    ].filter(([r, c]) => 
      r >= 0 && r < this.size && c >= 0 && c < this.size
    );
  }

  private getRandomFactor(): number {
    switch (this.difficulty) {
      case 'easy': return 50;
      case 'medium': return 20;
      case 'hard': return 5;
      default: return 20;
    }
  }
}