import { useCallback, useEffect, useRef, useState } from 'react';
import { CircularLinkedList, addNode, traverse } from '@/common/ListNode';
import './style.scss';

enum CommentType {
  User,
  Text,
}
interface ICommentItem {
  content: string;
  type: CommentType;
}

const UserCommentItem = ({ content }: { content: string }) => {
  return (
    <div className="user-comment-item">
      <div className="left">
        <div className="use-avatar"></div>
      </div>
      <div className="right">
        <div className="use-info">
          <div className="use-name">George Hanson</div>
          <div className="use-icon"></div>
        </div>
        <div className="comment-text-wrap">
          <div className="comment-text">{content}</div>
        </div>
      </div>
    </div>
  );
};
const TextCommentItem = () => {
  return (
    <div className="text-comment-item">
      4号小姐姐的声音好好听4号小姐姐的声音好好听4号小姐姐的声音好好听
    </div>
  );
};

const CommentItem = ({ data }: { data: ICommentItem }) => {
  return (
    <div className="comment-item">
      {data.type === CommentType.User ? (
        <UserCommentItem content={data.content} />
      ) : (
        <TextCommentItem />
      )}
    </div>
  );
};

const listData: ICommentItem[] = Array.from({ length: 400 }).map((_, idx) => ({
  content: `${idx}号小姐姐的声音好好听`.repeat(
    +(Math.random() * 10 + 1).toFixed(0),
  ),
  type: CommentType.User,
}));

listData.unshift({
  content: '4号小姐姐的声音好好听4号小姐姐的声音好好听4号小姐姐的声音好好听',
  type: CommentType.Text,
});

let start = 0;
let end = 20;
const step = 10;
const pageSize = 20;
const gap = 16;
let startObserver: IntersectionObserver | null = null;
let endObserver: IntersectionObserver | null = null;
let viewConverse = false; // 视图逆序
const elementLinkedList: CircularLinkedList<HTMLElement> = {
  last: null,
};
const messageLinkedList: CircularLinkedList<ICommentItem> = {
  last: null,
};
let direction = 'bottom';

// listData.forEach((data) => {
//   addNode(messageLinkedList, data);
// });

export const Comments = () => {
  const scrollElement = useRef<HTMLDivElement | null>(null);
  const [visibleData, setVisibleData] = useState<ICommentItem[]>([]);

  useEffect(() => {
    if (!scrollElement.current) return;
    initIntersectionObserver(scrollElement.current);

    const arr = listData.slice(start, end);
    setVisibleData(arr);
  }, []);

  const addComment = useCallback(
    (text: string) => {
      const newMsg = { content: text, type: CommentType.User };
      addNode(messageLinkedList, newMsg);
      console.log(messageLinkedList);
    },
    [visibleData],
  );

  const handleKeyup = useCallback(
    (e) => {
      if (e.keyCode !== 13) return;
      const text = e.target.value;
      e.target.value = '';
      addComment(text);
    },
    [addComment],
  );

  const initCircularVirtualView = useCallback((element: HTMLElement) => {
    const elementArr = Array.from(element.children) as HTMLElement[];
    elementArr.forEach((ele) => {
      addNode(elementLinkedList, ele);
    });
    let current_bottom_y = 0;
    traverse(elementLinkedList, ({ value }) => {
      const rect = value.getBoundingClientRect();
      value.style.top = ` ${current_bottom_y}px`;
      value.dataset.y = `${current_bottom_y}`;
      value.dataset.h = `${rect.height}`;
      current_bottom_y += rect.height + gap;
    });
    if (listData.length < step) return;
    endObserver?.observe(elementLinkedList.last!.value); // end
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
          endObserver?.unobserve(elementLinkedList.last!.value); // end
          startObserver?.unobserve(elementLinkedList.last!.next.value); // first
          updateVisibleData(false);
          direction = 'top';
        }
      });
    }, options);
    endObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          endObserver?.unobserve(elementLinkedList.last!.value); // end
          startObserver?.unobserve(elementLinkedList.last!.next.value); // first
          updateVisibleData(true);
          direction = 'bottom';
        }
      });
    }, options);
  }, []);

  const updateView = useCallback(() => {
    if (direction === 'bottom') {
      // 需要先将数据更新到 dom 上后，此时高度等信息才正确
      // 直接取前 10 个 node 移动底部，视图位置变了，实际 dom 的顺序并没有变
      // 因此在数据层面上需要对顺序进行适配
      let node = elementLinkedList.last;
      if (!node) return;
      // 此时去取 node 的高度是不准的，因为数据视图已经翻转了
      let current_bottom_y =
        +node.value.dataset.y! + +node.value.dataset.h! + gap;
      for (let index = 0; index < step; index++) {
        node = node.next;
        const rect = node.value.getBoundingClientRect();
        node.value.style.top = `${current_bottom_y}px`;
        node.value.dataset.h = `${rect.height}`;
        node.value.dataset.y = `${current_bottom_y}`;
        current_bottom_y += rect.height + gap;
      }
      startObserver?.observe(node.next.value); // first
      elementLinkedList.last = node; // 重设链尾
      if (end >= listData.length) return;
      endObserver?.observe(node.value); // end
    }
    if (direction === 'top') {
      let node = elementLinkedList.last!.next;
      if (!node) return;
      let current_top_y = +node.value.dataset.y!;
      for (let index = 0; index < step; index++) {
        node = node.prev;
        const rect = node.value.getBoundingClientRect();
        current_top_y -= rect.height + gap;
        node.value.style.top = ` ${current_top_y}px`;
        node.value.dataset.y = `${current_top_y}`;
        node.value.dataset.h = `${rect.height}`;
      }
      elementLinkedList.last = node.prev; // 重设链尾
      endObserver?.observe(elementLinkedList.last!.value); // end
      if (end <= pageSize) return;
      startObserver?.observe(elementLinkedList.last!.next.value); // first
    }
  }, []);

  useEffect(() => {
    if (!visibleData.length) return;
    if (!elementLinkedList.last) {
      initCircularVirtualView(scrollElement.current as HTMLElement);
      return;
    }
    updateView();
  }, [visibleData]);

  const updateVisibleData = useCallback((isBottom: boolean) => {
    // FIXME 如果往 listData 前插入了一个数据，会导致下标变化
    // TODO 数据可以试试使用循环链表来描述
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
        <div className="comment-list-wrap" ref={scrollElement}>
          {/*  10000 条左右开始滚动卡顿 */}
          {visibleData.map((data, idx) => (
            <CommentItem key={idx} data={data} />
          ))}
        </div>
        <div className="comment-input" onKeyUp={handleKeyup}>
          <input
            name=""
            className="input-element"
            placeholder="发表评论，按Enter输入"
          />
        </div>
      </div>
    </div>
  );
};
