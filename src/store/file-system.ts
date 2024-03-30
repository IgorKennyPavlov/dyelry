import * as FileSystem from "expo-file-system";
import { WritingOptions, ReadingOptions } from "expo-file-system";

const getStoreDir = (key: string) => `${FileSystem.cacheDirectory}${key}/`;
const options = { encoding: "utf8" } as WritingOptions | ReadingOptions;

const ensureStore = async (key: string) => {
  const storeDir = getStoreDir(key);
  const dirInfo = await FileSystem.getInfoAsync(storeDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(storeDir, { intermediates: true });
  }

  const storeURI = storeDir + "store.json";
  const fileInfo = await FileSystem.getInfoAsync(storeURI);

  if (!fileInfo.exists) {
    const emptyStore = JSON.stringify({ sessions: [] });
    await FileSystem.writeAsStringAsync(storeURI, emptyStore, options);
  }

  return storeURI;
};

const setItem = async (key: string, data: unknown) => {
  try {
    const uri = await ensureStore(key);
    const stringData = JSON.stringify(data);
    await FileSystem.writeAsStringAsync(uri, stringData, options);
  } catch (e) {
    console.error("FileSystem: Failed to save storage", e);
  }
};

const getItem = async (key: string) => {
  try {
    const uri = await ensureStore(key);
    const data = await FileSystem.readAsStringAsync(uri, options);
    return JSON.parse(data);
  } catch (e) {
    console.error("FileSystem: Failed to load storage", e);
  }
};

const removeItem = async (key: string) => {
  try {
    const uri = await ensureStore(key);
    await FileSystem.deleteAsync(uri);
  } catch (e) {
    console.error("FileSystem: Failed to remove storage", e);
  }
};

export const fileSystemStorage = {
  getItem,
  setItem,
  removeItem,
};
