import React, { useRef, useState, useEffect } from "react";

// Single-file React component for a simple top-down tree placer
// - Tailwind for styling
// - Click on a tree in the palette, then click on the plane to place
// - Drag to move placed trees, select to edit rotation/scale
// - Export JSON (download) and POST to backend endpoint

export default function UnrealTreePlacer() {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ w: 1200, h: 700 });
  const [palette] = useState([
    { id: "pine_01", name: "Pine (Pine_01)", model: "Pine_01" },
    { id: "oak_01", name: "Oak (Oak_01)", model: "Oak_01" },
    { id: "birch_01", name: "Birch (Birch_01)", model: "Birch_01" },
  ]);

  const [selectedPaletteItem, setSelectedPaletteItem] = useState(null);
  const [trees, setTrees] = useState([]); // {id, model, x, y, rotation, scale}
  const [selectedTreeId, setSelectedTreeId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [transformSettings, setTransformSettings] = useState({
    // how canvas coordinates map to Unreal coordinates
    // unrealX = (canvasX - originX) * scaleX
    originX: 0,
    originY: 0,
    scale: 1.0,
    invertY: true // in many engines y axis points opposite
  });

  // helper: draw top-down plane + trees
  useEffect(() => {
    draw();
  }, [trees, selectedTreeId, canvasSize]);

  useEffect(() => {
    const handleResize = () => {
      // keep a responsive canvas
      const w = Math.min(window.innerWidth - 320, 1400);
      const h = Math.min(window.innerHeight - 140, 900);
      setCanvasSize({ w, h });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw grid
    const grid = 50;
    ctx.fillStyle = "#eef2ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(canvas.width, y + 0.5);
      ctx.stroke();
    }

    // draw trees
    trees.forEach((t) => {
      drawTreeIcon(ctx, t, t.id === selectedTreeId);
    });
  }

  function drawTreeIcon(ctx, tree, highlighted) {
    const { x, y, rotation = 0, scale = 1 } = tree;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // simple tree icon: triangle for crown + rect trunk
    // crown
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(12, 10);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fillStyle = "#16a34a";
    ctx.fill();
    // trunk
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(-3, 10, 6, 8);

    // label
    ctx.font = "12px Inter, Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(tree.model, -ctx.measureText(tree.model).width / 2, 30);

    if (highlighted) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#2563eb";
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 28, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function canvasCoordsFromEvent(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  function handleCanvasClick(e) {
    const pos = canvasCoordsFromEvent(e);
    // if a palette item selected -> place new tree
    if (selectedPaletteItem) {
      const newTree = {
        id: `tree_${Date.now()}`,
        model: selectedPaletteItem.model,
        x: pos.x,
        y: pos.y,
        rotation: 0,
        scale: 1,
      };
      setTrees((t) => [...t, newTree]);
      setSelectedTreeId(newTree.id);
      // keep selectedPaletteItem so user can place many
      return;
    }

    // otherwise see if user clicked an existing tree -> select it
    const hit = trees.slice().reverse().find((tr) => {
      // small hit test around center
      const dx = tr.x - pos.x;
      const dy = tr.y - pos.y;
      return dx * dx + dy * dy < 30 * 30;
    });
    if (hit) {
      setSelectedTreeId(hit.id);
    } else {
      setSelectedTreeId(null);
    }
  }

  function handleMouseDown(e) {
    const pos = canvasCoordsFromEvent(e);
    const hit = trees.slice().reverse().find((tr) => {
      const dx = tr.x - pos.x;
      const dy = tr.y - pos.y;
      return dx * dx + dy * dy < 30 * 30;
    });
    if (hit) {
      setIsDragging(true);
      setSelectedTreeId(hit.id);
    }
  }
  function handleMouseMove(e) {
    if (!isDragging || !selectedTreeId) return;
    const pos = canvasCoordsFromEvent(e);
    setTrees((prev) =>
      prev.map((t) => (t.id === selectedTreeId ? { ...t, x: pos.x, y: pos.y } : t))
    );
  }
  function handleMouseUp() {
    setIsDragging(false);
  }

  function updateSelectedTree(changes) {
    if (!selectedTreeId) return;
    setTrees((prev) => prev.map((t) => (t.id === selectedTreeId ? { ...t, ...changes } : t)));
  }

  function downloadJSON() {
    const payload = generateUnrealJSON();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tree_placement_unreal.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function postToBackend() {
    const payload = generateUnrealJSON();

    fetch("http://localhost:8080/api/sim/launch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((j) => alert("Backend response: " + JSON.stringify(j)))
      .catch((err) => alert("Error posting to backend: " + err));
  }


  function generateUnrealJSON() {
    // Map each placed tree into Unreal coordinate system using transformSettings
    // Schema example:
    // { meta: {...}, objects: [{id, model, unrealX, unrealY, unrealZ, rotationDeg, scale}] }
    const { originX, originY, scale, invertY } = transformSettings;
    const objects = trees.map((t) => {
      // convert canvas (pixels) -> world units
      const relX = (t.x - canvasSize.w / 2) - originX; // center-based
      const relY = (t.y - canvasSize.h / 2) - originY;
      const unrealX = relX * scale;
      const unrealY = (invertY ? -relY : relY) * scale;
      const unrealZ = 0; // top-down placement; user can adjust later
      return {
        id: t.id,
        model: t.model,
        location: { x: Number(unrealX.toFixed(3)), y: Number(unrealY.toFixed(3)), z: Number(unrealZ.toFixed(3)) },
        rotationDegrees: t.rotation,
        scale: t.scale,
      };
    });

    const payload = {
      meta: {
        createdAt: new Date().toISOString(),
        canvasSize,
        transformSettings,
        unrealNote: "Adjust Z, yaw/pitch/roll mapping in Unreal if needed",
      },
      objects,
    };
    return payload;
  }

  function removeSelected() {
    if (!selectedTreeId) return;
    setTrees((p) => p.filter((t) => t.id !== selectedTreeId));
    setSelectedTreeId(null);
  }

  const selectedTree = trees.find((t) => t.id === selectedTreeId) || null;

  return (
    <div className="flex gap-4 p-4 h-screen">
      <aside className="w-72 bg-white rounded-2xl shadow p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Tree Palette</h2>
        <div className="flex flex-col gap-2">
          {palette.map((pItem) => (
            <button
              key={pItem.id}
              onClick={() => setSelectedPaletteItem(pItem)}
              className={`text-left p-2 rounded-md border ${selectedPaletteItem && selectedPaletteItem.id === pItem.id ? 'border-blue-500' : 'border-gray-200'}`}>
              <div className="font-medium">{pItem.name}</div>
              <div className="text-xs text-gray-500">model: {pItem.model}</div>
            </button>
          ))}
        </div>

        <div className="mt-2">
          <button className="w-full py-2 rounded bg-sky-600 text-white" onClick={() => setSelectedPaletteItem(null)}>
            Pointer (select/move)
          </button>
        </div>

        <hr />
        <h3 className="font-medium">Selected Tree</h3>
        {selectedTree ? (
          <div className="space-y-2">
            <div>Model: {selectedTree.model}</div>
            <label className="block">
              Rotation (deg)
              <input type="range" min={0} max={360} value={selectedTree.rotation} onChange={(e) => updateSelectedTree({ rotation: Number(e.target.value) })} />
            </label>
            <label className="block">
              Scale
              <input type="range" min={0.2} max={3} step={0.05} value={selectedTree.scale} onChange={(e) => updateSelectedTree({ scale: Number(e.target.value) })} />
            </label>
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded bg-red-500 text-white" onClick={removeSelected}>Delete</button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No tree selected. Click a placed tree to select it.</div>
        )}

        <hr />
        <h3 className="font-medium">Export / Backend</h3>
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded bg-emerald-600 text-white" onClick={downloadJSON}>Download JSON</button>
          <button className="flex-1 py-2 rounded bg-indigo-600 text-white" onClick={postToBackend}>Start simulation</button>
        </div>

        <hr />
        <h3 className="font-medium">Coordinate mapping</h3>
        <div className="text-sm">Center-based mapping: canvas center → (0,0) in unreal by default. You can change origin and scale below.</div>
        <div className="space-y-2 mt-2">
          <label className="block text-sm">Origin X (px)
            <input className="w-full" type="number" value={transformSettings.originX} onChange={(e) => setTransformSettings(s => ({ ...s, originX: Number(e.target.value) }))} />
          </label>
          <label className="block text-sm">Origin Y (px)
            <input className="w-full" type="number" value={transformSettings.originY} onChange={(e) => setTransformSettings(s => ({ ...s, originY: Number(e.target.value) }))} />
          </label>
          <label className="block text-sm">Scale (canvas px -> Unreal units)
            <input className="w-full" type="number" value={transformSettings.scale} step={0.01} onChange={(e) => setTransformSettings(s => ({ ...s, scale: Number(e.target.value) }))} />
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={transformSettings.invertY} onChange={(e) => setTransformSettings(s => ({ ...s, invertY: e.target.checked }))} /> Invert Y
          </label>
        </div>

      </aside>

      <main className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Unreal Tree Placer — Top-down</h1>
          <div className="text-sm text-gray-600">Click palette then plane to place. Drag to move. Export JSON for Unreal.</div>
        </div>

        <div className="bg-white rounded-2xl shadow flex-1 p-4">
          <canvas
            ref={canvasRef}
            width={canvasSize.w}
            height={canvasSize.h}
            className="w-full h-full border rounded"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="bg-white rounded p-3 shadow">
          <h3 className="font-medium">Placed trees ({trees.length})</h3>
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {trees.map((t) => (
              <button key={t.id} onClick={() => setSelectedTreeId(t.id)} className={`p-2 border rounded ${t.id === selectedTreeId ? 'border-blue-500' : 'border-gray-200'}`}>
                <div className="text-sm font-medium">{t.model}</div>
                <div className="text-xs text-gray-500">x:{Math.round(t.x)} y:{Math.round(t.y)}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/*
Notes and next steps (in-code):
- This is a minimal single-file app. For production, split into components and add undo/redo.
- You can replace the simple icons with thumbnails / sprite images for each model.
- The generateUnrealJSON() function produces an array of objects with location/rotation/scale.
  Adjust the mapping to match your Unreal project's scale and axes.
- Backend example (Node/Express) should accept POST /api/sim/launch and trigger the simulation. See server example in the conversation notes.
*/
