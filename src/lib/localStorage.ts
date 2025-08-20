type AppFields = 'user';

const getAppKey = (key: AppFields) => `NextAI_${key}`;

export const setField = (key: AppFields, value: string) => {
  localStorage.setItem(getAppKey(key), value);
};

export const removeField = (key: AppFields) => {
  localStorage.removeItem(getAppKey(key));
};

export const getField = (key: AppFields) => localStorage.getItem(getAppKey(key));
