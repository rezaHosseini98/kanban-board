"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTitle: string;
  setNewTitle: (val: string) => void;
  newDescription: string;
  setNewDescription: (val: string) => void;
  newColor: string;
  setNewColor: (val: string) => void;
  isUpdating: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function EditBoardDialog({
  isOpen,
  onOpenChange,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newColor,
  setNewColor,
  isUpdating,
  onSubmit,
}: EditBoardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
          <DialogDescription className="sr-only">
            Update the title and color of your board.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="boardTitle">Board Title</Label>
            <Input
              id="boardTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter board title..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boardDescription">Board Description</Label>
            <Textarea
              id="boardDescription"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter board description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Board Color</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {[
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-red-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-indigo-500",
                "bg-gray-500",
                "bg-orange-500",
                "bg-teal-500",
                "bg-cyan-500",
                "bg-emerald-500",
              ].map((color, key) => (
                <button
                  key={key}
                  type="button"
                  className={`w-8 h-8 rounded-full cursor-pointer ${color} ${
                    color === newColor
                      ? "ring-2 ring-offset-2 ring-gray-900"
                      : ""
                  }`}
                  onClick={() => setNewColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="flex-actions">
            <Button type="submit" className="btn-primary" disabled={isUpdating}>
              {isUpdating ? (
                <div className="flex items-center justify-center gap-2 text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Changing...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              className="btn-secondary"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
