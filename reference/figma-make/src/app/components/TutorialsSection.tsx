import { BookOpen, Clock, GraduationCap, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Tutorial } from '../data/aiTools';
import { useState } from 'react';

interface TutorialsSectionProps {
  tutorials: Tutorial[];
}

const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function TutorialsSection({ tutorials }: TutorialsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const videosPerPage = 4;
  const totalPages = Math.ceil(tutorials.length / videosPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentVideos = tutorials.slice(
    currentPage * videosPerPage,
    (currentPage + 1) * videosPerPage
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen size={24} />
          <h2>Tutorials</h2>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentVideos.map((tutorial) => (
          <div
            key={tutorial.id}
            className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group"
          >
            {/* Video Thumbnail/Player */}
            <div className="relative aspect-video bg-black">
              {tutorial.videoUrl ? (
                <iframe
                  src={tutorial.videoUrl}
                  title={tutorial.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                  <Play size={32} className="text-white opacity-50" />
                </div>
              )}
            </div>

            {/* Tutorial Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm line-clamp-2 flex-1">{tutorial.title}</h3>
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {tutorial.description}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>{tutorial.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <GraduationCap size={12} />
                  <span>{tutorial.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentPage ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-2'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
