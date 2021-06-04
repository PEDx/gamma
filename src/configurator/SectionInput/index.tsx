import { useEffect, forwardRef } from 'react';
import { Textarea } from '@chakra-ui/react';
import {
  ConfiguratorMethods,
  ConfiguratorProps,
} from '@/prototype/Configurator';

export const SectionInput = forwardRef<ConfiguratorMethods, ConfiguratorProps>(
  () => {
    useEffect(() => {}, []);
    return (
      <Textarea placeholder="Here is a sample placeholder" size="xs" rows={2} />
    );
  },
);
