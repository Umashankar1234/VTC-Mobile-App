import AsyncStorage from '@react-native-async-storage/async-storage';
export async function getItem() {
  const value = await AsyncStorage.getItem('token');
  return value ? JSON.parse(value) : null;
}
export async function setItem(value) {
  return await AsyncStorage.setItem('token', JSON.stringify(value));
}
export async function removeItem() {
  await removeUser();
  return await AsyncStorage.removeItem('token');
}
export const setUser = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@userInfo', jsonValue);
  } catch (e) {
  }
};

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@userInfo');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
  }
};
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem('@userInfo');
  } catch (e) {
  }
};
