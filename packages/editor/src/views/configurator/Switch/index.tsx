import { useEffect } from 'react';
import { Switch as CSwitch, useBoolean } from '@chakra-ui/react';
import { IConfiguratorComponentProps } from '..';

export const Switch = ({
  value,
  onChange,
}: IConfiguratorComponentProps<boolean>) => {
  const [flag, setFlag] = useBoolean(value);

  useEffect(() => {
    value ? setFlag.on() : setFlag.off();
  }, [value]);

  return (
    <CSwitch
      colorScheme="gamma"
      isChecked={flag}
      onChange={(value) => {
        const checked = value.target.checked;
        checked ? setFlag.on() : setFlag.off();
        onChange(checked);
      }}
    />
  );
};
