'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decodeBuild, type BuildData } from '@/utils/buildCodec';
import Planner from '@/components/Planner';

export default function BuildPage() {
  const params = useParams();
  const [sharedBuild, setSharedBuild] = useState<BuildData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const code = params.code as string;
    if (!code) {
      setFailed(true);
      return;
    }

    const build = decodeBuild(code);
    if (!build) {
      setFailed(true);
      return;
    }

    setSharedBuild(build);
  }, [params.code]);

  if (failed) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#1e1e1e] text-gray-300">
        <p className="text-lg">Invalid or corrupted build link.</p>
        <a href="/" className="text-yellow-400 underline hover:text-yellow-200">
          Go to planner
        </a>
      </div>
    );
  }

  if (!sharedBuild) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e1e1e]">
        <p className="text-lg text-gray-400">Loading build...</p>
      </div>
    );
  }

  return <Planner sharedBuild={sharedBuild} />;
}
