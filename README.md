# PedidosYa User UI

## 📝 Description
Frontend application for user interaction within the PedidosYa system. Built with Angular and TypeScript, it connects to backend services for authentication and personal data management, providing a responsive and user-friendly interface.

## 🧩 Features
- User login and authentication via JWT.
- Client data listing, creation, and editing.
- Location selection (city, province, country).
- Role-based access control (RBAC).
- Form validation and error feedback.

## 🖼️ Screenshots

Here are some screenshots showcasing the application's interface:

#### Login
User authentication screen with email and password input.
<p align="center">
  <img src="/src/assets/screenshots/login.png" width="800" alt="Login">
</p>

#### Sign Up
User registration form with name, surname, email, and password fields.
<p align="center">
  <img src="/src/assets/screenshots/sign-up.png" width="800" alt="Sign Up">
</p>

#### Home
Landing page after login. Displays a list of food items retrieved from a mock API `(mock-food.ts)`.
<p align="center">
  <img src="/src/assets/screenshots/home-1.png" width="800" alt="Home part 1">
</p>
<p align="center">
  <img src="/src/assets/screenshots/home-2.png" width="800" alt="Home part 2">
</p>

#### People List
Displays all registered persons with their personal details.
<p align="center">
  <img src="/src/assets/screenshots/persons.png" width="800" alt="People List">
</p>

#### Create Person
Form to add a new person, including name, email, birth date, and city selection.
<p align="center">
  <img src="/src/assets/screenshots/create-person.png" width="800" alt="Create Person">
</p>

#### Edit Person
Form to update an existing person's information.
<p align="center">
  <img src="/src/assets/screenshots/edit-person.png" width="800" alt="Edit Person">
</p>

## 🔗 Backend Integration
This application interfaces with the following backend services:
- 🧍‍♂️ [Person Service](https://github.com/ImanolBarrionuevo/pedidosya-person-service): Manages user personal data and location hierarchy.
- 🔐 [Auth Service](https://github.com/ImanolBarrionuevo/pedidosya-auth-service): Handles login, JWT token issuance, and role-based access control.

Access to client data operations (viewing, creating, editing) is restricted based on user roles, enforced via JWT validation in the backend.  
The UI remains consistent across roles, but unauthorized actions are blocked securely.

## ⚙️ Tech Stack
- **Frontend Framework:** Angular
- **Language:** TypeScript
- **Styling:** CSS
- **State Management:** RxJS
- **HTTP Client:** Axios (custom clients for Auth and Person services)
- **Authentication:** JWT (via Auth Service)

## 🚀 Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the development server
    ```bash
    ng serve
    ```
    Once the server is running, open your browser and navigate to `http://localhost:4200/`. 
    The application will automatically reload whenever you modify any of the source files.

## 📡 API Configuration

This project uses pre-configured Axios clients to communicate with backend services:

| Axios Client          | Base URL                     | Purpose                       |
|-----------------------|------------------------------|-------------------------------|
| `axiosServiceAuth`    | `http://localhost:3001/auth` | Authentication requests       |
| `axiosServicePersons` | `http://localhost:3000`      | Personal data and location    |

These clients are defined in `src/app/services/` and include headers and interceptors for JWT authentication. The `axiosServicePersons` client automatically attaches the access token from `localStorage` to each request.

## 🧪 Testing

To execute unit tests:
   ```bash
   npm run test
   ```
To run end-to-end tests:
   ```bash
   npm run e2e
   ```
These commands use Angular's testing tools to validate component behavior and application flows.

## 👨‍💻 Credits

This project was collaboratively developed by Group G as part of the Software Development course at UTN FRVM. All members contributed equally to planning, implementation, and documentation.

**Team Members:**
- [@ImanolBarrionuevo](https://github.com/ImanolBarrionuevo)
- [@tomigambino](https://github.com/tomigambino)
- [@gabrieldiaz8](https://github.com/gabrieldiaz8)
- [@MateoBroilo](https://github.com/MateoBroilo)
- [@LolitoGlezz](https://github.com/LolitoGlezz)
