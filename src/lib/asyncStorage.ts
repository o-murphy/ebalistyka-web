const asyncStorage = {
  getItem: async (key: string): Promise<string | null> => localStorage.getItem(key),
  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value)
  },
  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key)
  },
  multiGet: async (keys: string[]): Promise<[string, string | null][]> =>
    keys.map((key) => [key, localStorage.getItem(key)]),
  multiSet: async (pairs: [string, string][]): Promise<void> => {
    pairs.forEach(([key, value]) => localStorage.setItem(key, value))
  },
  multiRemove: async (keys: string[]): Promise<void> => {
    keys.forEach((key) => localStorage.removeItem(key))
  },
  clear: async (): Promise<void> => {
    localStorage.clear()
  },
  getAllKeys: async (): Promise<string[]> => Object.keys(localStorage),
}

export default asyncStorage
