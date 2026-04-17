import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              background: '#1A1714',
              color: '#F5F1EB',
              borderRadius: '10px',
              padding: '12px 18px',
            },
            success: { iconTheme: { primary: '#D45A20', secondary: '#F5F1EB' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}
