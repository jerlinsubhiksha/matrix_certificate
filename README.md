# Matrix Certification Webapp

A modern, full-stack web application for coordinating events, managing participants, and dynamically generating & delivering certificates. Built with Next.js, Firebase, and integrated with Google Workspace APIs for seamless document management and email delivery.

## 🚀 Features

- **Role-Based Access Control**: Secure coordinator dashboards protected by Firebase Authentication.
- **Event & Participant Management**: Easily track events and manage their attendees.
- **Dynamic Certificate Generation**: Automated high-quality PDF certificate generation using `pdf-lib` and `html2canvas`.
- **Google Workspace Integration**:
  - Automatically export and save generated certificates directly to Google Drive.
  - Send certificates to participants seamlessly via the Gmail API.
- **Certificate Verification**: Secure verification portal for authenticating issued certificates.
- **Modern & Dynamic UI/UX**: Built with Tailwind CSS, Framer Motion, and shadcn/ui components for a premium, responsive experience.
- **Dark Mode Support**: Full support for light and dark themes using `next-themes`.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) & React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Authentication & Database**: [Firebase](https://firebase.google.com/) (Client & Admin SDKs)
- **Form Validation**: React Hook Form & Zod
- **APIs**: Google Drive API, Gmail API
- **PDF Processing**: `pdf-lib`, `html2canvas`

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- A Firebase Project (with Authentication & Firestore enabled)
- A Google Cloud Project (with Google Drive API and Gmail API enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sudikshas-byte/matrixcertificationwebapp.git
   cd matrixcertificationwebapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory based on the provided `.env.example`. You will need to provide your Firebase configuration and Google API service account credentials:
   ```env
   # Firebase Client Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Firebase Admin Configuration (for API routes)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"

   # Google APIs (Drive/Gmail) Service Account Configuration
   GOOGLE_CLIENT_EMAIL=your_google_service_account_email
   GOOGLE_PRIVATE_KEY="your_google_private_key"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running locally.

## 📁 Project Structure

- `/src/app`: Next.js App Router directories encompassing public pages, API routes, and the `/coordinator` protected dashboard.
- `/src/components`: Reusable frontend UI components (shadcn/ui, layout blocks).
- `/src/lib`: Core backend logic and utilities (Firebase configuration, Google API wrappers, PDF generation handlers).
- `/src/context`: React Context providers for global state (e.g., AuthContext).
- `/public`: Static assets including images and fonts.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sudikshas-byte/matrixcertificationwebapp/issues).

## 📄 License

This project is licensed under the [MIT License](LICENSE).
