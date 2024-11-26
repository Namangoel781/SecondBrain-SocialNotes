import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/Slidbar";
import Header from "../components/Header";
import BentoGridNotes from "../components/BentoGridNotes";
import ShareModal from "../components/Modal";
import AddContentModal from "../components/AddContent";
import API from "../api/api";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import FetchUserSharedContent from "@/components/FetchUserSharedContent";
import usePagination from "../context/usePagination";
import SavedYTVidoes from "../components/YoutubeFetchedContent";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState("tweets");

  const navigate = useNavigate();
  const itemsPerPage = 6;

  const {
    paginatedItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(notes, itemsPerPage);

  const fetchNotes = async () => {
    try {
      const response = await API.get("/content");
      const notesData = Array.isArray(response.data.Content)
        ? response.data.Content
        : [];
      if (notesData.length === 0) {
        setError("No valid notes available.");
      } else {
        const normalizedNotes = notesData.map((note) => ({
          ...note,
          id: note._id,
          title: note.title || "Untitled",
          tags: Array.isArray(note.tags) ? note.tags : [],
          date: note.date || "No Date",
        }));
        setNotes(normalizedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(error.response?.data?.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (contentData) => {
    const validTypes = ["video", "article", "image", "tweets"];
    if (!validTypes.includes(contentData.type)) {
      setError(
        `Invalid type: ${contentData.type}. Please select a valid type.`
      );
      return;
    }

    if (!Array.isArray(contentData.tags) || contentData.tags.length === 0) {
      setError("Tags should be an array and cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to perform this action.");
      return;
    }

    try {
      const response = await API.post("/content", contentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedContent = response.data.content;
      setNotes((prevNotes) => [...prevNotes, savedContent]);
      setSuccess("Content added successfully!");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding content:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add content. Please try again."
      );
    }
  };

  const deleteNote = async (contentId, video) => {
    console.log("deleteNote called with:", { contentId, video });

    if (!contentId) {
      console.error("Content ID is undefined");
      setError("Invalid content ID. Please try again.");
      return;
    }

    // if (!video || !video._id) {
    //   console.warn("Video object or video._id is undefined");
    //   return;
    // }

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/content/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== contentId)
      );
      setSuccess("Content deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  const handleShare = (content, type) => {
    console.log("handleShare called with content:", content);
    if (type === "note" || type === "video") {
      if (content && content._id && content.title) {
        setSelectedNote(content);
        setIsShareModalOpen(true);
      } else {
        setError(`Selected ${type} is invalid`);
      }
    } else {
      setError("Invalid content type for sharing");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchNotes();
    }
  }, [navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="flex-1 overflow-auto">
        <Header
          onShareClick={() => setIsShareModalOpen(true)}
          onAddClick={() => setIsAddModalOpen(true)}
        />
        <div className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {activeTab === "tweets" ? (
            <BentoGridNotes
              notes={paginatedItems.filter((note) => note.type === "tweets")}
              onDelete={deleteNote}
              onShare={(note) => handleShare(note, "note")}
            />
          ) : activeTab === "shared" ? (
            <FetchUserSharedContent />
          ) : activeTab === "videos" ? (
            <SavedYTVidoes
              notes={paginatedItems.filter((note) => note.type === "video")}
              onDelete={deleteNote}
              onShare={(video) => handleShare(video, "video")}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No content available for this tab.</p>
            </div>
          )}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddContent={addContent}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        content={selectedNote}
      />
    </div>
  );
};

export default Dashboard;
