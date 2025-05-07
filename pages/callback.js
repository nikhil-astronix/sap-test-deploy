// pages/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      console.log("User returned from Cognito");

      const groupParam = router.query.groups;
      const parsedGroups = groupParam ? groupParam.split(',') : [];
      const roleGroups = parsedGroups.filter(g => !g.includes('Google') && !g.includes('MicrosoftOIDC') && !g.includes('us-east-2'));
      setGroups(roleGroups);

      console.log("User groups:", parsedGroups);
    }
  }, [router.isReady, router.query.groups]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Login successful! You can close this tab.</h2>
      {groups.length > 0 && (
        <p>You're part of: <strong>{groups.join(', ')}</strong></p>
      )}
    </div>
  );
}
