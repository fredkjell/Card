
import React, { useEffect, useState } from "react";
import { getLyrics, Lyric } from "@/lib/localStorage";
import LyricCard from "@/components/LyricCard";
import NewLyricForm from "@/components/NewLyricForm";
import { Music, MusicIcon } from "lucide-react";

const Index = () => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);

  useEffect(() => {
    loadLyrics();
  }, []);

  const loadLyrics = () => {
    const storedLyrics = getLyrics();
    setLyrics(storedLyrics);
  };

  return (
    <div className="page-gradient min-h-screen pb-20">
      <header className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <MusicIcon size={36} className="text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Lyric Locker
          </h1>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-2">
          Create and share your song lyrics with the world. Add your own creative lyrics by clicking the + button.
          <span className="block mt-2 text-sm font-medium text-primary">Click on any card to view the full lyrics!</span>
        </p>
      </header>

      <main className="container mx-auto px-4 py-4">
        {lyrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lyrics.map((lyric) => (
              <LyricCard key={lyric.id} lyric={lyric} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-background/50 rounded-lg border border-border shadow-sm">
            <Music size={64} className="mx-auto text-primary/50 mb-4" />
            <h2 className="text-2xl font-medium mb-3">No Lyrics Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Be the first to add your creative lyrics! Click the + button to get started.
            </p>
          </div>
        )}
      </main>

      <NewLyricForm onLyricAdded={loadLyrics} />
    </div>
  );
};

export default Index;
