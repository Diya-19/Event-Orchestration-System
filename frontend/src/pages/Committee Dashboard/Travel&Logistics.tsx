import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Users,
  Plane,
  Hotel,
  Wallet,
  CheckCircle,
  Eye,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Download,
  X,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import { api } from '../../lib/api';
import { useSearchParams } from 'react-router-dom';
// --- Type Definitions ---
interface TeamLogistics {
  id: string;
  teamId: string;
  teamName: string;
  representative: string;
  travelStatus: 'Submitted' | 'Under Review' | 'Approved' | 'Not Submitted';
  hotelStatus: 'Assigned' | 'Not Assigned';
  reimbursementStatus: 'Pending' | 'Approved' | 'Not Submitted';
  membersCount: number;

  // Detailed metadata for right panel drawer
  travelDetails?: {
    mode: string;
    airline: string;
    flightNo: string;
    from: string;
    to: string;
    arrival: string;
    pnr: string;
    ticketFile: string;
  };
  eventSchedule?: Array<{ date: string; label: string; time: string }>;
  hotelDetails?: {
    assigned: boolean;
    name: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    roomNumbers: string;
  };
  participants?: Array<{ name: string; email: string; role: 'Team Lead' | 'Member' }>;
  reimbursementDetails?: {
    amount: string;
    submittedOn: string;
    file: string;
  };
}

export default function TravelLogisticsManagement() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  const [teams, setTeams] = useState<any[]>([]);
  const totalTeams = teams.length;
  const [searchTerm, setSearchTerm] = useState("");
  const [travelFilter, setTravelFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");
  const [reimbursementFilter, setReimbursementFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 8;

  const travelForms = teams.filter(
    (t) => t.travel_status !== "Not Submitted"
  ).length;

  const hotelsAssigned = teams.filter(
    (t) => t.hotel_status === "Assigned"
  ).length;

  const reimbursements = teams.filter(
    (t) => t.reimbursement_status !== "Not Submitted"
  ).length;

  const checkedIn = teams.filter(
    (t) => t.travel_status === "Completed"
  ).length;

  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);
  const [rightPanelView, setRightPanelView] = useState<"teamSummary" | "participantDetails" | "assignHotel">("teamSummary");

  useEffect(() => {
    const fetchTeams = async () => {
      if (!eventId) {
        setTeams([]);
        return;
      }
      try {
        const res = await api.get(`/api/travel-logistics/?event_id=${eventId}`);
        const data = res.data;
        const uniqueTeams = data.filter((team: any, index: number, self: any[]) => 
          index === self.findIndex((t) => (t.team_id || t.id) === (team.team_id || team.id) || (t.team_name || t.teamName) === (team.team_name || team.teamName))
        );
        const sortedData = [...uniqueTeams].sort((a: any, b: any) => {
          const nameA = a.team_name || a.teamName || "";
          const nameB = b.team_name || b.teamName || "";
          return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
        });
        setTeams(sortedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeams();
  }, [eventId]);

  // Section visibility states for the details right panel drawer
  const [openSections, setOpenSections] = useState({
    travel: true,
    schedule: true,
    hotel: true,
    participants: true,
    reimbursement: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  const fetchTeamDetails = async (teamId: string) => {
    try {
      const res = await api.get(`/api/travel-logistics/${teamId}`);
      const data = res.data;

      setSelectedTeam(data);
      setRightPanelView("teamSummary");
      setSelectedParticipant(null);
      setOpenSections({
        travel: true,
        schedule: true,
        hotel: true,
        participants: true,
        reimbursement: true
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLock = async () => {
    if (!selectedTeam) return;
    const isCurrentlyLocked = selectedTeam.is_locked;
    const action = isCurrentlyLocked ? 'unlock' : 'lock';
    try {
      const res = await api.patch(`/api/travel-logistics/${selectedTeam.team_id}/${action}`);
      if (res.status === 200) {
        setSelectedTeam({ ...selectedTeam, is_locked: !isCurrentlyLocked });
        setTeams(teams.map(t => (t.team_id || t.id) === selectedTeam.team_id ? { ...t, is_locked: !isCurrentlyLocked } : t));
      }
    } catch (err) {
      console.error("Failed to toggle lock state", err);
    }
  };

  const [hotelForm, setHotelForm] = useState({
    hotel_name: '',
    hotel_address: '',
    hotel_maps_url: '',
    check_in_date: '',
    check_out_date: '',
    special_instructions: ''
  });

  const handleOpenAssignHotel = () => {
    if (!selectedTeam) return;
    if (selectedTeam.hotelDetails) {
      setHotelForm({
        hotel_name: selectedTeam.hotelDetails.name || '',
        hotel_address: selectedTeam.hotelDetails.address || '',
        hotel_maps_url: selectedTeam.hotelDetails.mapsUrl || '',
        check_in_date: selectedTeam.hotelDetails.checkIn || '',
        check_out_date: selectedTeam.hotelDetails.checkOut || '',
        special_instructions: selectedTeam.hotelDetails.specialInstructions || ''
      });
    } else {
      setHotelForm({
        hotel_name: '',
        hotel_address: '',
        hotel_maps_url: '',
        check_in_date: '',
        check_out_date: '',
        special_instructions: ''
      });
    }
    setRightPanelView("assignHotel");
  };

  const submitHotelAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    try {
      const res = await api.patch(`/api/travel-logistics/${selectedTeam.team_id}/hotel`, hotelForm);
      if (res.status === 200) {
        setRightPanelView("teamSummary");
        fetchTeamDetails(selectedTeam.team_id);
      }
    } catch (err) {
      console.error("Failed to assign hotel", err);
    }
  };

  const [isEditingOrganizer, setIsEditingOrganizer] = useState(false);
  const [organizerForm, setOrganizerForm] = useState({
    participant_notes: '',
    travelCoordinator: { name: '', phone: '', whatsapp: '', email: '' },
    eventSchedule: [] as any[]
  });

  const handleOpenEditOrganizer = () => {
    if (!selectedTeam) return;
    setOrganizerForm({
      participant_notes: selectedTeam.participant_notes || '',
      travelCoordinator: selectedTeam.travelCoordinator || { name: '', phone: '', whatsapp: '', email: '' },
      eventSchedule: Array.isArray(selectedTeam.eventSchedule) ? selectedTeam.eventSchedule : []
    });
    setIsEditingOrganizer(true);
  };

  const submitOrganizerInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    try {
      const res = await api.put(`/api/travel-logistics/${selectedTeam.team_id}/organizer`, organizerForm);
      if (res.status === 200) {
        setIsEditingOrganizer(false);
        fetchTeamDetails(selectedTeam.team_id);
      }
    } catch (err) {
      console.error("Failed to update organizer info", err);
    }
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const updated = [...(Array.isArray(organizerForm?.eventSchedule) ? organizerForm.eventSchedule : [])];
    updated[index] = { ...updated[index], [field]: value };
    setOrganizerForm({ ...organizerForm, eventSchedule: updated });
  };

  const addScheduleItem = () => {
    setOrganizerForm({
      ...organizerForm,
      eventSchedule: [...(Array.isArray(organizerForm?.eventSchedule) ? organizerForm.eventSchedule : []), { date: '', label: '', time: '' }]
    });
  };

  const removeScheduleItem = (index: number) => {
    const updated = [...(Array.isArray(organizerForm?.eventSchedule) ? organizerForm.eventSchedule : [])];
    updated.splice(index, 1);
    setOrganizerForm({ ...organizerForm, eventSchedule: updated });
  };

  // Badge Color Mappers
  const getTravelStatusStyles = (status: TeamLogistics['travelStatus']) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Under Review': return 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Not Submitted': return 'bg-slate-50 text-slate-500 border border-slate-200';
    }
  };

  const getHotelStatusStyles = (status: TeamLogistics['hotelStatus']) => {
    return status === 'Assigned'
      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      : 'bg-rose-50 text-rose-600 border border-rose-100';
  };

  const getReimbursementStyles = (status: TeamLogistics['reimbursementStatus']) => {
    switch (status) {
      case 'Pending': return 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Not Submitted': return 'bg-slate-50 text-slate-500 border border-slate-200';
    }
  };

  const filteredTeams = teams.filter((team) => {
  const searchMatch =
    team.team_name?.toLowerCase().includes(
      searchTerm.toLowerCase()
    );

  const travelMatch =
    travelFilter === "All" ||
    team.travel_status === travelFilter;

  const hotelMatch =
    hotelFilter === "All" ||
    team.hotel_status === hotelFilter;

  const reimbursementMatch =
    reimbursementFilter === "All" ||
    team.reimbursement_status === reimbursementFilter;
  
  return (
    searchMatch &&
    travelMatch &&
    hotelMatch &&
    reimbursementMatch
  );
});

  const indexOfLastTeam = currentPage * teamsPerPage;

  const indexOfFirstTeam =
    indexOfLastTeam - teamsPerPage;

  const currentTeams =
    filteredTeams.slice(
      indexOfFirstTeam,
      indexOfLastTeam
    );

  const totalPages = Math.ceil(
    filteredTeams.length / teamsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800 antialiased">
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Travel & Logistics Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage travel details, hotel accommodations, event schedule and reimbursement for all teams</p>
      </div>

      {/* Metrics Summary Grid Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-5 h-5" /></div>
          <div>
            <span className="text-xl font-bold text-slate-900 block leading-none">{totalTeams}</span>
            <span className="text-xs font-semibold text-slate-800 block mt-1">Total Qualified</span>
            <span className="text-[10px] text-slate-400 block">Teams Round 3</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Plane className="w-5 h-5" /></div>
          <div>
            <span className="text-xl font-bold text-slate-900 block leading-none">{travelForms}</span>
            <span className="text-xs font-semibold text-slate-800 block mt-1">Travel Forms</span>
            <span className="text-[10px] text-slate-400 block">72% of total teams</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Hotel className="w-5 h-5" /></div>
          <div>
            <span className="text-xl font-bold text-slate-900 block leading-none">{hotelsAssigned}</span>
            <span className="text-xs font-semibold text-slate-800 block mt-1">Hotel Assigned</span>
            <span className="text-[10px] text-slate-400 block">56% of total teams</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Wallet className="w-5 h-5" /></div>
          <div>
            <span className="text-xl font-bold text-slate-900 block leading-none">{reimbursements}</span>
            <span className="text-xs font-semibold text-slate-800 block mt-1">Reimbursement</span>
            <span className="text-[10px] text-slate-400 block">24% of total teams</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
          <div>
            <span className="text-xl font-bold text-slate-900 block leading-none">{checkedIn}</span>
            <span className="text-xs font-semibold text-slate-800 block mt-1">Checked In</span>
            <span className="text-[10px] text-slate-400 block">48% of total teams</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        {/* --- LEFT SECTION: Dashboard Content Area --- */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input type="text" placeholder="Search team name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"/>
              </div>

              <select
              value={travelFilter}
              onChange={(e) => setTravelFilter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 outline-none"
            >
              <option value="All">All Travel Status</option>
              <option value="Not Submitted">Not Submitted</option>
              <option value="Submitted">Submitted</option>
              <option value="Completed">Completed</option>
             </select>

              <select
              value={hotelFilter}
              onChange={(e) => setHotelFilter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 outline-none"
            >
              <option value="All">All Hotel Status</option>
              <option value="Assigned">Assigned</option>
              <option value="Not Assigned">Not Assigned</option>
              </select>

              <select
              value={reimbursementFilter}
              onChange={(e) => setReimbursementFilter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 outline-none"
            >
              <option value="All">All Reimbursement Status</option>
              <option value="Not Submitted">Not Submitted</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              </select>

              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </button>
            </div>

            {/* Main Table Interface */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50/70">
                    <th className="py-3 px-4">Team / Representative</th>
                    <th className="py-3 px-4">Travel Status</th>
                    <th className="py-3 px-4">Hotel Status</th>
                    <th className="py-3 px-4">Reimbursement</th>
                    <th className="py-3 px-4 text-center">Members</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {currentTeams.map((team) => (
                    <tr
                      key={team.team_id || team.id}
                      onClick={() => fetchTeamDetails(team.team_id || team.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${(selectedTeam?.team_id || selectedTeam?.id) === (team.team_id || team.id) ? 'bg-purple-50/20' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-none">{team.team_name}</span>
                            <span className="text-xs font-normal text-slate-400 block mt-1">{team.representative}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getTravelStatusStyles(team.travel_status)}`}>
                          {team.travel_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getHotelStatusStyles(team.hotel_status)}`}>
                          {team.hotel_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getReimbursementStyles(team.reimbursement_status)}`}>
                          {team.reimbursement_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-900 font-bold">{team.members_count}</td>
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 border border-slate-100 rounded-md hover:bg-slate-100 text-slate-400 hover:text-purple-600" onClick={() => fetchTeamDetails(team.team_id)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 border border-slate-100 rounded-md hover:bg-slate-100 text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Showing {indexOfFirstTeam + 1} to{" "} {Math.min(indexOfLastTeam, filteredTeams.length)} of{" "} {filteredTeams.length} teams</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.max(p - 1, 1))
                  }
                  className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 font-semibold"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${ currentPage === i + 1 ? "bg-purple-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50" }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(p + 1, totalPages)
                    )
                  }
                  className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 font-semibold"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>

        {/* --- RIGHT SECTION: Team Logistics Side Drawer Drawer --- */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {selectedTeam ? (
            <div className="flex flex-col flex-1">
              {/* Drawer Top Branding Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">{selectedTeam.team_name || selectedTeam.teamName}</h3>
                    <span className="text-[11px] font-semibold text-slate-400 block mt-1">Team ID: {selectedTeam.team_id || selectedTeam.teamId}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* View Rendering */}
              {rightPanelView === "teamSummary" && (
                <div className="flex flex-col">
                  {/* Accordion Panels Layout Container */}
                  <div className="p-4 space-y-4">



                    {/* 3. Hotel Details Section */}
                    <div className="border border-slate-100 rounded-lg overflow-hidden flex flex-col">
                      <button onClick={() => toggleSection('hotel')} className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50/50 uppercase tracking-wide border-b border-slate-100 shrink-0">
                        <span className="flex items-center gap-2"><Hotel className="w-3.5 h-3.5 text-purple-600" /> Hotel Details</span>
                        {openSections.hotel ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {openSections.hotel && (
                        (!selectedTeam.hotelDetails?.assigned || selectedTeam.hotel_status === 'Not Assigned') ? (
                          <div className="p-10 flex flex-col items-center justify-center bg-slate-50/50">
                            <span className="text-sm font-bold text-slate-500">Hotel Status: Not Assigned</span>
                          </div>
                        ) : (
                          <div className="p-6 grid grid-cols-2 gap-y-5 gap-x-4 text-xs">
                            <div className="col-span-2"><span className="text-slate-400 block mb-1">Hotel Name</span><span className="font-bold text-slate-800 text-sm">{selectedTeam.hotelDetails.name || selectedTeam.hotelDetails.hotelName || "-"}</span></div>
                            <div className="col-span-2"><span className="text-slate-400 block mb-1">Address / Maps Link</span><span className="font-bold text-blue-600 truncate block text-sm">{selectedTeam.hotelDetails.mapsUrl || selectedTeam.hotelDetails.address || "-"}</span></div>
                            <div>
                              <span className="text-slate-400 block mb-1">Check-in</span>
                              <span className="font-bold text-slate-700 whitespace-nowrap text-sm block">{selectedTeam.hotelDetails.checkIn?.split(",")[0] || "-"}</span>
                              <span className="text-[11px] block text-slate-400 mt-0.5">{selectedTeam.hotelDetails.checkIn?.split(",")[1] || ""}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Check-out</span>
                              <span className="font-bold text-slate-700 whitespace-nowrap text-sm block">{selectedTeam.hotelDetails.checkOut?.split(",")[0] || "-"}</span>
                              <span className="text-[11px] block text-slate-400 mt-0.5">{selectedTeam.hotelDetails.checkOut?.split(",")[1] || ""}</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    {selectedTeam.participants && (() => {
                        console.log("selectedTeam.team_name:", selectedTeam.team_name);
                        console.log("selectedTeam.participants:", selectedTeam.participants);
                        return (
                          <div className="border border-slate-100 rounded-lg overflow-hidden">
                        <button onClick={() => toggleSection('participants')} className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50/50 uppercase tracking-wide border-b border-slate-100">
                          <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-purple-600" /> Participants <span className="text-slate-400 font-normal">({selectedTeam.participants.length})</span></span>
                          {openSections.participants ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        {openSections.participants && (
                          <div className="p-2 space-y-1">
                            {selectedTeam.participants.map((user: any, idx: number) => (
                              <div 
                                key={idx} 
                                onClick={() => {
                                  setSelectedParticipant(user);
                                  setRightPanelView("participantDetails");
                                }}
                                className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-md transition-colors text-xs cursor-pointer border border-transparent hover:border-slate-200"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-800 block truncate leading-none">{user.name}</span>
                                    <span className="text-[10px] font-normal text-slate-400 block mt-0.5 truncate">{user.email}</span>
                                  </div>
                                </div>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${user.role === 'Team Lead' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {user.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                    })()}



                  </div>

                  {/* Action Buttons Footer Row */}
                  <div className="px-4 pb-4 flex items-center gap-2 w-full shrink-0">
                    <button onClick={handleOpenAssignHotel} className="flex-1 px-3 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors whitespace-nowrap text-center">
                      Assign Hotel
                    </button>
                    <button className="flex-1 px-3 py-2 bg-purple-600 text-white font-semibold rounded-lg text-xs hover:bg-purple-700 transition-colors shadow-sm shadow-purple-600/10 whitespace-nowrap text-center">
                      Approve Reimbursement
                    </button>
                    <button onClick={handleToggleLock} className="flex-1 px-3 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors whitespace-nowrap text-center">
                      {selectedTeam.is_locked ? "Unlock" : "Lock"}
                    </button>
                  </div>
                </div>
              )}

              {/* View: Participant Details */}
              {rightPanelView === "participantDetails" && selectedParticipant && (
                <div className="flex flex-col flex-1 min-h-0 bg-slate-50/30">
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
                    <button onClick={() => setRightPanelView("teamSummary")} className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600">
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none">{selectedParticipant.name}</h4>
                      <span className="text-xs text-slate-500 block mt-1">{selectedParticipant.role} &middot; {selectedParticipant.email}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 overflow-y-auto space-y-6">
                    {/* Travel Details & Preferences */}
                    <section>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Plane className="w-4 h-4 text-purple-600"/> Travel Details & Preferences</h4>
                      {(!selectedTeam?.travelDetails || selectedTeam?.travel_status === 'Not Submitted') ? (
                        <div className="p-4 text-center bg-white rounded-lg border border-slate-100 shadow-sm">
                          <span className="text-xs font-bold text-slate-500">Status: Not Submitted</span>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-3 border border-slate-100 grid grid-cols-2 gap-y-4 gap-x-4 text-xs shadow-sm">
                          <div><span className="text-slate-400 block mb-1">Travel Mode</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.mode || "-"}</span></div>
                          <div><span className="text-slate-400 block mb-1">PNR</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.pnr || "-"}</span></div>
                          <div><span className="text-slate-400 block mb-1">Departure (From)</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.from || "-"}</span></div>
                          <div><span className="text-slate-400 block mb-1">Destination (To)</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.to || "-"}</span></div>
                          <div><span className="text-slate-400 block mb-1">Arrival Time</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.arrival || "-"}</span></div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block mb-1">Preferences</span>
                            <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                              {selectedTeam.preferences?.need_airport_to_hotel_cab && <li>Needs Airport Cab</li>}
                              {selectedTeam.preferences?.need_accommodation && <li>Needs Accommodation</li>}
                              {selectedTeam.preferences?.self_arranged_accommodation && <li>Self-Arranged Hotel</li>}
                              {!selectedTeam.preferences?.need_airport_to_hotel_cab && !selectedTeam.preferences?.need_accommodation && !selectedTeam.preferences?.self_arranged_accommodation && <li>No specific preferences</li>}
                            </ul>
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Ticket PDF */}
                    {(!selectedTeam?.travelDetails || selectedTeam?.travel_status === 'Not Submitted') ? null : (
                      <section>
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-purple-600"/> Ticket Document</h4>
                        {selectedTeam?.travelDetails?.ticketFile ? (
                          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm">
                            <span className="truncate flex items-center gap-2"><span className="text-rose-500 font-extrabold text-xs">PDF</span> {selectedTeam.travelDetails.ticketFile}</span>
                            {selectedTeam.travelDetails.ticketUrl ? (
                              <a href={selectedTeam.travelDetails.ticketUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-purple-600 px-3 py-1.5 border border-slate-200 bg-white rounded-md flex items-center gap-2 text-xs transition-colors"><Download className="w-3.5 h-3.5" /> Download</a>
                            ) : (
                              <button disabled className="text-slate-300 px-3 py-1.5 border border-slate-100 bg-slate-50 rounded-md flex items-center gap-2 text-xs cursor-not-allowed"><Download className="w-3.5 h-3.5" /> Download</button>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">No ticket uploaded.</p>
                        )}
                      </section>
                    )}

                    {/* Reimbursement Details */}
                    <section>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Wallet className="w-4 h-4 text-purple-600"/> Reimbursement Details</h4>
                      {(!selectedTeam?.reimbursementDetails || selectedTeam?.reimbursement_status === 'Not Submitted') ? (
                        <div className="p-4 text-center bg-white rounded-lg border border-slate-100 shadow-sm">
                          <span className="text-xs font-bold text-slate-500">Reimbursement Status: Not Submitted</span>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-3 border border-slate-100 space-y-4 text-xs shadow-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-slate-400 block mb-1">Status</span><span className={`inline-flex px-2 py-0.5 rounded font-bold text-[10px] ${selectedTeam.reimbursement_status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>{selectedTeam.reimbursement_status || "Pending"}</span></div>
                            <div><span className="text-slate-400 block mb-1">Amount</span><span className="font-bold text-slate-900">{selectedTeam.reimbursementDetails.amount || "-"}</span></div>
                            <div className="col-span-2"><span className="text-slate-400 block mb-1">Account Holder</span><span className="font-bold text-slate-800">{selectedTeam.reimbursementDetails.accountHolder || "-"}</span></div>
                            <div className="col-span-2"><span className="text-slate-400 block mb-1">Bank Name</span><span className="font-bold text-slate-800">{selectedTeam.reimbursementDetails.bankName || "-"}</span></div>
                            <div><span className="text-slate-400 block mb-1">Account Number</span><span className="font-bold text-slate-800">{selectedTeam.reimbursementDetails.accountNumber || "-"}</span></div>
                            <div><span className="text-slate-400 block mb-1">IFSC Code</span><span className="font-bold text-slate-800">{selectedTeam.reimbursementDetails.ifsc || "-"}</span></div>
                          </div>
                          {selectedTeam.reimbursementDetails.file && (
                            <div className="mt-2 pt-3 border-t border-slate-100">
                              <span className="text-slate-400 block mb-1.5">Uploaded Receipt</span>
                              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-700">
                                <span className="truncate flex items-center gap-2"><span className="text-rose-500 font-extrabold text-[10px]">PDF</span> {selectedTeam.reimbursementDetails.file}</span>
                                {selectedTeam.reimbursementDetails.receiptUrl ? (
                                  <a href={selectedTeam.reimbursementDetails.receiptUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-purple-600"><Download className="w-3.5 h-3.5" /></a>
                                ) : (
                                  <button disabled className="text-slate-300 cursor-not-allowed"><Download className="w-3.5 h-3.5" /></button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              )}

              {/* View: Assign Hotel */}
              {rightPanelView === "assignHotel" && (
                <form onSubmit={submitHotelAssignment} className="flex flex-col flex-1 min-h-0 bg-slate-50/30">
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3 shrink-0">
                    <button type="button" onClick={() => setRightPanelView("teamSummary")} className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600">
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none flex items-center gap-2"><Hotel className="w-4 h-4 text-purple-600"/> Assign Hotel</h4>
                      <span className="text-xs text-slate-500 block mt-1">Configure stay details for this team</span>
                    </div>
                  </div>
                  <div className="p-4 overflow-y-auto space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hotel Name</label>
                      <input required type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all shadow-sm"
                        value={hotelForm.hotel_name} onChange={e => setHotelForm({...hotelForm, hotel_name: e.target.value})} placeholder="e.g. Radisson Blu" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hotel Address</label>
                      <input required type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all shadow-sm"
                        value={hotelForm.hotel_address} onChange={e => setHotelForm({...hotelForm, hotel_address: e.target.value})} placeholder="e.g. 123 Main St, City" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps URL</label>
                      <input required type="url" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all shadow-sm"
                        value={hotelForm.hotel_maps_url} onChange={e => setHotelForm({...hotelForm, hotel_maps_url: e.target.value})} placeholder="https://maps.google.com/..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Check-in</label>
                        <input required type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all shadow-sm"
                          value={hotelForm.check_in_date} onChange={e => setHotelForm({...hotelForm, check_in_date: e.target.value})} placeholder="20 Jun 2026, 02:00 PM" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Check-out</label>
                        <input required type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all shadow-sm"
                          value={hotelForm.check_out_date} onChange={e => setHotelForm({...hotelForm, check_out_date: e.target.value})} placeholder="23 Jun 2026, 11:00 AM" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Special Instructions</label>
                      <textarea className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all resize-none shadow-sm"
                        rows={3} value={hotelForm.special_instructions} onChange={e => setHotelForm({...hotelForm, special_instructions: e.target.value})} placeholder="Any special instructions for the hotel..." />
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                    <button type="button" onClick={() => setRightPanelView("teamSummary")} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors shadow-sm">
                      Save Assignment
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              Select a team from the dashboard table to inspect live travel details and administrative itineraries.
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM SECTION: Organizer Information --- */}
      {selectedTeam && (
        <form onSubmit={submitOrganizerInfo} className="mt-6 bg-white rounded-xl border border-slate-100 shadow-sm p-6 relative">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Organizer Information</h3>
            {!isEditingOrganizer ? (
              <button type="button" onClick={handleOpenEditOrganizer} className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setIsEditingOrganizer(false)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-start">
              <h4 className="font-bold text-slate-800 mb-2 text-sm">Important Notes</h4>
              {!isEditingOrganizer ? (
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedTeam.participant_notes || "No notes available."}</p>
              ) : (
                <textarea className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all resize-none shadow-sm"
                  rows={3} value={organizerForm?.participant_notes ?? ''} onChange={e => setOrganizerForm({...organizerForm, participant_notes: e.target.value})} placeholder="Notes visible to participants..." />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 h-full flex flex-col justify-start">
                <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><User className="w-4 h-4 text-purple-600"/> Travel Coordinator</h4>
                {!isEditingOrganizer ? (
                  selectedTeam?.travelCoordinator ? (
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-semibold inline-block w-20">Name:</span> {selectedTeam.travelCoordinator?.name || "-"}</p>
                      <p><span className="font-semibold inline-block w-20">Phone:</span> {selectedTeam.travelCoordinator?.phone || "-"}</p>
                      <p><span className="font-semibold inline-block w-20">WhatsApp:</span> {selectedTeam.travelCoordinator?.whatsapp || "-"}</p>
                      <p><span className="font-semibold inline-block w-20">Email:</span> {selectedTeam.travelCoordinator?.email || "-"}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Not Assigned</p>
                  )
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-700 w-16">Name</span><input type="text" className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 outline-none shadow-sm" value={organizerForm?.travelCoordinator?.name ?? ''} onChange={e => setOrganizerForm({...organizerForm, travelCoordinator: {...(organizerForm?.travelCoordinator || {}), name: e.target.value}})} /></div>
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-700 w-16">Phone</span><input type="text" className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 outline-none shadow-sm" value={organizerForm?.travelCoordinator?.phone ?? ''} onChange={e => setOrganizerForm({...organizerForm, travelCoordinator: {...(organizerForm?.travelCoordinator || {}), phone: e.target.value}})} /></div>
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-700 w-16">WhatsApp</span><input type="text" className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 outline-none shadow-sm" value={organizerForm?.travelCoordinator?.whatsapp ?? ''} onChange={e => setOrganizerForm({...organizerForm, travelCoordinator: {...(organizerForm?.travelCoordinator || {}), whatsapp: e.target.value}})} /></div>
                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-700 w-16">Email</span><input type="email" className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 outline-none shadow-sm" value={organizerForm?.travelCoordinator?.email ?? ''} onChange={e => setOrganizerForm({...organizerForm, travelCoordinator: {...(organizerForm?.travelCoordinator || {}), email: e.target.value}})} /></div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 h-full flex flex-col justify-start">
                <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600"/> Event Schedule</h4>
                {!isEditingOrganizer ? (
                  <div className="space-y-2 text-sm text-slate-600">
                    {Array.isArray(selectedTeam?.eventSchedule) && selectedTeam.eventSchedule.length > 0 ? (
                      selectedTeam.eventSchedule.map((ev: any, idx: number) => (
                        <p key={idx}><span className="font-semibold">{ev?.date || '-'}:</span> {ev?.label || '-'} ({ev?.time || '-'})</p>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">No schedule available.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(Array.isArray(organizerForm?.eventSchedule) ? organizerForm.eventSchedule : []).map((ev: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" placeholder="Date" className="w-20 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 outline-none shadow-sm" value={ev?.date ?? ''} onChange={e => handleScheduleChange(idx, 'date', e.target.value)} />
                        <input type="text" placeholder="Event Name" className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 outline-none shadow-sm" value={ev?.label ?? ''} onChange={e => handleScheduleChange(idx, 'label', e.target.value)} />
                        <input type="text" placeholder="Time" className="w-16 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 outline-none shadow-sm" value={ev?.time ?? ''} onChange={e => handleScheduleChange(idx, 'time', e.target.value)} />
                        <button type="button" onClick={() => removeScheduleItem(idx)} className="text-slate-400 hover:text-rose-500 transition-colors p-1"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={addScheduleItem} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2">
                      + Add Schedule Item
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}