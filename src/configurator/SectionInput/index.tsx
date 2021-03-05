import { useEffect, FC } from 'react';
import { Textarea } from '@chakra-ui/react';

export const SectionInput: FC = () => {
  useEffect(() => {}, []);
  return <Textarea placeholder="Here is a sample placeholder" size="xs" rows={2} />;
};
