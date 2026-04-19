import { useEffect } from "react";

function useDisableNumberInputScroll() {
  useEffect(() => {
    const handleWheel = () => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement && active.type === "number") {
        active.blur();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);
}

export { useDisableNumberInputScroll };
