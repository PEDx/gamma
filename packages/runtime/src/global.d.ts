type TupleToUnion<T extends unknown[]> = T[number];

type RGBColor = {
  a?: number | undefined;
  b: number;
  g: number;
  r: number;
};
