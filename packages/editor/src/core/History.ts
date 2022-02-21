// [o1, o2]
// [o1, o2, o2', o1', o3] == [o3]

export enum EOperatorType {
  Select,
  Unselect,
  Add,
  Delete,
  Change,
}

export class Operator<T extends Function> {
  readonly execute: T;
  constructor(exe: T) {
    this.execute = exe;
  }
}

export const operators = {
  [EOperatorType.Select]: new Operator((id: string) => {
    console.log(`select id ${id}`);
  }),
  [EOperatorType.Unselect]: new Operator((id: string) => {
    console.log(`unselect id ${id}`);
  }),
  [EOperatorType.Add]: new Operator((id: string) => {
    console.log(`add id ${id}`);
  }),
  [EOperatorType.Delete]: new Operator((id: string) => {
    console.log(`delete id ${id}`);
  }),
  [EOperatorType.Change]: new Operator((id: string) => {
    console.log(`change id ${id}`);
  }),
};

export interface IRecord {
  readonly id: string;
  readonly op: EOperatorType;
}

export class History {
  private records: IRecord[] = [];
  constructor() {}
  push(op: EOperatorType, id: string) {
    const operator = operators[op];
    operator.execute(id);
    this.records.push({
      id,
      op,
    });
  }
  undo() {}
  redo() {}
}
