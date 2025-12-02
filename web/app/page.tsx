'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/');
        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-bold">CarShare App</h1>
        
        <div className="flex flex-col gap-4 w-full">
          {loading && <p className="text-lg">Loading backend data...</p>}
          {error && <p className="text-lg text-red-500">Error: {error}</p>}
          {data && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Backend Response:</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
