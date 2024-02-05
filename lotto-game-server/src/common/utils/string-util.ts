export const randomText = (length = 10) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // const now = nowString();
  // length = length - now.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const booleanify = (value: string): boolean => {
  const truthy: string[] = ["true", "1"];
  return truthy.includes(value.trim().toLowerCase());
};
