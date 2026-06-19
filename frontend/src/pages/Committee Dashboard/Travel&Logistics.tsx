import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';

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

// --- Mock Data parsed from image_8e420b.jpg ---
const mockTeamsData: TeamLogistics[] = [
  {
    id: '1',
    teamId: 'TA-1001',
    teamName: 'Team Alpha',
    representative: 'Rahul Sharma',
    travelStatus: 'Submitted',
    hotelStatus: 'Assigned',
    reimbursementStatus: 'Pending',
    membersCount: 4,
    travelDetails: {
      mode: 'Flight',
      airline: 'IndiGo',
      flightNo: '6E 5214',
      from: 'Bangalore (BLR)',
      to: 'Mumbai (BOM)',
      arrival: '20 Jun 2026, 10:25 AM',
      pnr: '6E123ABC',
      ticketFile: 'ticket_alpha.pdf'
    },
    eventSchedule: [
      { date: '20 Jun 2026', label: 'Team Check-in', time: '10:00 AM' },
      { date: '21 Jun 2026', label: 'Hackathon Day 1', time: '09:00 AM' },
      { date: '22 Jun 2026', label: 'Hackathon Day 2', time: '09:00 AM' },
      { date: '23 Jun 2026', label: 'Finale & Prize Distribution', time: '04:00 PM' },
    ],
    hotelDetails: {
      assigned: true,
      name: 'Radisson Blu',
      roomType: 'Deluxe Twin',
      checkIn: '20 Jun 2026, 02:00 PM',
      checkOut: '23 Jun 2026, 11:00 AM',
      rooms: 2,
      roomNumbers: '402, 403'
    },
    participants: [
      { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', role: 'Team Lead' },
      { name: 'Anita Mehta', email: 'anita.mehta@example.com', role: 'Member' },
      { name: 'Vivek Kumar', email: 'vivek.kumar@example.com', role: 'Member' },
      { name: 'Siddharth Jain', email: 'siddharth.jain@example.com', role: 'Member' },
    ],
    reimbursementDetails: {
      amount: '₹ 4,500',
      submittedOn: '19 Jun 2026',
      file: 'reimbursement_alpha.pdf'
    }
  },
  { id: '2', teamId: 'TV-1002', teamName: 'Team Vega', representative: 'Anita Mehta', travelStatus: 'Under Review', hotelStatus: 'Assigned', reimbursementStatus: 'Pending', membersCount: 3 },
  { id: '3', teamId: 'TBB-1003', teamName: 'Team ByteBuilders', representative: 'Dev Kumar', travelStatus: 'Approved', hotelStatus: 'Assigned', reimbursementStatus: 'Approved', membersCount: 4 },
  { id: '4', teamId: 'TN-1004', teamName: 'Team Nova', representative: 'Neha Patel', travelStatus: 'Submitted', hotelStatus: 'Not Assigned', reimbursementStatus: 'Pending', membersCount: 3 },
  { id: '5', teamId: 'TF-1005', teamName: 'Team Frontend', representative: 'Arjun Yadav', travelStatus: 'Approved', hotelStatus: 'Assigned', reimbursementStatus: 'Pending', membersCount: 4 },
  { id: '6', teamId: 'TCC-1006', teamName: 'Team CodeCrafters', representative: 'Vivek Sinha', travelStatus: 'Not Submitted', hotelStatus: 'Not Assigned', reimbursementStatus: 'Not Submitted', membersCount: 3 },
  { id: '7', teamId: 'TIX-1007', teamName: 'Team InnovateX', representative: 'Kavya Bhat', travelStatus: 'Submitted', hotelStatus: 'Not Assigned', reimbursementStatus: 'Not Submitted', membersCount: 4 },
  { id: '8', teamId: 'TDB-1008', teamName: 'Team Debuggers', representative: 'Riya Singh', travelStatus: 'Under Review', hotelStatus: 'Assigned', reimbursementStatus: 'Pending', membersCount: 3 }
];

export default function TravelLogisticsManagement() {
  const [selectedTeam, setSelectedTeam] = useState<TeamLogistics | null>(mockTeamsData[0]);

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

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-800 antialiased">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* --- LEFT SECTION: Dashboard Content Area --- */}
        <div className="flex-1 min-w-0">
          
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
                <span className="text-xl font-bold text-slate-900 block leading-none">25</span>
                <span className="text-xs font-semibold text-slate-800 block mt-1">Total Qualified</span>
                <span className="text-[10px] text-slate-400 block">Teams Round 3</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Plane className="w-5 h-5" /></div>
              <div>
                <span className="text-xl font-bold text-slate-900 block leading-none">18</span>
                <span className="text-xs font-semibold text-slate-800 block mt-1">Travel Forms</span>
                <span className="text-[10px] text-slate-400 block">72% of total teams</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Hotel className="w-5 h-5" /></div>
              <div>
                <span className="text-xl font-bold text-slate-900 block leading-none">14</span>
                <span className="text-xs font-semibold text-slate-800 block mt-1">Hotel Assigned</span>
                <span className="text-[10px] text-slate-400 block">56% of total teams</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Wallet className="w-5 h-5" /></div>
              <div>
                <span className="text-xl font-bold text-slate-900 block leading-none">6</span>
                <span className="text-xs font-semibold text-slate-800 block mt-1">Reimbursement</span>
                <span className="text-[10px] text-slate-400 block">24% of total teams</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
              <div>
                <span className="text-xl font-bold text-slate-900 block leading-none">12</span>
                <span className="text-xs font-semibold text-slate-800 block mt-1">Checked In</span>
                <span className="text-[10px] text-slate-400 block">48% of total teams</span>
              </div>
            </div>
          </div>

          {/* Filtering Control Bar */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search team name..." 
                  className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <select className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 outline-none">
                <option>All Travel Status</option>
              </select>

              <select className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 outline-none">
                <option>All Hotel Status</option>
              </select>

              <select className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 outline-none">
                <option>All Reimbursement Status</option>
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
                  {mockTeamsData.map((team) => (
                    <tr 
                      key={team.id} 
                      onClick={() => team.travelDetails && setSelectedTeam(team)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedTeam?.id === team.id ? 'bg-purple-50/20' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-none">{team.teamName}</span>
                            <span className="text-xs font-normal text-slate-400 block mt-1">{team.representative}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getTravelStatusStyles(team.travelStatus)}`}>
                          {team.travelStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getHotelStatusStyles(team.hotelStatus)}`}>
                          {team.hotelStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${getReimbursementStyles(team.reimbursementStatus)}`}>
                          {team.reimbursementStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-900 font-bold">{team.membersCount}</td>
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 border border-slate-100 rounded-md hover:bg-slate-100 text-slate-400 hover:text-purple-600" onClick={() => team.travelDetails && setSelectedTeam(team)}>
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
              <span>Showing 1 to 8 of 25 teams</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 font-semibold">Previous</button>
                <button className="w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center font-bold text-xs">1</button>
                <button className="w-6 h-6 border border-slate-200 hover:bg-slate-50 rounded flex items-center justify-center text-slate-600">2</button>
                <button className="w-6 h-6 border border-slate-200 hover:bg-slate-50 rounded flex items-center justify-center text-slate-600">3</button>
                <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 font-semibold">Next &gt;</button>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION: Team Logistics Side Drawer Drawer --- */}
        <div className="w-full lg:w-[420px] bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden shrink-0 self-start sticky top-6">
          {selectedTeam ? (
            <div>
              {/* Drawer Top Branding Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">{selectedTeam.teamName}</h3>
                    <span className="text-[11px] font-semibold text-slate-400 block mt-1">Team ID: {selectedTeam.teamId}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Accordion Panels Layout Container */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
                
                {/* 1. Travel Details Section */}
                {selectedTeam.travelDetails && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <button onClick={() => toggleSection('travel')} className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50/50 uppercase tracking-wide border-b border-slate-100">
                      <span className="flex items-center gap-2"><Plane className="w-3.5 h-3.5 text-purple-600" /> Travel Details</span>
                      {openSections.travel ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openSections.travel && (
                      <div className="p-3 grid grid-cols-3 gap-y-3 gap-x-2 text-xs">
                        <div><span className="text-slate-400 block mb-0.5">Travel Mode</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.mode}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Airline</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.airline}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Flight No.</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.flightNo}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">From</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.from}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">To</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.to}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Arrival</span><span className="font-bold text-slate-800 block whitespace-nowrap">{selectedTeam.travelDetails.arrival}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">PNR</span><span className="font-bold text-slate-800">{selectedTeam.travelDetails.pnr}</span></div>
                        <div className="col-span-2">
                          <span className="text-slate-400 block mb-1">Ticket</span>
                          <div className="flex items-center justify-between px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold text-slate-700">
                            <span className="truncate max-w-[120px] flex items-center gap-1"><span className="text-rose-500 font-extrabold text-[10px]">PDF</span> {selectedTeam.travelDetails.ticketFile}</span>
                            <button className="text-slate-400 hover:text-purple-600"><Download className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Event Schedule Timeline Section */}
                {selectedTeam.eventSchedule && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <button onClick={() => toggleSection('schedule')} className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50/50 uppercase tracking-wide border-b border-slate-100">
                      <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-purple-600" /> Event Schedule</span>
                      {openSections.schedule ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openSections.schedule && (
                      <div className="p-3 space-y-3">
                        {selectedTeam.eventSchedule.map((evt, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 block" />
                              <span className="text-slate-400 font-semibold w-18">{evt.date}</span>
                              <span className="font-bold text-slate-700">{evt.label}</span>
                            </div>
                            <span className="text-slate-500 font-bold">{evt.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Hotel Details Section */}
                {selectedTeam.hotelDetails && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <button onClick={() => toggleSection('hotel')} className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50/50 uppercase tracking-wide border-b border-slate-100">
                      <span className="flex items-center gap-2"><Hotel className="w-3.5 h-3.5 text-purple-600" /> Hotel Details</span>
                      {openSections.hotel ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openSections.hotel && (
                      <div className="p-3 grid grid-cols-3 gap-y-3 gap-x-2 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Hotel Assigned</span>
                          <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100">Yes</span>
                        </div>
                        <div><span className="text-slate-400 block mb-0.5">Hotel Name</span><span className="font-bold text-slate-800">{selectedTeam.hotelDetails.name}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Room Type</span><span className="font-bold text-slate-800 whitespace-nowrap">{selectedTeam.hotelDetails.roomType}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Check-in</span><span className="font-bold text-slate-700 whitespace-nowrap">{selectedTeam.hotelDetails.checkIn.split(',')[0]}</span><span className="text-[10px] block text-slate-400">{selectedTeam.hotelDetails.checkIn.split(',')[1]}</span></div>
                        <div><span className="text-slate-400 block mb-0.5">Check-out</span><span className="font-bold text-slate-700 whitespace-nowrap">{selectedTeam.hotelDetails.checkOut.split(',')[0]}</span><span className="text-[10px] block text-slate-400">{selectedTeam.hotelDetails.checkOut.split(',')[1]}</span></div>
                        <div className="grid grid-cols-2 gap-1">
                          <div><span className="text-slate-400 block mb-0.5">Rooms</span><span className="font-bold text-slate-800">{selectedTeam.hotelDetails.rooms}</span></div>
                          <div><span className="text-slate-400 block mb-0.5">Room Numbers</span><span className="font-bold text-slate-800 whitespace-nowrap">{selectedTeam.hotelDetails.roomNumbers}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Participants List Feed */}
                {selectedTeam.participants && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <button onClick={() => toggleSection('participants')} className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50/50 uppercase tracking-wide border-b border-slate-100">
                      <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-purple-600" /> Participants <span className="text-slate-400 font-normal">({selectedTeam.participants.length})</span></span>
                      {openSections.participants ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openSections.participants && (
                      <div className="p-2 space-y-1">
                        {selectedTeam.participants.map((user, idx) => (
                          <div key={idx} className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-md transition-colors text-xs">
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
                )}

                {/* 5. Reimbursement Details Section */}
                {selectedTeam.reimbursementDetails && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <button onClick={() => toggleSection('reimbursement')} className="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-900 bg-slate-50/50 uppercase tracking-wide border-b border-slate-100">
                      <span className="flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-purple-600" /> Reimbursement Details</span>
                      {openSections.reimbursement ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openSections.reimbursement && (
                      <div className="p-3 space-y-3 text-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Status</span>
                            <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-orange-50 text-orange-600 border border-orange-100">Pending</span>
                          </div>
                          <div><span className="text-slate-400 block mb-0.5">Amount (INR)</span><span className="font-bold text-slate-900">{selectedTeam.reimbursementDetails.amount}</span></div>
                          <div><span className="text-slate-400 block mb-0.5">Submitted On</span><span className="font-bold text-slate-700 whitespace-nowrap">{selectedTeam.reimbursementDetails.submittedOn}</span></div>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-1">Reimbursement File</span>
                          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-semibold text-slate-700">
                            <span className="truncate flex items-center gap-1"><span className="text-rose-500 font-extrabold text-[10px]">PDF</span> {selectedTeam.reimbursementDetails.file}</span>
                            <button className="text-slate-400 hover:text-purple-600"><Download className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Action Buttons Footer Row */}
              <div className="p-4 border-t border-slate-100 flex items-center gap-2 bg-slate-50/30">
                <button className="px-3 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors whitespace-nowrap">
                  Assign Hotel
                </button>
                <button className="flex-1 px-3 py-2 bg-purple-600 text-white font-semibold rounded-lg text-xs hover:bg-purple-700 transition-colors shadow-sm shadow-purple-600/10 whitespace-nowrap">
                  Approve Reimbursement
                </button>
                <button className="px-3 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-colors whitespace-nowrap">
                  View / Edit Details
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              Select a team from the dashboard table to inspect live travel details and administrative itineraries.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}