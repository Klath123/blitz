export default function GridBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,170,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,170,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />
      {/* Corner brackets */}
      <div style={{ position:"absolute", top:24, left:24, width:50, height:50, borderTop:"2px solid #00ffaa33", borderLeft:"2px solid #00ffaa33" }} />
      <div style={{ position:"absolute", top:24, right:24, width:50, height:50, borderTop:"2px solid #00ffaa33", borderRight:"2px solid #00ffaa33" }} />
      <div style={{ position:"absolute", bottom:24, left:24, width:50, height:50, borderBottom:"2px solid #00ffaa33", borderLeft:"2px solid #00ffaa33" }} />
      <div style={{ position:"absolute", bottom:24, right:24, width:50, height:50, borderBottom:"2px solid #00ffaa33", borderRight:"2px solid #00ffaa33" }} />
      {/* Scanlines */}
      <div style={{
        position:"absolute", inset:0,
        background:"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
      }} />
    </div>
  );
}