const MultipleInputAndParent = ({
  array,
  onChange,
  label,
  placeholder,
  formValue,
  i1,
}) => {
  return array.map((val, i2) => (
    <input
      key={i2}
      type='text'
      name={label}
      value={val}
      placeholder={placeholder}
      onChange={(e) => {
        const updatedFormValue = formValue.map((job, index1) => {
          if (index1 === i1) {
            return {
              ...job,
              responsibilities: job.responsibilities.map((res, index2) => {
                if (index2 === i2) {
                  return e.target.value;
                }
                return res;
              }),
            };
          }
          return job;
        });
        onChange(updatedFormValue);
      }}
    />
  ));
};

export default MultipleInputAndParent;
