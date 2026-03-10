import React from "react";

function SpinnerMini() {
  return (
    <div className="m-0 w-5  aspect-square rounded-full border-2 border-white border-r-transparent animate-spin"></div>
  );
}

export default SpinnerMini;

/* .spinner-mini {
  margin: 0;
  width: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid theme("colors.primary.100");
  border-right-color: transparent;
  animation: rotate 1s infinite linear;
} */
