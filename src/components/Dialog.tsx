import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

/** lu-dialog の閉じるアニメーションの長さ（--lu-duration-slow と同じ値） */
const CLOSE_DURATION_MS = 250;

type DialogProps = {
  show: boolean;
  /** 省略すると、Escキーや背景のクリックでは閉じなくなる */
  onHide?: () => void;
  title?: string;
  /** title がないダイアログの読み上げ用の名前 */
  ariaLabel?: string;
  /** title がないダイアログで、名前として参照する本文内の見出しの id */
  labelledBy?: string;
  bodyClassName?: string;
  /** 既定の 560px では狭いときに、幅を 800px まで広げる */
  wide?: boolean;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * ネイティブの dialog 要素を show に合わせて開閉する、lu-dialog のラッパー。
 * 閉じている間は中身をマウントせず、閉じるアニメーション中は閉じる直前の中身を表示し続ける。
 */
export const Dialog: React.FC<DialogProps> = ({
  show,
  onHide,
  title,
  ariaLabel,
  labelledBy,
  bodyClassName,
  wide,
  actions,
  children,
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [isMounted, setMounted] = useState(show);

  const content = useRef<ReactNode>(null);
  if (show) {
    content.current = (
      <>
        {title && (
          <h2 className="lu-dialog__title" id={titleId}>
            {title}
          </h2>
        )}
        <div className={`lu-dialog__body ${bodyClassName ?? ""}`}>
          {children}
        </div>
        {actions && <div className="lu-dialog__actions">{actions}</div>}
      </>
    );
  }

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (show) {
      setMounted(true);
      if (!dialog.open) dialog.showModal();
      return;
    }

    dialog.close();
    const timer = setTimeout(() => setMounted(false), CLOSE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [show]);

  // padding の部分も target は dialog になるので、座標で背景のクリックだけを判定する
  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (!onHide || e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!isInside) onHide();
  };

  return (
    <dialog
      ref={ref}
      className={`lu-dialog ${wide ? "ep-dialog-wide" : ""}`}
      aria-labelledby={title ? titleId : labelledBy}
      aria-label={ariaLabel}
      onCancel={(e) => {
        e.preventDefault();
        onHide?.();
      }}
      onKeyDown={(e) => {
        // cancel を止めても、Chrome は Esc の連打で閉じてしまうため
        if (!onHide && e.key === "Escape") e.preventDefault();
      }}
      onClick={handleClick}
    >
      {(show || isMounted) && content.current}
    </dialog>
  );
};
