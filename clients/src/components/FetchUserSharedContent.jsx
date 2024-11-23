import React, { useState, useEffect } from "react";
import API from "../api/api";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const FetchUserSharedContent = () => {
  const [content, setContent] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSharedContents = async () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      setError("You must be logged in to fetch shared contents.");
      setLoading(false);
      return;
    }

    const parsedUser = user ? JSON.parse(user) : null;

    if (!parsedUser || !parsedUser.id) {
      setError("Invalid user data. Please log in again");
      setLoading(false);
      return;
    }

    const userId = parsedUser.id;

    try {
      const response = await API.get(`/brain/shared-contents/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedSharedContents = response.data.sharedContents;
      if (!fetchedSharedContents || fetchedSharedContents.length === 0) {
        setError("No shared content found for this user");
      } else {
        setContent(fetchedSharedContents);
      }
    } catch (err) {
      console.error("Error fetching shared contents: ", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch shared contents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedContents();
  }, []);

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        User's Shared Content
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      {content.length > 0 ? (
        content.map((sharedContent) => (
          <Card
            key={sharedContent._id} // Ensure a unique key for each card
            className="mb-4 overflow-hidden shadow-md border border-gray-200 rounded-lg bg-white"
          >
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                {sharedContent.title || "Untitled"}
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">
                {sharedContent.content || "No content available."}
              </p>
            </CardContent>
            <CardFooter className="p-4 bg-gray-50">
              <div className="flex flex-wrap gap-2 mb-2">
                {sharedContent.tags &&
                  sharedContent.tags.map((tag) => (
                    <Badge
                      key={tag._id}
                      className="bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs"
                    >
                      {tag.title}
                    </Badge>
                  ))}
              </div>
              <p className="text-xs text-gray-500">
                Added on {sharedContent.date || "Recent"}
              </p>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No shared content found for this user.</p>
      )}

      <Button onClick={fetchSharedContents} className="mt-4">
        Refresh Shared Content
      </Button>
    </div>
  );
};

export default FetchUserSharedContent;
