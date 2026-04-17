import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase';

export const generateImage = async (prompt) => {
  const generateImageFn = httpsCallable(functions, 'generateImage');
  const response = await generateImageFn({ prompt });
  return response.data;
};
