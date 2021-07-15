import { getRandomStr } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CircularLinkedList, addNode, traverse } from '@/common/ListNode';
import './style.scss';

const CommentItem = ({ content, id }: { content: string; id: number }) => {
  const height = id % 3 ? 40 : 100;
  return (
    <div className="comment-item">
      <div className="comment-content" style={{ width: '270px' }}>
        <div style={{ height: `${height}px` }}>comment-content-{content}</div>
      </div>
    </div>
  );
};

const listData: ICommentItem[] = Array.from({ length: 400 }).map((_, idx) => ({
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
const step = 10;
const pageSize = 20;
const gap = 16;
let startObserver: IntersectionObserver | null = null;
let endObserver: IntersectionObserver | null = null;
let bottom_y = 0;
let viewConverse = false; // 视图逆序
const elementList: CircularLinkedList<HTMLElement> = {
  last: null,
};
let direction = 'bottom';
const top_y_arr: number[] = [];

export const Comments = () => {
  const scrollElement = useRef<HTMLDivElement | null>(null);
  const [visibleData, setVisibleData] = useState<ICommentItem[]>([]);

  useEffect(() => {
    if (!scrollElement.current) return;
    initIntersectionObserver(scrollElement.current);
    // 滚动反向
    scrollElement.current.addEventListener('mousewheel', (event: any) => {
      scrollElement.current!.scrollTop -= event.deltaY!;
      event.preventDefault();
    });
    const varr = listData.slice(start, end);
    setVisibleData(varr);
  }, []);

  useEffect(() => {
    if (!visibleData.length) return;
    if (!elementList.last) {
      initCircularVirtualView(scrollElement.current as HTMLElement);
      return;
    }
    updateView();
  }, [visibleData]);

  const initCircularVirtualView = useCallback((element: HTMLElement) => {
    const elementArr = Array.from(element.children) as HTMLElement[];
    elementArr.forEach((ele) => {
      addNode(elementList, ele);
    });
    traverse(elementList, ({ value }) => {
      value.style.transform = `translate3d(0, ${bottom_y}px, 0)`;
      value.dataset.y = `${bottom_y}`;
      bottom_y += value.getBoundingClientRect().height + gap;
    });
    if (listData.length < step) return;
    endObserver?.observe(elementList.last!.value); // end
  }, []);

  const initIntersectionObserver = useCallback((element: HTMLElement) => {
    // 可视区域监测
    const options = {
      root: element,
      rootMargin: '0px',
      threshold: 0.1,
    };
    startObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          endObserver?.unobserve(elementList.last!.value); // end
          startObserver?.unobserve(elementList.last!.next.value); // first
          updateVisibleData(false);
          direction = 'top';
        }
      });
    }, options);
    endObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          endObserver?.unobserve(elementList.last!.value); // end
          startObserver?.unobserve(elementList.last!.next.value); // first
          updateVisibleData(true);
          direction = 'bottom';
        }
      });
    }, options);
  }, []);

  const updateView = useCallback(() => {
    if (direction === 'bottom') {
      // 直接取前 10 个 node 移动底部
      let node = elementList.last;
      if (!node) return;
      top_y_arr.push(+node.next.value.dataset.y!);
      for (let index = 0; index < step; index++) {
        node = node.next;
        node.value.style.transform = `translate3d(0, ${bottom_y}px, 0)`;
        node.value.dataset.y = `${bottom_y}`;
        bottom_y += node.value.getBoundingClientRect().height + gap;
      }
      startObserver?.observe(node.next.value); // first
      elementList.last = node; // 重设链尾
      if (end >= listData.length) return;
      endObserver?.observe(node.value); // end
    }
    if (direction === 'top') {
      let node = elementList.last!;
      let off = top_y_arr.pop();
      if (off === undefined) return;
      // 取后 10 个 node 移动前面
      for (let index = 0; index < pageSize; index++) {
        node = node.next;
        if (index < step) {
          if (index === 9) {
            elementList.last = node; // 重设链尾
          }
          continue;
        }
        node.value.style.transform = `translate3d(0, ${off}px, 0)`;
        node.value.dataset.y = `${off}`;
        off += node.value.getBoundingClientRect().height + gap;
      }
      endObserver?.observe(elementList.last!.value); // end
      const last = elementList.last?.value!;
      bottom_y = +last.dataset.y! + last.getBoundingClientRect().height + gap;
      if (end <= pageSize) return;
      startObserver?.observe(elementList.last!.next.value); // first
    }
  }, []);

  const updateVisibleData = useCallback((isBottom: boolean) => {
    const edge = isBottom ? end : end - pageSize;
    viewConverse = !viewConverse;
    let arr: ICommentItem[] = [];
    let startDataArr = listData.slice(edge - step, edge);
    let endDataArr = listData.slice(edge, edge + step);
    arr = viewConverse
      ? arr.concat(endDataArr, startDataArr)
      : arr.concat(startDataArr, endDataArr);
    setVisibleData(arr);
    isBottom ? (end += step) : (end -= step);
  }, []);

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
              <CommentItem
                content={`${data.content}-${data.index}`}
                id={data.index}
              />
            </div>
          ))}
        </div>
        <div className="comment-input">
          <textarea
            name=""
            className="input-element"
            placeholder="发表评论，按Enter输入"
          />
        </div>
      </div>
    </div>
  );
};
