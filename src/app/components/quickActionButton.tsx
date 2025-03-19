import { Button } from "@/components/ui/button";
import React from "react";
// import Button from "@mui/material/Button";
import { ElementType } from "react";

type QuickActionButtonProps = {
  needsConfirmation?: boolean;
  confirmText?: string;
  onClickHandler?: Function;
  children: React.ReactNode;
};

function QuickActionButton({
  needsConfirmation = false,
  confirmText,
  onClickHandler = () => {},
  children,
}: QuickActionButtonProps) {
  return (
    <Button
      onClick={(e) => {
        if (needsConfirmation && confirmText) {
          if (confirm(confirmText)) {
            onClickHandler(e);
          }
        } else {
          onClickHandler(e);
        }
      }}
    >
      {children}
    </Button>
  );
}

export default QuickActionButton;
