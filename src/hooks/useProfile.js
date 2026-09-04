import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

let cachedProfile = null;
let profilePromise = null;

export const useProfile = () => {
  const [profile, setProfile] = useState(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfile);

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
      setLoading(false);
      return;
    }

    if (!profilePromise) {
      const targetUsername = import.meta.env.VITE_PORTFOLIO_USERNAME;
      let query = supabase.from('profile').select('*');
      
      if (targetUsername) {
        query = query.eq('username', targetUsername);
      }
      
      profilePromise = query
        .limit(1)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            cachedProfile = data[0];
            return cachedProfile;
          }
          return null;
        });
    }

    profilePromise.then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  return { profile, loading };
};
