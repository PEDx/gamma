import { useRef, useState, useEffect, useMemo, FC } from 'react';
import { IConfiguratorComponentProps } from '..';
import { TBackgroundValue } from '@gamma/runtime';

export function BackgroundConfig({
  value,
  onChange,
}: IConfiguratorComponentProps<TBackgroundValue>) {
  console.log(value);
  return <div></div>;
}
