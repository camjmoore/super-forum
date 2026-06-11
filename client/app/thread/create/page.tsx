'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_THREAD } from '@/graphql/mutations';
import { GET_ALL_CATEGORIES } from '@/graphql/queries';
import type { CreateThreadMutation, CreateThreadMutationVariables, GetAllCategoriesQuery } from '@/graphql/__generated__/graphql';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function CreateThreadPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const { data: catData } = useQuery<GetAllCategoriesQuery>(GET_ALL_CATEGORIES);
  const categories = catData?.getAllCategories?.threadCategories ?? [];
  const [createThread, { loading }] = useMutation<CreateThreadMutation, CreateThreadMutationVariables>(CREATE_THREAD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { data } = await createThread({ variables: { categoryId, title, body } });
    const messages = data?.createThread?.messages ?? [];
    if (messages[0]?.toLowerCase().includes('success') || messages[0]?.toLowerCase().includes('created')) {
      router.push('/');
    } else {
      setError(messages[0] || 'Failed to create thread.');
    }
  };

  if (authLoading) return <p className="text-gray-500 text-sm">Loading…</p>;
  if (!user) {
    return (
      <div className="bg-white rounded border border-gray-200 p-6 text-center">
        <p className="text-gray-600 mb-3">You must be logged in to post.</p>
        <Link href="/login" className="text-orange-500 hover:underline">Log in</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-gray-200 p-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          >
            <option value="">Select a category…</option>
            {categories.map((c: { id: string; name: string }) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            required
            maxLength={150}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
            required
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white px-5 py-2 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Posting…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
