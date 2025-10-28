// Simple localStorage wrapper for drafts
export const saveDraft = (key: string, data: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

export const loadDraft = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

export const removeDraft = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove draft:', error);
  }
};
