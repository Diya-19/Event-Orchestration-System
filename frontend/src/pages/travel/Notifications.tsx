import { Bell, Bus, Calendar, Clock, AlertTriangle, Plane, Building, Wallet, Utensils, Gift, CheckCircle2, Info } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      icon: Bus,
      category: "Shuttle",
      categoryColor: "bg-blue-100 text-blue-700",
      title: "Shuttle Update",
      message: "Shuttle #2 leaving The Leela Palace for TI Office in 10 minutes.",
      time: "10:30 AM",
      date: "22 Jun 2026",
      unread: true
    },
    {
      icon: Calendar,
      category: "Itinerary",
      categoryColor: "bg-purple-100 text-purple-700",
      title: "Itinerary Update",
      message: "Round 3 Kickoff starting at 09:00 AM at TI Main Building.",
      time: "Yesterday",
      date: "21 Jun 2026",
      unread: true
    },
    {
      icon: Clock,
      category: "Reminder",
      categoryColor: "bg-yellow-100 text-yellow-700",
      title: "Reminder",
      message: "Don't forget to submit your travel documents for reimbursement.",
      time: "Yesterday",
      date: "21 Jun 2026",
      unread: true
    },
    {
      icon: Bell,
      category: "General",
      categoryColor: "bg-gray-100 text-gray-700",
      title: "General Update",
      message: "Wi-Fi will be available at TI Office and hotel for all participants.",
      time: "09:15 AM",
      date: "20 Jun 2026",
      unread: false
    },
    {
      icon: Plane,
      category: "Flight",
      categoryColor: "bg-blue-100 text-blue-700",
      title: "Flight Reminder",
      message: "Your flight IndiGo 6E-2134 is tomorrow at 11:45 AM.",
      time: "04:45 PM",
      date: "19 Jun 2026",
      unread: false
    },
    {
      icon: Building,
      category: "Hotel",
      categoryColor: "bg-purple-100 text-purple-700",
      title: "Hotel Check-in Reminder",
      message: "Hotel check-in is on 21 Jun at 02:00 PM.",
      time: "10:00 AM",
      date: "19 Jun 2026",
      unread: false
    },
    {
      icon: CheckCircle2,
      category: "Reimbursement",
      categoryColor: "bg-green-100 text-green-700",
      title: "Reimbursement Approved",
      message: "Your reimbursement request #RMB-2026-021 has been approved.",
      time: "06:20 PM",
      date: "18 Jun 2026",
      unread: false
    },
    {
      icon: Utensils,
      category: "Food",
      categoryColor: "bg-orange-100 text-orange-700",
      title: "Food Update",
      message: "Today's dinner will be served at 08:00 PM in TI Cafeteria.",
      time: "05:30 PM",
      date: "18 Jun 2026",
      unread: false
    },
    {
      icon: AlertTriangle,
      category: "Alert",
      categoryColor: "bg-red-100 text-red-700",
      title: "Important Alert",
      message: "Roadwork near the airport. Please allow extra travel time.",
      time: "08:00 AM",
      date: "17 Jun 2026",
      unread: false
    },
    {
      icon: Gift,
      category: "Welcome",
      categoryColor: "bg-purple-100 text-purple-700",
      title: "Welcome to HackFlow 2026!",
      message: "We're excited to have you on board. Check your itinerary now.",
      time: "09:00 AM",
      date: "15 Jun 2026",
      unread: false
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with all the important alerts and updates</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <button className="text-purple-700 font-medium border-b-2 border-purple-700 pb-2">All</button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">Updates</button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">Shuttle</button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">Itinerary</button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">Alerts</button>
        </div>
        <button className="text-purple-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 size={16} />
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option>All Categories</option>
          <option>Shuttle</option>
          <option>Itinerary</option>
          <option>Flight</option>
          <option>Hotel</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option>All Status</option>
          <option>Read</option>
          <option>Unread</option>
        </select>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Bell className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Info size={18} />
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-5 border ${
              notif.unread ? "border-purple-300 shadow-sm" : "border-gray-200"
            } hover:shadow-md transition`}
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notif.categoryColor.replace("text-", "bg-").replace("100", "50")
              }`}>
                <notif.icon className={notif.categoryColor.split(" ")[1]} size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${notif.categoryColor}`}>
                        {notif.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{notif.time}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                    {notif.unread && (
                      <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 ml-auto"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enable Notifications Card */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <Bell className="text-purple-600" size={40} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">Never miss an update!</h3>
            <p className="text-sm text-gray-600 mt-1">
              Enable browser notifications to get real-time alerts and reminders.
            </p>
            <button className="mt-3 px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
              Enable Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-600" size={20} />
          <p className="text-sm text-green-800 font-medium">You're all caught up!</p>
        </div>
        <button className="text-purple-700 text-sm font-medium flex items-center gap-2">
          View All Updates
          <Plane size={16} className="rotate-90" />
        </button>
      </div>
    </div>
  );
}