export interface ColorInfo {
  type: string;
  name: string;
  hex: string;
}

export interface LogoConcept {
  conceptName: string;
  visualDescription: string;
  meaning: string;
  colorPalette: ColorInfo[];
}

export interface GeneratedImage {
  conceptIndex: number;
  imageUrl: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  GENERATING_CONCEPTS = 'GENERATING_CONCEPTS',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}