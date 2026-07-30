"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

const BOARD_COLORS = [
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
];

interface CreateBoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    title: string;
    color: string;
    description?: string;
  }) => Promise<void>;
  isCreating: boolean;
}

export default function CreateBoardDialog({
  isOpen,
  onOpenChange,
  onCreate,
  isCreating,
}: CreateBoardDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("bg-blue-500");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle("");
      setDescription("");
      setColor("bg-blue-500");
    }
    onOpenChange(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onCreate({ title, color, description });

    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription className="sr-only">
            Enter title and select color for your new board.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="createBoardTitle">
              Board Titles <span className="text-red-500">*</span>
            </Label>
            <Input
              id="createBoardTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board title..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="createBoardDescription">Description</Label>
            <Textarea
              id="createBoardDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter brief description..."
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Board Color</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {BOARD_COLORS.map((c, key) => (
                <button
                  key={key}
                  type="button"
                  className={`w-8 h-8 rounded-full cursor-pointer ${c} ${
                    c === color ? "ring-2 ring-offset-2 ring-gray-900" : ""
                  }`}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="flex-actions">
            <Button type="submit" className="btn-primary" disabled={isCreating}>
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Board"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="btn-secondary"
              disabled={isCreating}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
