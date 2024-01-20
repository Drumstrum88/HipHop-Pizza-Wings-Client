/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();
  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <div className="home-screen">
        <h1 className="home-screen">Hello, {user.first_name}! </h1>
        <Link passHref className="btn" href="/orders">| View Orders |</Link>
        <Link passHref href="../orders/new" className="home-btn"> Start an Order
        </Link>
        <Link href="/revenue">
          <a className="home-btn"> | View Revenue |</a>
        </Link>

      </div>
    </div>
  );
}

export default Home;
