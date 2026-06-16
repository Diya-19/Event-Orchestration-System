import { Plane, Building, Bus, Wallet, Calendar, AlertCircle, Bell, Info, ChevronRight } from "lucide-react";

export default function TravelDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">Travel Dashboard</h1>

      {/* Welcome Banner & Trip Summary */}
      <div className="grid grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-6">
          <div className="w-32 h-32 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Plane className="text-purple-600" size={56} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Hello, Rahul! </h2>
            <p className="text-gray-600 mt-2 text-sm">We're here to make your trip smooth and stress-free.</p>
            <h3 className="text-lg font-bold text-purple-700 mt-3">HackFlow 2026</h3>
            <p className="text-gray-600 text-sm mt-1">Have a great experience!</p>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Trip Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Arrival</p>
              <p className="font-bold text-gray-900">21 Jun, 11:45 AM</p>
              <p className="text-gray-600 mt-1">BLR Airport, T1</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Departure</p>
              <p className="font-bold text-gray-900">24 Jun, 03:30 PM</p>
              <p className="text-gray-600 mt-1">BLR Airport, T1</p>
            </div>
          </div>
          <button className="w-full mt-4 py-2 text-purple-700 font-medium bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center justify-center gap-2 text-sm">
            View Full Itinerary
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Plane className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Flight Status</p>
              <p className="text-xs text-gray-600">IndiGo 6E-2134</p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            On Time
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Building className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Hotel Check-in</p>
              <p className="text-xs text-gray-600">21 Jun, 02:00 PM</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">The Leela Palace, Bangalore</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Bus className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Shuttle Pickup</p>
              <p className="text-xs text-gray-600">21 Jun, 12:30 PM</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">BLR Airport, T1 - Gate 4</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Wallet className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Reimbursement</p>
              <p className="text-xs text-gray-600">Approved Budget</p>
            </div>
          </div>
          <p className="text-lg font-bold text-purple-700">₹35,000 INR</p>
        </div>
      </div>

      {/* Itinerary & Notifications */}
      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Itinerary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Upcoming Itinerary</h3>
            <button className="text-purple-700 text-sm font-medium hover:text-purple-800 flex items-center gap-1">
              View Full Itinerary
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex flex-col items-center justify-center text-purple-700">
                <span className="text-lg font-bold">21</span>
                <span className="text-xs font-medium">JUN</span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
            </div>
            <div className="flex-1 space-y-4 pt-1">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">12:00 PM</p>
                  <p className="text-sm font-medium text-gray-900">Hotel Check-in</p>
                  <p className="text-xs text-gray-600">The Leela Palace, Bangalore</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bus className="text-green-600" size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">12:30 PM</p>
                  <p className="text-sm font-medium text-gray-900">Airport Pickup</p>
                  <p className="text-xs text-gray-600">Kempegowda International Airport</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Important Notifications</h3>
            <button className="text-purple-700 text-sm font-medium hover:text-purple-800">View All</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Bell className="text-purple-600" size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Shuttle #2 leaving in 10 mins</p>
                    <p className="text-xs text-gray-600 mt-1">Please be in the lobby by 12:20 PM.</p>
                  </div>
                  <span className="text-xs text-gray-500">10:00 AM</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Info className="text-blue-600" size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Don't forget to submit travel docs</p>
                    <p className="text-xs text-gray-600 mt-1">for reimbursement.</p>
                  </div>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Alert */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3">
        <AlertCircle className="text-purple-600" size={20} />
        <p className="text-sm text-purple-800">
          Please be at the pickup point 10 minutes before the scheduled time.
        </p>
      </div>
    </div>
  );
}