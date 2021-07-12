import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { Switch as CSwitch, useBoolean } from '@chakra-ui/react';
import { ConfiguratorComponent } from '@/runtime/Configurator';

export const Switch = forwardRef<
  ConfiguratorComponent<boolean>['methods'],
  ConfiguratorComponent<boolean>['props']
>(({ onChange }, ref) => {
  const [flag, setFlag] = useBoolean();
  useEffect(() => {}, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {
        value ? setFlag.on() : setFlag.off();
      },
    }),
    [],
  );
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
});
