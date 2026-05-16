// Error types
export type ApiErrorDetail = {
  field: string;
  reason: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
  timestamp: string;
};

// Generic API response wrapper
export type ApiResponse<T, M = Record<string, unknown>> =
  | { success: true; data: T; meta?: M }
  | { success: false; error: ApiError };

// Domain types
export type Player = {
  id: string;
  username: string;
  total_points: number;
  created_at: string;
};

export type LoginData = {
  id: string;
  username: string;
};

export type SpinResult = {
  id: string;
  player_id: string;
  points: number;
  created_at: string;
};

export type Reward = {
  checkpoint: number;
  claimed: boolean;
  claimed_at?: string;
};

export type HistoryEntry = {
  id: string;
  player_id: string;
  username: string;
  points: number;
  created_at: string;
};

// API response types
export type LoginResponse = ApiResponse<LoginData>;
export type ProfileResponse = ApiResponse<Player>;
export type SpinResponse = ApiResponse<SpinResult>;
