import { getRandomStr } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const listData: ICommentItem[] = Array.from({ length: 3 }).map((_, idx) => ({
  content: '4号小姐姐的声音好好听4号小姐姐的声音好好听4号小姐姐的声音好好听',
  type: CommentType.User,
}));

listData.unshift({
  content: '4号小姐姐的声音好好听4号小姐姐的声音好好听4号小姐姐的声音好好听',
  type: CommentType.Text,
});

export const Comments = () => {
  const scrollElement = useRef<HTMLDivElement | null>(null);
  const [visibleData, setVisibleData] = useState<ICommentItem[]>([]);

  useEffect(() => {
    if (!scrollElement.current) return;
    // 滚动反向
    scrollElement.current.addEventListener('mousewheel', (event: any) => {
      scrollElement.current!.scrollTop -= event.deltaY!;
      event.preventDefault();
    });
    setVisibleData(listData);
  }, []);

  const addComment = useCallback(
    (text: string) => {
      visibleData.unshift({ content: text, type: CommentType.User });
      setVisibleData([...visibleData]);
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
