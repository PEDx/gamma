import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { MAIN_COLOR } from '@/color';
import './style.scss';

export const GraduallyLoading: FC<{
  size?: 'small' | 'large';
  speed?: number;
}> = ({ size = 'small', speed = 3 }) => {
  return (
    <Box
      position="relative"
      overflow="hidden"
      w={`${size === 'small' ? 56 : size === 'large' ? 64 : 60}px`}
      h={`${size === 'small' ? 8 : size === 'large' ? 20 : 16}px`}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'nowrap',
          position: 'absolute',
          zIndex: '1',
          left: '0',
          top: '0',
          '>div': {
            animation: `gradualShowDispear ${speed || 4}s ease-in-out infinite`,
          },
          '>div:nth-of-type(8)': {
            animationDelay: `0s`,
          },
          '>div:nth-of-type(7)': {
            animationDelay: `${(speed / 16) * 1 || (4 / 16) * 1}s`,
          },
          '>div:nth-of-type(6)': {
            animationDelay: `${(speed / 16) * 2 || (4 / 16) * 2}s`,
          },
          '>div:nth-of-type(5)': {
            animationDelay: `${(speed / 16) * 3 || (4 / 16) * 3}s`,
          },
          '>div:nth-of-type(4)': {
            animationDelay: `${(speed / 16) * 4 || (4 / 16) * 4}s`,
          },
          '>div:nth-of-type(3)': {
            animationDelay: `${(speed / 16) * 5 || (4 / 16) * 5}s`,
          },
          '>div:nth-of-type(2)': {
            animationDelay: `${(speed / 16) * 6 || (4 / 16) * 6}s`,
          },
          '>div:nth-of-type(1)': {
            animationDelay: `${(speed / 16) * 7 || (4 / 16) * 7}s`,
          },
        }}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <Box
            key={idx}
            className="loading-rect"
            sx={{
              backgroundColor: `${MAIN_COLOR}`,
            }}
          ></Box>
        ))}
      </Box>
    </Box>
  );
};
