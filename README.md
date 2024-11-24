📚 Second Brain App

A web application that helps users store and organize their shared content, such as tweets, videos, documents, links, and tags. The app features a sidebar for easy navigation between content types and integrates with external services such as Twitter to display tweets.

📝 Table of Contents
Technologies Used
Features
Usage
Contributing
License


⚙️ Technologies Used

React: 🧑‍💻 A JavaScript library for building user interfaces. It allows the app to efficiently update and render UI components when data changes, providing a smooth user experience.

Use case: React is used to manage UI components like the sidebar, content cards, and dynamic views based on user interactions (like switching tabs).
React Hooks: 🔧 Functions like useState and useEffect that enable the use of state and lifecycle methods in functional components.

Use case: useState is used to manage the state for content, loading, and error messages, while useEffect is used to fetch data when the component is mounted.
Masonry Layout: 📐 The layout system used to display cards with variable heights in an organized, grid-like structure.

Use case: The Masonry component is used to display shared content in a responsive layout, adjusting the number of columns based on the screen size.
Lucide Icons: 🖼️ A collection of SVG icons used for the sidebar buttons and other UI elements.

Use case: Icons like Twitter, Video, and Tags are used for visually distinguishing the different content categories in the sidebar.
Tailwind CSS: 🌈 A utility-first CSS framework for building custom designs without writing custom CSS.

Use case: Tailwind is used to style the components in a responsive and modern way, with classes for spacing, colors, hover states, and grid layouts.
Axios: 🌐 A promise-based HTTP client for making requests to the backend API.

Use case: Axios is used to fetch shared content from the server, handle authentication tokens, and display content based on user input.
React-Tweet: 🐦 A library for embedding tweets from Twitter.

Use case: Tweets shared by users are embedded directly within the app, allowing users to interact with tweets seamlessly within the content cards.
React Context / Props: 🔄 Used for passing data through the component tree without having to pass props down manually at every level.

Use case: The sidebar component receives the activeTab state from the parent component, allowing it to highlight the active button based on the user's selection.


🚀 Features

Sidebar Navigation: 🧭 Easily navigate between different categories of content (Tweets, Videos, Documents, Links, Tags, Shared Content).
Responsive Layout: 📱 The layout adjusts for different screen sizes (1 column on small screens, 2 columns on medium screens, and 3 columns on large screens).
Dynamic Content Fetching: 📥 Fetches and displays content from an API, with dynamic updates based on user interaction.
Embedded Tweets: 🐦 Displays tweets directly in the app with the ability to interact with the content.
Tagging System: 🏷️ Allows content to be categorized with tags for easy filtering.
Refresh Content: 🔄 Option to refresh the displayed shared content.


📦 Usage

Login: 🔐 You must be logged in to access and fetch shared content.

Sidebar: 📑 The sidebar allows you to switch between different types of content: Tweets, Videos, Documents, Links, Tags, and Shared Content.

Shared Content: 📂 You can see the content that you've shared, along with relevant tags and metadata like the date it was added.


🤝 Contributing

We welcome contributions! 🎉 If you'd like to improve this app, feel free to submit a pull request. Please ensure that your code follows the existing coding conventions and that tests pass before submitting.

Steps to contribute:

Fork the repository 🍴.

Create a new branch (git checkout -b feature-name) 🌿.

Make your changes and commit them (git commit -am 'Add feature') 📝.

Push to the branch (git push origin feature-name) ⬆️.

Create a new pull request 🔄.
