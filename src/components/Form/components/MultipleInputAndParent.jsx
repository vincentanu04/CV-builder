const MultipleInputAndParent = ({
  array,
  onChange,
  placeholder,
  formValueKey,
  formValue,
  i1,
}) => {
  return array.map((val, i2) => (
    <input
      key={i2}
      type='text'
      name={formValueKey}
      value={val}
      placeholder={placeholder}
      onChange={(e) => {
        const updatedFormValue = formValue.map((instance, index1) => {
          if (index1 === i1) {
            return {
              ...instance,
              [formValueKey]: instance[formValueKey].map((val, index2) => {
                if (index2 === i2) {
                  return e.target.value;
                }
                return val;
              }),
            };
          }
          return instance;
        });
        onChange(updatedFormValue);
      }}
    />
  ));
};

export default MultipleInputAndParent;
