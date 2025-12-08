import React, { useEffect, useRef, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from "../api/projects";

export default function TreeGenApp() {

    const [projects, setProjects] = useState([]);

    const [query, setQuery] = useState('');
    const [numberSort, setNumberSort] = useState('none');
    const [numRange, setNumRange] = useState({ from: '', to: '' });
    const [nameFilter, setNameFilter] = useState('');

    const [dragIndex, setDragIndex] = useState(null);
    const dragNode = useRef();

    const [menuOpenFor, setMenuOpenFor] = useState(null);
    const [editingFor, setEditingFor] = useState(null);
    const [editingNameValue, setEditingNameValue] = useState('');

    const [participantsModal, setParticipantsModal] = useState({ open: false, projectId: null });
    const [newParticipantId, setNewParticipantId] = useState('');

    // ===== LOAD PROJECTS FROM SERVER =====
    useEffect(() => {
        async function load() {
            const data = await getProjects();
            setProjects(data);
        }
        load();
    }, []);


    // ===== FILTERING =====
    const filtered = projects
        .filter(p => {
            if (numRange.from !== '' && Number(p.id) < Number(numRange.from)) return false;
            if (numRange.to !== '' && Number(p.id) > Number(numRange.to)) return false;

            if (nameFilter.trim() && !p.title.toLowerCase().includes(nameFilter.toLowerCase())) return false;
            return true;
        })
        .filter(p => {
            if (!query.trim()) return true;
            return p.title.toLowerCase().includes(query.toLowerCase()) || String(p.id).includes(query);
        });

    if (numberSort === 'asc') filtered.sort((a, b) => a.id - b.id);
    if (numberSort === 'desc') filtered.sort((a, b) => b.id - a.id);


    // ===== DRAG & DROP (only UI, not saved server-side) =====
    function handleDragStart(e, index) {
        dragNode.current = index;
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragEnter(e, targetIndex) {
        if (dragNode.current === null) return;
        if (dragNode.current === targetIndex) return;

        setProjects(old => {
            const copy = [...old];
            const item = copy.splice(dragNode.current, 1)[0];
            copy.splice(targetIndex, 0, item);
            dragNode.current = targetIndex;
            return copy;
        });
    }

    function handleDragEnd() {
        dragNode.current = null;
        setDragIndex(null);
    }


    // ===== CRUD =====
    async function addProject() {
        const dto = {
            title: "New project",
            description: "",
            isPublic: true
        };

        const newProj = await createProject(dto);
        setProjects(prev => [...prev, newProj]);
    }


    async function deleteProjectAction(id) {
        await deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        setMenuOpenFor(null);
    }


    function openEditName(id) {
        const p = projects.find(x => x.id === id);
        setEditingFor(id);
        setEditingNameValue(p.title);
        setMenuOpenFor(null);
    }


    async function saveEditName() {
        const updated = await updateProject({
            id: editingFor,
            title: editingNameValue
        });

        setProjects(prev => prev.map(p => p.id === editingFor ? updated : p));
        setEditingFor(null);
        setEditingNameValue('');
    }


    function openParticipants(id) {
        setParticipantsModal({ open: true, projectId: id });
        setMenuOpenFor(null);
    }


    async function addParticipantToProject() {
        const project = projects.find(p => p.id === participantsModal.projectId);
        const updated = await updateProject({
            ...project,
            participants: [...project.participants, newParticipantId.trim()]
        });

        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        setNewParticipantId("");
    }


    async function removeParticipant(pid, uid) {
        const project = projects.find(p => p.id === pid);
        const updated = await updateProject({
            ...project,
            participants: project.participants.filter(x => x !== uid)
        });

        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    }


    function getParticipantsList() {
        const p = projects.find(x => x.id === participantsModal.projectId);
        return p ? p.participants : [];
    }


    const shouldOpenUpwards = idx => idx >= filtered.length - 3;


    // ===== UI BELOW (YOUR ORIGINAL DESIGN KEPT SAME) =====
    return (
        <div className="min-h-screen bg-green-50 text-slate-900 p-6">
            <div className="max-w-6xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white">

                {/* TOP BAR */}
                <div className="flex items-center justify-between p-4 border-b border-green-200">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-green-700 text-xl">TreeGen</span>
                    </div>

                    <div className="flex items-center gap-2 w-1/3">
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Search…"
                        />
                    </div>
                </div>

                <div className="flex">

                    {/* SIDEBAR */}
                    <div className="w-[12%] border-r border-green-100 p-4">
                        <button className="w-full text-left px-3 py-2 rounded hover:bg-green-50 font-medium text-green-700">
                            Projects
                        </button>
                    </div>

                    {/* MAIN PANEL */}
                    <div className="w-[88%] p-4 bg-green-50">

                        {/* FILTERS */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <label>Sort:</label>
                                <select
                                    value={numberSort}
                                    onChange={e => setNumberSort(e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="none">None</option>
                                    <option value="asc">Asc</option>
                                    <option value="desc">Desc</option>
                                </select>

                                <label>Range:</label>
                                <input
                                    className="w-20 border rounded px-2 py-1"
                                    placeholder="from"
                                    value={numRange.from}
                                    onChange={e => setNumRange(r => ({ ...r, from: e.target.value }))}
                                />
                                <input
                                    className="w-20 border rounded px-2 py-1"
                                    placeholder="to"
                                    value={numRange.to}
                                    onChange={e => setNumRange(r => ({ ...r, to: e.target.value }))}
                                />

                                <label>Name:</label>
                                <input
                                    className="border rounded px-2 py-1"
                                    value={nameFilter}
                                    onChange={e => setNameFilter(e.target.value)}
                                    placeholder="letters…"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    setNumberSort("none");
                                    setNumRange({ from: "", to: "" });
                                    setNameFilter("");
                                    setQuery("");
                                }}
                                className="px-3 py-1 border rounded"
                            >
                                Clear
                            </button>
                        </div>

                        {/* TABLE HEADER */}
                        <div className="grid grid-cols-[80px_1fr_40px] text-sm font-medium text-slate-600 border-b pb-2">
                            <div>#</div>
                            <div>Name</div>
                            <div />
                        </div>

                        {/* PROJECT LIST */}
                        <div>
                            {filtered.map((p, idx) => (
                                <div
                                    key={p.id}
                                    draggable
                                    onDragStart={e => handleDragStart(e, projects.findIndex(x => x.id === p.id))}
                                    onDragEnter={e => handleDragEnter(e, projects.findIndex(x => x.id === p.id))}
                                    onDragEnd={handleDragEnd}
                                    className={`grid grid-cols-[80px_1fr_40px] py-3 border-b hover:bg-green-100 cursor-move`}
                                >
                                    <div className="px-2">{p.id}</div>
                                    <div className="px-2 flex items-center justify-between">

                                        {editingFor === p.id ? (
                                            <input
                                                value={editingNameValue}
                                                onChange={e => setEditingNameValue(e.target.value)}
                                                className="border px-2 py-1 rounded w-64"
                                            />
                                        ) : (
                                            <span className="font-medium">{p.title}</span>
                                        )}

                                        <span className="text-xs text-slate-400">
                                            {p.participants?.length ?? 0} members
                                        </span>
                                    </div>

                                    <div className="px-2 text-right relative">
                                        <button
                                            onClick={() => setMenuOpenFor(menuOpenFor === p.id ? null : p.id)}
                                            className="px-2 py-1 hover:bg-green-100 rounded"
                                        >
                                            ⋯
                                        </button>

                                        {menuOpenFor === p.id && (
                                            <div
                                                className={`absolute right-0 w-40 bg-white border rounded shadow-md z-20 ${
                                                    shouldOpenUpwards(idx) ? "bottom-full mb-1" : "top-full mt-1"
                                                }`}
                                            >
                                                <button
                                                    onClick={() => alert("Open project " + p.id)}
                                                    className="w-full text-left px-3 py-2 hover:bg-green-50"
                                                >
                                                    Open
                                                </button>

                                                <button
                                                    onClick={() => openEditName(p.id)}
                                                    className="w-full text-left px-3 py-2 hover:bg-green-50"
                                                >
                                                    Edit name
                                                </button>

                                                <button
                                                    onClick={() => openParticipants(p.id)}
                                                    className="w-full text-left px-3 py-2 hover:bg-green-50"
                                                >
                                                    Participants
                                                </button>

                                                <button
                                                    onClick={() => deleteProjectAction(p.id)}
                                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* EDIT NAME SAVE */}
                        {editingFor && (
                            <div className="mt-3 flex gap-2">
                                <button onClick={saveEditName} className="px-3 py-1 bg-green-600 text-white rounded">
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingFor(null);
                                        setEditingNameValue("");
                                    }}
                                    className="px-3 py-1 border rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {/* ADD PROJECT */}
                        <div className="mt-4">
                            <button onClick={addProject} className="px-3 py-2 bg-green-700 text-white rounded">
                                + Add project
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* PARTICIPANTS MODAL */}
            {participantsModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black opacity-40"
                        onClick={() => setParticipantsModal({ open: false, projectId: null })}
                    />

                    <div className="relative bg-white rounded-lg shadow-lg w-96 p-6">
                        <h3 className="text-lg font-medium">
                            Project #{participantsModal.projectId} — Participants
                        </h3>

                        <ul className="mt-4 space-y-2">
                            {getParticipantsList().map(uid => (
                                <li
                                    key={uid}
                                    className="flex items-center justify-between border px-3 py-2 rounded"
                                >
                                    <div>{uid}</div>
                                    <button
                                        onClick={() => removeParticipant(participantsModal.projectId, uid)}
                                        className="text-red-600 text-sm"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex gap-2">
                            <input
                                placeholder="participant id"
                                value={newParticipantId}
                                onChange={e => setNewParticipantId(e.target.value)}
                                className="flex-1 border px-2 py-1 rounded"
                            />
                            <button
                                onClick={addParticipantToProject}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                                Add
                            </button>
                        </div>

                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setParticipantsModal({ open: false, projectId: null })}
                                className="px-3 py-1 border rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
