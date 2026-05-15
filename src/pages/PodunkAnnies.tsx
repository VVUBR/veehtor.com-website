import { useEffect } from "react";

export default function PodunkAnnies() {
  useEffect(() => {
    window.location.replace("/podunkannies.html");
  }, []);
  return null;
}
