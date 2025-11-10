"use client";

import React, { useState } from "react";
import { DeleteIcon } from "@/icons";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { removeBrowsingHistory } from "@/lib/utils/localstorage";

interface RemoveButtonProps {
  onHistoryClear: () => void;
}

export default function RemoveButton({ onHistoryClear }: RemoveButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemove = () => {
    setIsDialogOpen(false);
    onHistoryClear();
    removeBrowsingHistory();
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="p-2 hover:bg-stone-100 rounded-2xl transition-colors"
      >
        <DeleteIcon />
      </button>
      {isDialogOpen && (
        <ConfirmationDialog
          isOpen={true}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleRemove}
          title="閲覧履歴を削除しますか？"
          message="この操作は取り消せません"
          confirmText="削除"
        />
      )}
    </>
  );
}
