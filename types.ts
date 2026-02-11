export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AnalysisResult {
  rootCause: string;
  fix: string;
  prevention: string;
}
