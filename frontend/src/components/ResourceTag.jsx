export  function ResourceTag({ id }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs border"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        borderColor: "#D8DCD4",
        color: "#1F2A24",
        borderRadius: "3px",
        borderStyle: "dashed",
        backgroundColor: "#F2F4F1",
      }}
    >
      {id}
    </span>
  );
}
