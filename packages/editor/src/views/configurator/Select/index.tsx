import { useCallback, useEffect, useState } from 'react';
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

  useEffect(() => {
    value.forEach((item) => {
      if (item.check) setLocalValue(item.value);
    });
  }, [value]);

  const handleSelectChange = useCallback(
    (e) => {
      const selectValue = e.target.value;
      if (localValue === selectValue) return;
      const _value = value.map((item) => {
        item.check = false;
        if (item.value === selectValue) item.check = true;
        return item;
      });
      setLocalValue(e.target.value);
      onChange(_value);
    },
    [value],
  );

  return (
    <CSelect value={localValue} onChange={handleSelectChange}>
      {value.map((option, idx) => (
        <option value={option.value} key={idx}>
          {option.name}
        </option>
      ))}
    </CSelect>
  );
};
