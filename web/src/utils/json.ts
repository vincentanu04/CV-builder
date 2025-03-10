export function toOrderedJSON(obj: Record<string, any>): string {
  const orderedArray = Object.entries(obj).map(([key, value]) => ({
    key,
    value,
  }));
  return JSON.stringify(orderedArray);
}

export function fromOrderedJSON(jsonString: string): Record<string, any> {
  const parsedArray: { key: string; value: any }[] = JSON.parse(jsonString);
  return parsedArray.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
}
