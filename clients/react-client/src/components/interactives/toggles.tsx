interface ToggleProps {
  value: boolean;
  onClick: () => void;
}

function Toggle({ value, onClick }: ToggleProps) {
  return (
    <button
      type="button"
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
    </button>
  );
}

export default Toggle;
