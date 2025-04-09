
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addLyric, isPasswordVerified } from "@/lib/localStorage";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { LockKeyhole, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NewLyricFormProps {
  onLyricAdded: () => void;
}

const NewLyricForm: React.FC<NewLyricFormProps> = ({ onLyricAdded }) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add lyrics",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use user's display name if available, otherwise fall back to manual author input
      const authorName = user?.displayName || author || user?.username || "Anonymous";
      
      addLyric(
        { 
          title, 
          content, 
          author: authorName,
          authorDisplayName: user?.displayName, 
          userId: user?.id || "anonymous"
        }, 
        user?.id || "anonymous"
      );
      
      toast({
        title: "Lyrics added!",
        description: "Your lyrics have been successfully added",
      });
      
      setTitle("");
      setContent("");
      setAuthor("");
      
      onLyricAdded();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lyrics. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setTitle("");
      setContent("");
      setAuthor("");
      setPassword("");
      setPasswordError("");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-10 add-button">
          <Plus size={24} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        {!isAuthenticated && !isPasswordVerified() ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LockKeyhole size={18} />
                Authentication Required
              </DialogTitle>
              <DialogDescription>
                You need to log in to add new lyrics to the collection.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 text-center">
              <p className="mb-4">Please log in to your account to continue.</p>
              <Button onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Lyrics</DialogTitle>
              <DialogDescription>
                Create and share your song lyrics with the community.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Song Title</Label>
                <Input 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter song title"
                  maxLength={100}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Lyrics</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your lyrics here..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              {!user?.displayName && (
                <div className="grid gap-2">
                  <Label htmlFor="author">Your Name</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={50}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Lyrics</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewLyricForm;
