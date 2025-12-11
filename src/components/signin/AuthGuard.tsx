'use server'; // Ensure this runs on the server
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies(); // Access cookies
  const token = cookieStore.get('token'); // Get token from the cookie store

  // Redirect to login page if token is missing
  if (!token?.value) {
    return redirect('/auth/login');
  }

  // If token exists, render the children components
  return <>{children}</>;
}
