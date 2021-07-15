export type ListNode<T> = {
  value: T;
  next: ListNode<T>;
  prev: ListNode<T>;
};

export type CircularLinkedList<T> = {
  last: null | ListNode<T>;
};

export function addNode<T>(list: CircularLinkedList<T>, value: T) {
  const node: ListNode<T> = {
    value,
    next: null as any,
    prev: null as any,
  };
  if (!list.last) {
    node.next = node;
    node.prev = node;
  } else {
    const first = list.last.next;
    node.next = first;
    node.prev = list.last;
    list.last.next = node; // 新节点上链
  }
  list.last = node;  // 重设 last 指针
  list.last.next.prev = list.last
}

export function traverse<T>(
  list: CircularLinkedList<T>,
  callback: (v: ListNode<T>) => void,
) {
  if (!list.last) return;
  const first = list.last.next;
  let node = first;
  do {
    callback(node);
    node = node.next;
  } while (node !== first);
}


const numberLinkedList: CircularLinkedList<number> = {
  last: null,
};
addNode(numberLinkedList, 1)
addNode(numberLinkedList, 2)
addNode(numberLinkedList, 3)
console.log(numberLinkedList);
