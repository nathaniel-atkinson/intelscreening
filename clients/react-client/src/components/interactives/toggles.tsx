interface ToggleProps {
  value: boolean;
  onClick: () => void;
}

function Toggle({ value, onClick }: ToggleProps) {
  return (
    <div
      className="toggle"
      onClick={onClick}
      role="switch"
      aria-checked={value}
    >
      <div
        className="eye"
        style={{
          float: value ? "right" : "left",
        }}
      />
    </div>
  );
}

export default Toggle;
