import React from "react";
import NoteCard from "./NoteCard";
import Masonry from "react-masonry-css";
import FetchUserSharedContent from "./FetchUserSharedContent";

const BentoGridNotes = ({ notes, onDelete, onShare }) => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1,
  };
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto -ml-4 "
      columnClassName="pl-4 bg-transparent"
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={() => onDelete(note.id)}
          onShare={() => onShare(note)}
        />
      ))}

      <FetchUserSharedContent />
    </Masonry>
  );
};

export default BentoGridNotes;
