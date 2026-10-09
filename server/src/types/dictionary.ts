export interface DictionaryEntry {
  word: string;
  forms: string[];
  etymology: string | null;
  headlineExpansion: string | null;
  hyphenation: string | null;
  pronunciation: PronunciationEntry | null;
  partsOfSpeech: PosGroup[];
  synonyms: string[];
  antonyms: string[];
  hypernyms: string[];
  hyponyms: string[];
  meronyms: string[];
  holonyms: string[];
  derived: string[];
  related: string[];
  coordinateTerms: string[];
  descendants: DescendantEntry[];
}

export interface PosGroup {
  partOfSpeech: string;
  senses: SenseEntry[];
}

export interface SenseEntry {
  definition: string;
  example: string | null;
}

export interface PronunciationEntry {
  ipa: string | null;
  enpr: string | null;
  rhymes: string | null;
  audioUrl: string | null;
}

export interface DescendantEntry {
  lang: string;
  word: string;
}
