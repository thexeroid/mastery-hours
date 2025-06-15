import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  skillName = "",
  title = "Delete Skill",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const defaultDescription = skillName
    ? `Are you sure you want to delete "${skillName}"? This action cannot be undone and will also delete all associated practice sessions.`
    : "Are you sure you want to delete this skill? This action cannot be undone and will also delete all associated practice sessions.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
