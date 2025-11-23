import React, {useEffect, useRef, useState} from 'react';

export default function TreeGenApp() {
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('tg_projects');
        if (saved) return JSON.parse(saved);
        return [
            {id: 1, name: 'Proj1', participants: ['u100', 'u201']},
            {id: 2, name: 'Proj2', participants: ['u12']},
            {id: 3, name: 'Proj3', participants: []},
        ];
    });

    const [query, setQuery] = useState('');
    const [numberSort, setNumberSort] = useState('none');
    const [numRange, setNumRange] = useState({from: '', to: ''});
    const [nameFilter, setNameFilter] = useState('');

    const [dragIndex, setDragIndex] = useState(null);
    const dragNode = useRef();

    const [menuOpenFor, setMenuOpenFor] = useState(null);
    const [editingFor, setEditingFor] = useState(null);
    const [editingNameValue, setEditingNameValue] = useState('');

    const [participantsModal, setParticipantsModal] = useState({open: false, projectId: null});
    const [newParticipantId, setNewParticipantId] = useState('');

    useEffect(() => {
        localStorage.setItem('tg_projects', JSON.stringify(projects));
    }, [projects]);

    // Filtering and sorting pipeline
    const filtered = projects
        .filter(p => {
            if (numRange.from !== '' && Number.isFinite(Number(numRange.from))) {
                if (p.id < Number(numRange.from)) return false;
            }
            if (numRange.to !== '' && Number.isFinite(Number(numRange.to))) {
                if (p.id > Number(numRange.to)) return false;
            }
            if (nameFilter.trim() !== '') {
                if (!p.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
            }
            return true;
        })
        .filter(p => {
            if (query.trim() === '') return true;
            return p.name.toLowerCase().includes(query.toLowerCase()) || String(p.id).includes(query);
        });

    if (numberSort === 'asc') filtered.sort((a, b) => a.id - b.id);
    if (numberSort === 'desc') filtered.sort((a, b) => b.id - a.id);

    // Drag and drop handlers (HTML5)
    function handleDragStart(e, index) {
        dragNode.current = index;
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragEnter(e, targetIndex) {
        if (dragNode.current === null) return;
        if (dragNode.current === targetIndex) return;
        setProjects(old => {
            const copy = Array.from(old);
            const draggedItem = copy.splice(dragNode.current, 1)[0];
            copy.splice(targetIndex, 0, draggedItem);
            dragNode.current = targetIndex;
            return copy;
        });
    }

    function handleDragEnd() {
        setDragIndex(null);
        dragNode.current = null;
    }

    function addProject() {
        const last = projects.length ? projects[projects.length - 1].id : 0;
        const newProj = {id: last + 1, name: `New project ${last + 1}`, participants: []};
        setProjects(prev => [...prev, newProj]);
    }

    function deleteProject(id) {
        setProjects(prev => prev.filter(p => p.id !== id));
        setMenuOpenFor(null);
    }

    function openEditName(id) {
        const p = projects.find(x => x.id === id);
        setEditingFor(id);
        setEditingNameValue(p ? p.name : '');
        setMenuOpenFor(null);
    }

    function saveEditName() {
        setProjects(prev => prev.map(p => (p.id === editingFor ? {...p, name: editingNameValue} : p)));
        setEditingFor(null);
        setEditingNameValue('');
    }

    function openParticipants(id) {
        setParticipantsModal({open: true, projectId: id});
        setMenuOpenFor(null);
    }

    function addParticipantToProject() {
        const id = newParticipantId.trim();
        if (!id) return;
        setProjects(prev => prev.map(p => (p.id === participantsModal.projectId ? {
            ...p,
            participants: [...p.participants, id]
        } : p)));
        setNewParticipantId('');
    }

    function removeParticipant(pid, uid) {
        setProjects(prev => prev.map(p => (p.id === pid ? {
            ...p,
            participants: p.participants.filter(x => x !== uid)
        } : p)));
    }

    function openProject(id) {
        alert('Open project ' + id);
        setMenuOpenFor(null);
    }

    // Get participants for modal
    const getParticipants = () => {
        const project = projects.find(p => p.id === participantsModal.projectId);
        return project && project.participants ? project.participants : [];
    };

    // Function to determine if menu should open upwards
    const shouldOpenUpwards = (index) => {
        return index >= filtered.length - 3;
    };

    return (
        <div className="min-h-screen bg-green-50 text-slate-900 p-6">
            <div className="max-w-6xl mx-auto shadow-lg rounded-lg overflow-hidden bg-white">
                {/* Top bar */}
                <div className="flex items-center justify-between p-4 border-b border-green-200">
                    <div className="flex items-center gap-3">
                        <a
                            href="https://example.com"
                            className="inline-flex items-center gap-2 font-semibold text-green-700 hover:underline"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2">
                                <path d="M3 12l2-2 4 4 8-8 4 4"/>
                            </svg>
                            TreeGen
                        </a>
                    </div>

                    <div className="flex items-center gap-2 w-1/3">
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                            placeholder="Search by name or #"
                        />
                        <button className="px-3 py-2 bg-green-600 text-white rounded">Search</button>
                    </div>
                </div>

                {/* Below horizontal divider */}
                <div className="flex">
                    {/* Left column 12% */}
                    <div className="w-[12%] border-r border-green-100 p-4">
                        <button
                            className="w-full text-left px-3 py-2 rounded hover:bg-green-50 font-medium text-green-700"
                            onClick={() => alert('Go to Projects page')}>
                            Projects
                        </button>
                    </div>

                    {/* Right column 88% */}
                    <div className="w-[88%] p-4 bg-green-50">
                        {/* Filters header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-slate-600">Sort by #: </label>
                                <select value={numberSort} onChange={e => setNumberSort(e.target.value)}
                                        className="border rounded px-2 py-1">
                                    <option value="none">None</option>
                                    <option value="asc">Asc</option>
                                    <option value="desc">Desc</option>
                                </select>

                                <label className="text-sm text-slate-600">Range: </label>
                                <input className="w-20 border rounded px-2 py-1" placeholder="from"
                                       value={numRange.from}
                                       onChange={e => setNumRange(r => ({...r, from: e.target.value}))}/>
                                <input className="w-20 border rounded px-2 py-1" placeholder="to" value={numRange.to}
                                       onChange={e => setNumRange(r => ({...r, to: e.target.value}))}/>

                                <label className="text-sm text-slate-600">Name filter:</label>
                                <input className="border rounded px-2 py-1" placeholder="letters..." value={nameFilter}
                                       onChange={e => setNameFilter(e.target.value)}/>
                            </div>

                            <div>
                                <button className="px-3 py-1 border rounded text-green-700" onClick={() => {
                                    setNumberSort('none');
                                    setNumRange({from: '', to: ''});
                                    setNameFilter('');
                                    setQuery('');
                                }}>
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Table header */}
                        <div
                            className="grid grid-cols-[80px_1fr_40px] items-center text-sm font-medium text-slate-600 border-b pb-2">
                            <div>#</div>
                            <div>Project name</div>
                            <div className="text-right"></div>
                        </div>

                        {/* Projects list (draggable) */}
                        <div className="relative">
                            {filtered.map((p, idx) => (
                                <div
                                    key={p.id}
                                    draggable
                                    onDragStart={e => handleDragStart(e, projects.findIndex(x => x.id === p.id))}
                                    onDragEnter={e => handleDragEnter(e, projects.findIndex(x => x.id === p.id))}
                                    onDragEnd={handleDragEnd}
                                    className={`grid grid-cols-[80px_1fr_40px] items-center py-3
                              ${dragIndex === idx ? 'bg-green-100' : ''}
                              border-b border-green-200 hover:bg-green-100/60 transition cursor-move relative`}
                                >
                                    <div className="px-2 text-sm">{p.id}</div>
                                    <div className="px-2 flex items-center justify-between">
                                        <div>
                                            {editingFor === p.id ? (
                                                <input value={editingNameValue}
                                                       onChange={e => setEditingNameValue(e.target.value)}
                                                       className="border px-2 py-1 rounded w-64"/>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{p.name}</span>
                                                    <span className="text-xs text-slate-400">...</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400">{p.participants.length} members</div>
                                    </div>
                                    <div className="px-2 text-right relative">
                                        <button onClick={() => setMenuOpenFor(menuOpenFor === p.id ? null : p.id)}
                                                className="px-2 py-1 rounded hover:bg-green-100">
                                            ⋯
                                        </button>

                                        {menuOpenFor === p.id && (
                                            <div
                                                className={`absolute right-0 w-40 bg-white border rounded shadow-md z-20 ${shouldOpenUpwards(idx)
                                                    ? 'bottom-full mb-1'
                                                    : 'top-full mt-1'
                                                }`}>
                                                <button onClick={() => openProject(p.id)}
                                                        className="w-full text-left px-3 py-2 hover:bg-green-50">Open
                                                </button>
                                                <button onClick={() => openEditName(p.id)}
                                                        className="w-full text-left px-3 py-2 hover:bg-green-50">Edit
                                                    name
                                                </button>
                                                <button onClick={() => openParticipants(p.id)}
                                                        className="w-full text-left px-3 py-2 hover:bg-green-50">Add
                                                    participants
                                                </button>
                                                <button onClick={() => deleteProject(p.id)}
                                                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50">Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* If editing name, show save/cancel */}
                        {editingFor && (
                            <div className="mt-3 flex gap-2">
                                <button onClick={saveEditName}
                                        className="px-3 py-1 bg-green-600 text-white rounded">Save
                                </button>
                                <button onClick={() => {
                                    setEditingFor(null);
                                    setEditingNameValue('');
                                }} className="px-3 py-1 border rounded">Cancel
                                </button>
                            </div>
                        )}

                        {/* Add + button */}
                        <div className="mt-4">
                            <button onClick={addProject} className="px-3 py-2 bg-green-700 text-white rounded">+ Add
                                project
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Participants modal - FIXED: modal is not darkened */}
            {participantsModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop - only darkens the background, not the modal */}
                    <div
                        className="absolute inset-0 bg-black opacity-40"
                        onClick={() => setParticipantsModal({open: false, projectId: null})}
                    />
                    {/* Modal content - has higher z-index and is not affected by backdrop */}
                    <div className="relative bg-white rounded-lg shadow-lg w-96 p-6 z-60">
                        <h3 className="text-lg font-medium text-green-700">Project {participantsModal.projectId} —
                            Participants</h3>
                        <div className="mt-4">
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {getParticipants().map(uid => (
                                    <li key={uid}
                                        className="flex items-center justify-between border rounded px-3 py-2">
                                        <div>{uid}</div>
                                        <button onClick={() => removeParticipant(participantsModal.projectId, uid)}
                                                className="text-red-600 text-sm">Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 flex gap-2">
                                <input
                                    placeholder="participant id"
                                    value={newParticipantId}
                                    onChange={e => setNewParticipantId(e.target.value)}
                                    className="flex-1 border rounded px-2 py-1"
                                />
                                <button onClick={addParticipantToProject}
                                        className="px-3 py-1 bg-green-600 text-white rounded">Add
                                </button>
                            </div>

                            <div className="mt-4 text-right">
                                <button onClick={() => setParticipantsModal({open: false, projectId: null})}
                                        className="px-3 py-1 border rounded">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}