export const request = async (
  url: string,
  _options: any,
  postData?: any
): Promise<any> => {
  const result = await fetch(url);
  const json = await result.json();
  return json
};
