import React from "react";
type QuickActionButtonProps = {
  needsConfirmation: boolean;
  confirmText?: string;
  onClickHandler: Function;
  children: React.ReactNode;
};

function QuickActionButton({
  needsConfirmation,
  confirmText,
  onClickHandler,
  children,
}: QuickActionButtonProps) {
  return (
    <button
      onClick={(e) => {
        if (needsConfirmation && confirmText) {
          if (confirm(confirmText)) {
            onClickHandler(e);
          }
        } else {
          onClickHandler(e);
        }
      }}
      type="button"
      className="bg-transparent hover:bg-blue-500 font-semibold hover:text-white py-1 px-1 border border-blue-500 hover:border-transparent rounded"
    >
      {children}
    </button>
  );
}

export default QuickActionButton;
