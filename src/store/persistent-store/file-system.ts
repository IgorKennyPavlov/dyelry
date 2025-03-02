import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { WritingOptions, ReadingOptions } from "expo-file-system";
import * as Sharing from "expo-sharing";

const options = { encoding: FileSystem.EncodingType.UTF8 } as
  | WritingOptions
  | ReadingOptions;

const ensureStore = async (key: string) => {
  const storeDir = `${FileSystem.cacheDirectory}${key}/`;
  const dirInfo = await FileSystem.getInfoAsync(storeDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(storeDir, { intermediates: true });
  }

  const storeURI = `${storeDir}${key}.json`;
  const fileInfo = await FileSystem.getInfoAsync(storeURI);

  if (!fileInfo.exists) {
    const defaultStore = JSON.stringify({ state: {}, version: 0 });
    await FileSystem.writeAsStringAsync(storeURI, defaultStore, options);
  }

  return storeURI;
};

const getItem = async (key: string) => {
  try {
    const uri = await ensureStore(key);
    return FileSystem.readAsStringAsync(uri, options);
  } catch (e) {
    console.error("FileSystem: Failed to load storage", e);
  }
};

const setItem = async (key: string, data: string) => {
  try {
    const uri = await ensureStore(key);
    await FileSystem.writeAsStringAsync(uri, data, options);
  } catch (e) {
    console.error("FileSystem: Failed to save storage", e);
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

export const exportStoreAsync = async (key: string) => {
  try {
    const uri = await ensureStore(key);
    await Sharing.shareAsync(uri);
  } catch (e) {
    console.error("FileSystem: Failed to export storage", e);
  }
};

// TODO add import strategies [override, merge, append, prepend]
export const importStoreAsync = async (key: string) => {
  try {
    const pickerOptions = { type: "application/json" };
    const result = await DocumentPicker.getDocumentAsync(pickerOptions);

    if (result.canceled) return;

    const uri = result.assets[0]?.uri;

    if (!uri) return;

    const importedDataString = await FileSystem.readAsStringAsync(uri, options);
    await FileSystem.deleteAsync(uri);

    // TODO think of more precise validation maybe?
    const importedState = JSON.parse(importedDataString)?.state;
    const targetStateKey = key.split("-")?.[0];
    const hasRequiredData = importedState?.[targetStateKey];

    if (!hasRequiredData) {
      alert(
        "The imported file doesn't contain the required data! Make sure you're importing the correct file!",
      );
      return;
    }

    await setItem(key, importedDataString);
  } catch (err) {
    console.error(err);
  }
};

export const clearUserStoredData = async (username: string) => {
  try {
    const storeDir = FileSystem.cacheDirectory;

    if (!storeDir) {
      console.error(
        `Couldn't find the cache directory. storeDir===${storeDir}`,
      );
      return;
    }

    const fileNames = await FileSystem.readDirectoryAsync(storeDir);

    const userFileNames = fileNames.filter((name) =>
      name.endsWith(`-${username.replaceAll(" ", "_")}`),
    );

    await Promise.allSettled(
      userFileNames.map((name) => FileSystem.deleteAsync(`${storeDir}${name}`)),
    );
  } catch (e) {
    console.error(`FileSystem: Failed to clear data of user ${username}`, e);
  }
};

export const fileSystemStorage = {
  getItem,
  setItem,
  removeItem,
};
