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

const listData: ICommentItem[] = Array.from({ length: 73 }).map((_, idx) => ({
  content: `${idx}号小姐姐的声音好好听`.repeat(
    +(Math.random() * 10 + 1).toFixed(0),
  ),
  type: CommentType.User,
}));

listData.unshift({
  content: '4号小姐姐的声音好好听4号小姐姐的声音好好听4号小姐姐的声音好好听',
  type: CommentType.Text,
});

const step = 10;
const gap = 16;
let startObserver: IntersectionObserver | null = null;
let endObserver: IntersectionObserver | null = null;
const elementLinkedList: CircularLinkedList<HTMLElement> = {
  last: null,
};
const messageLinkedList: CircularLinkedList<ICommentItem> = {
  last: null,
};
let direction = 'bottom';
let isViewEdge = false;
let offsetViewNodeCount = 0;

listData.forEach((data) => {
  addNode(messageLinkedList, data);
});

export const Comments = () => {
  const scrollElement = useRef<HTMLDivElement | null>(null);
  const [visibleData, setVisibleData] = useState<ICommentItem[]>([]);

  useEffect(() => {
    if (!scrollElement.current) return;
    initIntersectionObserver(scrollElement.current);

    const arr = listData.slice(0, 20);
    setVisibleData(arr);
  }, []);

  const addComment = useCallback(
    (text: string) => {
      const newMsg = { content: text, type: CommentType.User };
      addNode(messageLinkedList, newMsg);
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
    let index = 0;
    traverse(elementLinkedList, ({ value }) => {
      const rect = value.getBoundingClientRect();
      value.style.top = ` ${current_bottom_y}px`;
      value.dataset.y = `${current_bottom_y}`;
      value.dataset.h = `${rect.height}`;
      value.dataset.idx = `${index}`;
      current_bottom_y += rect.height + gap;
      index++;
    });
    if (listData.length < step) return;
    endObserver?.observe(elementLinkedList.last!.value);
  }, []);

  const alignDataFromElement = useCallback(
    (dataArr: ICommentItem[], direction: 'up' | 'down') => {
      const viewDataArr: ICommentItem[] = [];
      let index = 0;
      // 先变换一次视图
      let nidx = 0;
      let laseView = elementLinkedList.last;
      while (nidx < offsetViewNodeCount) {
        nidx++;
        laseView = direction === 'down' ? laseView?.next! : laseView?.prev!;
      }
      traverse({ last: laseView }, ({ value }) => {
        const dataidx = +value.dataset.idx!;
        viewDataArr[dataidx] = dataArr[index];
        index++;
      });
      return viewDataArr;
    },
    [],
  );

  const initIntersectionObserver = useCallback((element: HTMLElement) => {
    // 可视区域监测
    const options = {
      root: element,
      rootMargin: '0px',
      threshold: 0.1,
    };
    // 滚动过快可能错过检测
    startObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          endObserver?.unobserve(elementLinkedList.last!.value);
          startObserver?.unobserve(elementLinkedList.last!.next.value);
          const [visibleArr, offset, isEdge] =
            updateVisibleDataFromLinkListData('up');
          isViewEdge = isEdge;
          offsetViewNodeCount = offset;
          setVisibleData(alignDataFromElement(visibleArr, 'up'));
          direction = 'top';
        }
      });
    }, options);
    endObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          endObserver?.unobserve(elementLinkedList.last!.value);
          startObserver?.unobserve(elementLinkedList.last!.next.value);
          const [visibleArr, offset, isEdge] =
            updateVisibleDataFromLinkListData('down');
          isViewEdge = isEdge;
          offsetViewNodeCount = offset;
          setVisibleData(alignDataFromElement(visibleArr, 'down'));
          direction = 'bottom';
        }
      });
    }, options);
  }, []);

  const offsetBottomView = useCallback((offsetNodeCount) => {
    // 因为节点为动态高度，需要先将数据更新到 dom 上后，此时高度信息才正确
    let node = elementLinkedList.last;
    if (!node) return;
    let current_bottom_y =
      +node.value.dataset.y! + +node.value.dataset.h! + gap;
    for (let index = 0; index < offsetNodeCount; index++) {
      node = node.next;
      const rect = node.value.getBoundingClientRect();
      node.value.style.top = `${current_bottom_y}px`;
      node.value.dataset.h = `${rect.height}`;
      node.value.dataset.y = `${current_bottom_y}`;
      current_bottom_y += rect.height + gap;
    }
    startObserver?.observe(node.next.value);
    elementLinkedList.last = node; // 重设链尾
    if (isViewEdge) return;
    endObserver?.observe(node.value);
  }, []);

  const offsetTopView = useCallback((offsetNodeCount) => {
    let node = elementLinkedList.last!.next;
    if (!node) return;
    let current_top_y = +node.value.dataset.y!;
    // 直接取后 offsetNodeCount 个 node 移动到顶部
    for (let index = 0; index < offsetNodeCount; index++) {
      node = node.prev;
      const rect = node.value.getBoundingClientRect();
      current_top_y -= rect.height + gap;
      node.value.style.top = ` ${current_top_y}px`;
      node.value.dataset.y = `${current_top_y}`;
      node.value.dataset.h = `${rect.height}`;
    }
    elementLinkedList.last = node.prev; // 重设链尾
    endObserver?.observe(elementLinkedList.last!.value);
    if (isViewEdge) return;
    startObserver?.observe(elementLinkedList.last!.next.value);
  }, []);

  useEffect(() => {
    if (!visibleData.length) return;
    if (!elementLinkedList.last) {
      initCircularVirtualView(scrollElement.current as HTMLElement);
      return;
    }
    if (direction === 'bottom') offsetBottomView(offsetViewNodeCount);
    if (direction === 'top') offsetTopView(offsetViewNodeCount);
  }, [visibleData]);

  const updateVisibleDataFromLinkListData = useCallback(
    (() => {
      /**
       * 动态计算步长
       */
      let visibleLastNode = messageLinkedList.last!.next!;
      let visibleFirstNode = messageLinkedList.last!.next!;
      const MAX_OFFSET = 10;
      const VIEW_SIZE = 20;
      let index = 0;
      while (index < VIEW_SIZE && visibleLastNode !== messageLinkedList.last) {
        visibleLastNode = visibleLastNode.next;
        index += 1;
      }
      return (direction: 'down' | 'up'): [ICommentItem[], number, boolean] => {
        let isEdge = false;
        const firstHalf: ICommentItem[] = [];
        const secondHalf: ICommentItem[] = [];
        const last = messageLinkedList.last!;
        const first = messageLinkedList.last?.next!;
        let index = 0;
        let offset = 0;
        if (direction === 'down') {
          let node = visibleLastNode;
          while (offset < MAX_OFFSET && node !== first) {
            secondHalf.push(node.value);
            node = node.next;
            offset += 1;
          }
          const newVisibleLastNode = node;

          if (offset < MAX_OFFSET || node === first) {
            isEdge = true;
          }

          // 再往前找齐 20 个节点
          node = visibleLastNode;
          while (index < VIEW_SIZE - offset) {
            node = node.prev;
            firstHalf.push(node.value);
            index++;
          }

          visibleLastNode = newVisibleLastNode;
          visibleFirstNode = node;
        }

        if (direction === 'up') {
          let node = visibleFirstNode;
          while (offset < MAX_OFFSET && node !== last) {
            node = node.prev;
            firstHalf.push(node.value);
            offset += 1;
          }
          const newVisibleFirstNode = node;

          if (offset < MAX_OFFSET || node === last) {
            isEdge = true;
          }

          // 再往后找齐 20 个节点
          node = visibleFirstNode;
          while (index < VIEW_SIZE - offset) {
            secondHalf.push(node.value);
            node = node.next;
            index++;
          }
          visibleFirstNode = newVisibleFirstNode;
          visibleLastNode = node;
        }
        let arr: ICommentItem[] = [];
        arr = arr.concat(firstHalf.reverse(), secondHalf);
        return [arr, offset, isEdge];
      };
    })(),
    [],
  );

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
