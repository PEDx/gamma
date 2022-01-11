import { useEffect, useState } from 'react';
import { Select as CSelect } from '@chakra-ui/react';
import { StringOrNumber } from '@gamma/runtime';
import { IConfiguratorComponentProps } from '..';
import { TInnerOptions } from '@gamma/runtime/src/values/OptionsValueEntity';

export const Select = ({
  value,
  onChange,
}: IConfiguratorComponentProps<TInnerOptions>) => {
  const [localValue, setLocalValue] = useState<StringOrNumber>('');

  if (!value) return null;

  useEffect(() => {}, []);

  return (
    <CSelect
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
    >
      {value.map((option, idx) => (
        <option value={option.value} key={idx}>
          {option.name}
        </option>
      ))}
    </CSelect>
  );
};
