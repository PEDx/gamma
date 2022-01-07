import { useEffect, useState } from 'react';
import { Select as CSelect } from '@chakra-ui/react';
import { StringOrNumber, ISelectOption } from '@gamma/runtime';
import { IConfiguratorComponentProps } from '..';

type SelectOptionArr = ISelectOption[];

export const Select = ({ onChange }: IConfiguratorComponentProps<string>) => {
  const [options, setOptions] = useState<SelectOptionArr>([]);
  const [value, setValue] = useState<StringOrNumber>('');
  useEffect(() => {}, []);

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
};
