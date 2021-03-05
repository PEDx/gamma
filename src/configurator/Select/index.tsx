import { useEffect, FC } from 'react';
import { Select as CSelect } from '@chakra-ui/react';

export const Select: FC = () => {
  useEffect(() => {}, []);
  return (
    <CSelect placeholder="Select option" size="sm">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </CSelect>
  );
};
