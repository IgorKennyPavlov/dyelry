import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { WritingOptions, ReadingOptions } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { SESSIONS } from "../global";

const DEFAULT_STORE = { state: { sessions: [] }, version: 0 };
const options = { encoding: FileSystem.EncodingType.UTF8 } as
  | WritingOptions
  | ReadingOptions;

const ensureStore = async (key: string) => {
  const storeDir = `${FileSystem.cacheDirectory}${key}/`;
  const dirInfo = await FileSystem.getInfoAsync(storeDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(storeDir, { intermediates: true });
  }

  const storeURI = storeDir + "store.json";
  const fileInfo = await FileSystem.getInfoAsync(storeURI);

  if (!fileInfo.exists) {
    const defaultStore = JSON.stringify(DEFAULT_STORE);
    await FileSystem.writeAsStringAsync(storeURI, defaultStore, options);
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

export const exportStoreAsync = async () => {
  try {
    const uri = await ensureStore(SESSIONS);
    await Sharing.shareAsync(uri);
  } catch (e) {
    console.error("FileSystem: Failed to export storage", e);
  }
};

// TODO add import strategies [override, merge, append, prepend]
export const importSessionsAsync = async () => {
  try {
    const pickerOptions = { type: "application/json" };
    const result = await DocumentPicker.getDocumentAsync(pickerOptions);

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0]?.uri;

    if (!uri) {
      return;
    }

    const fileContent = await FileSystem.readAsStringAsync(uri, options);
    await FileSystem.deleteAsync(uri);
    const imported = JSON.parse(fileContent);
    await setItem(SESSIONS, imported);
  } catch (err) {
    console.error(err);
  }
};

export const fileSystemStorage = {
  getItem,
  setItem,
  removeItem,
};
