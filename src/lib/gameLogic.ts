import { Stone } from '../types';

type Position = [number, number];

export function isValidMove(board: Stone[][], row: number, col: number): boolean {
  // Basic checks
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
    return false;
  }
  
  // Check if position is empty
  if (board[row][col] !== null) {
    return false;
  }

  return true;
}

export function checkWinner(board: Stone[][]): Stone | 'draw' | null {
  const { black, white } = calculateTerritory(board);

  // Game is not finished if there are still valid moves
  if (hasValidMoves(board)) {
    return null;
  }

  if (black > white) {
    return 'black';
  } else if (white > black) {
    return 'white';
  } else {
    return 'draw';
  }
}

export function calculateTerritory(board: Stone[][]): { black: number; white: number } {
  const visited = new Set<string>();
  let blackTerritory = 0;
  let whiteTerritory = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (!board[i][j] && !visited.has(`${i},${j}`)) {
        const { region, owner } = findTerritoryOwner(board, i, j, visited);
        if (owner === 'black') {
          blackTerritory += region.size;
        } else if (owner === 'white') {
          whiteTerritory += region.size;
        }
      }
    }
  }

  return { black: blackTerritory, white: whiteTerritory };
}

function findTerritoryOwner(
  board: Stone[][],
  startRow: number,
  startCol: number,
  visited: Set<string>
): { region: Set<string>; owner: Stone | null } {
  const region = new Set<string>();
  const stack: Position[] = [[startRow, startCol]];
  const borders = new Set<Stone>();

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    const key = `${row},${col}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (board[row][col] === null) {
      region.add(key);
      
      // Check adjacent positions
      const adjacent: Position[] = [
        [row - 1, col], [row + 1, col],
        [row, col - 1], [row, col + 1]
      ];
      
      for (const [r, c] of adjacent) {
        if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
          if (board[r][c] === null && !visited.has(`${r},${c}`)) {
            stack.push([r, c]);
          } else if (board[r][c] !== null) {
            borders.add(board[r][c]);
          }
        }
      }
    }
  }

  // Determine territory owner
  if (borders.size === 1) {
    return { region, owner: borders.values().next().value };
  }
  return { region, owner: null };
}

function hasValidMoves(board: Stone[][]): boolean {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (isValidMove(board, i, j)) {
        return true;
      }
    }
  }
  return false;
}