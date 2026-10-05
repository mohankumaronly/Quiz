import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="text-6xl font-bold text-slate-300">404</div>
      <p className="text-slate-500 mt-3">Page not found.</p>
      <Link to="/" className="mt-5">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}