
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyReadonly<T> = { readonly [P in keyof T]: T[P] };
type TupleToObject<T extends readonly any[]> = { [P in T[number]]: P };
type First<T extends unknown[]> = T extends [infer F, ...infer L] ? F : never;
type Length<T extends unknown[]> = T['length'];
type Exclude<T, U> = T extends U ? never : T;
type MyReturnType<T> = T extends (key: any) => infer P ? P : never;
type MyParamsType<T> = T extends (...arg: infer P) => any ? P : never;
type MyOmit<T, U extends keyof T> = MyPick<T, Exclude<keyof T, U>>;
type MyReadonly2<T, U extends keyof T> = {
  readonly [P in U]: T[P];
} &
  { [Q in Exclude<keyof T, U>]: T[Q] };

type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
type TupleToUnion<T extends unknown[]> = T[number];
interface IChainable<T = {}> {
  option<K extends string, V>(
    key: K,
    value: V,
  ): IChainable<T & { [key in K]: V }>;
  get(): T;
}

type Last<T extends unknown[]> = T extends [...infer F, infer L] ? L : never;

type Pop<T extends unknown[]> = T extends [...infer F, infer L] ? F : never;
type Push<T extends unknown[], U> = [...T, U];
type Shift<T extends unknown[]> = T extends [infer F, ...infer L] ? L : never;
type Unshift<T extends unknown[], U> = [U, ...T];

declare function PromiseAll<T extends readonly unknown[]>(arg: T): Promise<{ [P in keyof T]: T[P] extends Promise<infer Q> ? Q : T[P] }>

type LookUp<T extends { type: string }, U extends string> = U extends T['type'] ? T extends { type: U } ? T : never : never;

type TrimLeft<T extends string> = T extends `${' ' | '\n' | '\t'}${infer R}` ? TrimLeft<R> : T;
type Trim<T extends string> = T extends `${' ' | '\n' | '\t'}${infer R}${' ' | '\n' | '\t'}` ? Trim<R> : T;
type Capitalize<T extends string> = T extends `${infer S}${infer R}` ? `${Uppercase<S>}${R}` : T;
type Replace<T extends string, U extends string, K extends string> = T extends `${infer S}${U}${infer F}` ? `${S}${K}${F}` : never;
type ReplaceAll<T extends string, U extends string, K extends string> = T extends `${infer S}${U}${infer F}` ? ReplaceAll<`${S}${K}${F}`, U, K> : T;

type AppendArgument<T extends Function, U> = T extends (...args: infer A) => infer B ? (...args: [...A, U]) => B : never

type Flatten<T extends unknown[]> = T extends [infer B, ...infer P] ? B extends unknown[] ? [...Flatten<B>, ...Flatten<P>] : [B, ...Flatten<P>] : T

type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]

export default ''
