import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const withAuth = (Component) => {
  const AuthHOC = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/signin'); 
        } else {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; 
    }

    return <Component {...props} />;
  };

  AuthHOC.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthHOC;
};

export default withAuth;
