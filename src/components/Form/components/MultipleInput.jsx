import Buttons, { MultipleInputButton } from '../../Buttons/Buttons';

const MultipleInput = ({
  array,
  onChange,
  placeholder,
  formValueKey,
  formValue,
}) => {
  return array.map((value, index) => (
    <div key={index} className='multiple-input'>
      <input
        type='text'
        name={formValueKey}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const updatedFormValue = { ...formValue };
          const updatedArray = [...updatedFormValue[formValueKey]];
          updatedArray[index] = e.target.value;
          updatedFormValue[formValueKey] = updatedArray;
          onChange(updatedFormValue);
        }}
      />
      <Buttons>
        <MultipleInputButton
          text='+'
          onClick={() => {
            const updatedFormValue = { ...formValue };
            const updatedArray = [...updatedFormValue[formValueKey]];
            updatedArray.splice(index + 1, 0, '');
            updatedFormValue[formValueKey] = updatedArray;
            onChange(updatedFormValue);
          }}
        />
        <MultipleInputButton
          text='-'
          disabled={array.length > 1 ? false : true}
          onClick={() => {
            const updatedFormValue = { ...formValue };
            const updatedArray = [...updatedFormValue[formValueKey]];
            updatedArray.splice(index, 1);
            updatedFormValue[formValueKey] = updatedArray;
            onChange(updatedFormValue);
          }}
        />
      </Buttons>
    </div>
  ));
};

export default MultipleInput;
