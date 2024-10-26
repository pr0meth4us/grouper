import Link from 'next/link';

export default function Home() {
  return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <h1 className="text-4xl font-bold text-center">Welcome to Grouping App</h1>
          <div className="space-y-4">
            <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
                href="/signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
  );
}
