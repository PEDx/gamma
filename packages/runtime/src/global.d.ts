

type TupleToUnion<T extends unknown[]> = T extends [infer F, ...infer O]
  ? F | TupleToUnion<O>
  : never;

type RGBColor = {
  a?: number | undefined;
  b: number;
  g: number;
  r: number;
};
