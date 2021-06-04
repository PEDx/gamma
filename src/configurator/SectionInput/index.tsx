import { useEffect, forwardRef } from 'react';
import { Textarea } from '@chakra-ui/react';
import { ConfiguratorMethods } from '@/prototype/Configurator';

export const SectionInput = forwardRef<ConfiguratorMethods>(() => {
  useEffect(() => {}, []);
  return (
    <Textarea placeholder="Here is a sample placeholder" size="xs" rows={2} />
  );
});
