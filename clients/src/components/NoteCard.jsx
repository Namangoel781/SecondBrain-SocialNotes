import React from "react";
import { Share2, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import { Tweet } from "react-tweet";
import { Twitter } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const NoteCard = ({
  note = {
    type: "General",
    title: "Untitled",
    content: "",
    link: null,
    tags: [],
    userId: "",
    date: "",
  },
  onDelete = () => {},
  onShare = () => {},
}) => {
  const tags = Array.isArray(note.tags) ? note.tags : [];

  return (
    <Card className="mb-4 overflow-hidden shadow-md border border-gray-200 rounded-lg bg-white">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center gap-2">
          {note.type === "tweets" && (
            <Twitter className="text-blue-500 h-5 w-5" />
          )}
          {/* <h4 className="text-xs text-gray-500 text-transform: uppercase">
            {note.type || "General"}
          </h4> */}
          <h3 className="text-lg font-semibold text-gray-800">
            {note.title || "Untitled"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-100"
            aria-label="Share this note"
            onClick={() => onShare(note)}
          >
            <Share2 className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-100"
            onClick={() => onDelete(note)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {note.type === "tweets" && note.link ? (
          <div className="border rounded-lg p-3 bg-blue-50">
            <Tweet id={note.link.split("/status/")[1]} />
          </div>
        ) : (
          <p className="text-sm text-gray-700">
            {typeof note.content === "string"
              ? note.content
              : JSON.stringify(note.content) || "No content available."}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-gray-50">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Badge
              key={tag._id || `${tag.title}-${index}`}
              className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs"
            >
              {tag.title}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Added on {note.date || "Recent"}
        </p>
      </CardFooter>
    </Card>
  );
};

NoteCard.propTypes = {
  note: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    link: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          _id: PropTypes.string,
          title: PropTypes.string.isRequired,
        }),
        PropTypes.string,
      ])
    ),
    date: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default NoteCard;
