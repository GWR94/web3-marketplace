import "@styles/globals.css";
import { Navbar, Footer } from "@components/common";
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <div className="relative bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4">
          <Navbar />
          <div className="fit">
            <Component {...pageProps} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MyApp;
