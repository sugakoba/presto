// A script found to fix the "Unable to find draggable/droppable with id" error for react-beautiful-dnd with react 18
// Credits to https://github.com/GiovanniACamacho and https://github.com/Meligy 
// Original post: https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export const StrictModeDraggable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Draggable {...props}>{children}</Draggable>;
};
