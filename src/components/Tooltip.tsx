interface TooltipProps {
  text: string;
}

function Tooltip({ text }: TooltipProps) {
  return (
    <div className="info">
      <span className="material-symbols-outlined">info</span>
      <div className="text">{text}</div>
    </div>
  );
}

export default Tooltip;
