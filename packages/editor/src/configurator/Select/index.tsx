import { useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { Select as CSelect } from '@chakra-ui/react';
import {
  ConfiguratorComponent,
  StringOrNumber,
  ISelectOption,
} from '@gamma/runtime';

type SelectOptionArr = ISelectOption[];

export const Select = forwardRef<
  ConfiguratorComponent<StringOrNumber>['methods'],
  ConfiguratorComponent<StringOrNumber>['props']
>(({ onChange }, ref) => {
  const [options, setOptions] = useState<SelectOptionArr>([]);
  const [value, setValue] = useState<StringOrNumber>('');
  useEffect(() => {}, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {
        setValue(value);
      },
      setConfig<SelectOptionArr>(value: SelectOptionArr) {
        setOptions(value as any);
      },
    }),
    [],
  );
  return (
    <CSelect
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
    >
      {options.map((option, idx) => (
        <option value={option.value} key={idx}>
          {option.label}
        </option>
      ))}
    </CSelect>
  );
});
