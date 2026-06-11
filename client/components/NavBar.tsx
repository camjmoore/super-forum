'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/AuthContext';
import { GET_ALL_CATEGORIES } from '@/graphql/queries';
import type { GetAllCategoriesQuery } from '@/graphql/__generated__/graphql';

export default function NavBar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: catData } = useQuery<GetAllCategoriesQuery>(GET_ALL_CATEGORIES);
  const categories = catData?.getAllCategories?.threadCategories ?? [];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-orange-500 text-white px-4 py-2 flex items-center gap-4 shadow">
      <Link href="/" className="font-bold text-lg tracking-tight hover:text-orange-100">
        Super Forum
      </Link>

      {/* Categories dropdown */}
      <div className="relative group">
        <button className="hover:text-orange-100 text-sm">Categories ▾</button>
        <div className="absolute left-0 top-full hidden group-hover:block bg-white text-gray-800 shadow-lg rounded min-w-40 z-10">
          {categories.map((c: { id: string; name: string }) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="block px-4 py-2 hover:bg-orange-50 text-sm"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 text-sm">
        {user ? (
          <>
            <Link href={`/user/${user.userName}`} className="hover:text-orange-100">
              {user.userName}
            </Link>
            <Link href="/thread/create" className="bg-white text-orange-600 px-3 py-1 rounded font-medium hover:bg-orange-50">
              + Post
            </Link>
            <button onClick={handleLogout} className="hover:text-orange-100">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-orange-100">Login</Link>
            <Link href="/register" className="bg-white text-orange-600 px-3 py-1 rounded font-medium hover:bg-orange-50">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
