'use client';
import { useState } from 'react';

interface Meeting {
  id: number;
  join_url: string;
  start_url: string;
  password?: string;
}

export default function ZoomPage() {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(false);

  const createMeeting = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/zoom/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Interview Meeting',
          start_time: new Date().toISOString(),
          duration: 30,
        }),
      });

      const data = await res.json();
      console.log('Zoom API response:', data); // debug
      if ('error' in data) throw new Error(data.error);
      setMeeting(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Zoom Meeting Integration</h1>

        <button
          onClick={createMeeting}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Meeting'}
        </button>

        {meeting && (
          <div className="mt-6 bg-indigo-50 p-5 rounded-lg shadow-inner text-left text-gray-800">
            <p className="mb-2">
              <span className="font-semibold">Meeting ID:</span> {meeting.id || 'N/A'}
            </p>
            <p className="mb-2 break-all">
              <span className="font-semibold">Join URL:</span>{' '}
              <a
                href={meeting.join_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {meeting.join_url || 'N/A'}
              </a>
            </p>
            {meeting.password ? (
              <p>
                <span className="font-semibold">Password:</span> {meeting.password}
              </p>
            ) : (
              <p className="text-gray-500">No password required</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
