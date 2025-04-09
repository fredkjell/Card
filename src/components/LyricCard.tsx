
import React, { useState } from "react";
import { Lyric, deleteLyric } from "@/lib/localStorage";
import { Music, Maximize2, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LyricCardProps {
  lyric: Lyric;
  onDelete: () => void;
}

const LyricCard: React.FC<LyricCardProps> = ({ lyric, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Format date to be more readable
  const formattedDate = new Date(lyric.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const canDelete = user?.isAdmin || (user && user.id === lyric.userId);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteLyric(lyric.id)) {
      toast({
        title: "Success",
        description: "Lyric deleted successfully",
      });
      onDelete();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete lyric",
        variant: "destructive",
      });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Card 
        className="lyric-card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
        onClick={handleOpen}
      >
        <div className="music-note-bg top-4 right-4">
          <Music size={24} className="text-primary/30" />
        </div>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 size={18} className="text-primary" />
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl md:text-2xl">{lyric.title}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="lyric-content text-base text-muted-foreground line-clamp-4">{lyric.content}</p>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm font-medium">By: {lyric.authorDisplayName || lyric.author}</p>
          <div className="flex items-center gap-3">
            {canDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete} 
                className="h-8 w-8 p-0 rounded-full text-destructive hover:text-destructive-foreground hover:bg-destructive delete-btn"
              >
                <Trash2 size={16} />
              </Button>
            )}
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl">{lyric.title}</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <div className="absolute -top-6 -right-6 opacity-10">
              <Music size={120} className="text-primary/30" />
            </div>
            
            <div className="mt-6 mb-8">
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{lyric.content}</p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-base font-medium">By: {lyric.authorDisplayName || lyric.author}</p>
              <div className="flex items-center gap-3">
                {canDelete && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDelete}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive delete-btn"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                )}
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LyricCard;
