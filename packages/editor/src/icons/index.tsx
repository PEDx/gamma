import { FC } from 'react';
import { Icon as ChakraIcon, IconProps } from '@chakra-ui/react';

// https://remixicon.com/

export interface IIconProps {
  name: string;
}

export const Icon: FC<IIconProps & IconProps> = (props) => {
  const symbolId = `#icon-${props.name}`;
  return (
    <ChakraIcon {...props}>
      <use xlinkHref={symbolId} fill="currentColor" />
    </ChakraIcon>
  );
};
