export const handleConvertDataObject = (
  data: { toObject: (arg0: { virtuals: boolean }) => any },
  allowedFields: string | any[],
  blockedFields: any,
) => {
  const dataObject = data.toObject({ virtuals: true });
  for (const field of blockedFields) {
    if (allowedFields.includes(field)) {
      continue;
    }

    delete dataObject[field];
  }
  return dataObject;
};
