interface TooltipProps {
  text: string;
}

function Tooltip({ text }: TooltipProps) {
  return (
    <div className="info flex">
      <span className="material-symbols-outlined">info</span>
      <div className="text flex">{text}</div>
    </div>
  );
}

export default Tooltip;
