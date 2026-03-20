import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg border shadow-sm p-8 w-full max-w-md">
        <h1 className="text-xl font-bold mb-2">Admin Access</h1>
        <p className="text-gray-500 text-sm mb-6">
          Internal admin tools. Enter your admin secret.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
