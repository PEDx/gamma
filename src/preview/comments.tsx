import { getRandomStr } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import './style.scss';

type ListNode<T> = {
  value: T;
  next: ListNode<T>;
};

type CircularLinkedList<T> = {
  last: null | ListNode<T>;
};

function addNode<T>(list: CircularLinkedList<T>, value: T) {
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

function traverse<T>(
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

const list1: CircularLinkedList<number> = {
  last: null,
};

addNode(list1, 1);
addNode(list1, 2);
addNode(list1, 3);
addNode(list1, 4);
console.log(list1);

const CommentItem = ({ content }: { content: string }) => {
  const height = 42 + +(Math.random() * 42).toFixed(0);
  return (
    <div className="comment-item">
      <div
        className="comment-content"
        style={{ height: `${height}px`, width: `${height * 4}px` }}
      >
        comment-content-{content}
      </div>
    </div>
  );
};
const listData: ICommentItem[] = Array.from({ length: 2000 }).map((_, idx) => ({
  content: getRandomStr(10),
  time: new Date().toLocaleDateString(),
  index: idx,
}));

interface ICommentItem {
  content: string;
  time: string;
  index: number;
}

let start = 0;
let end = 20;
const pageSize = 20;
const step = 10;
const gap = 16;
let topElement: HTMLElement | null = null;
let bottomElement: HTMLElement | null = null;
let observer: IntersectionObserver | null = null;

export const Comments = () => {
  const scrollElement = useRef<HTMLDivElement | null>(null);
  const [visibleData, setVisibleData] = useState<ICommentItem[]>([]);

  useEffect(() => {
    if (!scrollElement.current) return;
    const elementList: CircularLinkedList<HTMLElement> = {
      last: null,
    };
    // // 滚动反向
    // scrollElement.current.addEventListener('mousewheel', (event: any) => {
    //   scrollElement.current!.scrollTop -= event.deltaY!;
    //   event.preventDefault();
    // });
    updateVisibleData();
    // 可视区域监测
    let prevY = 0;
    const options = {
      root: scrollElement.current,
      rootMargin: '0px',
      threshold: 0.1,
    };
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { target, isIntersecting } = entry;
        if (isIntersecting && (target as HTMLElement).dataset.end) {
          observer?.unobserve(elementList.last!.value); // end
          observer?.unobserve(elementList.last!.next.value); // first
          elementList.last!.value.dataset.end = '';
          elementList.last!.next.value.dataset.first = '';
          // 直接取 10 个 node 移动
          let node = elementList.last!;
          node.next.value.dataset.first = `${prevY}`;
          for (let index = 0; index < 10; index++) {
            node = node.next;
            node.value.style.transform = `translate3d(0, ${prevY}px, 0)`;
            prevY += node.value.getBoundingClientRect().height + gap;
          }
          node.value.dataset.end = `${prevY}`;
          observer?.observe(node.value); // end
          observer?.observe(node.next.value); // end
          elementList.last = node;
        }
        if (isIntersecting && (target as HTMLElement).dataset.first) {
          observer?.unobserve(elementList.last!.value); // end
          observer?.unobserve(elementList.last!.next.value); // first
          elementList.last!.value.dataset.end = '';
          elementList.last!.next.value.dataset.first = '';

          let node = elementList.last!;
          let total = 0;
          for (let index = 0; index < 20; index++) {
            node = node.next;
            total += node.value.getBoundingClientRect().height;
          }
          console.log(total);
          prevY -= total;
          for (let index = 0; index < 20; index++) {
            node = node.next;
            if (index < 10) {
              continue;
            }
            node.value.style.transform = `translate3d(0, ${prevY}px, 0)`;
            prevY -= node.value.getBoundingClientRect().height + gap;
          }
        }
      });
    }, options);
    setTimeout(() => {
      const elementArr = Array.from(
        scrollElement.current!.children,
      ) as HTMLElement[];
      elementArr.forEach((ele) => {
        addNode(elementList, ele);
      });
      observer?.observe(elementList.last!.value); // end
      elementList.last!.next.value.dataset.first = '0';
      traverse(elementList, ({ value }) => {
        value.style.transform = `translate3d(0, ${prevY}px, 0)`;
        prevY += value.getBoundingClientRect().height + gap;
      });
      elementList.last!.value.dataset.end = `${prevY}`;
    });
  }, []);

  const updateVisibleData = useCallback(() => {
    const varr = listData.slice(start, end);
    setVisibleData(varr);
  }, [visibleData]);

  return (
    <div className="wrap">
      <div className="commants">
        <div className="comment-list" ref={scrollElement}>
          {/*  10000 条左右开始滚动卡顿 */}
          {visibleData.map((data, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
              }}
            >
              <CommentItem content={`${data.content}-${data.index}`} />
            </div>
          ))}
        </div>
        <div className="comment-input">
          <textarea name="" className="input-element"></textarea>
        </div>
      </div>
    </div>
  );
};
