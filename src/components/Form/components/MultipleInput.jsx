const MultipleInput = ({
  array,
  onChange,
  placeholder,
  formValueKey,
  formValue,
}) => {
  return array.map((value, index) => (
    <input
      key={index}
      type='text'
      name={formValueKey}
      value={value}
      placeholder={`${placeholder} ${index + 1}`}
      onChange={(e) => {
        const updatedFormValue = { ...formValue };
        const updatedArray = [...updatedFormValue[formValueKey]];
        updatedArray[index] = e.target.value;
        updatedFormValue[formValueKey] = updatedArray;
        onChange(updatedFormValue);
      }}
    />
  ));
};

export default MultipleInput;
