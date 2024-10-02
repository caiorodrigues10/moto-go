import * as FileSystem from "expo-file-system";

export async function convertFileToBase64(filePath: string) {
  try {
    const base64Image = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64Image;
  } catch (error) {
    console.error("Erro ao converter arquivo para base64:", error);
    return undefined;
  }
}

export async function convertUrlToBase64(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;

        const base64WithoutMime = base64data.replace(/^data:(.*?);base64,/, "");
        resolve(base64WithoutMime);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Erro ao converter URL para base64:", error);
    return undefined;
  }
}
