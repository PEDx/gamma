export type ListNode<T> = {
  value: T;
  next: ListNode<T>;
};

export type CircularLinkedList<T> = {
  last: null | ListNode<T>;
};

export function addNode<T>(list: CircularLinkedList<T>, value: T) {
  const node: ListNode<T> = {
    value,
    next: null as any,
  };
  if (!list.last) {
    node.next = node;
    list.last = node;
  } else {
    const first = list.last.next;
    node.next = first;
    list.last.next = node; // 新节点上链
  }
  list.last = node;
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
