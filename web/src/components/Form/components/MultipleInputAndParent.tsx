import Buttons, { MultipleInputButton } from '../../Buttons/Buttons';

interface MultipleInputAndParentProps {
  array: string[];
  onChange: (updatedFormValue: any) => void;
  placeholder: string;
  formValueKey: string;
  formValue: any[];
  i1: number;
}

const MultipleInputAndParent = ({
  array,
  onChange,
  placeholder,
  formValueKey,
  formValue,
  i1,
}: MultipleInputAndParentProps) => {
  return array.map((val, i2) => (
    <div key={i2} className='multiple-input'>
      <input
        type='text'
        name={formValueKey}
        value={val}
        placeholder={placeholder}
        onChange={(e) => {
          const updatedFormValue = formValue.map((instance, index1) => {
            if (index1 === i1) {
              return {
                ...instance,
                [formValueKey]: instance[formValueKey].map(
                  (val: string, index2: number) => {
                    if (index2 === i2) {
                      return e.target.value;
                    }
                    return val;
                  }
                ),
              };
            }
            return instance;
          });
          onChange(updatedFormValue);
        }}
      />
      <Buttons>
        <MultipleInputButton
          text='+'
          onClick={() => {
            const updatedFormValue = formValue.map((instance, index1) => {
              if (index1 === i1) {
                const updatedArray = [...instance[formValueKey]];
                updatedArray.splice(i2 + 1, 0, '');
                return {
                  ...instance,
                  [formValueKey]: updatedArray,
                };
              }
              return instance;
            });
            onChange(updatedFormValue);
          }}
        />
        <MultipleInputButton
          text='-'
          disabled={array.length > 1 ? false : true}
          onClick={() => {
            const updatedFormValue = formValue.map((instance, index1) => {
              if (index1 === i1) {
                const updatedArray = [...instance[formValueKey]];
                updatedArray.splice(i2, 1);
                return {
                  ...instance,
                  [formValueKey]: updatedArray,
                };
              }
              return instance;
            });
            onChange(updatedFormValue);
          }}
        />
      </Buttons>
    </div>
  ));
};

export default MultipleInputAndParent;
