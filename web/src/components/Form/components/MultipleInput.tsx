import Buttons, { MultipleInputButton } from '../../Buttons/Buttons';

interface MultipleInputProps {
  array: string[];
  onChange: (updatedFormValue: any) => void;
  placeholder: string;
  formValueKey: string;
  formValue: { [key: string]: string[] | string };
}

const MultipleInput = ({
  array,
  onChange,
  placeholder,
  formValueKey,
  formValue,
}: MultipleInputProps) => {
  return array.map((value, index) => (
    <div key={index} className='multiple-input'>
      <input
        type='text'
        name={formValueKey}
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
