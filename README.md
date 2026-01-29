# TaskFlow - Collaborative Task Management

TaskFlow is a modern, single-page application built with Angular for teams to manage their projects and tasks efficiently. It provides a clean and intuitive interface for creating teams, organizing projects, and tracking tasks through a Kanban-style board.

---

## ✨ Features

-   **User Authentication:** Secure login and registration system using JWT.
-   **Team Management:** Create teams and invite members to collaborate.
-   **Project Organization:** Create and manage multiple projects within each team.
-   **Kanban Task Board:** Visualize your workflow with "To Do", "In Progress", and "Done" columns.
-   **Full CRUD for Tasks:** Create, read, update, and delete tasks with ease.
-   **Task Prioritization:** Assign priorities (High, Medium, Low) to focus on what matters.
-   **Commenting System:** Discuss task details with your team members directly on the task card.
-   **Responsive Design:** A clean and professional UI that works seamlessly on all devices.

---

## 🛠️ Tech Stack

-   **Framework:** [Angular](https://angular.io/) (v21.1.0)
-   **Styling:** [SCSS](https://sass-lang.com/) for advanced and maintainable stylesheets.
-   **State Management:** [RxJS](https://rxjs.dev/) and [Angular Signals](https://angular.io/guide/signals) for reactive data flow.
-   **HTTP Client:** Angular's built-in `HttpClient` with `HttpInterceptor` for handling API requests and JWT authentication.
-   **Testing:** [Vitest](https://vitest.dev/) for unit testing.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) (v9 or later)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd TasksClient
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

1.  **Start the server:**
    ```bash
    ng serve
    ```

2.  **Open the application:**
    Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any of the source files.

---

## 📂 Project Structure

The project follows a standard Angular structure, organized for scalability and maintainability.
src/ ├── app/ │ ├── components/ # All UI components (login, header, teams, tasks...) │ ├── core/ # Core logic (auth.guard, auth.interceptor) │ ├── models/ # TypeScript interfaces for data models (User, Team, Project) │ ├── services/ # Services for API interaction and business logic │ └── ... ├── assets/ # Static assets like images and fonts └── environments/ # Environment-specific configurations (dev, prod)


---

## 📄 API Endpoints

The application interacts with a backend server that exposes the following main REST API endpoints:

-   `/api/auth/login`
-   `/api/auth/register`
-   `/api/teams`
-   `/api/projects`
-   `/api/tasks`
-   `/api/comments`

All protected routes require a `Bearer <token>` in the `Authorization` header.

